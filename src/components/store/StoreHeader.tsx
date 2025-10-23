'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store as StoreIcon } from 'lucide-react';
import { Store } from '@/types/store';

interface StoreHeaderProps {
  store: Store;
  locale: string;
}

export function StoreHeader({ store, locale }: StoreHeaderProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: `/${locale}/store/${store.storeSlug}`, text: 'Products' },
    { href: `/${locale}/store/${store.storeSlug}/about`, text: 'About' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            {store.logoUrl ? (
              <img 
                src={store.logoUrl} 
                alt={store.storeName}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <StoreIcon className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{store.storeName}</h1>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`text-lg font-medium transition-colors ${pathname === link.href ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}>
                  {link.text}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}