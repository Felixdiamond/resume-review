"use client";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import { Typewriter } from 'react-simple-typewriter';

export function UploadPage() {
  const { selectedOption } = useContext(AppContext);
  const [verses, setVerses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (selectedOption === 0) {
      setVerses([
        "Hey there! I'm your AI Career Coach, ready to provide honest feedback on your resume.",
        "Don't worry, your information is confidential.",
        "Share your resume, and together we'll make it stand out in the job market."
      ]);
    } else {
      setVerses([
        "Well, well, well... look who decided to share their resume.",
        "Brace yourself, this might hurt.",
        "I've seen better resumes written by kindergarteners.",
        "But hey, at least you have a sense of humor for choosing the 'jerk mode.'",
        "Let's see how much of a trainwreck your professional life is."
      ]);
    }
    setCurrentIndex(0);
  }, [selectedOption]);

  const handleLoopDone = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div className="outer-div">
      <div className="typewriter-container">
        <Typewriter
          words={verses.slice(0, currentIndex + 1)}
          loop={1}
          cursor
          cursorStyle={
            <span
              style={{
                fontSize: '1.2em',
                background: 'currentColor',
                marginLeft: '5px',
                animation: 'blink 1s infinite',
              }}
            >
              _
            </span>
          }
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={1000}
          onLoopDone={handleLoopDone}
        />
        <br />
      </div>
    </div>
  );
}