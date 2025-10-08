'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

interface NeuralButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  neural?: boolean;
  className?: string;
}

export default function NeuralButton({
  children,
  variant = 'primary',
  size = 'md',
  neural = false,
  className = '',
  ...props
}: NeuralButtonProps) {
  const baseClasses = 'relative overflow-hidden font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50';
  
  const variantClasses = {
    primary: neural 
      ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40'
      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
    ghost: 'text-white hover:bg-white/10',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl'
  };

  const neuralClasses = neural 
    ? 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
    : '';

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${neuralClasses}
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
