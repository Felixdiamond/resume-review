"use client";

import React, { useContext, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { Landing } from "../Home/Home";
import { SelectAI } from "../SelectAI/SelectAI";
import { UploadPage } from "../UploadPage/Upload";
import { AnimatePresence, motion } from "framer-motion";

export function HomeContainer() {
  const { selectedOption } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState("landing");

  const handleStartClick = () => {
    setCurrentPage("selectAI");
  };

  const handleContinueClick = () => {
    setCurrentPage("upload");
  };

  const pageVariants = {
    initial: { opacity: 0, x: "100%" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "-100%" },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <div className="home-container relative w-full h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {currentPage === "landing" && (
          <motion.div
            key="landing"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="absolute top-0 left-0 w-full h-full"
          >
            <Landing onStartClick={handleStartClick} />
          </motion.div>
        )}
        {currentPage === "selectAI" && (
          <motion.div
            key="selectAI"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="absolute top-0 left-0 w-full h-full"
          >
            <SelectAI onContinueClick={handleContinueClick} />
          </motion.div>
        )}
        {currentPage === "upload" && (
          <motion.div
            key="upload"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="absolute top-0 left-0 w-full h-full"
          >
            <UploadPage selectedOption={selectedOption} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}