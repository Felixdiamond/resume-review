"use client";

import React, { useContext, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { Landing } from "../Home/Home";
import { SelectAI } from "../SelectAI/SelectAI";
import { UploadPage } from "../UploadPage/Upload";

export function HomeContainer() {
  const { selectedOption } = useContext(AppContext);
  const [showSelectAI, setShowSelectAI] = useState(false);
  const [showUploadPage, setShowUploadPage] = useState(false);

  const handleStartClick = () => {
    setShowSelectAI(true);
  };

  const handleContinueClick = () => {
    setShowUploadPage(true);
  };

  return (
    <div className="home-container">
      <div
        className={`component-container ${
          showSelectAI || showUploadPage ? "slide-out" : ""
        }`}
      >
        <Landing onStartClick={handleStartClick} />
      </div>
      <div
        className={`component-container ${
          showSelectAI && !showUploadPage ? "slide-in" : "slide-out"
        }`}
      >
        {showSelectAI && (
          <SelectAI onContinueClick={handleContinueClick} />
        )}
      </div>
      <div
        className={`component-container ${
          showUploadPage ? "slide-in" : "slide-out"
        }`}
      >
        {showUploadPage && <UploadPage selectedOption={selectedOption} />}
      </div>
    </div>
  );
}