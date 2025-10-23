"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, Check, Loader2, Plus, X } from 'lucide-react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { ProductFormData, Product, ProductVariant, VariantCombination } from '@/types/product';
import { VariantEditor } from '@/components/dashboard/VariantEditor';
import { DragDropImageUpload } from '@/components/dashboard/DragDropImageUpload';
import { useUser } from '@/contexts/UserContext';
import { storage } from '@/lib/firebase';
import { getCurrencySymbol } from '@/utils/currency';
import { useToast } from '@/contexts/ToastContext';
import { validateProductPrices, getMinimumPrice } from '@/utils/pricing';

export default function NewProductPage() {
  const router = useRouter();
  const t = useTranslations('Dashboard.products.add');
  const { user, store } = useUser();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    shortDescription: '',
    longDescription: '',
    category: '',
    tags: [],
    vendor: '',
    type: 'Physical',
    status: 'Active',
    images: [],
    existingImages: [],
    variants: [] as ProductVariant[],
    variantCombinations: [] as VariantCombination[],
    inventoryTracked: true,
    quantity: 0,
    lowStockThreshold: 5,
    variantStock: {},
    price: 0,
    compareAtPrice: 0,
    chargeTax: true,
    relatedProducts: [],
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (response.ok) {
        setAllProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleImageUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/products/upload-image', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          uploadedUrls.push(data.url);
        } else {
          toast.error(`Failed to upload ${file.name}: ${data.error}`);
        }
      }

      setImageUrls([...imageUrls, ...uploadedUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImage(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const toggleRelatedProduct = (productId: string) => {
    const isSelected = formData.relatedProducts.includes(productId);
    
    setFormData({
      ...formData,
      relatedProducts: isSelected
        ? formData.relatedProducts.filter(id => id !== productId)
        : [...formData.relatedProducts, productId],
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.longDescription) {
      toast.warning(t('requiredFields'));
      return;
    }
  
    if (formData.price <= 0) {
      toast.warning(t('priceError'));
      return;
    }

    // Validate minimum price requirements
    const currencyCode = store?.currency || 'USD';
    const priceValidation = validateProductPrices(
      formData.price,
      formData.variantCombinations,
      currencyCode
    );

    if (!priceValidation.isValid) {
      toast.error('Price Validation Failed');
      priceValidation.errors.forEach(error => {
        toast.error(error);
      });
      return;
    }
  
    setLoading(true);
  
    try {
      const productData = {
        ...formData,
        images: imageUrls,
        quantity: formData.variantCombinations && formData.variantCombinations.length > 0
          ? formData.variantCombinations.reduce((sum, c) => sum + c.stock, 0)
          : formData.quantity,
        compareAtPrice: formData.compareAtPrice || 0,
      };
  
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success(t('createSuccess'));
        router.push('/dashboard/products');
      } else {
        toast.error(t('createFailed') + ': ' + data.error);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(t('createFailed'));
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('nameLabel')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder={t('namePlaceholder')}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            rows={2}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
            placeholder="Enter a short description for your product"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Long Description <span className="text-red-500">*</span>
          </label>
          <ReactQuill
            value={formData.longDescription}
            onChange={(value) => setFormData({ ...formData, longDescription: value })}
            className="bg-white border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Describe your product in detail"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('categoryLabel')}
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder={t('categoryPlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('vendorLabel')}
          </label>
          <input
            type="text"
            value={formData.vendor}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder={t('vendorPlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('typeLabel')} <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="Physical">Physical</option>
            <option value="Digital">Digital</option>
            <option value="Service">Service</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('statusLabel')} <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('tagsLabel')}
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder={t('tagsPlaceholder')}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/20"
            >
              {t('addTag')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-blue-900 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Image Upload with Drag & Drop */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          {t('imagesLabel')}
        </label>
        <DragDropImageUpload
          imageUrls={imageUrls}
          onImagesChange={setImageUrls}
          onUpload={handleImageUpload}
          uploading={uploadingImage}
        />
      </div>

      {/* Enhanced Variants */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          {t('variantsLabel')}
        </label>
        <VariantEditor
          variants={formData.variants}
          combinations={formData.variantCombinations || []}
          basePrice={formData.price}
          onChange={(variants: ProductVariant[], combinations: VariantCombination[]) => {
            setFormData({
              ...formData,
              variants,
              variantCombinations: combinations,
            });
          }}
        />
      </div>

      {/* Inventory - Only show if no variant combinations */}
      {(!formData.variantCombinations || formData.variantCombinations.length === 0) && (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="inventory-tracked"
              checked={formData.inventoryTracked}
              onChange={(e) =>
                setFormData({ ...formData, inventoryTracked: e.target.checked })
              }
              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="inventory-tracked" className="text-sm font-semibold text-gray-900">
              {t('trackInventory')}
            </label>
          </div>

          {formData.inventoryTracked && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('quantityLabel')}
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('lowStockLabel')}
                </label>
                <input
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lowStockThreshold: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min="0"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info box when variants are used */}
      {formData.variantCombinations && formData.variantCombinations.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">{t('variantCombinationsNote')}</span>
              {' '}
              {t('totalStockAcrossVariants')}
              {' '}
              <span className="font-bold">
                {formData.variantCombinations.reduce((sum, c) => sum + c.stock, 0)} {t('units')}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => {
    const currencyCode = store?.currency || 'USD';
    const minPrice = getMinimumPrice(currencyCode);

    return (
    <div className="space-y-6">
      {/* Minimum Price Info Banner */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Minimum Price Requirement:</span>
            {' '}
            All products must be priced at least {getCurrencySymbol(currencyCode)}{minPrice.toFixed(2)} (equivalent to 100 LKR minimum)
          </p>
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('priceLabel')} <span className="text-red-500">*</span> ({getCurrencySymbol(store?.currency || 'USD')})
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            min={minPrice}
            step="0.01"
          />
          <p className="mt-1 text-xs text-gray-500">
            Minimum: {getCurrencySymbol(currencyCode)}{minPrice.toFixed(2)}
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('compareAtPriceLabel')} ({getCurrencySymbol(store?.currency || 'USD')})
          </label>
          <input
            type="number"
            value={formData.compareAtPrice}
            onChange={(e) =>
              setFormData({ ...formData, compareAtPrice: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            min="0"
            step="0.01"
          />
          <p className="mt-2 text-xs text-gray-500">
            {t('compareAtPriceHint')}
          </p>
        </div>
      </div>

      {/* Tax */}
      <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="charge-tax"
            checked={formData.chargeTax}
            onChange={(e) => setFormData({ ...formData, chargeTax: e.target.checked })}
            className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="charge-tax" className="text-sm font-semibold text-gray-900">
            {t('chargeTax')}
          </label>
        </div>
      </div>

      {/* Related Products */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {t('relatedProductsLabel')}
        </label>
        <p className="text-sm text-gray-600 mb-4">
          {t('relatedProductsDesc')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
          {allProducts.length === 0 ? (
            <p className="text-sm text-gray-500 col-span-2 text-center py-8">{t('noRelatedProducts')}</p>
          ) : (
            allProducts.map((product) => (
              <label
                key={product.id}
                className="flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-all border border-transparent hover:border-blue-200"
              >
                <input
                  type="checkbox"
                  checked={formData.relatedProducts.includes(product.id!)}
                  onChange={() => toggleRelatedProduct(product.id!)}
                  className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                  <div className="text-xs text-gray-500">{getCurrencySymbol(store?.currency || 'USD')}{product.price.toFixed(2)}</div>
                </div>
              </label>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToProducts')}
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Step Indicator */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm">
        <div className="flex items-center justify-center mb-8 max-w-2xl mx-auto">
          {[1, 2, 3].map((step, index) => (
            <React.Fragment key={step}>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  step < currentStep
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                    : step === currentStep
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {step < currentStep ? <Check className="h-6 w-6" /> : step}
              </div>
              {index < 2 && (
                <div
                  className={`flex-1 h-1 mx-4 rounded-full transition-all ${
                    step < currentStep ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            {currentStep === 1 && t('step1Title')}
            {currentStep === 2 && t('step2Title')}
            {currentStep === 3 && t('step3Title')}
          </h2>
          <p className="text-gray-600">
            {currentStep === 1 && t('step1Desc')}
            {currentStep === 2 && t('step2Desc')}
            {currentStep === 3 && t('step3Desc')}
          </p>
        </div>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            {t('previous')}
          </button>

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 transition-all font-medium"
            >
              {t('next')}
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t('creating')}
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  {t('createProduct')}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
    );
  };
}

  
