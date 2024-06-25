// app/api/upload-and-analyze/route.js

import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { NextResponse } from "next/server";
import { model, fileToGenerativePart } from "@/lib/gemini";
import { v4 as uuidv4 } from "uuid";
import { storeAnalysis } from "../get-analysis/[id]/route";
import { PDFDocument, rgb } from "pdf-lib";
import sharp from "sharp";
import { fromBuffer } from "pdf-img-convert";

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
  try {
    // Convert PDF pages to images
    const pngPages = await fromBuffer(pdfBuffer, {
      scale: 2.0, // Increase resolution
      combinedImage: true, // Combine all pages into a single image
    });

    // Save the combined image
    const imagePath = path.join(os.tmpdir(), `combined_${Date.now()}.png`);
    fs.writeFileSync(imagePath, pngPages[0]);

    return imagePath;
  } catch (error) {
    console.error("Error converting PDF to image:", error);
    throw error;
  }
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
