'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store as StoreIcon, ShoppingCart, Menu, X, Package, User } from 'lucide-react';
import { Store } from '@/types/store';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/currency';

interface StoreNavigationProps {
  store: Store;
  locale: string;
}

export function StoreNavigation({ store, locale }: StoreNavigationProps) {
  const pathname = usePathname();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navLinks = [
    { 
      href: `/${locale}/store/${store.storeSlug}`, 
      text: 'Shop', 
      icon: Package,
      show: true 
    },
    { 
      href: `/${locale}/store/${store.storeSlug}/account`, 
      text: 'Account', 
      icon: User,
      show: true 
    },
  ];

  return (
    <>
      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Store Name */}
            <Link href={`/${locale}/store/${store.storeSlug}`} className="flex items-center gap-3 group">
              {store.logoUrl ? (
                <img 
                  src={store.logoUrl} 
                  alt={store.storeName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-200 group-hover:border-blue-400 transition-colors"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <StoreIcon className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {store.storeName}
                </h1>
                {store.description && (
                  <p className="text-xs text-gray-500 hidden sm:block line-clamp-1">
                    {store.description}
                  </p>
                )}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center gap-8">
              {navLinks.filter(link => link.show).map((link) => {
                const Icon = link.icon;
                const isActive = link.href.startsWith('#') 
                  ? false 
                  : pathname === link.href;
                
                return link.href.startsWith('#') ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {link.text}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-center gap-2 font-medium transition-colors ${
                      isActive 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.text}
                  </Link>
                );
              })}
            </div>

            {/* Cart & Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.itemCount > 99 ? '99+' : cart.itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                {navLinks.filter(link => link.show).map((link) => {
                  const Icon = link.icon;
                  const isActive = link.href.startsWith('#') 
                    ? false 
                    : pathname === link.href;
                  
                  return link.href.startsWith('#') ? (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      {link.text}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                        isActive
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.text}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Drawer - Popup on Desktop, Full Page on Mobile */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Cart Panel - Full Page on Mobile, Popup on Desktop */}
          <div className="absolute inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[90vh] md:rounded-2xl w-full bg-gradient-to-b from-white to-gray-50 shadow-2xl overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Header - Enhanced & Mobile Responsive */}
              <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                      Shopping Cart
                    </h2>
                    {cart.items.length > 0 && (
                      <p className="text-blue-100 text-xs sm:text-sm mt-1">
                        {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              {/* Cart Items - Enhanced & Mobile Responsive */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
                {cart.items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                      <ShoppingCart className="w-16 h-16 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500">Add some products to get started</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                            {item.product.images && item.product.images.length > 0 ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-10 h-10 text-gray-300" />
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                              {item.product.name}
                            </h3>
                            {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {Object.entries(item.selectedAttributes).map(([key, value]) => (
                                  <span key={key} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                    {key}: {value}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            {/* Price */}
                            <div className="mb-3">
                              <p className="text-lg font-bold text-blue-600">
                                {formatPrice(item.price * item.quantity, store.currency || 'USD')}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatPrice(item.price, store.currency || 'USD')} each
                              </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                <button
                                  onClick={() => {
                                    if (item.quantity > 1) {
                                      updateQuantity(item.id, item.quantity - 1);
                                    }
                                  }}
                                  className="w-8 h-8 flex items-center justify-center bg-white hover:bg-blue-600 hover:text-white rounded-lg text-gray-700 font-bold transition-all shadow-sm"
                                >
                                  -
                                </button>
                                <span className="text-base font-bold w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center bg-white hover:bg-blue-600 hover:text-white rounded-lg text-gray-700 font-bold transition-all shadow-sm"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-sm text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-lg font-medium transition-all"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer with Total - Enhanced & Mobile Responsive */}
              {cart.items.length > 0 && (
                <div className="border-t-2 border-gray-200 bg-white px-4 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4 shadow-2xl">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between text-gray-600 text-sm sm:text-base">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold">{formatPrice(cart.total, store.currency || 'USD')}</span>
                  </div>
                  
                  {/* Total */}
                  <div className="flex items-center justify-between text-lg sm:text-xl font-bold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-blue-600">{formatPrice(cart.total, store.currency || 'USD')}</span>
                  </div>
                  
                  {/* Checkout Button */}
                  <Link
                    href={`/${locale}/store/${store.storeSlug}/checkout`}
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    Proceed to Checkout
                  </Link>
                  
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-gray-100 text-gray-700 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all text-sm sm:text-base"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
