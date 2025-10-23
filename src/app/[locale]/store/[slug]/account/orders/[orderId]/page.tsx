'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBuyerAuth } from '@/contexts/BuyerAuthContext';
import { ArrowLeft, Loader2, Package, MapPin, DollarSign, Calendar, CreditCard, FileText } from 'lucide-react';
import { formatPrice } from '@/utils/currency';
import { Order } from '@/types/order';
import OrderTimeline from '@/components/buyer/OrderTimeline';
import ChatBox from '@/components/messaging/ChatBox';

export default function BuyerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { buyer, loading: authLoading, isAuthenticated } = useBuyerAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${params.locale}/store/${params.slug}/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
    } else if (buyer && params.orderId) {
      fetchOrder();
    }
  }, [authLoading, isAuthenticated, buyer, params.orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${params.orderId}`);
      const data = await response.json();

      if (response.ok) {
        // Verify this order belongs to the current buyer
        if (data.order.buyerId !== buyer?.id) {
          setError('You do not have permission to view this order');
        } else {
          setOrder(data.order);
        }
      } else {
        setError(data.error || 'Failed to load order');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-semibold">{error || 'Order not found'}</p>
            <Link
              href={`/${params.locale}/store/${params.slug}/account/orders`}
              className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/${params.locale}/store/${params.slug}/account/orders`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>
            <div>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <OrderTimeline
              status={order.status}
              createdAt={order.createdAt}
              updatedAt={order.updatedAt}
            />

            {/* Order Items */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      {item.variant && Object.keys(item.variant).length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          {Object.entries(item.variant)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ')}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity, order.currency)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatPrice(item.price, order.currency)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Box */}
            {buyer && (
              <ChatBox
                orderId={order.id}
                currentUserId={buyer.id}
                currentUserType="buyer"
                currentUserName={buyer.name}
              />
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(order.subtotal, order.currency)}
                  </span>
                </div>
                {order.discount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount ({order.discount.code})</span>
                    <span className="font-medium text-green-600">
                      -{formatPrice(order.discount.discountAmount, order.currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">
                    {order.shipping > 0 ? formatPrice(order.shipping, order.currency) : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(order.tax, order.currency)}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-blue-600">
                    {formatPrice(order.total, order.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium text-gray-900 uppercase">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-medium ${
                      order.paymentStatus === 'paid'
                        ? 'text-green-600'
                        : order.paymentStatus === 'pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Tracking Number */}
            {order.trackingNumber && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Tracking Number
                </h3>
                <p className="text-sm font-mono text-blue-700 font-semibold">
                  {order.trackingNumber}
                </p>
              </div>
            )}

            {/* Notes */}
            {order.notes && (
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Notes
                </h3>
                <p className="text-sm text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
