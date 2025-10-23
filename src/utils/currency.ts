// Currency utilities

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  symbolPosition: 'before' | 'after';
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', symbolPosition: 'before' },
  { code: 'EUR', symbol: '€', name: 'Euro', symbolPosition: 'before' },
  { code: 'GBP', symbol: '£', name: 'British Pound', symbolPosition: 'before' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', symbolPosition: 'before' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', symbolPosition: 'before' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', symbolPosition: 'before' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', symbolPosition: 'before' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', symbolPosition: 'before' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', symbolPosition: 'before' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', symbolPosition: 'before' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', symbolPosition: 'before' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', symbolPosition: 'before' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', symbolPosition: 'before' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', symbolPosition: 'before' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', symbolPosition: 'before' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', symbolPosition: 'after' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', symbolPosition: 'after' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', symbolPosition: 'after' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', symbolPosition: 'after' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', symbolPosition: 'before' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', symbolPosition: 'before' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', symbolPosition: 'before' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', symbolPosition: 'before' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', symbolPosition: 'before' },
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', symbolPosition: 'before' },
];

export function getCurrencyByCode(code: string): Currency {
  return CURRENCIES.find(c => c.code === code) || CURRENCIES[0]; // Default to USD
}

export function formatPrice(price: number, currencyCode: string = 'USD'): string {
  const currency = getCurrencyByCode(currencyCode);
  const formattedPrice = price.toFixed(2);
  
  if (currency.symbolPosition === 'before') {
    return `${currency.symbol}${formattedPrice}`;
  } else {
    return `${formattedPrice} ${currency.symbol}`;
  }
}

export function getCurrencySymbol(currencyCode: string = 'USD'): string {
  const currency = getCurrencyByCode(currencyCode);
  return currency.symbol;
}
