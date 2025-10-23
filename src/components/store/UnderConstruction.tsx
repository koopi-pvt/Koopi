'use client';

import React from 'react';
import { Construction, Store as StoreIcon, Clock } from 'lucide-react';
import { Store } from '@/types/store';

interface UnderConstructionProps {
  store: Store;
}

export function UnderConstruction({ store }: UnderConstructionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          {store.logoUrl ? (
            <img 
              src={store.logoUrl} 
              alt={store.storeName}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <StoreIcon className="w-12 h-12 text-white" />
            </div>
          )}
        </div>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Construction className="w-20 h-20 text-blue-600 animate-bounce" />
            <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
              <Clock className="w-6 h-6 text-yellow-800" />
            </div>
          </div>
        </div>

        {/* Store Name */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {store.storeName}
        </h1>

        {/* Message */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            We're Under Construction
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Our store is currently being set up and will be available soon. 
            We're working hard to bring you an amazing shopping experience!
          </p>
          {store.description && (
            <p className="text-gray-500 text-sm italic border-t border-gray-200 pt-4 mt-4">
              "{store.description}"
            </p>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-blue-600 font-semibold mb-1">Setting Up</div>
            <div className="text-sm text-gray-600">Adding products</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-purple-600 font-semibold mb-1">Coming Soon</div>
            <div className="text-sm text-gray-600">Stay tuned</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-green-600 font-semibold mb-1">Opening Soon</div>
            <div className="text-sm text-gray-600">Check back later</div>
          </div>
        </div>

        {/* Footer Message */}
        <p className="text-gray-500 text-sm">
          Thank you for your patience! 🙏
        </p>
      </div>
    </div>
  );
}
