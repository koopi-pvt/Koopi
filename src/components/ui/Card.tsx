import React from 'react';

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ 
  children, 
  className = '',
  hover = false,
  ...props 
}: CardProps) {
  return (
    <div 
      className={`bg-white rounded-2xl border border-gray-100 p-6 ${
        hover ? 'hover:border-indigo-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
