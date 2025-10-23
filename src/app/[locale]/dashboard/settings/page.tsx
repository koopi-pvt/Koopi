"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { DollarSign, Loader2, Save, CreditCard, Banknote } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { CURRENCIES } from '@/utils/currency';
import Loader from '@/components/common/Loader';
import { useToast } from '@/contexts/ToastContext';

export default function SettingsPage() {
  const t = useTranslations('Dashboard');
  const { store } = useUser();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [codEnabled, setCodEnabled] = useState(true);

  useEffect(() => {
    if (store) {
      setCurrency(store.currency || 'USD');
      setCodEnabled(store.codEnabled !== false); // Default to true
      setLoading(false);
    } else {
      fetchStoreData();
    }
  }, [store]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/store');
      const data = await response.json();

      if (response.ok && data.store) {
        setCurrency(data.store.currency || 'USD');
        setCodEnabled(data.store.codEnabled !== false);
      }
    } catch (error) {
      console.error('Error fetching store:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/store', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency, codEnabled }),
      });

      if (response.ok) {
        toast.success('Currency settings saved successfully!');
        // Refresh the page to update the currency throughout the app
        setTimeout(() => window.location.reload(), 1000);
      } else {
        const data = await response.json();
        toast.error(`Failed to save settings: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('An error occurred while saving settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading settings..." />;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t('settings.title')}
        </h1>
        <p className="mt-2 text-gray-600">{t('settings.subtitle')}</p>
      </div>

      {/* Currency Settings Section */}
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          Currency Settings
        </h2>
        
        <div className="mb-6">
          <label htmlFor="currency" className="block font-medium text-gray-700 mb-2">
            Store Currency *
          </label>
          <select
            id="currency"
            name="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.symbol} - {curr.name} ({curr.code})
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-500">
            This currency will be used for all prices in your store. Changes will apply immediately after saving.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Payment Settings Section */}
      <div className="mt-6 bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          Payment Methods
        </h2>
        
        <div className="space-y-4">
          {/* COD Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Banknote className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Cash on Delivery (COD)</h3>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                  codEnabled 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {codEnabled ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Allow customers to pay with cash when their order is delivered
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCodEnabled(!codEnabled)}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                codEnabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  codEnabled ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Stripe - Coming Soon */}
          <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 opacity-60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-500">Stripe</h3>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                  Coming Soon
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Accept credit and debit card payments securely with Stripe
            </p>
          </div>

          {/* PayPal - Coming Soon */}
          <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 opacity-60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-500">PayPal</h3>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                  Coming Soon
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Let customers pay using their PayPal account
            </p>
          </div>

          {/* Bank Transfer - Coming Soon */}
          <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 opacity-60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-500">Bank Transfer</h3>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                  Coming Soon
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Accept direct bank transfers from customers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}