// Order types for the Koopi e-commerce platform

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'stripe' | 'paypal';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Address {
  id?: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  variant?: { [key: string]: string }; // e.g., { "Size": "M", "Color": "Red" }
  sku?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g., "KOP-2024-001234"
  storeId: string;
  storeName: string;
  sellerId: string;
  sellerEmail: string;
  
  buyerId: string;
  buyerEmail: string;
  buyerName: string;
  
  items: OrderItem[];
  
  subtotal: number;
  discount?: {
    code: string;
    discountAmount: number;
  };
  shipping: number;
  tax: number;
  total: number;
  
  currency: string;
  
  shippingAddress: Address;
  
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  
  trackingNumber?: string;
  notes?: string;
  
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

export interface CreateOrderData {
  storeId: string;
  storeName: string;
  sellerId: string;
  sellerEmail: string;
  buyerId: string;
  buyerEmail: string;
  buyerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  notes?: string;
}
