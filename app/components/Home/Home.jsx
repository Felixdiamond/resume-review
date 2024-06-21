import React from "react";
import "./Home.css";

export function Landing({ onStartClick }) {
  return (
    <div className="absolute z-50 inset-0 flex items-center justify-center text-center flex-col">
      <p className="bg-clip-text text-transparent drop-shadow-2xl hero-txt">
        How Good is your <span className="focus-txt">Resume</span>?
      </p>
      <p className="sub-txt">Get your resume reviewed by AI</p>
      <button className="start-btn" onClick={onStartClick}>
        Get Started
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
    </div>
  );
}