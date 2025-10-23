"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { BarChart3 } from 'lucide-react';
import EmptyState from '@/components/dashboard/EmptyState';

export default function AnalyticsPage() {
  const t = useTranslations('Dashboard');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t('analytics.title')}
        </h1>
        <p className="mt-2 text-gray-600">{t('analytics.subtitle')}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <EmptyState
          icon={BarChart3}
          title={t('analytics.emptyTitle')}
          description={t('analytics.emptyDesc')}
        />
      </div>
    </div>
  );
}