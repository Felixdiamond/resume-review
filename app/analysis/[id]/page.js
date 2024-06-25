"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function AnalysisPage() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const response = await fetch(`/api/get-analysis/${id}`);
        if (!response.ok) throw new Error("Failed to fetch analysis");
        const data = await response.json();
        setAnalysis(data.analysis);
      } catch (error) {
        console.error("Error fetching analysis:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-600">
          <h1 className="text-2xl font-bold text-white">Resume Analysis</h1>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {analysis ? (
            <div className="prose max-w-none">
              {analysis.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-red-600">
              Failed to load analysis. Please try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
