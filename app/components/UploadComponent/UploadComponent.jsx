import { useState, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import "./UploadComponent.css";
import { useRouter } from "next/navigation";
import * as PDFJS from 'pdfjs-dist/build/pdf';
import mammoth from 'mammoth';
import { useToast } from "../ui/use-toast";
import html2canvas from "html2canvas";

export const UploadComponent = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedOption } = useContext(AppContext);
  const router = useRouter();
  const { toast } = useToast();

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

  const convertToImage = async (file) => {
    console.log("converting to image")
    if (file.type === 'application/pdf') {
      return await convertPdfToImage(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword') {
      return await convertDocToImage(file);
    } else {
      throw new Error('Unsupported file type');
    }
  };

  const convertPdfToImage = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const scale = 1.5;
    
    let totalHeight = 0;
    const pageImages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: ctx, viewport }).promise;
      pageImages.push(canvas.toDataURL('image/png'));
      totalHeight += viewport.height;
    }

    // Combine all pages into a single image
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = canvas.width;
    combinedCanvas.height = totalHeight;
    const combinedCtx = combinedCanvas.getContext('2d');

    let yOffset = 0;
    for (const pageImage of pageImages) {
      const img = new Image();
      img.src = pageImage;
      await new Promise(resolve => {
        img.onload = () => {
          combinedCtx.drawImage(img, 0, yOffset);
          yOffset += img.height;
          resolve();
        };
      });
    }

    return combinedCanvas.toDataURL('image/png');
  };

  const convertDocToImage = async (file) => {
    console.log("converting doc to image")
    const arrayBuffer = await file.arrayBuffer();
    console.log("converting to html")
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const htmlString = result.value;
    
    console.log("creating div element")
    const container = document.createElement('div');
    container.innerHTML = htmlString;
    console.log("appending to body")
    document.body.appendChild(container);
    console.log("creating canvas")
    const canvas = await html2canvas(container, {
      scrollY: -window.scrollY,
      windowHeight: document.documentElement.offsetHeight
    });
    document.body.removeChild(container);
    
    console.log("returning image data")
    return canvas.toDataURL('image/png');
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setIsLoading(true);
    toast({
      title: "Processing...",
      description: "Please wait while we analyze your resume. This may take a few moments.",
    })
    try {
      const imageData = await convertToImage(file);
      console.log("image conversion complete")
      
      const response = await fetch("/api/upload-and-analyze", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          mode: selectedOption === 0 ? "balanced" : "jerk",
          fileName: file.name,
        }),
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
