'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'intense';
  hover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ 
  children, 
  className = '', 
  intensity = 'medium',
  hover = true,
  onClick 
}: GlassCardProps) {
  const intensityClasses = {
    light: 'bg-white/5 backdrop-blur-sm border-white/10',
    medium: 'bg-white/8 backdrop-blur-md border-white/12',
    intense: 'bg-white/12 backdrop-blur-lg border-white/18'
  };

  const hoverClasses = hover 
    ? 'hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300' 
    : '';

  return (
    <div 
      className={`
        ${intensityClasses[intensity]}
        ${hoverClasses}
        rounded-2xl border shadow-lg
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
