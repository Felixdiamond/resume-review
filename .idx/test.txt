// app/api/upload-and-analyze/route.js

import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { NextResponse } from "next/server";
import { model, fileToGenerativePart } from "@/lib/gemini";
import { v4 as uuidv4 } from "uuid";
import { storeAnalysis } from "../get-analysis/[id]/route";
import * as pdfjsLib from 'pdfjs-dist';
import { createCanvas } from 'canvas';
import sharp from 'sharp';

// Polyfill for Promise.withResolvers()
if (typeof Promise.withResolvers !== 'function') {
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// Set up the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");
    const mode = data.get("mode");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name;
    const ext = path.extname(filename).toLowerCase();

    let imagePath;

    // Convert to image based on file type
    if (ext === ".pdf") {
      imagePath = await convertPdfToImage(buffer);
    } else if (ext === ".doc" || ext === ".docx") {
      imagePath = await convertDocToImage(buffer);
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    // Set prompt based on mode
    let prompt;
    if (mode === "balanced") {
      prompt =
        "You are a professional career coach. Analyze this multi-page resume and provide comprehensive, constructive feedback on the candidate's qualifications and experience. Offer specific suggestions for improvement and highlight strengths. Consider the entire document in your analysis.";
    } else if (mode === "jerk") {
      prompt =
        "You are a brutally honest and sarcastic resume reviewer. Analyze this multi-page resume and provide harsh, yet humorous criticism. Don't hold back, but ensure your feedback is still somewhat constructive beneath the sarcasm. Consider the entire document in your roast.";
    } else {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const imagePart = fileToGenerativePart(imagePath, "image/png");

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean up temporary files
    fs.unlinkSync(imagePath);

    // Generate a unique ID and store the analysis
    const id = uuidv4();
    storeAnalysis(id, text);

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Error processing file" },
      { status: 500 }
    );
  }
}

async function convertPdfToImage(pdfBuffer) {
  // Load the PDF document
  const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
  
  const scale = 2.0;
  const pageImages = [];
  let totalHeight = 0;
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    
    const canvasFactory = new pdfjsLib.DOMCanvasFactory();
    const canvas = canvasFactory.create(viewport.width, viewport.height);
    const renderContext = {
      canvasContext: canvas.context,
      viewport: viewport,
    };
    
    await page.render(renderContext).promise;
    
    const image = await new Promise((resolve) => {
      canvas.canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
    
    pageImages.push(image);
    totalHeight += viewport.height;
  }
  
  // Combine images using sharp
  const combinedImage = await sharp({
    create: {
      width: viewport.width,
      height: totalHeight,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite(pageImages.map((image, index) => ({
      input: image,
      top: index * (totalHeight / pageImages.length),
      left: 0
    })))
    .png()
    .toBuffer();

  return combinedImage;
}


async function combineImages(images) {
  // You'll need to implement this function to combine multiple images into one
  // You can use a library like 'sharp' for this purpose
  // Here's a placeholder implementation:
  const sharp = require('sharp');

  const combinedImage = await sharp({
    create: {
      width: 2480,
      height: images.length * 3508,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite(images.map((image, index) => ({
      input: image,
      top: index * 3508,
      left: 0
    })))
    .png()
    .toBuffer();

  return combinedImage;
}

async function convertDocToImage(docBuffer) {
  // Convert doc/docx to HTML
  const result = await mammoth.convertToHtml({ buffer: docBuffer });
  const html = result.value;

  // Use puppeteer to render HTML to image
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const imagePath = path.join(os.tmpdir(), `temp_${Date.now()}.png`);
  await page.screenshot({ path: imagePath, fullPage: true });

  await browser.close();
  return imagePath;
}
