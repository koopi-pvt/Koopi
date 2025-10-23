'use client';

import React from 'react';
import { Store as StoreIcon, Info } from 'lucide-react';
import { Store } from '@/types/store';

interface AboutSectionProps {
  store: Store;
}

export function AboutSection({ store }: AboutSectionProps) {
  if (!store.aboutEnabled || !store.aboutContent) {
    return null;
  }

  return (
    <section id="about" className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <Info className="w-4 h-4" />
            <span className="text-sm font-semibold">About Us</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            About {store.storeName}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Store Logo/Icon */}
            <div className="flex-shrink-0">
              {store.logoUrl ? (
                <img 
                  src={store.logoUrl} 
                  alt={store.storeName}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-blue-200 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <StoreIcon className="w-16 h-16 text-white" />
                </div>
              )}
            </div>

            {/* About Content */}
            <div className="flex-1 min-w-0">
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed break-words overflow-wrap-anywhere"
                style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                dangerouslySetInnerHTML={{ __html: store.aboutContent }}
              />
              
              {/* Store Details */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Store Name</div>
                    <div className="font-semibold text-gray-900">{store.storeName}</div>
                  </div>
                  {store.categories && store.categories.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Categories</div>
                      <div className="font-semibold text-gray-900">
                        {store.categories.slice(0, 3).join(', ')}
                        {store.categories.length > 3 && ' +more'}
                      </div>
                    </div>
                  )}
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Status</div>
                    <div className="font-semibold text-green-600">Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
