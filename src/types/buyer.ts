export interface Buyer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  photoURL?: string;
  addresses: Address[];
  defaultAddressId?: string;
  createdAt: any;
  updatedAt: any;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface BuyerAuthState {
  buyer: Buyer | null;
  loading: boolean;
  isAuthenticated: boolean;
}
