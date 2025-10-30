import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  error?: string;
  className?: string;
}

export default function Input({ 
  label,
  error,
  className = '',
  ...props 
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
          error ? 'border-red-500' : 'border-gray-200'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
