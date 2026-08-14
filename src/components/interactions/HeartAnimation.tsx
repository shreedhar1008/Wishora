"use client";

import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export interface HeartAnimationProps {
  trigger: boolean;
  count?: number;
}

interface HeartItem {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

export const HeartAnimation: React.FC<HeartAnimationProps> = ({ trigger, count = 20 }) => {
  const [hearts, setHearts] = useState<HeartItem[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!trigger || prefersReducedMotion) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      const newHearts: HeartItem[] = Array.from({ length: count }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 3 + 3,
        delay: Math.random() * 0.5,
      }));
      setHearts(newHearts);
    });

    const timer = setTimeout(() => setHearts([]), 6000);
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, [trigger, count, prefersReducedMotion]);

  if (!trigger || prefersReducedMotion || hearts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute bottom-[-10%]"
          style={{
            left: `${h.x}%`,
            width: h.size,
            height: h.size,
            animation: `float-heart ${h.duration}s ease-in ${h.delay}s forwards`,
          }}
        >
          <svg viewBox="0 0 32 32" fill="#e63946" className="w-full h-full drop-shadow-sm">
            <path d="M16 28.5l-1.4-1.2C5.4 18.9 0 14 0 8 0 3.6 3.6 0 8 0c2.5 0 4.9 1.2 6.5 3.2h3C19.1 1.2 21.5 0 24 0c4.4 0 8 3.6 8 8 0 6-5.4 10.9-14.6 19.3L16 28.5z" />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes float-heart {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          10% { opacity: 1; transform: translateY(-10vh) scale(1); }
          100% { transform: translateY(-110vh) scale(1.5) rotate(15deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
