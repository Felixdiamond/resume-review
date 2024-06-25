"use client";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import { UploadComponent } from "../UploadComponent/UploadComponent";
import { motion, AnimatePresence } from "framer-motion";
import "./Upload.css";

export function UploadPage() {
  const { selectedOption } = useContext(AppContext);
  const [verses, setVerses] = useState([]);
  const [typedText, setTypedText] = useState([]);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTypingPaused, setIsTypingPaused] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (selectedOption === 0) {
      setVerses([
        "Bankai",
      ]);
    } else {
      setVerses([
        "Daiguren Hyorinmaru",
      ]);
    }
    setTypedText([]);
    setCurrentVerseIndex(0);
    setCurrentCharIndex(0);
  }, [selectedOption]);

  useEffect(() => {
    if (currentVerseIndex < verses.length && !isTypingPaused) {
      const currentVerse = verses[currentVerseIndex];
      const currentChar = currentVerse[currentCharIndex];

      const timeoutId = setTimeout(() => {
        if (currentCharIndex < currentVerse.length) {
          setTypedText((prev) => {
            const newTypedText = [...prev];
            if (!newTypedText[currentVerseIndex]) {
              newTypedText[currentVerseIndex] = "";
            }
            newTypedText[currentVerseIndex] += currentChar;
            return newTypedText;
          });
          setCurrentCharIndex((prev) => prev + 1);

          // Pause after punctuation
          if ([",", ".", "!", "?"].includes(currentChar)) {
            setIsTypingPaused(true);
            setTimeout(
              () => setIsTypingPaused(false),
              currentChar === "," ? 500 : 1000
            );
          }
        } else {
          if (currentVerseIndex === verses.length - 1) {
            // If this is the last verse and we've finished typing it
            setIsTypingComplete(true);
          } else {
            setCurrentVerseIndex((prev) => prev + 1);
            setCurrentCharIndex(0);
            setIsTypingPaused(true);
            setTimeout(() => setIsTypingPaused(false), 1000); // Pause between verses
          }
        }
      }, Math.random() * 30 + 50); // Random typing speed for more natural effect

      return () => clearTimeout(timeoutId);
    }
  }, [currentVerseIndex, currentCharIndex, verses, isTypingPaused]);

  return (
    <div className="outer-div flex items-center justify-center flex-col">
      <div className="max-w-2xl w-full bg-opacity-50 rounded-lg p-8">
        <div className="typewriter-container mb-8">
          {typedText.map((text, index) => (
            <p key={index} className="verse text-white text-lg mb-4">
              {text}
            </p>
          ))}
        </div>
        <AnimatePresence>
          {isTypingComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <UploadComponent />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
