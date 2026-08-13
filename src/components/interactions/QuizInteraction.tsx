"use client";

import React, { useState } from "react";
import { QuizQuestion } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export interface QuizInteractionProps {
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
}

export const QuizInteraction: React.FC<QuizInteractionProps> = ({ questions, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleAnswer = (optionId: string, isCorrect: boolean) => {
    setSelectedOption(optionId);
    if (isCorrect) setScore((prev) => prev + 1);

    setTimeout(() => {
      setSelectedOption(null);
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((prev) => prev + 1);
      } else {
        setIsFinished(true);
        onComplete?.(score + (isCorrect ? 1 : 0));
      }
    }, 1000);
  };

  const reset = () => {
    setCurrentIdx(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOption(null);
  };

  if (isFinished) {
    return (
      <div className="text-center p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-[#992255] mb-4">Quiz Complete!</h2>
        <p className="text-lg text-gray-700 mb-6">
          You scored {score} out of {questions.length}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[#ffb84d] text-white rounded-full font-semibold hover:bg-[#e6a645] min-h-[44px] min-w-[44px]"
        >
          Play Again
        </button>
      </div>
    );
  }

  const question = questions[currentIdx];

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="mb-6 flex justify-between text-sm text-gray-500 font-medium">
        <span>Question {currentIdx + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-medium text-gray-800">{question.text}</h3>
          
          <div className="space-y-3 mt-6">
            {question.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const showResult = selectedOption !== null;
              let bgColor = "bg-gray-50";
              let borderColor = "border-gray-200";
              let textColor = "text-gray-700";

              if (showResult) {
                if (opt.isCorrect) {
                  bgColor = "bg-green-100";
                  borderColor = "border-green-400";
                  textColor = "text-green-800";
                } else if (isSelected && !opt.isCorrect) {
                  bgColor = "bg-red-100";
                  borderColor = "border-red-400";
                  textColor = "text-red-800";
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={showResult}
                  onClick={() => handleAnswer(opt.id, opt.isCorrect)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${bgColor} ${borderColor} ${textColor} min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#992255] disabled:cursor-not-allowed`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
