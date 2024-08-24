"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Download } from "lucide-react";
import styles from "./AnalysisPage.module.css";
import { Button } from "@/app/components/ui/button";

const AnalysisPage = () => {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 640
  );
  const { id } = useParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 640);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const element = document.createElement("a");
      const file = new Blob([analysis], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = "resume_analysis.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error("Error downloading analysis:", error);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const response = await fetch(`/api/get-analysis/${id}`);
        if (!response.ok) throw new Error("Failed to fetch analysis");
        const data = await response.json();
        setAnalysis(data.analysis);
      } catch (error) {
        console.error("Error fetching analysis:", error);
        setError("Failed to load analysis. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, [id]);

  const formatContent = (content) => {
    const lines = content.split("\n");
    const formattedContent = [];

    lines.forEach((line, index) => {
      if (line.match(/^\d+\./)) {
        formattedContent.push(
          <div key={`section-${index}`} className={styles.section}>
            <h3 className={styles.sectionTitle}>{line}</h3>
          </div>
        );
      } else if (line.startsWith("- ")) {
        const lastSection = formattedContent[formattedContent.length - 1];
        if (lastSection && lastSection.props.className === styles.section) {
          const children = React.Children.toArray(lastSection.props.children);
          const ul = children.find((child) => child.type === "ul");
          if (ul) {
            const newUl = React.cloneElement(
              ul,
              {},
              ...React.Children.toArray(ul.props.children),
              <li key={`li-${index}`} className={styles.bulletItem}>
                {line.substring(2)}
              </li>
            );
            formattedContent[formattedContent.length - 1] = React.cloneElement(
              lastSection,
              {},
              ...children.map((child) => (child.type === "ul" ? newUl : child))
            );
          } else {
            formattedContent[formattedContent.length - 1] = React.cloneElement(
              lastSection,
              {},
              ...children,
              <ul key={`ul-${index}`} className={styles.bulletList}>
                <li key={`li-${index}`} className={styles.bulletItem}>
                  {line.substring(2)}
                </li>
              </ul>
            );
          }
        } else {
          formattedContent.push(
            <div key={`section-${index}`} className={styles.section}>
              <ul className={styles.bulletList}>
                <li key={`li-${index}`} className={styles.bulletItem}>
                  {line.substring(2)}
                </li>
              </ul>
            </div>
          );
        }
      } else if (line.trim() !== "") {
        const lastSection = formattedContent[formattedContent.length - 1];
        if (lastSection && lastSection.props.className === styles.section) {
          const children = React.Children.toArray(lastSection.props.children);
          formattedContent[formattedContent.length - 1] = React.cloneElement(
            lastSection,
            {},
            ...children,
            <p key={`p-${index}`} className={styles.paragraph}>
              {line}
            </p>
          );
        } else {
          formattedContent.push(
            <div key={`section-${index}`} className={styles.section}>
              <p key={`p-${index}`} className={styles.paragraph}>
                {line}
              </p>
            </div>
          );
        }
      }
    });

    return formattedContent;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Resume Analysis
          </h1>
          {loading ? (
            <div className="text-center">
              <div className="spinner"></div>
              <p className="mt-4 text-gray-600">Analyzing resume...</p>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center font-bold">{error}</div>
          ) : (
            <div className={styles.analysisResults}>
              {formatContent(analysis)}
            </div>
          )}
        </div>
      </div>
      {!loading && !error && (
        <Button
        onClick={handleDownload}
        className={`fixed bottom-4 right-4 ${
          isMobile ? "p-2" : "px-4 py-2"
        } bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-200`}
        disabled={loading || downloading}
      >
        {downloading ? (
          <div className="spinner h-5 w-5" />
        ) : (
          <>
            <Download className={`h-5 w-5 ${isMobile ? "" : "mr-2"}`} />
            {!isMobile && "Download Analysis"}
          </>
        )}
      </Button>
      )}
    </div>
  );
};

export default AnalysisPage;
