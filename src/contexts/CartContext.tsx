'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart, CartItem, CartContextType } from '@/types/cart';
import { Product, VariantCombination } from '@/types/product';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('koopi-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('koopi-cart', JSON.stringify(cart));
  }, [cart]);

  // Calculate totals
  const calculateTotals = useCallback((items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { total, itemCount };
  }, []);

  // Add to cart
  const addToCart = useCallback((
    product: Product,
    quantity: number,
    variantCombination?: VariantCombination,
    selectedAttributes?: { [key: string]: string }
  ) => {
    setCart((prevCart) => {
      // Generate unique ID for this cart item
      const itemId = variantCombination
        ? `${product.id}-${variantCombination.id}`
        : product.id || '';

      // Check if item already exists
      const existingItemIndex = prevCart.items.findIndex(item => item.id === itemId);

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        newItems = [...prevCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Add new item
        const price = variantCombination?.price || product.price;
        const newItem: CartItem = {
          id: itemId,
          productId: product.id || '',
          product,
          variantCombination,
          selectedAttributes,
          quantity,
          price,
        };
        newItems = [...prevCart.items, newItem];
      }

      const { total, itemCount } = calculateTotals(newItems);

      return {
        items: newItems,
        total,
        itemCount,
      };
    });
  }, [calculateTotals]);

  // Remove from cart
  const removeFromCart = useCallback((itemId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter(item => item.id !== itemId);
      const { total, itemCount } = calculateTotals(newItems);

      return {
        items: newItems,
        total,
        itemCount,
      };
    });
  }, [calculateTotals]);

  // Update quantity
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      const { total, itemCount } = calculateTotals(newItems);

      return {
        items: newItems,
        total,
        itemCount,
      };
    });
  }, [calculateTotals, removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart({
      items: [],
      total: 0,
      itemCount: 0,
    });
  }, []);

  // Check if product is in cart
  const isInCart = useCallback((productId: string, variantCombination?: VariantCombination) => {
    const itemId = variantCombination
      ? `${productId}-${variantCombination.id}`
      : productId;
    return cart.items.some(item => item.id === itemId);
  }, [cart.items]);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
