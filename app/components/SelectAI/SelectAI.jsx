"use client";
import { HoverEffect } from "../ui/card-hover-effect";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./SelectAI.css";

export function SelectAI({ onContinueClick }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelectionChange = (index) => {
    setSelectedOption(index !== null ? options[index] : null);
  };

  return (
    <motion.div
      className="outer-div"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="inner-div">
        <div className="options">
          <HoverEffect
            className="selectoptions"
            items={options}
            onSelectionChange={handleSelectionChange}
          />
        </div>
        <AnimatePresence>
          {selectedOption !== null && (
            <motion.button
              className="start-btn"
              onClick={onContinueClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              Continue
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export const options = [
  {
    title: "Normal",
    description: "A balanced AI review",
  },
  {
    title: "Jerk",
    description: "A jerk AI review",
  },
];
