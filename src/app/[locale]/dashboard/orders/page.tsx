"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ShoppingCart, Package, Loader2, Eye, CheckCircle, Clock, XCircle, Truck, Filter } from 'lucide-react';
import EmptyState from '@/components/dashboard/EmptyState';
import { useUser } from '@/contexts/UserContext';
import { formatPrice } from '@/utils/currency';
import Loader from '@/components/common/Loader';
import { useToast } from '@/contexts/ToastContext';

interface Order {
  id: string;
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  items: any[];
  total: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export default function OrdersPage() {
  const t = useTranslations('Dashboard');
  const { store } = useUser();
  const toast = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (store?.storeId) {
      fetchOrders();
    }
  }, [store]);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter]);

  const filterOrders = () => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.orderStatus === statusFilter));
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders?storeId=${store?.storeId}`);
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (response.ok) {
        // Refresh orders
        await fetchOrders();
        // Update selected order if it's the one being updated
        if (selectedOrder && selectedOrder.orderId === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        }
        toast.success('Order status updated successfully');
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { bg: string; text: string; icon: any } } = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Truck },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return <Loader text="Loading orders..." />;
  }

  if (orders.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t('orders.title')}
          </h1>
          <p className="mt-2 text-gray-600">{t('orders.subtitle')}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <EmptyState
            icon={ShoppingCart}
            title={t('orders.emptyTitle')}
            description={t('orders.emptyDesc')}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Orders
        </h1>
        <p className="mt-2 text-gray-600">Manage your store orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-600 font-medium mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <p className="text-sm text-yellow-700 font-medium mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{orders.filter(o => o.orderStatus === 'pending').length}</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <p className="text-sm text-blue-700 font-medium mb-1">Confirmed</p>
          <p className="text-2xl font-bold text-blue-700">{orders.filter(o => o.orderStatus === 'confirmed').length}</p>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
          <p className="text-sm text-purple-700 font-medium mb-1">Shipped</p>
          <p className="text-2xl font-bold text-purple-700">{orders.filter(o => o.orderStatus === 'shipped').length}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-sm text-green-700 font-medium mb-1">Delivered</p>
          <p className="text-2xl font-bold text-green-700">{orders.filter(o => o.orderStatus === 'delivered').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">
                      #{order.orderId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customerInfo.name}
                    </div>
                    <div className="text-sm text-gray-500">{order.customerInfo.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatPrice(order.total, order.currency)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 uppercase">
                      {order.paymentMethod}
                    </div>
                    <div className={`text-xs ${
                      order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {order.paymentStatus}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.orderStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSelectedOrder(null)}></div>
            
            <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-blue-600 font-semibold mt-1">#{selectedOrder.orderId}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm"><span className="font-medium">Name:</span> {selectedOrder.customerInfo.name}</p>
                    <p className="text-sm"><span className="font-medium">Email:</span> {selectedOrder.customerInfo.email}</p>
                    <p className="text-sm"><span className="font-medium">Phone:</span> {selectedOrder.customerInfo.phone}</p>
                    <p className="text-sm"><span className="font-medium">Address:</span> {selectedOrder.customerInfo.address}, {selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.country}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex gap-4 bg-gray-50 rounded-lg p-4">
                        {item.image && (
                          <img src={item.image} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {Object.entries(item.selectedAttributes).map(([key, value]) => `${key}: ${value}`).join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity, selectedOrder.currency)}</p>
                          <p className="text-xs text-gray-500">{formatPrice(item.price, selectedOrder.currency)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{formatPrice(selectedOrder.total, selectedOrder.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Payment Method</span>
                    <span className="uppercase font-medium">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Payment Status</span>
                    <span className={`font-medium ${selectedOrder.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {selectedOrder.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Update Order Status */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Update Order Status</h3>
                  <div className="flex gap-3">
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={(e) => {
                        if (confirm(`Update order status to "${e.target.value}"?`)) {
                          updateOrderStatus(selectedOrder.orderId, e.target.value);
                        }
                      }}
                      disabled={updatingStatus}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {updatingStatus && (
                      <div className="flex items-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Select a new status to update this order</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}