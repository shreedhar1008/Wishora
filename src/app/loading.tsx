import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center">
      <div className="relative">
        <svg width="64" height="64" viewBox="0 0 32 32" fill="none" className="animate-spin">
          <circle cx="16" cy="16" r="14" stroke="url(#loadingGrad)" strokeWidth="3" strokeDasharray="60" strokeDashoffset="0" fill="transparent" />
          <defs>
            <linearGradient id="loadingGrad" x1="0" y1="0" x2="32" y2="32">
              <stop offset="0%" stopColor="hsl(320, 60%, 30%)" />
              <stop offset="100%" stopColor="hsl(340, 65%, 55%)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl animate-pulse">✨</span>
        </div>
      </div>
      <p className="mt-4 text-plum font-medium tracking-wide animate-pulse">Loading magic...</p>
    </div>
  );
}
