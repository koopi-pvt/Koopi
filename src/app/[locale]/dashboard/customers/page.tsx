"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Users } from 'lucide-react';
import EmptyState from '@/components/dashboard/EmptyState';

export default function CustomersPage() {
  const t = useTranslations('Dashboard');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t('customers.title')}
        </h1>
        <p className="mt-2 text-gray-600">{t('customers.subtitle')}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <EmptyState
          icon={Users}
          title={t('customers.emptyTitle')}
          description={t('customers.emptyDesc')}
        />
      </div>
    </div>
  );
}