import React from 'react';

export function StoreLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Skeleton */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse hidden sm:block" />
              </div>
            </div>
            
            {/* Cart Skeleton */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Skeleton */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="h-10 w-64 bg-white/20 rounded-lg mx-auto animate-pulse" />
            <div className="h-6 w-96 bg-white/20 rounded-lg mx-auto animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters Skeleton */}
        <div className="mb-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto animate-pulse" />
            <div className="h-5 w-64 bg-gray-200 rounded-lg mx-auto animate-pulse" />
          </div>

          {/* Search Bar Skeleton */}
          <div className="max-w-2xl mx-auto">
            <div className="h-14 bg-white border-2 border-gray-200 rounded-xl animate-pulse" />
          </div>

          {/* Category Filters Skeleton */}
          <div className="flex flex-wrap justify-center gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="mb-6 text-center">
          <div className="h-10 w-48 bg-gray-200 rounded-full mx-auto animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Image Skeleton */}
              <div className="w-full h-64 bg-gray-200 animate-pulse" />
              
              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Skeleton */}
      <footer className="bg-gray-900 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <div className="h-4 w-48 bg-gray-700 rounded mx-auto animate-pulse" />
          <div className="h-3 w-32 bg-gray-700 rounded mx-auto animate-pulse" />
        </div>
      </footer>
    </div>
  );
}
