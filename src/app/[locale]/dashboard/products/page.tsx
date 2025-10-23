"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Package, Plus, Search, Edit, Trash2 } from 'lucide-react';
import EmptyState from '@/components/dashboard/EmptyState';
import { Dropdown } from '@/components/dashboard/Dropdown';
import { Product } from '@/types/product';
import { useUser } from '@/contexts/UserContext';
import { formatPrice } from '@/utils/currency';

export default function ProductsPage() {
  const t = useTranslations('Dashboard.products');
  const router = useRouter();
  const { store } = useUser();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, statusFilter, typeFilter, allProducts]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();

      if (response.ok) {
        setAllProducts(data.products);
        setFilteredProducts(data.products);
      } else {
        console.error('Failed to fetch products:', data.error);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let products = [...allProducts];

    if (searchQuery) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.vendor && p.vendor.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (statusFilter) {
      products = products.filter(p => p.status === statusFilter);
    }

    if (typeFilter) {
      products = products.filter(p => p.type === typeFilter);
    }

    setFilteredProducts(products);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm(t('deleteConfirm'))) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAllProducts(allProducts.filter(p => p.id !== productId));
        alert(t('deleteSuccess'));
      } else {
        const data = await response.json();
        alert(t('deleteFailed') + ': ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(t('deleteFailed'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (allProducts.length === 0 && !loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t('title')}
          </h1>
          <p className="mt-2 text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <EmptyState
            icon={Package}
            title={t('emptyTitle')}
            description={t('emptyDesc')}
            action={{
              label: t('addProduct'),
              onClick: () => router.push('/dashboard/products/new'),
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t('title')}
          </h1>
          <p className="mt-2 text-gray-600">{t('subtitle')}</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/products/new')}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30"
        >
          <Plus className="h-5 w-5" />
          {t('addProduct')}
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <Dropdown
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder={t('allStatus')}
            options={[
              { value: '', label: t('allStatus') },
              { value: 'Active', label: t('active') },
              { value: 'Draft', label: t('draft') },
            ]}
          />

          <Dropdown
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder={t('allTypes')}
            options={[
              { value: '', label: t('allTypes') },
              { value: 'Physical', label: t('physical') },
              { value: 'Digital', label: t('digital') },
              { value: 'Service', label: t('service') },
            ]}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('productColumn')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('statusColumn')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('inventoryColumn')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('typeColumn')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('priceColumn')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('vendorColumn')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('actionsColumn')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        {product.vendor && (
                          <div className="text-sm text-gray-500">{product.vendor}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.status === 'Active' ? t('active') : t('draft')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.inventoryTracked ? (
                        <>
                          {product.quantity} {t('inStock')}
                          {product.quantity <= product.lowStockThreshold && (
                            <span className="ml-2 text-red-600">⚠ {t('lowStock')}</span>
                          )}
                        </>
                      ) : (
                        t('notTracked')
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.type === 'Physical' && t('physical')}
                    {product.type === 'Digital' && t('digital')}
                    {product.type === 'Service' && t('service')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(product.price, store?.currency || 'USD')}
                    </div>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <div className="text-xs text-gray-500 line-through">
                        {formatPrice(product.compareAtPrice, store?.currency || 'USD')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.vendor || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/dashboard/products/${product.id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit className="h-4 w-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (searchQuery || statusFilter || typeFilter) && (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('noProductsFound')}</p>
        </div>
      )}
    </div>
  );
}