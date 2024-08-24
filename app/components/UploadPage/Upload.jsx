import React, { useContext, useState, useEffect, useRef } from "react";
import { UploadComponent } from "../UploadComponent/UploadComponent";
import { motion, AnimatePresence } from "framer-motion";
import "./Upload.css";

export const UploadPage = () => {
  return (
    <div className="min-h-screen bg-transparent text-white flex items-center justify-center p-4 overflow-y-auto outer-div">
      <div className="max-w-2xl w-full bg-white/20 backdrop-blur-lg rounded-lg shadow-xl p-6 md:p-8 space-y-6 overflow-y-auto">
        <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <UploadComponent />
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadPage;
