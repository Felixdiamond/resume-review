"use client";
import { HoverEffect } from "../ui/card-hover-effect";
import { useState, useRef, useEffect, useContext } from "react";
import "./SelectAI.css";

export function SelectAI({ onContinueClick }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const optionsRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelectionChange = (index) => {
    setSelectedOption(index !== null ? options[index] : null);
    setIsTransitioning(true);
  };

  useEffect(() => {
    if (optionsRef.current) {
      const targetTransform =
        selectedOption !== null ? "translateY(-40px)" : "translateY(0)";
      optionsRef.current.style.transform = isTransitioning
        ? targetTransform
        : "none";
    }
  }, [selectedOption, isTransitioning]);

  useEffect(() => {
    let timeoutId;
    if (isTransitioning) {
      timeoutId = setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
    }
    return () => clearTimeout(timeoutId);
  }, [isTransitioning]);

  return (
    <div className="outer-div">
      <div className="inner-div">
        <div className="options" ref={optionsRef}>
          <HoverEffect
            className={"selectoptions"}
            items={options}
            onSelectionChange={handleSelectionChange}
          />
        </div>
        {selectedOption !== null && (
          <button
            className={`start-btn ${selectedOption !== null ? "fade-in" : ""}`}
            onClick={onContinueClick}
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
          </button>
        )}
      </div>
    </div>
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
