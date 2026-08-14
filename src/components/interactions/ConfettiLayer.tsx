"use client";

import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export interface ConfettiLayerProps {
  trigger: boolean;
  colors?: string[];
  duration?: number;
  particleCount?: number;
}

interface ConfettiParticle {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  shape: "circle" | "square";
}

export const ConfettiLayer: React.FC<ConfettiLayerProps> = ({
  trigger,
  colors = ["#ff5e7e", "#ffb84d", "#7c5bd7", "#4dc2ff"],
  duration = 3000,
  particleCount = 60,
}) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!trigger || prefersReducedMotion) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      const newParticles: ConfettiParticle[] = Array.from({ length: particleCount }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        color: colors[i % colors.length],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        size: 5 + Math.random() * 10,
        shape: Math.random() > 0.5 ? "circle" : "square",
      }));
      setParticles(newParticles);
    });

    const timer = setTimeout(() => setParticles([]), duration);
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
    };
  }, [trigger, colors, duration, particleCount, prefersReducedMotion]);

  if (!trigger || prefersReducedMotion || particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-[-10%]"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "0",
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
