"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Loader2, Plus, X, Upload } from 'lucide-react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';
import { ProductFormData, ProductVariant, Product } from '@/types/product';
import { useUser } from '@/contexts/UserContext';
import { getCurrencySymbol } from '@/utils/currency';
import Loader from '@/components/common/Loader';
import { useToast } from '@/contexts/ToastContext';
import { validateProductPrices, getMinimumPrice } from '@/utils/pricing';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { store } = useUser();
  const toast = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(true);
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
    variants: [],
    variantCombinations: [],
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
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantOptions, setNewVariantOptions] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchProduct();
    fetchProducts();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setFetchingProduct(true);
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();

      if (response.ok) {
        const product = data.product;
        setFormData({
          name: product.name || '',
          shortDescription: product.shortDescription || '',
          longDescription: product.longDescription || '',
          category: product.category || '',
          tags: product.tags || [],
          vendor: product.vendor || '',
          type: product.type || 'Physical',
          status: product.status || 'Active',
          images: [],
          existingImages: product.images || [],
          variants: product.variants || [],
          variantCombinations: product.variantCombinations || [],
          inventoryTracked: product.inventoryTracked ?? true,
          quantity: product.quantity || 0,
          lowStockThreshold: product.lowStockThreshold || 5,
          variantStock: product.variantStock || {},
          price: product.price || 0,
          compareAtPrice: product.compareAtPrice || 0,
          chargeTax: product.chargeTax ?? true,
          relatedProducts: product.relatedProducts || [],
        });
        setImageUrls(product.images || []);
      } else {
        toast.error('Failed to fetch product: ' + data.error);
        router.push('/dashboard/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product');
      router.push('/dashboard/products');
    } finally {
      setFetchingProduct(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (response.ok) {
        // Filter out current product
        setAllProducts(data.products.filter((p: Product) => p.id !== productId));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
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

  const handleImageUrlsChange = (urls: string[]) => {
    setImageUrls(urls);
  };
  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };


  const addVariant = () => {
    if (!newVariantName || !newVariantOptions) {
      toast.warning('Please enter variant name and options');
      return;
    }

    const options = newVariantOptions.split(',').map(o => o.trim()).filter(o => o);
    
    setFormData({
      ...formData,
      variants: [...formData.variants, { name: newVariantName, options }],
    });

    setNewVariantName('');
    setNewVariantOptions('');
  };

  const removeVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
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

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.longDescription) {
      toast.warning('Please fill in all required fields');
      return;
    }

    if (formData.price <= 0) {
      toast.warning('Price must be greater than 0');
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
        name: formData.name,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription,
        category: formData.category,
        tags: formData.tags,
        vendor: formData.vendor,
        type: formData.type,
        status: formData.status,
        images: imageUrls,
        variants: formData.variants,
        variantCombinations: formData.variantCombinations,
        inventoryTracked: formData.inventoryTracked,
        quantity: formData.variantCombinations && formData.variantCombinations.length > 0
          ? formData.variantCombinations.reduce((sum, c) => sum + c.stock, 0)
          : formData.quantity,
        lowStockThreshold: formData.lowStockThreshold,
        variantStock: formData.variantStock,
        price: formData.price,
        compareAtPrice: formData.compareAtPrice || 0,
        chargeTax: formData.chargeTax,
        relatedProducts: formData.relatedProducts,
      };

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Product updated successfully!');
        router.push('/dashboard/products');
      } else {
        toast.error('Failed to update product: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter product name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Description *
        </label>
        <textarea
          value={formData.shortDescription}
          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
          rows={2}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Enter a short description for your product"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Long Description *
        </label>
        <ReactQuill
          value={formData.longDescription}
          onChange={(value) => setFormData({ ...formData, longDescription: value })}
          className="bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your product in detail"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Electronics, Clothing"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vendor
          </label>
          <input
            type="text"
            value={formData.vendor}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brand or manufacturer"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a tag"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Physical">Physical</option>
            <option value="Digital">Digital</option>
            <option value="Service">Service</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Product ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploadingImage}
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            {uploadingImage ? (
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            ) : (
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
            )}
            <span className="text-sm text-gray-600">
              {uploadingImage ? 'Uploading...' : 'Click to upload images'}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 10MB
            </span>
          </label>
        </div>
      </div>

      {/* Variants */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Variants (e.g., Size, Color)
        </label>
        
        <div className="space-y-2 mb-4">
          {formData.variants.map((variant, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <span className="font-medium">{variant.name}:</span>{' '}
                <span className="text-gray-600">{variant.options.join(', ')}</span>
              </div>
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            type="text"
            value={newVariantName}
            onChange={(e) => setNewVariantName(e.target.value)}
            placeholder="Variant name (e.g., Size)"
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={newVariantOptions}
            onChange={(e) => setNewVariantOptions(e.target.value)}
            placeholder="Options (comma-separated)"
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addVariant}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 inline mr-1" />
            Add Variant
          </button>
        </div>
      </div>

      {/* Inventory Tracking */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="inventory-tracked"
            checked={formData.inventoryTracked}
            onChange={(e) =>
              setFormData({ ...formData, inventoryTracked: e.target.checked })
            }
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label htmlFor="inventory-tracked" className="text-sm font-medium text-gray-700">
            Track inventory for this product
          </label>
        </div>

        {formData.inventoryTracked && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity in Stock
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Stock Threshold
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price * ({getCurrencySymbol(store?.currency || 'USD')})
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compare at Price ({getCurrencySymbol(store?.currency || 'USD')})
          </label>
          <input
            type="number"
            value={formData.compareAtPrice}
            onChange={(e) =>
              setFormData({ ...formData, compareAtPrice: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
          />
          <p className="mt-1 text-xs text-gray-500">
            Show a discount by setting a higher compare-at price
          </p>
        </div>
      </div>

      {/* Tax */}
      <div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="charge-tax"
            checked={formData.chargeTax}
            onChange={(e) => setFormData({ ...formData, chargeTax: e.target.checked })}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label htmlFor="charge-tax" className="text-sm font-medium text-gray-700">
            Charge tax on this product
          </label>
        </div>
      </div>

      {/* Related Products */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Related Products
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Select products to show as recommendations
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
          {allProducts.length === 0 ? (
            <p className="text-sm text-gray-500 col-span-2">No other products available</p>
          ) : (
            allProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => toggleRelatedProduct(product.id!)}
              >
                <input
                  type="checkbox"
                  checked={formData.relatedProducts.includes(product.id!)}
                  onChange={() => toggleRelatedProduct(product.id!)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  <div className="text-xs text-gray-500">{getCurrencySymbol(store?.currency || 'USD')}{product.price.toFixed(2)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  if (fetchingProduct) {
    return <Loader text="Loading product..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </button>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-2 text-gray-600">Update product information</p>
      </div>

      {/* Step Indicator */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold cursor-pointer ${
                  step < currentStep
                    ? 'bg-green-500 text-white'
                    : step === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
                onClick={() => setCurrentStep(step)}
              >
                {step < currentStep ? <Check className="h-5 w-5" /> : step}
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {currentStep === 1 && 'Step 1: Basic Information'}
            {currentStep === 2 && 'Step 2: Media & Inventory'}
            {currentStep === 3 && 'Step 3: Pricing & Related Products'}
          </h2>
          <p className="text-gray-600">
            {currentStep === 1 && 'Update the basic details about your product'}
            {currentStep === 2 && 'Manage images, variants, and inventory'}
            {currentStep === 3 && 'Update pricing and related products'}
          </p>
        </div>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Update Product
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
