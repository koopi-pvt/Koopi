'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MobileSidebar from './MobileSidebar';

export default function DockNav() {
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      {/* Spacer for fixed nav */}
      <div className="h-20"></div>
      
      {/* Desktop Navigation - Modern Clean Design */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden lg:block bg-white/70 backdrop-blur-2xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                  <span className="text-white text-xl font-bold">K</span>
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Koopi
              </span>
            </Link>

            {/* Right Section - Auth & Language */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    i18n.language === 'en'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage('si')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    i18n.language === 'si'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  සිං
                </button>
              </div>

              {/* Auth Buttons */}
              <Link 
                href="/login"
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/signup"
                className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Modern Clean Design */}
      <nav className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-white/70 backdrop-blur-2xl border-b border-gray-200/50 shadow-sm">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-lg font-bold">K</span>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Koopi
              </span>
            </Link>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors active:scale-95"
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}
