'use client';

import React, { useState, useEffect } from 'react';
import { ProductVariant, VariantCombination } from '@/types/product';

interface VariantSelectorProps {
  variants: ProductVariant[];
  combinations: VariantCombination[];
  basePrice: number;
  onSelectionChange: (combination: VariantCombination | null) => void;
}

export function VariantSelector({ 
  variants, 
  combinations, 
  basePrice,
  onSelectionChange 
}: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentCombination, setCurrentCombination] = useState<VariantCombination | null>(null);

  // Find matching combination based on selected options
  useEffect(() => {
    const validVariants = variants.filter(v => v.name && v.options.length > 0);
    
    // Check if all variants have been selected
    const allSelected = validVariants.every(v => selectedOptions[v.name]);

    if (allSelected && combinations.length > 0) {
      // Find matching combination
      const match = combinations.find(combo => {
        return validVariants.every(variant => 
          combo.attributes[variant.name] === selectedOptions[variant.name]
        );
      });
      setCurrentCombination(match || null);
      onSelectionChange(match || null);
    } else {
      setCurrentCombination(null);
      onSelectionChange(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions, variants, combinations]);

  const handleOptionSelect = (variantName: string, option: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [variantName]: option
    }));
  };

  // Check if an option is available (has stock)
  const isOptionAvailable = (variantName: string, option: string): boolean => {
    if (combinations.length === 0) return true;

    // Build a temporary selection with this option
    const tempSelection = { ...selectedOptions, [variantName]: option };

    // Find all combinations that match the current selection
    const matchingCombos = combinations.filter(combo => {
      return Object.entries(tempSelection).every(([key, value]) => 
        combo.attributes[key] === value
      );
    });

    // Check if any matching combination has stock
    return matchingCombos.some(combo => combo.stock > 0);
  };

  if (!variants || variants.length === 0) {
    return null;
  }

  const validVariants = variants.filter(v => v.name && v.options.length > 0);

  if (validVariants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {validVariants.map((variant) => (
        <div key={variant.name} className="space-y-3">
          <label className="text-sm font-semibold text-gray-900">
            {variant.name}
            {selectedOptions[variant.name] && (
              <span className="ml-2 text-blue-600">
                - {selectedOptions[variant.name]}
              </span>
            )}
          </label>
          
          <div className="flex flex-wrap gap-3">
            {variant.options.map((option) => {
              const isSelected = selectedOptions[variant.name] === option;
              const isAvailable = isOptionAvailable(variant.name, option);
              
              return (
                <button
                  key={option}
                  onClick={() => isAvailable && handleOptionSelect(variant.name, option)}
                  disabled={!isAvailable}
                  className={`
                    px-6 py-3 rounded-xl border-2 font-medium transition-all
                    ${isSelected 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md' 
                      : isAvailable
                        ? 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                    }
                  `}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Show current selection details */}
      {currentCombination && (
        <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Price:</span>
              <span className="text-lg font-bold text-gray-900">
                ${(currentCombination.price ?? basePrice).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Availability:</span>
              <span className={`text-sm font-semibold ${
                currentCombination.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {currentCombination.stock > 0 
                  ? `${currentCombination.stock} in stock`
                  : 'Out of stock'
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">SKU:</span>
              <span className="text-xs font-mono text-gray-600">
                {currentCombination.sku}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
