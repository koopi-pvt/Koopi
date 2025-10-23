'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Store } from '@/types/store';
import { useUser } from '@/contexts/UserContext';
import { Upload, Loader2, Image as ImageIcon, Power, Eye, EyeOff, Info } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useToast } from '@/contexts/ToastContext';
import Loader from '@/components/common/Loader';

// Dynamic import for React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function StoreSettingsPage() {
  const { user } = useUser();
  const toast = useToast();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    categories: '',
    shippingLocations: '',
    returnPolicy: '',
    businessHours: '',
    logoUrl: '',
    shopEnabled: true,
    aboutEnabled: false,
    aboutContent: '',
  });

  useEffect(() => {
    if (user) {
      fetchStoreData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/store');
      const data = await response.json();

      if (response.ok) {
        setStore(data.store);
        setFormData({
          storeName: data.store.storeName,
          description: data.store.description || '',
          categories: (data.store.categories || []).join(', '),
          shippingLocations: (data.store.shippingLocations || []).join(', '),
          returnPolicy: data.store.returnPolicy || '',
          businessHours: data.store.businessHours || '',
          logoUrl: data.store.logoUrl || '',
          shopEnabled: data.store.shopEnabled !== false, // Default to true
          aboutEnabled: data.store.aboutEnabled || false,
          aboutContent: data.store.aboutContent || '',
        });
      } else {
        console.error('Failed to fetch store:', data.error);
      }
    } catch (error) {
      console.error('Error fetching store:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = (field: 'shopEnabled' | 'aboutEnabled') => {
    setFormData({ ...formData, [field]: !formData[field] });
  };

  const handleAboutContentChange = (content: string) => {
    setFormData({ ...formData, aboutContent: content });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await fetch('/api/store/upload-logo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, logoUrl: data.logoUrl }));
      
      // Update local store state
      if (store) {
        setStore({ ...store, logoUrl: data.logoUrl });
      }
      
      toast.success('Logo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo. Please try again.');
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/store', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          categories: formData.categories.split(',').map(c => c.trim()).filter(Boolean),
          shippingLocations: formData.shippingLocations.split(',').map(l => l.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        toast.success('Store updated successfully!');
        fetchStoreData(); // Refresh data
      } else {
        const data = await response.json();
        toast.error(`Failed to update store: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating store:', error);
      toast.error('An error occurred while updating the store.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading store settings..." />;
  }

  if (!store) {
    return <div className="p-8 text-center text-gray-600">Store not found.</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-gray-600 mt-2">Manage your store settings and appearance</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Status Section */}
        <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Power className="w-5 h-5 text-blue-600" />
            Store Status
          </h2>
          
          <div className="space-y-6">
            {/* Shop Enable/Disable Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">Shop Status</h3>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    formData.shopEnabled 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {formData.shopEnabled ? 'LIVE' : 'DISABLED'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {formData.shopEnabled 
                    ? 'Your store is live and visible to customers' 
                    : 'Your store is hidden and shows "Under Construction" page'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('shopEnabled')}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  formData.shopEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    formData.shopEnabled ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* About Section Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">About Section</h3>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    formData.aboutEnabled 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {formData.aboutEnabled ? 'VISIBLE' : 'HIDDEN'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {formData.aboutEnabled 
                    ? 'About section is visible on your store page' 
                    : 'About section is hidden from customers'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('aboutEnabled')}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  formData.aboutEnabled ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    formData.aboutEnabled ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Store Logo Section */}
        <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Store Logo</h2>
          <div className="flex items-center gap-6">
            {/* Logo Preview */}
            <div className="relative">
              {formData.logoUrl ? (
                <Image
                  src={formData.logoUrl}
                  alt="Store Logo"
                  width={120}
                  height={120}
                  className="w-30 h-30 object-cover rounded-lg border-2 border-gray-200"
                />
              ) : (
                <div className="w-30 h-30 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="flex-1">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingLogo}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploadingLogo ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    Upload Logo
                  </>
                )}
              </button>
              <p className="mt-2 text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB. Recommended: 512x512px
              </p>
            </div>
          </div>
        </div>

        {/* Store Information Section */}
        <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold mb-4">Store Information</h2>
          
          <div>
            <label htmlFor="storeName" className="block font-medium text-gray-700 mb-2">Store Name *</label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block font-medium text-gray-700 mb-2">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Brief description of your store"
            />
          </div>
          <div>
            <label htmlFor="categories" className="block font-medium text-gray-700 mb-2">Categories (comma-separated)</label>
            <input
              type="text"
              id="categories"
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Electronics, Fashion, Home & Garden"
            />
          </div>
          <div>
            <label htmlFor="shippingLocations" className="block font-medium text-gray-700 mb-2">Shipping Locations (comma-separated)</label>
            <input
              type="text"
              id="shippingLocations"
              name="shippingLocations"
              value={formData.shippingLocations}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="USA, Canada, UK"
            />
          </div>
          <div>
            <label htmlFor="returnPolicy" className="block font-medium text-gray-700 mb-2">Return Policy</label>
            <textarea
              id="returnPolicy"
              name="returnPolicy"
              value={formData.returnPolicy}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="30-day return policy for all unused items..."
            />
          </div>
          <div>
            <label htmlFor="businessHours" className="block font-medium text-gray-700 mb-2">Business Hours</label>
            <input
              type="text"
              id="businessHours"
              name="businessHours"
              value={formData.businessHours}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
            />
          </div>
        </div>

        {/* About Section Content */}
        {formData.aboutEnabled && (
          <div className="bg-white p-6 rounded-xl border-2 border-blue-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">About Section Content</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              This content will be displayed in the About section of your store. Use the rich text editor to format your content.
            </p>
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={formData.aboutContent}
                onChange={handleAboutContentChange}
                placeholder="Tell your customers about your store, your mission, your story..."
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    ['link'],
                    ['clean']
                  ]
                }}
                className="bg-white"
                style={{ minHeight: '200px' }}
              />
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-4 pt-4">
          <button 
            type="submit" 
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
