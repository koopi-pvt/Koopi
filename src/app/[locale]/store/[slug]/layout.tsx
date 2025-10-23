'use client';

import React from 'react';
import { CartProvider } from '@/contexts/CartContext';
import { BuyerAuthProvider } from '@/contexts/BuyerAuthContext';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BuyerAuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </BuyerAuthProvider>
  );
}
