// Pricing utilities for product validation and display

import { Product, VariantCombination } from '@/types/product';

// Minimum price in LKR (base currency)
export const MIN_PRICE_LKR = 100;

// Exchange rates (approximations for validation)
// These rates convert FROM the currency TO LKR
export const EXCHANGE_RATES_TO_LKR: { [key: string]: number } = {
  LKR: 1,
  USD: 300,      // 1 USD ≈ 300 LKR
  EUR: 323,      // 1 EUR ≈ 323 LKR
  GBP: 370,      // 1 GBP ≈ 370 LKR
  INR: 3.64,     // 1 INR ≈ 3.64 LKR
  AUD: 200,      // 1 AUD ≈ 200 LKR
  CAD: 220,      // 1 CAD ≈ 220 LKR
  JPY: 2.2,      // 1 JPY ≈ 2.2 LKR
  CNY: 42,       // 1 CNY ≈ 42 LKR
  SGD: 220,      // 1 SGD ≈ 220 LKR
  HKD: 38,       // 1 HKD ≈ 38 LKR
  THB: 8.5,      // 1 THB ≈ 8.5 LKR
  MYR: 67,       // 1 MYR ≈ 67 LKR
  PHP: 5.2,      // 1 PHP ≈ 5.2 LKR
  IDR: 0.019,    // 1 IDR ≈ 0.019 LKR
};

// Get minimum price for a specific currency
export function getMinimumPrice(currencyCode: string): number {
  const rate = EXCHANGE_RATES_TO_LKR[currencyCode] || EXCHANGE_RATES_TO_LKR['USD'];
  return MIN_PRICE_LKR / rate;
}

// Validate if a price meets the minimum requirement
export function validateMinimumPrice(price: number, currencyCode: string): {
  isValid: boolean;
  minPrice: number;
  message?: string;
} {
  const minPrice = getMinimumPrice(currencyCode);
  const isValid = price >= minPrice;
  
  return {
    isValid,
    minPrice: parseFloat(minPrice.toFixed(2)),
    message: isValid ? undefined : `Price must be at least ${minPrice.toFixed(2)} ${currencyCode} (equivalent to 100 LKR minimum)`
  };
}

// Get the lowest variant price from a product
export function getLowestVariantPrice(product: Product): number {
  if (!product.variantCombinations || product.variantCombinations.length === 0) {
    return product.price;
  }

  const prices = product.variantCombinations
    .map(combo => combo.price ?? product.price)
    .filter(price => price > 0);

  if (prices.length === 0) {
    return product.price;
  }

  return Math.min(...prices, product.price);
}

// Get the highest variant price from a product
export function getHighestVariantPrice(product: Product): number {
  if (!product.variantCombinations || product.variantCombinations.length === 0) {
    return product.price;
  }

  const prices = product.variantCombinations
    .map(combo => combo.price ?? product.price)
    .filter(price => price > 0);

  if (prices.length === 0) {
    return product.price;
  }

  return Math.max(...prices, product.price);
}

// Get price range for display
export function getPriceRange(product: Product): {
  min: number;
  max: number;
  hasRange: boolean;
} {
  const min = getLowestVariantPrice(product);
  const max = getHighestVariantPrice(product);

  return {
    min,
    max,
    hasRange: min !== max
  };
}

// Format price with currency symbol
export function formatPriceWithCurrency(price: number, currency: string): string {
  const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    INR: '₹',
    LKR: 'රු',
    SGD: 'S$',
    HKD: 'HK$',
    THB: '฿',
    MYR: 'RM',
    PHP: '₱',
    IDR: 'Rp',
  };

  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${price.toFixed(2)}`;
}

// Calculate savings percentage
export function calculateSavingsPercentage(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0 || salePrice >= originalPrice) {
    return 0;
  }
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

// Validate all prices in a product (including variants)
export function validateProductPrices(
  basePrice: number,
  variantCombinations: VariantCombination[] | undefined,
  currencyCode: string
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const minPrice = getMinimumPrice(currencyCode);

  // Validate base price
  const basePriceValidation = validateMinimumPrice(basePrice, currencyCode);
  if (!basePriceValidation.isValid) {
    errors.push(`Base price: ${basePriceValidation.message}`);
  }

  // Validate variant prices
  if (variantCombinations && variantCombinations.length > 0) {
    variantCombinations.forEach((combo, index) => {
      const variantPrice = combo.price ?? basePrice;
      const variantValidation = validateMinimumPrice(variantPrice, currencyCode);
      if (!variantValidation.isValid) {
        const variantName = Object.entries(combo.attributes)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        errors.push(`Variant (${variantName}): ${variantValidation.message}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
