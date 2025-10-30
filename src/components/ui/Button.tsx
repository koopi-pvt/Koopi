import React from 'react';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg sm:rounded-xl transition-all duration-200 inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:scale-105',
    secondary: 'bg-white text-gray-900 border border-gray-200 hover:border-gray-300 hover:shadow-md',
    ghost: 'text-gray-700 hover:bg-gray-100'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm',
    md: 'px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base',
    lg: 'px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg'
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
