import { useState, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import "./UploadComponent.css";
import { useRouter } from "next/navigation";

export const UploadComponent = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedOption } = useContext(AppContext);
  const router = useRouter();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    handleFile(selectedFile);
  };

  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.size <= 10 * 1024 * 1024) {
      setFile(selectedFile);
    } else {
      alert("Please select a file up to 10MB in size.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", selectedOption === 0 ? "balanced" : "jerk");

    try {
      const response = await fetch("/api/upload-and-analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload and analyze file");
      }

      const result = await response.json();
      router.push(`/analysis/${result.id}`);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing the file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div
        className={`w-full z-50 p-6 border-2 border-dashed rounded-lg text-center transition-all duration-300 ease-in-out ${
          isDragging
            ? "border-blue-300 border-opacity-70"
            : "border-white border-opacity-30"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <h2 className="text-white text-2xl font-bold mb-2">
          Upload Your Resume
        </h2>
        <p className="text-white text-opacity-80 text-sm mb-6">
          PDF, DOC, DOCX up to 10MB
        </p>
        <input
          type="file"
          id="file-upload"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className="block w-full py-3 px-4 rounded-lg cursor-pointer bg-blue-500 text-white font-medium hover:bg-blue-600 transition duration-300 mb-4 fu-btn"
        >
          Choose File
        </label>
        <p className="text-white text-opacity-70 text-sm">
          {isDragging
            ? "Drop your file here"
            : "or drag and drop your file here"}
        </p>
        {file && (
          <div className="mt-4 p-3 bg-white bg-opacity-10 rounded-lg">
            <p className="text-sm text-white text-opacity-90 font-medium">
              Selected File:
            </p>
            <p className="text-sm text-white text-opacity-70">{file.name}</p>
          </div>
        )}
      </div>
      <button
        onClick={handleSubmit}
        disabled={!file || isLoading}
        className="mt-6 w-full py-3 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300 fu-btn disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Submit"}
      </button>
    </div>
  );
};
