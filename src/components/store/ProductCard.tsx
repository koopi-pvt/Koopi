'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';
import Link from 'next/link';
import { ShoppingCart, Star, Plus, Check, Eye } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { QuickLookModal } from './QuickLookModal';
import { formatPrice } from '@/utils/currency';

interface ProductCardProps {
  product: Product;
  storeSlug: string;
  locale: string;
  currency?: string;
}

export function ProductCard({ product, storeSlug, locale, currency = 'USD' }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showAdded, setShowAdded] = useState(false);
  const [showQuickLook, setShowQuickLook] = useState(false);

  // Calculate price range for products with variant combinations
  const getPriceDisplay = () => {
    if (!product.variantCombinations || product.variantCombinations.length === 0) {
      return {
        min: product.price,
        max: product.price,
        hasRange: false
      };
    }

    const prices = product.variantCombinations
      .map(combo => combo.price ?? product.price)
      .filter(price => price > 0);

    if (prices.length === 0) {
      return {
        min: product.price,
        max: product.price,
        hasRange: false
      };
    }

    const min = Math.min(...prices, product.price);
    const max = Math.max(...prices, product.price);

    return {
      min,
      max,
      hasRange: min !== max
    };
  };

  // Calculate total stock from variant combinations
  const getTotalStock = () => {
    if (!product.variantCombinations || product.variantCombinations.length === 0) {
      return product.quantity || 0;
    }
    return product.variantCombinations.reduce((sum, combo) => sum + combo.stock, 0);
  };

  // Get available variants summary
  const getVariantsSummary = () => {
    if (!product.variants || product.variants.length === 0) {
      return null;
    }
    return product.variants
      .filter(v => v.options.length > 0)
      .map(v => `${v.options.length} ${v.name}${v.options.length > 1 ? 's' : ''}`)
      .join(', ');
  };

  const priceDisplay = getPriceDisplay();
  const totalStock = getTotalStock();
  const variantsSummary = getVariantsSummary();
  const isOutOfStock = product.inventoryTracked && totalStock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If product has variants, redirect to product page
    if (product.variants && product.variants.length > 0 && product.variants.some(v => v.options.length > 0)) {
      return; // Let the link handle navigation
    }

    // Add simple product to cart
    setIsAdding(true);
    addToCart(product, 1);
    
    setTimeout(() => {
      setIsAdding(false);
      setShowAdded(true);
      setTimeout(() => setShowAdded(false), 2000);
    }, 300);
  };

  const hasVariants = product.variants && product.variants.length > 0 && product.variants.some(v => v.options.length > 0);
  const inCart = isInCart(product.id || '');

  return (
    <>
      <Link href={`/${locale}/store/${storeSlug}/product/${product.id}`}>
        <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="w-20 h-20 text-gray-300" />
            </div>
          )}
          
          {/* Stock badge */}
          {isOutOfStock && (
            <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
              Out of Stock
            </div>
          )}
          
          {/* Discount badge */}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
              {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
            </div>
          )}

          {/* Quick Look Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowQuickLook(true);
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold shadow-xl opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 hover:bg-blue-600 hover:text-white"
          >
            <Eye className="w-5 h-5" />
            Quick Look
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Vendor */}
          {product.vendor && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {product.vendor}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.shortDescription}
            </p>
          )}

          {/* Variants Summary */}
          {variantsSummary && (
            <div className="mb-3">
              <p className="text-xs text-blue-600 font-medium">
                {variantsSummary} available
              </p>
            </div>
          )}

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm font-semibold text-gray-900">
                  {product.averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Price and Add to Cart */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                {priceDisplay.hasRange ? (
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(priceDisplay.min, currency)} - {formatPrice(priceDisplay.max, currency)}
                  </p>
                ) : (
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrice(priceDisplay.min, currency)}
                  </p>
                )}
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <p className="text-sm text-gray-500 line-through">
                    {formatPrice(product.compareAtPrice, currency)}
                  </p>
                )}
              </div>

              {/* Stock indicator */}
              {product.inventoryTracked && totalStock > 0 && totalStock <= 10 && (
                <span className="text-xs text-orange-600 font-medium">
                  Only {totalStock} left
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            {!isOutOfStock && (
              <button
                onClick={handleAddToCart}
                disabled={isAdding || showAdded}
                className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  showAdded
                    ? 'bg-green-500 text-white'
                    : hasVariants
                    ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
                    : inCart
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
                }`}
              >
                {isAdding ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : showAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added!
                  </>
                ) : hasVariants ? (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Select Options
                  </>
                ) : inCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    In Cart
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </Link>

    {/* Quick Look Modal */}
    <QuickLookModal
      product={product}
      isOpen={showQuickLook}
      onClose={() => setShowQuickLook(false)}
      storeSlug={storeSlug}
      locale={locale}
      currency={currency}
    />
  </>
  );
}
