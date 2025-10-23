'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/types/product';
import { Store } from '@/types/store';
import { ProductCard } from '@/components/store/ProductCard';
import { Search, Package } from 'lucide-react';
import { StoreNavigation } from '@/components/store/StoreNavigation';
import { UnderConstruction } from '@/components/store/UnderConstruction';
import { StoreNotFound } from '@/components/store/StoreNotFound';
import { AboutSection } from '@/components/store/AboutSection';
import { StoreLoadingSkeleton } from '@/components/store/StoreLoadingSkeleton';

export default function StorePage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = params.locale as string;
  
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchStoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    filterProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, products]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/store/${slug}/products`);
      const data = await response.json();

      if (response.ok) {
        setStore(data.store);
        setProducts(data.products);
        setFilteredProducts(data.products);
      } else {
        setError(data.error || 'Failed to load store');
        console.error('Failed to fetch store:', data.error);
      }
    } catch (error) {
      setError('Network error');
      console.error('Error fetching store:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.vendor?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  if (loading) {
    return <StoreLoadingSkeleton />;
  }

  if (error || !store) {
    return <StoreNotFound locale={locale} />;
  }

  // Check if store is disabled
  if (store.shopEnabled === false) {
    return <UnderConstruction store={store} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <StoreNavigation store={store} locale={locale} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to {store.storeName}
            </h1>
            {store.description && (
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                {store.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-10 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop Our Products</h2>
            <p className="text-gray-600">Discover amazing products curated just for you</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-md text-lg"
              />
            </div>
          </div>

          {/* Category Filters */}
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-6 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg
                    ${selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-105'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }
                  `}
                >
                  {category === 'all' ? 'All Products' : category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="mb-6 text-center">
              <span className="inline-block bg-white px-6 py-2 rounded-full shadow-md text-gray-700 font-medium">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  storeSlug={slug}
                  locale={locale}
                  currency={store?.currency || 'USD'}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg mx-auto">
              <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Products Found</h3>
              <p className="text-gray-600 text-lg">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'This store doesn\'t have any products yet. Check back soon!'}
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* About Section */}
      <AboutSection store={store} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {store.storeName}. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Powered by Koopi
          </p>
        </div>
      </footer>
    </div>
  );
}
