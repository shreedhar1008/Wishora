"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface ScratchRevealProps {
  revealContent: React.ReactNode;
  coverColor?: string;
  onRevealed?: () => void;
}

export const ScratchReveal: React.FC<ScratchRevealProps> = ({
  revealContent,
  coverColor = "#silver",
  onRevealed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill cover
    ctx.fillStyle = coverColor === "#silver" ? "#c0c0c0" : coverColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some noise/texture for silver
    if (coverColor === "#silver") {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const noise = Math.random() * 30 - 15;
        imageData.data[i] += noise;
        imageData.data[i + 1] += noise;
        imageData.data[i + 2] += noise;
      }
      ctx.putImageData(imageData, 0, 0);
    }
  }, [coverColor]);

  const handleScratch = (clientX: number, clientY: number) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    checkReveal();
  };

  const checkReveal = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparentPixels++;
    }

    const totalPixels = canvas.width * canvas.height;
    if (transparentPixels / totalPixels > 0.5) {
      setIsRevealed(true);
      onRevealed?.();
    }
  };

  const handleRevealNow = () => {
    setIsRevealed(true);
    onRevealed?.();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-64 h-64 rounded-xl overflow-hidden shadow-lg select-none touch-none">
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-white">
          {revealContent}
        </div>
        
        <motion.canvas
          ref={canvasRef}
          width={256}
          height={256}
          className="absolute inset-0 z-10 cursor-pointer"
          onMouseDown={() => setIsDrawing(true)}
          onMouseUp={() => setIsDrawing(false)}
          onMouseLeave={() => setIsDrawing(false)}
          onMouseMove={(e) => isDrawing && handleScratch(e.clientX, e.clientY)}
          onTouchStart={() => setIsDrawing(true)}
          onTouchEnd={() => setIsDrawing(false)}
          onTouchMove={(e) => {
            if (isDrawing) {
              const touch = e.touches[0];
              handleScratch(touch.clientX, touch.clientY);
            }
          }}
          animate={{ opacity: isRevealed ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          style={{ pointerEvents: isRevealed ? "none" : "auto" }}
        />
      </div>
      
      {!isRevealed && (
        <button
          onClick={handleRevealNow}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Reveal Now
        </button>
      )}
    </div>
  );
};
