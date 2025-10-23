"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  ShoppingCart,
  Package,
  DollarSign,
  Users,
  Plus,
  Palette,
  Settings,
  TrendingUp,
} from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import TrialBanner from '@/components/dashboard/TrialBanner';
import { useUser } from '@/contexts/UserContext';
import { formatPrice } from '@/utils/currency';

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalStock: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
}

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const { user, store } = useUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();

      if (response.ok) {
        setStats(data);
      } else {
        console.error('Failed to fetch dashboard stats:', data.error);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Use real data from context
  const trialDaysLeft = store?.trialDaysRemaining || 0;
  const storeName = store?.storeName || "My Store";
  const showTrialBanner = store?.plan === 'trial' && trialDaysLeft > 0;

  const quickActions = [
    {
      icon: Plus,
      title: t('quickActions.addProduct'),
      description: t('quickActions.addProductDesc'),
      color: 'from-blue-50 to-purple-50 border-blue-200',
      iconBg: 'bg-blue-600',
      onClick: () => console.log('Add product'),
    },
    {
      icon: Palette,
      title: t('quickActions.customize'),
      description: t('quickActions.customizeDesc'),
      color: 'from-purple-50 to-pink-50 border-purple-200',
      iconBg: 'bg-purple-600',
      onClick: () => console.log('Customize store'),
    },
    {
      icon: Settings,
      title: t('quickActions.settings'),
      description: t('quickActions.settingsDesc'),
      color: 'from-green-50 to-emerald-50 border-green-200',
      iconBg: 'bg-green-600',
      onClick: () => console.log('Settings'),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t('overview.welcome')}
        </h1>
        <p className="mt-2 text-gray-600">
          {t('overview.subtitle', { storeName })}
        </p>
      </div>

      {/* Trial Banner */}
      {showTrialBanner && <TrialBanner daysLeft={trialDaysLeft} />}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatsCard
          title={t('stats.orders')}
          value={loadingStats ? '...' : (stats?.totalOrders ?? 0)}
          icon={ShoppingCart}
          color="blue"
          trend={{ value: t('stats.noOrdersYet'), isPositive: true }}
        />
        <StatsCard
          title={t('stats.products')}
          value={loadingStats ? '...' : (stats?.totalProducts ?? 0)}
          icon={Package}
          color="purple"
          trend={{ value: `${stats?.activeProducts ?? 0} active`, isPositive: true }}
        />
        <StatsCard
          title={t('stats.revenue')}
          value={loadingStats ? '...' : formatPrice(stats?.totalRevenue ?? 0, store?.currency || 'USD')}
          icon={DollarSign}
          color="green"
          trend={{ value: t('stats.startSelling'), isPositive: true }}
        />
        <StatsCard
          title={t('stats.customers')}
          value={loadingStats ? '...' : (stats?.totalCustomers ?? 0)}
          icon={Users}
          color="orange"
          trend={{ value: t('stats.noCustomersYet'), isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {t('quickActions.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                onClick={action.onClick}
                className={`p-6 text-left bg-gradient-to-br ${action.color} hover:shadow-md rounded-xl border transition-all group`}
              >
                <div
                  className={`w-12 h-12 ${action.iconBg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity / Orders */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{t('recentOrders.title')}</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            {t('recentOrders.viewAll')}
          </button>
        </div>
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <TrendingUp className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('recentOrders.empty')}
          </h3>
          <p className="text-gray-600 mb-6">{t('recentOrders.emptyDesc')}</p>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {t('recentOrders.addProduct')}
          </button>
        </div>
      </div>
    </div>
  );
}
