export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified: boolean;
  onboardingCompleted: boolean;
}

export interface BusinessInformation {
  accountType: 'individual' | 'business';
  businessName?: string;
  businessType?: 'llc' | 'corporation' | 'sole_proprietor' | 'partnership' | 'other';
  taxId?: string;
  businessAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface Store {
  storeId: string;
  userId: string;
  storeName: string;
  storeSlug: string;
  subdomain: string;
  customDomain?: string;
  plan: 'trial' | 'free' | 'pro';
  trialEndsAt: Date | null;
  trialDaysRemaining?: number;
  status: 'active' | 'suspended' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  categories?: string[];
  shippingLocations?: string[];
  returnPolicy?: string;
  logoUrl?: string;
  businessInfo?: BusinessInformation;
  currency?: string; // Add this line to fix the TS error
}

export type SerializableStore = Omit<Store, 'trialEndsAt' | 'createdAt' | 'updatedAt'> & {
  trialEndsAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export interface InitialData {
  user?: UserProfile;
  store?: SerializableStore | null;
}