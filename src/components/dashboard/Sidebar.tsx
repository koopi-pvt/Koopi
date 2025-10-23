"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  User,
  X,
  Store,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useDashboard } from '@/contexts/DashboardContext';
import { useUser } from '@/contexts/UserContext';

const Sidebar = () => {
  const t = useTranslations('Dashboard');
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const { sidebarOpen, setSidebarOpen } = useDashboard();
  const { store } = useUser();

  // Use real store data from context
  const storeName = store?.storeName || "My Store";
  const plan = store?.plan || "trial";
  const trialDaysLeft = store?.trialDaysRemaining || 0;

  const navigation = [
    {
      name: t('sidebar.overview'),
      href: `/${locale}/dashboard`,
      icon: LayoutDashboard,
      current: pathname === `/${locale}/dashboard`,
    },
    {
      name: t('sidebar.products'),
      href: `/${locale}/dashboard/products`,
      icon: Package,
      current: pathname === `/${locale}/dashboard/products`,
    },
    {
      name: t('sidebar.orders'),
      href: `/${locale}/dashboard/orders`,
      icon: ShoppingCart,
      current: pathname === `/${locale}/dashboard/orders`,
    },
    {
      name: t('sidebar.customers'),
      href: `/${locale}/dashboard/customers`,
      icon: Users,
      current: pathname === `/${locale}/dashboard/customers`,
    },
    {
      name: t('sidebar.analytics'),
      href: `/${locale}/dashboard/analytics`,
      icon: BarChart3,
      current: pathname === `/${locale}/dashboard/analytics`,
    },
    {
      name: 'Store',
      href: `/${locale}/dashboard/store`,
      icon: Store,
      current: pathname === `/${locale}/dashboard/store`,
    },
    {
      name: t('sidebar.settings'),
      href: `/${locale}/dashboard/settings`,
      icon: Settings,
      current: pathname === `/${locale}/dashboard/settings`,
    },
    {
      name: t('sidebar.profile'),
      href: `/${locale}/dashboard/profile`,
      icon: User,
      current: pathname === `/${locale}/dashboard/profile`,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-white/70 to-white/50 backdrop-blur-2xl border-r border-white/40 shadow-2xl shadow-gray-900/20 ring-1 ring-black/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/40">
            <div className="flex items-center space-x-3">
              <div className="p-2">
                <Image
                  src="/favicon.ico"
                  alt="Koopi"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Koopi</h2>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 p-2 hover:bg-white/70 rounded-xl transition-all active:scale-95"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Store Info */}
          <div className="p-4 bg-gradient-to-r from-blue-50/60 to-purple-50/60 border-b border-white/40">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 truncate">{storeName}</p>
                <p className="text-xs text-gray-600">
                  {plan === 'trial' && `${trialDaysLeft} ${t('sidebar.daysLeft')}`}
                  {plan === 'free' && t('sidebar.freePlan')}
                  {plan === 'pro' && t('sidebar.proPlan')}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${
                  plan === 'trial'
                    ? 'bg-yellow-100 text-yellow-800'
                    : plan === 'pro'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {plan === 'trial' && t('sidebar.trial')}
                {plan === 'free' && t('sidebar.free')}
                {plan === 'pro' && t('sidebar.pro')}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    item.current
                      ? 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 text-blue-700 border border-blue-100/50 shadow-sm'
                      : 'text-gray-700 hover:bg-white/70 hover:text-blue-600 hover:shadow-sm'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/40">
            <p className="text-xs text-gray-500 text-center">
              © 2025 Koopi. {t('sidebar.allRights')}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
