import { Product, VariantCombination } from './product';

export interface CartItem {
  id: string; // unique cart item id
  productId: string;
  product: Product;
  variantCombination?: VariantCombination;
  selectedAttributes?: { [key: string]: string }; // e.g., { "Size": "M", "Color": "Blue" }
  quantity: number;
  price: number; // final price (variant price or base price)
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity: number, variantCombination?: VariantCombination, selectedAttributes?: { [key: string]: string }) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string, variantCombination?: VariantCombination) => boolean;
}
