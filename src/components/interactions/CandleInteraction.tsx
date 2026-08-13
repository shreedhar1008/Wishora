"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface CandleInteractionProps {
  candleCount?: number;
  recipientName: string;
  onBlown?: () => void;
}

export const CandleInteraction: React.FC<CandleInteractionProps> = ({
  candleCount = 3,
  recipientName,
  onBlown,
}) => {
  const [blownCount, setBlownCount] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const handleBlow = () => {
    if (blownCount < candleCount) {
      const newCount = blownCount + 1;
      setBlownCount(newCount);
      if (newCount === candleCount) {
        onBlown?.();
      }
    }
  };

  const allBlown = blownCount === candleCount;

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="relative flex gap-4 mt-12 items-end">
        {/* Simple SVG Cake Base */}
        <div className="absolute bottom-0 w-64 h-24 bg-[#ffb84d] rounded-t-xl -z-10" />
        
        {Array.from({ length: candleCount }).map((_, i) => (
          <div key={i} className="relative w-4 h-16 bg-white border-2 border-gray-200 rounded-t-sm z-10 flex justify-center">
            {/* Flame */}
            {i >= blownCount ? (
              <motion.div
                className="absolute -top-6 w-4 h-6 bg-yellow-400 rounded-full origin-bottom"
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: [1, 1.1, 0.9, 1],
                        rotate: [-2, 2, -1, 1, 0],
                      }
                }
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            ) : (
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -20 }}
                className="absolute -top-4 w-2 h-4 bg-gray-400 rounded-full blur-sm"
              />
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        {allBlown ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-2xl font-bold text-[#992255]"
          >
            Happy Birthday, {recipientName}! 🎂
          </motion.div>
        ) : (
          <button
            onClick={handleBlow}
            className="px-6 py-3 bg-[#992255] text-white rounded-full font-semibold hover:bg-[#7a1b44] active:scale-95 transition-transform focus:ring-4 focus:ring-[#992255]/50 min-h-[44px] min-w-[44px]"
          >
            Blow out candle ({blownCount}/{candleCount})
          </button>
        )}
      </div>
    </div>
  );
};
