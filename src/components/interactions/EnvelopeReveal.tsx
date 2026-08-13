"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface EnvelopeRevealProps {
  message: string;
  senderName: string;
  recipientName: string;
}

export const EnvelopeReveal: React.FC<EnvelopeRevealProps> = ({
  message,
  senderName,
  recipientName,
}) => {
  const [opened, setOpened] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-4 perspective-1000">
      {!opened ? (
        <motion.button
          onClick={() => setOpened(true)}
          className="relative w-64 h-40 bg-[#f8f9fa] border border-gray-300 shadow-md rounded-md cursor-pointer focus:outline-none focus:ring-4 focus:ring-opacity-50 min-h-[44px] min-w-[44px]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Open envelope"
        >
          {/* Flap */}
          <div className="absolute top-0 left-0 w-0 h-0 border-l-[128px] border-r-[128px] border-t-[80px] border-l-transparent border-r-transparent border-t-gray-200" />
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium">
            To: {recipientName}
          </div>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md bg-[#fffdf0] p-8 shadow-lg rounded-sm border border-gray-100 font-serif text-gray-800"
        >
          <div className="mb-6 text-lg">Dear {recipientName},</div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="whitespace-pre-wrap leading-relaxed text-lg min-h-[100px]"
          >
            {message}
          </motion.div>
          
          <div className="mt-8 text-right text-lg font-medium">
            With love,<br />
            {senderName}
          </div>
        </motion.div>
      )}
    </div>
  );
};
