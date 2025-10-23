"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Clock, X } from 'lucide-react';

interface TrialBannerProps {
  daysLeft: number;
  onDismiss?: () => void;
}

const TrialBanner = ({ daysLeft, onDismiss }: TrialBannerProps) => {
  const t = useTranslations('Dashboard');

  if (daysLeft <= 0) return null;

  const urgency = daysLeft <= 3 ? 'red' : daysLeft <= 7 ? 'yellow' : 'blue';

  const colors = {
    red: 'bg-red-50 border-red-200 text-red-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div
      className={`${colors[urgency]} border rounded-lg p-4 flex items-center justify-between mb-6`}
    >
      <div className="flex items-center space-x-3">
        <Clock className="h-5 w-5" />
        <div>
          <p className="font-semibold">
            {t('trial.title', { days: daysLeft })}
          </p>
          <p className="text-sm mt-0.5">{t('trial.description')}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="px-4 py-2 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 border border-gray-300">
          {t('trial.upgrade')}
        </button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TrialBanner;
