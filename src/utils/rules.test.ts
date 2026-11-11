import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSubtotal, applyDiscount, calculateEscrowFee, calculateOrderTotal } from './cartRules';
import { canAffordPurchase, processDeposit, processWithdrawal, generateTxHash } from './walletRules';
import { formatCredits, maskHash } from './formatters';
import { CartItem, Product } from '../types';

const mockProductA: Product = {
  id: 'prod-1',
  name: 'Neural Shader Pack',
  slug: 'neural-shader-pack',
  category: 'Gaming Assets',
  price: 150,
  seller: {
    username: '0xGhost',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    rating: 4.9,
    salesCount: 142,
    verified: true,
  },
  rating: 4.9,
  reviewsCount: 38,
  description: 'Cyberpunk GLSL shaders for real-time engines.',
  features: ['PBR Metallic', 'Volumetric Fog', 'Bloom Pass'],
  specs: {
    fileFormat: 'ZIP (.glsl, .hlsl)',
    fileSize: '48.2 MB',
    license: 'Royalty Free Commercial',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    version: 'v2.4.0',
  },
  image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  tags: ['glsl', 'shaders', 'cyberpunk'],
  stock: 99,
  dateAdded: '2026-03-01',
};

const mockProductB: Product = {
  ...mockProductA,
  id: 'prod-2',
  name: 'Encrypted Cyberdeck 3D',
  price: 250,
};

test('Cart logic: calculates subtotal with quantities correctly', () => {
  const cartItems: CartItem[] = [
    { product: mockProductA, quantity: 2 }, // 150 * 2 = 300
    { product: mockProductB, quantity: 1 }, // 250 * 1 = 250
  ];
  assert.equal(calculateSubtotal(cartItems), 550);
});

test('Cart logic: promo code discounts', () => {
  const resultValid = applyDiscount(100, 'CYBER2026');
  assert.equal(resultValid.isValid, true);
  assert.equal(resultValid.discountRate, 0.20);
  assert.equal(resultValid.discountAmount, 20);

  const resultInvalid = applyDiscount(100, 'FAKECODE');
  assert.equal(resultInvalid.isValid, false);
  assert.equal(resultInvalid.discountAmount, 0);
});

test('Cart logic: escrow fee and final order total', () => {
  const subtotal = 200;
  const escrowFee = calculateEscrowFee(subtotal); // 2% of 200 = 4.00
  assert.equal(escrowFee, 4);

  const discount = 40;
  const total = calculateOrderTotal(subtotal, discount, escrowFee);
  assert.equal(total, 164);
});

test('Wallet logic: affordability and transaction boundaries', () => {
  assert.equal(canAffordPurchase(500, 450), true);
  assert.equal(canAffordPurchase(500, 500), true);
  assert.equal(canAffordPurchase(500, 501), false);
  assert.equal(canAffordPurchase(500, 0), false);
});

test('Wallet logic: deposit increments balance cleanly', () => {
  const depositRes = processDeposit(1000, 250.5);
  assert.equal(depositRes.newBalance, 1250.5);
  assert.equal(depositRes.status, 'Confirmed');
  assert.match(depositRes.txHash, /^0x[0-9a-f]{40}$/);
});

test('Wallet logic: withdrawal limits and rejection on overdraft', () => {
  const validWithdrawal = processWithdrawal(1000, 300);
  assert.equal(validWithdrawal.success, true);
  assert.equal(validWithdrawal.newBalance, 700);

  const overWithdrawal = processWithdrawal(500, 800);
  assert.equal(overWithdrawal.success, false);
  assert.equal(overWithdrawal.newBalance, 500);
  assert.equal(overWithdrawal.error, 'Insufficient fictional wallet balance.');

  const negativeWithdrawal = processWithdrawal(500, -50);
  assert.equal(negativeWithdrawal.success, false);
});

test('Formatting helpers: credit string and hash masking', () => {
  assert.equal(formatCredits(1250), '1,250.00 BVT');
  const sampleHash = '0x1234567890abcdef1234567890abcdef12345678';
  assert.equal(maskHash(sampleHash), '0x1234...5678');
});
