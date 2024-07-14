import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import "./Home.css";

export const Landing = ({ onStartClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center text-white p-4"
    >
      <div className="max-w-4xl w-full text-center">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          How Good is your{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Resume?
          </span>
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl mb-8"
        >
          Get your resume reviewed by AI
        </motion.p>
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartClick}
          className="bg-white text-purple-700 font-semibold py-3 px-6 rounded-full text-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out flex items-center justify-center mx-auto"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Landing;