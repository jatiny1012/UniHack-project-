"use client";

import { useEffect, useState } from "react";

const loadingMessages = [
  "Understanding your skills...",
  "Mapping your neighbourhood...",
  "Finding your resilience cluster...",
  "Almost there...",
];

export function LoadingScreen({ message }: { message?: string }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (message) return;
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [message]);

  return (
    <div className="fixed inset-0 z-50 bg-warmWhite flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">🤝</span>
        </div>
      </div>
      <p className="mt-6 text-lg font-medium text-textDark animate-pulse">
        {message || loadingMessages[msgIndex]}
      </p>
    </div>
  );
}
