"use client";

import React, { useState } from "react";
import { PollOption } from "@/types";
import { motion } from "framer-motion";

export interface PollInteractionProps {
  question: string;
  options: PollOption[];
  onVote?: (optionId: string) => void;
}

export const PollInteraction: React.FC<PollInteractionProps> = ({ question, options, onVote }) => {
  const pollId = React.useMemo(() => {
    try {
      return btoa(question).substring(0, 10);
    } catch {
      return 'poll_default';
    }
  }, [question]);

  const [hasVoted, setHasVoted] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem(`poll_${pollId}`);
    }
    return false;
  });

  const [localVotes, setLocalVotes] = useState<Record<string, number>>(() => {
    const initialVotes: Record<string, number> = {};
    options.forEach(opt => {
      initialVotes[opt.id] = opt.votes || 0;
    });
    return initialVotes;
  });

  const handleVote = (optionId: string) => {
    if (hasVoted) return;
    
    setHasVoted(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`poll_${pollId}`, "true");
    }
    
    setLocalVotes(prev => ({
      ...prev,
      [optionId]: (prev[optionId] || 0) + 1
    }));
    
    onVote?.(optionId);
  };

  const totalVotes = Object.values(localVotes).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h3 className="text-xl font-medium text-gray-800 mb-6">{question}</h3>
      
      <div className="space-y-4">
        {options.map((opt) => {
          const votes = localVotes[opt.id] || 0;
          const percentage = Math.round((votes / totalVotes) * 100);

          return (
            <div key={opt.id} className="relative">
              {!hasVoted ? (
                <button
                  onClick={() => handleVote(opt.id)}
                  className="w-full text-left p-4 rounded-lg border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#992255]"
                >
                  {opt.text}
                </button>
              ) : (
                <div className="relative w-full p-4 rounded-lg border-2 border-gray-100 bg-gray-50 overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-[#ffb84d]/30"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                  <div className="relative z-10 flex justify-between text-gray-800">
                    <span className="font-medium">{opt.text}</span>
                    <span className="text-gray-500">{percentage}%</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {hasVoted && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Total votes: {totalVotes}
        </div>
      )}
    </div>
  );
};
