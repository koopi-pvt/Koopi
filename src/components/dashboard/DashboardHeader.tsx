"use client";

import React, { useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import {
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Globe,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useDashboard } from '@/contexts/DashboardContext';
import { useUser } from '@/contexts/UserContext';
import Image from 'next/image';

const DashboardHeader = () => {
  const t = useTranslations('Dashboard');
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const { toggleSidebar } = useDashboard();
  const { user } = useUser();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // Use real user data from context
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push(`/${locale}/login`);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const switchLanguage = (newLocale: string) => {
    const pathParts = pathname.split('/');
    pathParts[1] = newLocale;
    const newPath = pathParts.join('/');
    router.push(newPath);
    setLangMenuOpen(false);
  };

  // Get user initials for avatar
  const userInitials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <header className="bg-white/95 backdrop-blur-2xl border-b border-gray-200/60 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
            {t('header.welcome')}
          </h1>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{locale.toUpperCase()}</span>
              <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {langMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setLangMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-36 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden z-20 ring-1 ring-black/5">
                  <button
                    onClick={() => switchLanguage('en')}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-all ${
                      locale === 'en' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => switchLanguage('si')}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-all ${
                      locale === 'si' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    සිංහල
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
            >
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={userName}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {userInitials}
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">{userEmail}</p>
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 py-1 z-20 ring-1 ring-black/5">
                  <div className="px-4 py-3 border-b border-gray-200 md:hidden">
                    <p className="text-sm font-medium text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  </div>
                  <button
                    onClick={() => {
                      router.push(`/${locale}/dashboard/profile`);
                      setUserMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all"
                  >
                    <User className="mr-3 h-4 w-4" />
                    {t('header.profile')}
                  </button>
                  <button
                    onClick={() => {
                      router.push(`/${locale}/dashboard/settings`);
                      setUserMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all"
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    {t('header.settings')}
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    {t('header.logout')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
