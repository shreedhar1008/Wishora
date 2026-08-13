"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface BloomingRosesProps {
  message?: string;
  petalColor?: string;
}

export const BloomingRoses: React.FC<BloomingRosesProps> = ({
  message = "For You",
  petalColor = "#e63946",
}) => {
  const [bloomed, setBloomed] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <button 
        onClick={() => setBloomed(true)}
        className="focus:outline-none min-h-[44px] min-w-[44px]"
        aria-label="Bloom rose"
      >
        <svg width="200" height="200" viewBox="0 0 100 100">
          <motion.circle
            cx="50"
            cy="50"
            r="10"
            fill={petalColor}
            initial={{ scale: 1 }}
            animate={{ scale: bloomed ? (prefersReducedMotion ? 2 : 4) : 1 }}
            transition={{ duration: 1.5 }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="15"
            fill={petalColor}
            opacity="0.8"
            initial={{ scale: 0 }}
            animate={{ scale: bloomed ? (prefersReducedMotion ? 2 : 3.5) : 0 }}
            transition={{ duration: 1.5, delay: 0.2 }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="20"
            fill={petalColor}
            opacity="0.6"
            initial={{ scale: 0 }}
            animate={{ scale: bloomed ? (prefersReducedMotion ? 2 : 3) : 0 }}
            transition={{ duration: 1.5, delay: 0.4 }}
          />
        </svg>
      </button>

      {bloomed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-8 text-2xl font-serif text-[#992255]"
        >
          {message}
        </motion.div>
      )}
    </div>
  );
};
