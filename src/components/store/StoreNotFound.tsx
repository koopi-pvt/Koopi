'use client';

import React from 'react';
import Link from 'next/link';
import { Store as StoreIcon, Search, Home, AlertCircle } from 'lucide-react';

interface StoreNotFoundProps {
  locale: string;
}

export function StoreNotFound({ locale }: StoreNotFoundProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <StoreIcon className="w-16 h-16 text-gray-500" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-3 shadow-lg">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-7xl font-bold text-gray-800 mb-4">404</h1>
        
        {/* Message */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            Store Not Found
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            We couldn't find the store you're looking for. It may have been removed, 
            renamed, or never existed.
          </p>
          
          {/* Possible Reasons */}
          <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Possible reasons:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>The store URL might be incorrect or misspelled</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>The store may have been closed or deleted</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>The store owner might have changed the URL</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <Home className="w-5 h-5" />
              Go to Homepage
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-gray-500 text-sm">
          Need help? Contact the store owner or visit our{' '}
          <Link href={`/${locale}`} className="text-blue-600 hover:underline font-medium">
            main platform
          </Link>
        </p>
      </div>
    </div>
  );
}
