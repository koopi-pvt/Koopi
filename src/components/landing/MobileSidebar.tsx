'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { i18n } = useTranslation();
  const pathname = usePathname();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl blur-sm opacity-50"></div>
                <div className="relative w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-base font-bold">K</span>
                </div>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Koopi
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors active:scale-95"
              aria-label="Close menu"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-5 py-6">
            <div className="space-y-2 mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                Menu
              </p>
            </div>

            {/* Auth Buttons */}
            <div className="space-y-3 mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                Account
              </p>
              <Link
                href="/login"
                onClick={onClose}
                className={`block px-4 py-2.5 text-center text-sm rounded-xl font-semibold transition-all ${
                  pathname === '/login'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={onClose}
                className="block px-4 py-2.5 text-center text-sm bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
              >
                Sign Up
              </Link>
            </div>

            {/* Language Switcher */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                Language
              </p>
              <div className="flex items-center bg-gray-100 rounded-xl p-1.5">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    i18n.language === 'en'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage('si')}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    i18n.language === 'si'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  සිං
                </button>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} Koopi. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
