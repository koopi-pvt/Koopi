'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCw, Package } from 'lucide-react';
import { ProductVariant, VariantCombination } from '@/types/product';
import { useTranslations } from 'next-intl';

type VariantEditorProps = {
  variants: ProductVariant[];
  combinations: VariantCombination[];
  basePrice: number;
  onChange: (variants: ProductVariant[], combinations: VariantCombination[]) => void;
};

export function VariantEditor({ 
  variants, 
  combinations,
  basePrice,
  onChange 
}: EnhancedVariantEditorProps) {
  const t = useTranslations('Dashboard.products.add');
  const [localVariants, setLocalVariants] = useState<ProductVariant[]>(variants);
  const [localCombinations, setLocalCombinations] = useState<VariantCombination[]>(combinations);
  const [showPriceColumn, setShowPriceColumn] = useState(false);

  // Generate all combinations from variants
  const generateCombinations = (vars: ProductVariant[]): VariantCombination[] => {
    const validVariants = vars.filter(v => v.name && v.options.length > 0);
    
    if (validVariants.length === 0) {
      return [];
    }

    // Generate cartesian product
    const combinations: VariantCombination[] = [];
    
    const generate = (index: number, current: { [key: string]: string }) => {
      if (index === validVariants.length) {
        const id = Object.values(current).join('-');
        const sku = `SKU-${Object.values(current).join('-').toUpperCase().replace(/\s+/g, '-')}`;
        
        // Check if combination already exists to preserve user data
        const existing = localCombinations.find(c => c.id === id);
        
        combinations.push({
          id,
          attributes: { ...current },
          sku: existing?.sku || sku,
          price: existing?.price,
          stock: existing?.stock || 0,
          lowStockThreshold: existing?.lowStockThreshold || 5,
        });
        return;
      }

      const variant = validVariants[index];
      for (const option of variant.options) {
        generate(index + 1, { ...current, [variant.name]: option });
      }
    };

    generate(0, {});
    return combinations;
  };

  const handleAddVariant = () => {
    const newVariants = [...localVariants, { name: '', options: [] }];
    setLocalVariants(newVariants);
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = localVariants.filter((_, i) => i !== index);
    setLocalVariants(newVariants);
    const newCombinations = generateCombinations(newVariants);
    setLocalCombinations(newCombinations);
    onChange(newVariants, newCombinations);
  };

  const handleVariantNameChange = (index: number, name: string) => {
    const newVariants = [...localVariants];
    newVariants[index].name = name;
    setLocalVariants(newVariants);
  };

  const handleOptionChange = (variantIndex: number, optionIndex: number, value: string) => {
    const newVariants = [...localVariants];
    newVariants[variantIndex].options[optionIndex] = value;
    setLocalVariants(newVariants);
  };

  const handleAddOption = (variantIndex: number) => {
    const newVariants = [...localVariants];
    newVariants[variantIndex].options.push('');
    setLocalVariants(newVariants);
  };

  const handleRemoveOption = (variantIndex: number, optionIndex: number) => {
    const newVariants = [...localVariants];
    newVariants[variantIndex].options.splice(optionIndex, 1);
    setLocalVariants(newVariants);
    const newCombinations = generateCombinations(newVariants);
    setLocalCombinations(newCombinations);
    onChange(newVariants, newCombinations);
  };

  const handleGenerateCombinations = () => {
    const newCombinations = generateCombinations(localVariants);
    setLocalCombinations(newCombinations);
    onChange(localVariants, newCombinations);
  };

  const handleCombinationChange = (
    combinationId: string, 
    field: 'sku' | 'price' | 'stock' | 'lowStockThreshold',
    value: string | number
  ) => {
    const newCombinations = localCombinations.map(combo => {
      if (combo.id === combinationId) {
        if (field === 'price') {
          return { ...combo, [field]: value === '' ? undefined : Number(value) };
        }
        return { ...combo, [field]: value };
      }
      return combo;
    });
    setLocalCombinations(newCombinations);
    onChange(localVariants, newCombinations);
  };

  const handleBulkStockUpdate = (stock: number) => {
    const newCombinations = localCombinations.map(combo => ({
      ...combo,
      stock,
    }));
    setLocalCombinations(newCombinations);
    onChange(localVariants, newCombinations);
  };

  return (
    <div className="space-y-6">
      {/* Variant Definition Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{t('defineVariants')}</h3>
          <span className="text-sm text-gray-500">
            {localVariants.filter(v => v.name && v.options.length > 0).length} {t('variantsDefined')}
          </span>
        </div>

        {localVariants.map((variant, variantIndex) => (
          <div key={variantIndex} className="p-5 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-2">{t('variantNameLabel')}</label>
                <input
                  type="text"
                  value={variant.name}
                  onChange={(e) => handleVariantNameChange(variantIndex, e.target.value)}
                  placeholder={t('variantNamePlaceholder')}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium"
                />
              </div>
              <button 
                onClick={() => handleRemoveVariant(variantIndex)} 
                className="mt-7 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-500">{t('optionsLabel')}</label>
              {variant.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(variantIndex, optionIndex, e.target.value)}
                    placeholder={t('optionPlaceholder')}
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button 
                    onClick={() => handleRemoveOption(variantIndex, optionIndex)} 
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => handleAddOption(variantIndex)} 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mt-2 px-2 py-1 hover:bg-blue-50 rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
                {t('addOption')}
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={handleAddVariant} 
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>{t('addNewVariant')}</span>
        </button>
      </div>

      {/* Generate Combinations Button */}
      {localVariants.some(v => v.name && v.options.length > 0) && (
        <div className="flex items-center gap-4">
          <button 
            onClick={handleGenerateCombinations}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20 transition-all font-medium flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            {t('generateCombinations')}
          </button>
          {localCombinations.length > 0 && (
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
              {localCombinations.length} {t('combinations')}
            </span>
          )}
        </div>
      )}

      {/* Combinations Management Section */}
      {localCombinations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              {t('manageVariantCombinations')}
            </h3>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showPriceColumn}
                  onChange={(e) => setShowPriceColumn(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-600">{t('showCustomPricing')}</span>
              </label>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">{t('bulkSetStock')}</label>
              <input
                type="number"
                min="0"
                placeholder={t('enterQuantity')}
                className="px-3 py-2 w-32 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const value = parseInt((e.target as HTMLInputElement).value);
                    if (!isNaN(value)) {
                      handleBulkStockUpdate(value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
              />
              <span className="text-xs text-gray-500">{t('pressEnterToApply')}</span>
            </div>
          </div>

          {/* Combinations Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t('variant')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t('sku')}
                  </th>
                  {showPriceColumn && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {t('priceColumn')} ($)
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t('stock')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {t('lowStockAlert')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {localCombinations.map((combo, index) => (
                  <tr key={combo.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(combo.attributes).map(([key, value]) => (
                          <span 
                            key={key}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {key}: <span className="font-semibold ml-1">{value}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={combo.sku}
                        onChange={(e) => handleCombinationChange(combo.id, 'sku', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                      />
                    </td>
                    {showPriceColumn && (
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={combo.price ?? ''}
                          onChange={(e) => handleCombinationChange(combo.id, 'price', e.target.value)}
                          placeholder={basePrice.toString()}
                          className="w-28 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        value={combo.stock}
                        onChange={(e) => handleCombinationChange(combo.id, 'stock', parseInt(e.target.value) || 0)}
                        className="w-24 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        value={combo.lowStockThreshold ?? 5}
                        onChange={(e) => handleCombinationChange(combo.id, 'lowStockThreshold', parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{t('totalStockSummary')}</span>
              <span className="text-2xl font-bold text-green-600">
                {localCombinations.reduce((sum, combo) => sum + combo.stock, 0)} {t('units')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
