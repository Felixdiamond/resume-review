"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "./AnalysisPage.module.css";

const AnalysisPage = () => {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
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
    </div>
  );
};

export default AnalysisPage;
