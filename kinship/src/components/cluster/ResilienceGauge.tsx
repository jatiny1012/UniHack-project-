"use client";

import { useEffect, useState } from "react";

interface ResilienceGaugeProps {
  score: number;
  size?: number;
}

export function ResilienceGauge({ score, size = 140 }: ResilienceGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const color = animatedScore >= 70 ? "#27AE60" : animatedScore >= 40 ? "#F39C12" : "#E74C3C";

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 1.5s ease, stroke 0.5s ease" }}
        />
      </svg>
      <div className="relative -mt-[calc(50%+10px)] flex flex-col items-center justify-center" style={{ height: size }}>
        <span className="text-3xl font-extrabold" style={{ color }}>{Math.round(animatedScore)}</span>
        <span className="text-xs text-textMuted font-medium mt-0.5">/ 100</span>
      </div>
      <p className="text-sm font-medium text-textMuted -mt-2">Cluster Resilience</p>
    </div>
  );
}
