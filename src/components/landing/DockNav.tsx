'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DockNav() {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();

  return (
    <>
      {/* Spacer for fixed nav */}
      <div className="h-20"></div>
      
      {/* Dock Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-full shadow-2xl px-6 py-3">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-md">
                <span className="text-white text-lg font-bold">K</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">Koopi</span>
            </Link>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-200"></div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Link 
                href="/login"
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  pathname === '/login'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Login
              </Link>
              <Link 
                href="/signup"
                className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Sign Up
              </Link>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

            {/* Language Switcher */}
            <div className="hidden sm:flex items-center space-x-1 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('si')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  language === 'si'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                සිං
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
