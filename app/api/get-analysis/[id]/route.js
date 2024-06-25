import { NextResponse } from "next/server";

// In a real application, you'd fetch this from a database
const analysisStore = new Map();

export async function GET(request, { params }) {
  const id = params.id;
  const analysis = analysisStore.get(id);

  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  return NextResponse.json({ analysis });
}

// Export this function to be used in the upload API
export function storeAnalysis(id, analysis) {
  analysisStore.set(id, analysis);
}
