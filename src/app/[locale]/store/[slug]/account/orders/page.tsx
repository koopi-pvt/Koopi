'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBuyerAuth } from '@/contexts/BuyerAuthContext';
import { Package, Loader2, ChevronRight, ArrowLeft, Calendar, DollarSign } from 'lucide-react';
import { formatPrice } from '@/utils/currency';

interface Order {
  id: string;
  orderNumber: string;
  items: any[];
  total: number;
  currency: string;
  status: string;
  createdAt: any;
}

export default function BuyerOrdersPage() {
  const params = useParams();
  const router = useRouter();
  const { buyer, loading: authLoading, isAuthenticated } = useBuyerAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${params.locale}/store/${params.slug}/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
    } else if (buyer) {
      fetchOrders();
    }
  }, [authLoading, isAuthenticated, buyer]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?buyerId=${buyer?.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/${params.locale}/store/${params.slug}/account`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Account
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
            <Link
              href={`/${params.locale}/store/${params.slug}`}
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Link
                key={order.id}
                href={`/${params.locale}/store/${params.slug}/account/orders/${order.id}`}
                className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Order #{order.orderNumber}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatPrice(order.total, order.currency)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
