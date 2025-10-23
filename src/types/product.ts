export type ProductStatus = 'Active' | 'Draft';
export type ProductType = 'Physical' | 'Digital' | 'Service';

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface VariantCombination {
  id: string; // unique identifier for the combination
  attributes: { [key: string]: string }; // e.g., { "Size": "S", "Color": "Red" }
  sku: string;
  price?: number; // optional override price
  stock: number;
  lowStockThreshold?: number;
}

export interface Product {
  id?: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  status: ProductStatus;
  type: ProductType;
  vendor: string;
  tags: string[];
  category: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  inventoryTracked: boolean;
  lowStockThreshold: number;
  chargeTax: boolean;
  variants: ProductVariant[];
  variantCombinations?: VariantCombination[]; // new field for variant combinations
  relatedProducts: string[];
  images: string[];
  variantStock: { [key: string]: number }; // keeping for backward compatibility
  storeId: string;
  userId?: string;
  averageRating: number;
  reviewCount: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface ProductFormData {
  // Step 1: Basic Info
  name: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  tags: string[];
  vendor: string;
  type: ProductType;
  status: ProductStatus;

  // Step 2: Media & Inventory
  images: File[];
  existingImages?: string[];
  variants: ProductVariant[];
  variantCombinations?: VariantCombination[]; // new field for variant combinations
  inventoryTracked: boolean;
  quantity: number;
  lowStockThreshold: number;
  variantStock: { [key: string]: number };

  // Step 3: Pricing
  price: number;
  compareAtPrice?: number;
  chargeTax: boolean;
  relatedProducts: string[];
}
