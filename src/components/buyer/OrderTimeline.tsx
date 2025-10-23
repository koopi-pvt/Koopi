'use client';

import React from 'react';
import { Check, Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { OrderStatus } from '@/types/order';

interface OrderTimelineProps {
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const statusOrder: { [key: string]: number } = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
};

export default function OrderTimeline({ status, createdAt, updatedAt }: OrderTimelineProps) {
  const currentStatusIndex = statusOrder[status] || 0;
  const isCancelled = status === 'cancelled';

  if (isCancelled) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 rounded-full p-3">
            <XCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-900">Order Cancelled</h3>
            <p className="text-sm text-red-700">This order has been cancelled</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Timeline</h3>
      
      <div className="relative">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          const Icon = step.icon;
          
          return (
            <div key={step.key} className="flex items-start gap-4 pb-8 last:pb-0 relative">
              {/* Connector Line */}
              {index < statusSteps.length - 1 && (
                <div
                  className={`absolute left-5 top-12 w-0.5 h-full -ml-px ${
                    isCompleted ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              )}
              
              {/* Icon Circle */}
              <div
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white border-gray-300'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Icon
                    className={`w-5 h-5 ${
                      isCurrent ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  />
                )}
              </div>
              
              {/* Step Content */}
              <div className="flex-1 pt-1">
                <p
                  className={`font-semibold ${
                    isCompleted ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    Current Status
                  </p>
                )}
                {isCompleted && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(index === 0 ? createdAt : updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
