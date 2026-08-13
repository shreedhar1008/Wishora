"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface GiftBoxRevealProps {
  children: React.ReactNode;
  ribbonColor?: string;
  boxColor?: string;
}

export const GiftBoxReveal: React.FC<GiftBoxRevealProps> = ({
  children,
  ribbonColor = "#ff5e7e",
  boxColor = "#4dc2ff",
}) => {
  const [opened, setOpened] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full relative">
      {!opened ? (
        <motion.button
          onClick={() => setOpened(true)}
          className="relative w-40 h-40 cursor-pointer focus:outline-none focus:ring-4 focus:ring-opacity-50 min-h-[44px] min-w-[44px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open gift box"
        >
          {/* Box base */}
          <div
            className="absolute bottom-0 w-full h-32 rounded-b-md"
            style={{ backgroundColor: boxColor }}
          />
          {/* Ribbon vertical */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-32"
            style={{ backgroundColor: ribbonColor }}
          />
          {/* Box lid */}
          <motion.div
            className="absolute top-4 w-44 h-10 -left-2 rounded-t-md z-10"
            style={{ backgroundColor: boxColor }}
          >
            {/* Ribbon on lid */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-10"
              style={{ backgroundColor: ribbonColor }}
            />
            {/* Bow */}
            <div
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-8 rounded-full border-4 z-20"
              style={{ borderColor: ribbonColor }}
            />
          </motion.div>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 100 }}
          className="z-10"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};
