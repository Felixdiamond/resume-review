import { getAnalysis } from "@/lib/kv-client";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const id = params.id;
  try {
    const analysis = await getAnalysis(id);
    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error(`Error retrieving analysis for id ${id}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
