export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
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

export interface SignupData {
  email: string;
  password: string;
  displayName: string;
  phoneNumber: string;
  storeName: string;
  storeSlug: string;
  storeDescription: string;
  categories: string[];
  shippingLocations: string[];
  returnPolicy: string;
  businessHours: string;
  businessInfo?: BusinessInformation;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}
