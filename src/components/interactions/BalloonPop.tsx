"use client";

import React, { useState, useMemo } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

export interface BalloonPopProps {
  balloonCount?: number;
  colors?: string[];
  onAllPopped?: () => void;
}

export const BalloonPop: React.FC<BalloonPopProps> = ({
  balloonCount = 5,
  colors = ["#ff5e7e", "#ffb84d", "#7c5bd7", "#4dc2ff", "#ff8a5c"],
  onAllPopped,
}) => {
  const [popped, setPopped] = useState<number[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const balloonDurations = useMemo(() => {
    return Array.from({ length: balloonCount }).map((_, i) => 2 + ((i * 37) % 10) / 10);
  }, [balloonCount]);

  const handlePop = (index: number) => {
    if (popped.includes(index)) return;
    const newPopped = [...popped, index];
    setPopped(newPopped);
    if (newPopped.length === balloonCount) {
      onAllPopped?.();
    }
  };

  if (popped.length === balloonCount) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-6 text-2xl font-bold text-[#992255]"
      >
        Yay! Celebration! 🎉
      </motion.div>
    );
  }

  return (
    <div className="relative h-64 w-full flex justify-center items-end gap-4 overflow-hidden">
      {Array.from({ length: balloonCount }).map((_, i) => {
        const isPopped = popped.includes(i);
        return (
          <AnimatePresence key={i}>
            {!isPopped && (
              <motion.button
                onClick={() => handlePop(i)}
                className="relative w-12 h-16 rounded-[50%] flex items-center justify-center cursor-pointer focus:outline-none focus:ring-4 focus:ring-opacity-50"
                style={{ backgroundColor: colors[i % colors.length] }}
                initial={{ y: 100 }}
                animate={{
                  y: prefersReducedMotion ? 0 : [0, -20, 0],
                }}
                transition={{
                  y: prefersReducedMotion
                    ? {}
                    : { duration: balloonDurations[i] || 2.5, repeat: Infinity, ease: "easeInOut" },
                }}
                exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.2 } }}
                aria-label="Pop balloon"
              >
                <div className="absolute -bottom-2 w-1 h-8 bg-gray-300" />
              </motion.button>
            )}
          </AnimatePresence>
        );
      })}
    </div>
  );
};
