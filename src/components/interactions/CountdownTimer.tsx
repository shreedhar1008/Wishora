"use client";

import React, { useState, useEffect } from "react";

export interface CountdownTimerProps {
  targetDate: string;
  title?: string;
  onComplete?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  title = "Counting down...",
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const update = () => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance <= 0) {
        setIsComplete(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onComplete?.();
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  if (isComplete) {
    return (
      <div className="text-center p-6 bg-[#fffaf0] rounded-xl shadow-sm text-2xl font-bold text-[#992255]">
        The wait is over! 🎉
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-[#fffaf0] rounded-xl shadow-sm">
      <h3 className="text-lg font-medium text-gray-700 mb-4">{title}</h3>
      <div className="flex gap-4 text-center">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map((unit, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center bg-white rounded-lg shadow-sm text-2xl font-bold text-[#992255]">
              {unit.value.toString().padStart(2, "0")}
            </div>
            <span className="text-xs text-gray-500 mt-2 uppercase tracking-wider">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
