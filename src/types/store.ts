export interface Store {
  storeId: string;
  userId: string;
  storeName: string;
  storeSlug: string;
  subdomain: string;
  customDomain: string | null;
  plan: 'trial' | 'free' | 'pro';
  trialEndsAt: Date;
  status: 'active' | 'suspended' | 'deleted';
  
  // Optional - to be filled later
  description?: string;
  categories?: string[];
  shippingLocations?: string[];
  returnPolicy?: string;
  logoUrl?: string;
  themeConfig?: Record<string, unknown>;
  
  // Store settings
  shopEnabled?: boolean; // If false, show "Under Construction"
  aboutEnabled?: boolean; // Show/hide about section
  aboutContent?: string; // Rich text content for about section
  currency?: string; // Currency code (USD, EUR, GBP, etc.)
  codEnabled?: boolean; // Cash on Delivery payment option
  
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreSlug {
  slug: string;
  storeId: string;
  userId: string;
  createdAt: Date;
}

export interface CreateStoreData {
  storeName: string;
  storeSlug: string;
  userId: string;
}
