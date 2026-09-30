import { CurrencyCode } from '../types/travel';

// Baseline exchange rates relative to 1 USD
export const EXCHANGE_RATES: Record<CurrencyCode, { rate: number; symbol: string; name: string }> = {
  USD: { rate: 1.0, symbol: '$', name: 'US Dollar' },
  EUR: { rate: 0.92, symbol: '€', name: 'Euro' },
  GBP: { rate: 0.78, symbol: '£', name: 'British Pound' },
  INR: { rate: 86.5, symbol: '₹', name: 'Indian Rupee' },
  JPY: { rate: 154.2, symbol: '¥', name: 'Japanese Yen' },
  CAD: { rate: 1.38, symbol: 'CA$', name: 'Canadian Dollar' },
  AUD: { rate: 1.54, symbol: 'A$', name: 'Australian Dollar' },
  AED: { rate: 3.67, symbol: 'AED', name: 'UAE Dirham' },
};

export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): number {
  if (from === to) return amount;
  const inUSD = amount / EXCHANGE_RATES[from].rate;
  return Math.round(inUSD * EXCHANGE_RATES[to].rate);
}

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'USD'
): string {
  const meta = EXCHANGE_RATES[currency] || EXCHANGE_RATES.USD;
  const rounded = Math.round(amount);

  if (currency === 'INR') {
    // Format Indian Rupee with Indian number system (Lakhs, Crores)
    return `${meta.symbol} ${formatIndianNumber(rounded)}`;
  }

  return `${meta.symbol}${rounded.toLocaleString('en-US')}`;
}

function formatIndianNumber(num: number): string {
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const str = absNum.toString();
  if (str.length <= 3) {
    return (isNegative ? '-' : '') + str;
  }
  const lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  return (isNegative ? '-' : '') + formatted;
}
