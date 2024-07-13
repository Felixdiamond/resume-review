import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { storeAnalysis } from "@/lib/kv-client";
import { generateContent } from "../../../lib/antrophic.mjs";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");
    const mode = data.get("mode");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (mode !== "balanced" && mode !== "jerk") {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    console.log('generating content')
    const analysis = await generateContent(mode, buffer);

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