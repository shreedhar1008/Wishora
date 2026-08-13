"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface MemoryGalleryProps {
  images: { url: string; caption?: string; alt?: string }[];
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center">
      <div className="relative w-full aspect-square overflow-hidden rounded-xl shadow-lg bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = offset.x;
              if (swipe < -50) handleNext();
              else if (swipe > 50) handlePrev();
            }}
          >
            <img
              src={images[currentIndex].url}
              alt={images[currentIndex].alt || "Memory"}
              className="w-full h-full object-cover pointer-events-none"
            />
            {images[currentIndex].caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white text-center">
                {images[currentIndex].caption}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          className="p-3 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#992255] min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-colors focus:outline-none ${
                i === currentIndex ? "bg-[#992255]" : "bg-gray-300"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-3 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#992255] min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
