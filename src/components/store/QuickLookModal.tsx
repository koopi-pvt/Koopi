'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';
import { X, ShoppingCart, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/currency';

interface QuickLookModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  storeSlug: string;
  locale: string;
  currency?: string;
}

export function QuickLookModal({ product, isOpen, onClose, storeSlug, locale, currency = 'USD' }: QuickLookModalProps) {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showAdded, setShowAdded] = useState(false);

  if (!isOpen) return null;

  // Calculate price based on selected variant
  const getPrice = () => {
    if (!product.variantCombinations || product.variantCombinations.length === 0) {
      return product.price;
    }

    const selectedCombo = product.variantCombinations.find(combo => {
      const comboAttrs = combo.attributes || {};
      return Object.keys(selectedAttributes).every(
        key => comboAttrs[key] === selectedAttributes[key]
      );
    });

    return selectedCombo?.price ?? product.price;
  };

  // Check if all variants are selected
  const areAllVariantsSelected = () => {
    if (!product.variants || product.variants.length === 0) return true;
    const activeVariants = product.variants.filter(v => v.options.length > 0);
    return activeVariants.every(v => selectedAttributes[v.name]);
  };

  // Get available stock for selected variant
  const getAvailableStock = () => {
    if (!product.inventoryTracked) return Infinity;
    
    if (!product.variantCombinations || product.variantCombinations.length === 0) {
      return product.quantity || 0;
    }

    const selectedCombo = product.variantCombinations.find(combo => {
      const comboAttrs = combo.attributes || {};
      return Object.keys(selectedAttributes).every(
        key => comboAttrs[key] === selectedAttributes[key]
      );
    });

    return selectedCombo?.stock ?? 0;
  };

  const currentPrice = getPrice();
  const availableStock = getAvailableStock();
  const isOutOfStock = product.inventoryTracked && availableStock === 0;
  const hasVariants = product.variants && product.variants.length > 0 && product.variants.some(v => v.options.length > 0);

  const handleAddToCart = () => {
    if (!areAllVariantsSelected() || isOutOfStock) return;

    setIsAdding(true);
    addToCart(product, quantity, hasVariants ? selectedAttributes : undefined);
    
    setTimeout(() => {
      setIsAdding(false);
      setShowAdded(true);
      setTimeout(() => {
        setShowAdded(false);
        onClose();
      }, 1500);
    }, 300);
  };

  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-h-[90vh] overflow-y-auto">
            {/* Left: Image Gallery */}
            <div className="relative bg-gray-100 flex items-center justify-center p-6 md:p-8">
              {product.images && product.images.length > 0 ? (
                <div className="relative w-full aspect-square">
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                  
                  {/* Image Navigation */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-800" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-800" />
                      </button>
                      
                      {/* Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {product.images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === selectedImageIndex 
                                ? 'bg-blue-600 w-6' 
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full aspect-square flex items-center justify-center">
                  <ShoppingCart className="w-24 h-24 text-gray-300" />
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="p-6 md:p-8 flex flex-col">
              {/* Vendor */}
              {product.vendor && (
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                  {product.vendor}
                </p>
              )}

              {/* Product Name */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <p className="text-3xl font-bold text-blue-600">
                  {formatPrice(currentPrice, currency)}
                </p>
                {product.compareAtPrice && product.compareAtPrice > currentPrice && (
                  <>
                    <p className="text-xl text-gray-500 line-through">
                      {formatPrice(product.compareAtPrice, currency)}
                    </p>
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      {Math.round((1 - currentPrice / product.compareAtPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Stock Status */}
              {product.inventoryTracked && (
                <div className="mb-6">
                  {isOutOfStock ? (
                    <p className="text-red-600 font-semibold">Out of Stock</p>
                  ) : availableStock <= 10 ? (
                    <p className="text-orange-600 font-medium">
                      Only {availableStock} left in stock
                    </p>
                  ) : (
                    <p className="text-green-600 font-medium">In Stock</p>
                  )}
                </div>
              )}

              {/* Variant Selection */}
              {hasVariants && (
                <div className="space-y-4 mb-6">
                  {product.variants?.filter(v => v.options.length > 0).map((variant) => (
                    <div key={variant.name}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {variant.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => setSelectedAttributes({
                              ...selectedAttributes,
                              [variant.name]: option
                            })}
                            className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                              selectedAttributes[variant.name] === option
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-blue-400 text-gray-700'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => {
                        const maxQty = product.inventoryTracked ? availableStock : 999;
                        setQuantity(Math.min(maxQty, quantity + 1));
                      }}
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding || showAdded || isOutOfStock || (hasVariants && !areAllVariantsSelected())}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  showAdded
                    ? 'bg-green-500 text-white'
                    : isOutOfStock || (hasVariants && !areAllVariantsSelected())
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl'
                }`}
              >
                {isAdding ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : showAdded ? (
                  <>
                    <Check className="w-6 h-6" />
                    Added to Cart!
                  </>
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : hasVariants && !areAllVariantsSelected() ? (
                  'Select Options'
                ) : (
                  <>
                    <Plus className="w-6 h-6" />
                    Add to Cart
                  </>
                )}
              </button>

              {/* View Full Details Link */}
              <a
                href={`/${locale}/store/${storeSlug}/product/${product.id}`}
                className="mt-4 text-center text-blue-600 hover:text-blue-700 font-medium underline"
              >
                View Full Details
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
