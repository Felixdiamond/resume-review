import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { storeAnalysis } from "@/lib/kv-client";
import { generateContent } from "../../../lib/antrophic.mjs";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { image, mode, fileName } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    if (mode !== "balanced" && mode !== "jerk") {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    // Convert base64 image data to buffer
    const buffer = Buffer.from(image.split(',')[1], 'base64');

    console.log("generating content");
    const analysis = await generateContent(mode, buffer, "image/png", fileName);

    // Generate a unique ID and store the analysis
    const id = uuidv4();
    await storeAnalysis(id, analysis);
    console.log(`Analysis generated and stored with id: ${id}`);

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      { error: "Error processing file" },
      { status: 500 }
    );
  }
}