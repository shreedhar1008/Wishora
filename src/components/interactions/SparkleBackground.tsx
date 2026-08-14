"use client";

import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export interface SparkleBackgroundProps {
  color?: string;
  density?: "low" | "medium" | "high";
}

interface SparkleItem {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const SparkleBackground: React.FC<SparkleBackgroundProps> = ({
  color = "#ffb84d",
  density = "medium",
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [sparkles, setSparkles] = useState<SparkleItem[]>([]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const frameId = requestAnimationFrame(() => {
      const count = density === "low" ? 20 : density === "high" ? 60 : 40;
      const newSparkles: SparkleItem[] = Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 2,
      }));
      
      setSparkles(newSparkles);
    });

    return () => cancelAnimationFrame(frameId);
  }, [density, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            backgroundColor: color,
            boxShadow: `0 0 ${s.size * 2}px ${color}`,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};
