'use client';

import { useEffect, useState } from 'react';

interface GaugeChartProps {
  score: number;
}

export default function GaugeChart({ score }: GaugeChartProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [score]);

  const percentage = (score / 100) * 100;
  const getColor = () => {
    if (score >= 85) return '#10B981';
    if (score >= 70) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 54}`}
          strokeDashoffset={`${2 * Math.PI * 54 * (1 - percentage / 100)}`}
          transform="rotate(-90 60 60)"
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Center text */}
        <text
          x="60"
          y="65"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-2xl font-bold"
          fill="#1F2937"
        >
          {animatedScore}
        </text>
        <text
          x="60"
          y="85"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs"
          fill="#6B7280"
        >
          /100
        </text>
      </svg>
    </div>
  );
}