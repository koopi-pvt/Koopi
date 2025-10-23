'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store as StoreIcon, ShoppingCart, Menu, X, Package, User, LogIn, LogOut, Heart, Search, ChevronDown, Sparkles } from 'lucide-react';
import { Store } from '@/types/store';
import { useCart } from '@/contexts/CartContext';
import { useBuyerAuth } from '@/contexts/BuyerAuthContext';
import { formatPrice } from '@/utils/currency';

interface StoreNavigationProps {
  store: Store;
  locale: string;
}

export function StoreNavigation({ store, locale }: StoreNavigationProps) {
  const pathname = usePathname();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { buyer, isAuthenticated, logout } = useBuyerAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { 
      href: `/${locale}/store/${store.storeSlug}`, 
      text: 'Shop', 
      icon: Package,
      show: true 
    },
  ];

  return (
    <>
      {/* Main Navigation - Redesigned */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
          : 'bg-gradient-to-b from-white to-gray-50/50 border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Store Name - Enhanced */}
            <Link href={`/${locale}/store/${store.storeSlug}`} className="flex items-center gap-3 group relative">
              {store.logoUrl ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
                  <img 
                    src={store.logoUrl} 
                    alt={store.storeName}
                    className="relative w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400 group-hover:scale-110 transition-all duration-300 shadow-md"
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <StoreIcon className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  {store.storeName}
                </h1>
                {store.description && (
                  <p className="text-xs text-gray-500 hidden sm:block line-clamp-1 group-hover:text-gray-700 transition-colors">
                    {store.description}
                  </p>
                )}
              </div>
              {/* Premium Badge */}
              <div className="hidden lg:flex items-center gap-1 ml-2 px-2 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700">Verified</span>
              </div>
            </Link>

            {/* Desktop Navigation - Enhanced */}
            <div className="hidden md:flex items-center justify-center gap-2">
              {navLinks.filter(link => link.show).map((link) => {
                const Icon = link.icon;
                const isActive = link.href.startsWith('#') 
                  ? false 
                  : pathname === link.href;
                
                return link.href.startsWith('#') ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="relative px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 hover:bg-blue-50 group"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>{link.text}</span>
                    </div>
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-xl font-semibold transition-all duration-300 group ${
                      isActive 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                      <span>{link.text}</span>
                    </div>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Cart, Account & Mobile Menu - Enhanced */}
            <div className="flex items-center gap-2">
              {/* Account Dropdown - Desktop Enhanced */}
              <div className="hidden md:block relative">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 group border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                        {buyer?.name?.split(' ')[0]}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isAccountMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsAccountMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-3 z-50 overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-900">{buyer?.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{buyer?.email}</p>
                          </div>
                          <div className="py-2">
                            <Link
                              href={`/${locale}/store/${store.storeSlug}/account`}
                              onClick={() => setIsAccountMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="font-medium">My Account</span>
                            </Link>
                            <Link
                              href={`/${locale}/store/${store.storeSlug}/account/orders`}
                              onClick={() => setIsAccountMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                <Package className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="font-medium">My Orders</span>
                            </Link>
                          </div>
                          <div className="border-t border-gray-100 pt-2 pb-1">
                            <button
                              onClick={() => {
                                setIsAccountMenuOpen(false);
                                logout();
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                <LogOut className="w-4 h-4 text-red-600" />
                              </div>
                              <span className="font-medium">Logout</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <Link
                    href={`/${locale}/store/${store.storeSlug}/login`}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                )}
              </div>

              {/* Cart Button - Enhanced */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 group border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                    {cart.itemCount > 99 ? '99+' : cart.itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button - Enhanced */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-3 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 group border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 group-hover:text-red-600 transition-colors" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu - Enhanced */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
              <div className="flex flex-col space-y-2">
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
                      className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:text-blue-600 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md border border-gray-100"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span>{link.text}</span>
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md border ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border-blue-200'
                          : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 border-gray-100'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isActive ? 'bg-blue-100' : 'bg-gray-50'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span>{link.text}</span>
                    </Link>
                  );
                })}
                
                {/* Mobile Account Links - Enhanced */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-3" />
                
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{buyer?.name}</p>
                          <p className="text-xs text-gray-500">{buyer?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      href={`/${locale}/store/${store.storeSlug}/account`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:text-blue-600 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md border border-gray-100"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <span>My Account</span>
                    </Link>
                    
                    <Link
                      href={`/${locale}/store/${store.storeSlug}/account/orders`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:text-blue-600 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md border border-gray-100"
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                        <Package className="w-5 h-5 text-purple-600" />
                      </div>
                      <span>My Orders</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-red-50 text-red-600 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md border border-gray-100"
                    >
                      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                        <LogOut className="w-5 h-5 text-red-600" />
                      </div>
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/${locale}/store/${store.storeSlug}/login`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login to Continue</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Drawer - Enhanced with Modern Design */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop - Enhanced */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-black/70 via-blue-900/30 to-purple-900/30 backdrop-blur-md transition-all duration-300"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Cart Panel - Enhanced Modern Design */}
          <div className="absolute inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[650px] md:max-h-[90vh] md:rounded-3xl w-full bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden border border-white/20 md:border-gray-200">
            <div className="h-full flex flex-col">
              {/* Header - Enhanced Premium Design */}
              <div className="relative px-4 sm:px-6 py-5 sm:py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-300 rounded-full blur-3xl animate-pulse delay-700" />
                </div>
                
                <div className="relative flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <span>Shopping Cart</span>
                    </h2>
                    {cart.items.length > 0 && (
                      <p className="text-blue-100 text-xs sm:text-sm mt-2 ml-1 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                          <Package className="w-3 h-3" />
                          {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
                        </span>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2.5 text-white/90 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              {/* Cart Items - Enhanced Premium Design */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-b from-gray-50/50 to-white">
                {cart.items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse" />
                      <div className="relative w-40 h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-xl">
                        <ShoppingCart className="w-20 h-20 text-blue-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500 mb-6">Start adding some amazing products</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                    >
                      <Package className="w-5 h-5" />
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.items.map((item) => (
                      <div key={item.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl p-4 transition-all duration-300 border border-gray-100 hover:border-blue-200">
                        <div className="flex gap-4">
                          {/* Product Image - Enhanced */}
                          <div className="relative w-24 h-24 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden group-hover:shadow-lg transition-shadow">
                            {item.product.images && item.product.images.length > 0 ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-10 h-10 text-gray-300" />
                              </div>
                            )}
                          </div>

                          {/* Product Info - Enhanced */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 line-clamp-2 mb-1.5 group-hover:text-blue-600 transition-colors">
                              {item.product.name}
                            </h3>
                            {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {Object.entries(item.selectedAttributes).map(([key, value]) => (
                                  <span key={key} className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-100">
                                    {key}: {value}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            {/* Price - Enhanced */}
                            <div className="mb-3">
                              <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {formatPrice(item.price * item.quantity, store.currency || 'USD')}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatPrice(item.price, store.currency || 'USD')} each
                              </p>
                            </div>

                            {/* Quantity Controls - Enhanced */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1.5 border border-gray-200">
                                <button
                                  onClick={() => {
                                    if (item.quantity > 1) {
                                      updateQuantity(item.id, item.quantity - 1);
                                    }
                                  }}
                                  className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white rounded-lg text-gray-700 font-bold transition-all shadow-sm hover:shadow-md transform hover:scale-110"
                                >
                                  -
                                </button>
                                <span className="text-base font-bold w-10 text-center text-gray-900">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white rounded-lg text-gray-700 font-bold transition-all shadow-sm hover:shadow-md transform hover:scale-110"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-sm text-red-600 hover:text-white hover:bg-red-600 px-3 py-2 rounded-lg font-semibold transition-all hover:shadow-md"
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

              {/* Footer with Total - Enhanced Premium Design */}
              {cart.items.length > 0 && (
                <div className="relative border-t-2 border-gray-100 bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 py-5 sm:py-6 space-y-4 shadow-2xl">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600" />
                  
                  {/* Subtotal */}
                  <div className="flex items-center justify-between text-gray-600 text-sm sm:text-base">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-bold text-gray-900">{formatPrice(cart.total, store.currency || 'USD')}</span>
                  </div>
                  
                  {/* Total - Enhanced */}
                  <div className="flex items-center justify-between text-xl sm:text-2xl font-bold pt-3 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(cart.total, store.currency || 'USD')}
                    </span>
                  </div>
                  
                  {/* Checkout Button - Enhanced */}
                  <Link
                    href={`/${locale}/store/${store.storeSlug}/checkout`}
                    onClick={() => setIsCartOpen(false)}
                    className="relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <ShoppingCart className="relative w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                    <span className="relative">Proceed to Checkout</span>
                  </Link>
                  
                  {/* Continue Shopping - Enhanced */}
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 py-3 sm:py-3.5 rounded-xl font-bold hover:from-gray-200 hover:to-gray-100 transition-all text-sm sm:text-base border border-gray-200 hover:border-gray-300 hover:shadow-md"
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
