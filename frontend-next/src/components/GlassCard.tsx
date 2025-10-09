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
  const getIntensityClass = () => {
    switch (intensity) {
      case 'light':
        return 'bg-white/5 backdrop-blur-sm border-white/10';
      case 'medium':
        return 'bg-white/8 backdrop-blur-md border-white/12';
      case 'intense':
        return 'bg-white/12 backdrop-blur-lg border-white/18';
      default:
        return 'bg-white/8 backdrop-blur-md border-white/12';
    }
  };

  const getHoverClass = () => {
    return hover
      ? 'hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300'
      : '';
  };

  return (
    <div
      className={`rounded-2xl border shadow-lg ${getIntensityClass()} ${getHoverClass()} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
