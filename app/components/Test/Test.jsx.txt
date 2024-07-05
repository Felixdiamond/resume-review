"use client";

import { TypewriterEffectSmooth } from "../ui/typewriter-effect";

export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "Build",
    },
    {
      text: "awesome",
    },
    {
      text: "apps",
    },
    {
      text: "with",
    },
    {
      text: "Aceternity.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
      <TypewriterEffectSmooth words={words} />
  );
}


useEffect(() => {
  if (selectedOption === 0) {
    setVerses([
      "Hey there! I'm your AI Career Coach, ready to provide honest feedback on your resume.",
      "Don't worry, your information is confidential.",
      "Share your resume, and together we'll make it stand out in the job market.",
    ]);
  } else {
    setVerses([
      "Well, well, well... look who decided to share their resume.",
      "Brace yourself, this might hurt.",
      "I've seen better resumes written by kindergarteners.",
      "But hey, at least you have a sense of humor for choosing the 'jerk mode.'",
      "Let's see how much of a trainwreck your professional life is.",
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
        setCurrentVerseIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
        setIsTypingPaused(true);
        setTimeout(() => setIsTypingPaused(false), 1000);
      }
    }, Math.random() * 30 + 50);

    return () => clearTimeout(timeoutId);
  }
}, [currentVerseIndex, currentCharIndex, verses, isTypingPaused]);



useEffect(() => {
  if (selectedOption === 0) {
    setVerses([
      "Hey there! I'm your AI Career Coach, ready to provide honest feedback on your resume.",
      "Don't worry, your information is confidential.",
      "Share your resume, and together we'll make it stand out in the job market.",
    ]);
  } else {
    setVerses([
      "Well, well, well. look who decided to share their resume.",
      "Brace yourself, this might hurt.",
      "I've seen better resumes written by kindergarteners.",
      "But hey, at least you have a sense of humor for choosing the 'jerk mode'.",
      "Let's see how much of a trainwreck your professional life is.",
    ]);
  }
  setTypedText([]);
  setCurrentVerseIndex(0);
  setCurrentCharIndex(0);
}, [selectedOption]);