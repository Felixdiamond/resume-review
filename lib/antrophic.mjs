import Anthropic from "@anthropic-ai/sdk";
import axios from "axios";
import FormData from "form-data";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function convertPdfToImage(pdfBuffer) {
  const data = new FormData();
  data.append("file", pdfBuffer, {
    filename: "document.pdf",
    contentType: "application/pdf",
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.pdfrest.com/png",
    headers: {
      "Api-Key": process.env.PDFREST_API_KEY,
      ...data.getHeaders(),
    },
    data: data,
  };

  try {
    const response = await axios(config);
    const outputUrls = response.data.outputUrl;

    // Download and combine all PNG images
    const imageBuffers = await Promise.all(
      outputUrls.map((url) => axios.get(url, { responseType: "arraybuffer" }))
    );

    // Combine image buffers (you may need to adjust this based on your needs)
    const combinedImageBuffer = Buffer.concat(
      imageBuffers.map((response) => Buffer.from(response.data))
    );

    return combinedImageBuffer;
  } catch (error) {
    console.error("Error converting PDF to image:", error);
    throw error;
  }
}

export async function generateContent(prompt, pdfBuffer) {
  try {
    const imageBuffer = await convertPdfToImage(pdfBuffer);

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: imageBuffer.toString("base64"),
              },
            },
          ],
        },
      ],
    });

    return response.content[0].text;
  } catch (error) {
    console.error("Error generating content with Anthropic:", error);
    throw error;
  }
}