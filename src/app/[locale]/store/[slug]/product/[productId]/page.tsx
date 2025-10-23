'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { Store } from '@/types/store';
import { VariantCombination } from '@/types/product';
import { ProductGallery } from '@/components/store/ProductGallery';
import { VariantSelector } from '@/components/store/VariantSelector';
import { StoreNavigation } from '@/components/store/StoreNavigation';
import { useCart } from '@/contexts/CartContext';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  ArrowLeft, 
  Star, 
  Package,
  TrendingUp,
  Shield,
  Check,
  Plus
} from 'lucide-react';
import { formatPrice } from '@/utils/currency';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const productId = params.productId as string;
  const locale = params.locale as string;
  const { addToCart, isInCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCombination, setSelectedCombination] = useState<VariantCombination | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, slug]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/store/${slug}/products/${productId}`);
      const data = await response.json();

      if (response.ok) {
        setProduct(data.product);
        setStore(data.store);
      } else {
        console.error('Failed to fetch product:', data.error);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVariantSelectionChange = (
    combination: VariantCombination | null
  ) => {
    setSelectedCombination(combination);
  };

  const getCurrentPrice = () => {
    if (selectedCombination && selectedCombination.price) {
      return selectedCombination.price;
    }
    return product?.price || 0;
  };

  const getCurrentStock = () => {
    if (selectedCombination) {
      return selectedCombination.stock;
    }
    if (product?.variantCombinations && product.variantCombinations.length > 0) {
      return product.variantCombinations.reduce((sum, combo) => sum + combo.stock, 0);
    }
    return product?.quantity || 0;
  };

  const canAddToCart = () => {
    if (!product) return false;
    
    const hasVariants = product.variants && product.variants.length > 0 && 
      product.variants.some(v => v.options.length > 0);
    
    if (hasVariants) {
      return selectedCombination !== null && selectedCombination.stock > 0;
    }
    
    return !product.inventoryTracked || getCurrentStock() > 0;
  };

  const handleAddToCart = () => {
    if (!canAddToCart() || !product) return;

    setIsAdding(true);
    
    // Get selected attributes for display
    const selectedAttributes: { [key: string]: string } = {};
    if (selectedCombination && selectedCombination.attributes) {
      Object.assign(selectedAttributes, selectedCombination.attributes);
    }

    // Add to cart
    addToCart(product, quantity, selectedCombination || undefined, selectedAttributes);
    
    setTimeout(() => {
      setIsAdding(false);
      setShowAdded(true);
      setTimeout(() => setShowAdded(false), 2000);
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentPrice = getCurrentPrice();
  const currentStock = getCurrentStock();
  const isOutOfStock = product.inventoryTracked && currentStock === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      {store && <StoreNavigation store={store} locale={locale} />}
      
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push(`/${locale}/store/${slug}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Vendor */}
            {product.vendor && (
              <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                {product.vendor}
              </p>
            )}

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-lg text-gray-700">
                {product.shortDescription}
              </p>
            )}

            {/* Price */}
            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-center gap-4">
                <p className="text-4xl font-bold text-gray-900">
                  {formatPrice(currentPrice, store?.currency || 'USD')}
                </p>
                {product.compareAtPrice && product.compareAtPrice > currentPrice && (
                  <>
                    <p className="text-2xl text-gray-500 line-through">
                      {formatPrice(product.compareAtPrice, store?.currency || 'USD')}
                    </p>
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-full">
                      Save {Math.round((1 - currentPrice / product.compareAtPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
              {product.chargeTax && (
                <p className="text-sm text-gray-500 mt-2">Tax included</p>
              )}
            </div>

            {/* Variant Selection */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <VariantSelector
                  variants={product.variants}
                  combinations={product.variantCombinations || []}
                  basePrice={product.price}
                  onSelectionChange={handleVariantSelectionChange}
                />
              </div>
            )}

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={currentStock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(currentStock, parseInt(e.target.value) || 1)))}
                    className="w-20 px-4 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
                  >
                    +
                  </button>
                  {product.inventoryTracked && (
                    <span className="text-sm text-gray-600">
                      {currentStock} available
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart() || isAdding || showAdded}
                className={`
                  w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2
                  ${showAdded
                    ? 'bg-green-500 text-white'
                    : canAddToCart()
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {isAdding ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </>
                ) : showAdded ? (
                  <>
                    <Check className="w-6 h-6" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 px-4 border-2 border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium">
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </button>
                <button className="py-3 px-4 border-2 border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Product Type</p>
                    <p className="text-sm text-gray-600">{product.type}</p>
                  </div>
                </div>
                
                {product.category && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Category</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Quality Guarantee</p>
                    <p className="text-sm text-gray-600">30-day return policy</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Long Description */}
            {product.longDescription && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <div 
                  className="prose prose-sm max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: product.longDescription }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
