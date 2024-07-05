import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { storeAnalysis } from "@/lib/kv-client";
import { generateContent } from "@/lib/antrophic.mjs";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");
    const mode = data.get("mode");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Set prompt based on mode
    let prompt;
    if (mode === "balanced") {
      prompt =
        "You are a professional career coach. Analyze this resume and provide comprehensive, constructive feedback on the candidate's qualifications and experience. Offer specific suggestions for improvement and highlight strengths.";
    } else if (mode === "jerk") {
      prompt =
        "You are a brutally honest and sarcastic resume reviewer. Analyze this resume and provide harsh, yet humorous criticism. Don't hold back, but ensure your feedback is still somewhat constructive beneath the sarcasm.";
    } else {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const analysis = await generateContent(prompt, buffer);

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
