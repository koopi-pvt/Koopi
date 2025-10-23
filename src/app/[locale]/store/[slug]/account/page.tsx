'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBuyerAuth } from '@/contexts/BuyerAuthContext';
import { User, Package, MapPin, LogOut, Loader2 } from 'lucide-react';

export default function BuyerAccountPage() {
  const params = useParams();
  const router = useRouter();
  const { buyer, loading, isAuthenticated, logout } = useBuyerAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/${params.locale}/store/${params.slug}/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [loading, isAuthenticated, params, router]);

  const handleLogout = async () => {
    await logout();
    router.push(`/${params.locale}/store/${params.slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!buyer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{buyer.name}</h1>
                <p className="text-gray-600">{buyer.email}</p>
                {buyer.phone && <p className="text-gray-500 text-sm">{buyer.phone}</p>}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Orders */}
          <Link
            href={`/${params.locale}/store/${params.slug}/account/orders`}
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  My Orders
                </h3>
                <p className="text-gray-600 text-sm">View and track your orders</p>
              </div>
            </div>
          </Link>

          {/* Addresses */}
          <Link
            href={`/${params.locale}/store/${params.slug}/account/addresses`}
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  Saved Addresses
                </h3>
                <p className="text-gray-600 text-sm">Manage your delivery addresses</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Back to Store */}
        <div className="mt-8 text-center">
          <Link
            href={`/${params.locale}/store/${params.slug}`}
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
