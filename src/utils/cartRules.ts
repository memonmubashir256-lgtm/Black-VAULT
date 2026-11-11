import { CartItem } from '../types';

export const PROMO_CODES: Record<string, number> = {
  CYBER2026: 0.20, // 20% off
  BLACKVAULT: 0.15, // 15% off
  NEOHACKER: 0.10, // 10% off
  ZERODAY: 0.25,   // 25% off
};

export const ESCROW_FEE_RATE = 0.02; // 2% fictional escrow insurance fee

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
}

export function applyDiscount(subtotal: number, code: string): {
  discountAmount: number;
  discountRate: number;
  isValid: boolean;
  code: string;
} {
  const normalized = (code || '').trim().toUpperCase();
  if (normalized && PROMO_CODES[normalized] !== undefined) {
    const rate = PROMO_CODES[normalized];
    const discountAmount = Math.round(subtotal * rate * 100) / 100;
    return {
      discountAmount,
      discountRate: rate,
      isValid: true,
      code: normalized,
    };
  }
  return {
    discountAmount: 0,
    discountRate: 0,
    isValid: false,
    code: normalized,
  };
}

export function calculateEscrowFee(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return Math.round(subtotal * ESCROW_FEE_RATE * 100) / 100;
}

export function calculateOrderTotal(subtotal: number, discountAmount: number, escrowFee: number): number {
  const total = subtotal - discountAmount + escrowFee;
  return Math.max(0, Math.round(total * 100) / 100);
}
