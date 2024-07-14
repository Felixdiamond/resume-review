import React from "react";
import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-700 via-pink-600 to-blue-500"
        animate={{
          background: [
            "linear-gradient(to bottom right, #6b46c1, #d53f8c, #2b6cb0)",
            "linear-gradient(to bottom right, #805ad5, #ed64a6, #4299e1)",
            "linear-gradient(to bottom right, #6b46c1, #d53f8c, #2b6cb0)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default AnimatedBackground;