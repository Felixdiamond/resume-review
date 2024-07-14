import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HoverEffect } from "../ui/card-hover-effect";
import AnimatedBackground from "./AnimatedBackground";
import "./SelectAI.css";

export function SelectAI({ onContinueClick }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSelectionChange = (index) => {
    setSelectedOption(index !== null ? options[index] : null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      className="outer-div"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* <AnimatedBackground /> */}
      <div className="inner-div">
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 text-center"
          variants={itemVariants}
        >
          Choose Your AI Experience
        </motion.h1>
        <motion.div className="options w-full" variants={itemVariants}>
          <HoverEffect
            className="selectoptions"
            items={options}
            onSelectionChange={handleSelectionChange}
            isMobile={isMobile}
          />
        </motion.div>
        <AnimatePresence>
          {selectedOption !== null && (
            <motion.button
              className="start-btn bg-white/[0.15] text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-white/[0.25] transition-all duration-300 flex items-center space-x-2"
              onClick={onContinueClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <span>Continue</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
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
    icon: "🤖",
  },
  {
    title: "Jerk",
    description: "A jerk AI review",
    icon: "😈",
  },
];
