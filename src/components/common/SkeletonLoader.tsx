import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'table' | 'stats';
  width?: string;
  height?: string;
  count?: number;
  className?: string;
}

export default function SkeletonLoader({
  variant = 'text',
  width = 'w-full',
  height = 'h-4',
  count = 1,
  className = '',
}: SkeletonLoaderProps) {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]';

  const renderSkeleton = () => {
    switch (variant) {
      case 'circular':
        return <div className={`${baseClasses} rounded-full ${width} ${height} ${className}`} />;
      
      case 'rectangular':
        return <div className={`${baseClasses} rounded-lg ${width} ${height} ${className}`} />;
      
      case 'card':
        return (
          <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
            <div className="space-y-4">
              <div className={`${baseClasses} rounded-lg h-48 w-full`} />
              <div className={`${baseClasses} rounded h-6 w-3/4`} />
              <div className={`${baseClasses} rounded h-4 w-full`} />
              <div className={`${baseClasses} rounded h-4 w-5/6`} />
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <div className="flex gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`${baseClasses} rounded h-4 flex-1`} />
                ))}
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="p-4">
                  <div className="flex gap-4">
                    {[1, 2, 3, 4].map((col) => (
                      <div key={col} className={`${baseClasses} rounded h-4 flex-1`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'stats':
        return (
          <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
            <div className="space-y-3">
              <div className={`${baseClasses} rounded h-4 w-1/2`} />
              <div className={`${baseClasses} rounded h-8 w-3/4`} />
              <div className={`${baseClasses} rounded h-3 w-2/3`} />
            </div>
          </div>
        );
      
      case 'text':
      default:
        return <div className={`${baseClasses} rounded ${width} ${height} ${className}`} />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
      ))}
    </>
  );
}
