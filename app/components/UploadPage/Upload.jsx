import React, { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "@/context/AppContext";
import { UploadComponent } from "../UploadComponent/UploadComponent";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import "./Upload.css";

export const UploadPage = () => {
  const { selectedOption } = useContext(AppContext);
  const [verses, setVerses] = useState([]);
  const [typedText, setTypedText] = useState([]);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTypingPaused, setIsTypingPaused] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    setVerses(
      selectedOption === 0
        ? [
            "Hey there! I'm your AI Career Coach, ready to provide honest feedback on your resume.",
            "Don't worry, your information is confidential.",
            "Share your resume, and together we'll make it stand out in the job market.",
          ]
        : [
            "Well, well, well. look who decided to share their resume.",
            "Brace yourself, this might hurt.",
            "I've seen better resumes written by kindergarteners.",
            "But hey, at least you have a sense of humor for choosing the 'jerk mode'.",
            "Let's see how much of a trainwreck your professional life is.",
          ]
    );
    setTypedText([]);
    setCurrentVerseIndex(0);
    setCurrentCharIndex(0);
    setIsTypingComplete(false);
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
          if ([",", ".", "!", "?"].includes(currentChar)) {
            setIsTypingPaused(true);
            setTimeout(
              () => setIsTypingPaused(false),
              currentChar === "," ? 500 : 1000
            );
          }
        } else {
          if (currentVerseIndex === verses.length - 1) {
            setIsTypingComplete(true);
          } else {
            setCurrentVerseIndex((prev) => prev + 1);
            setCurrentCharIndex(0);
            setIsTypingPaused(true);
            setTimeout(() => setIsTypingPaused(false), 1000);
          }
        }
      }, Math.random() * 30 + 50);
      return () => clearTimeout(timeoutId);
    }
  }, [currentVerseIndex, currentCharIndex, verses, isTypingPaused]);

  return (
    <div className="min-h-screen bg-transparent text-white flex items-center justify-center p-4 overflow-y-auto outer-div">
      <div className="max-w-2xl w-full bg-white/20 backdrop-blur-lg rounded-lg shadow-xl p-6 md:p-8 space-y-6 overflow-y-auto">
        <div className="space-y-4">
          {typedText.map((text, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-lg md:text-xl leading-relaxed"
            >
              {text}
            </motion.p>
          ))}
        </div>
        <AnimatePresence>
          {isTypingComplete ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <UploadComponent />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadPage;
