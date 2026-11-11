import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Wallet,
  Lock,
  ArrowRight,
  CheckCircle2,
  Download,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { CartItem, Order, UserProfile } from '../../types';
import {
  calculateSubtotal,
  applyDiscount,
  calculateEscrowFee,
  calculateOrderTotal,
} from '../../utils/cartRules';
import { generateTxHash, canAffordPurchase } from '../../utils/walletRules';
import { formatCredits } from '../../utils/formatters';
import { soundFx } from '../../utils/audio';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  discountCode: string;
  currentUser: UserProfile;
  onOrderSuccess: (order: Order, newWalletBalance: number) => void;
  onDepositFunds: (amount: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  discountCode,
  currentUser,
  onOrderSuccess,
  onDepositFunds,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'balance' | 'escrow' | 'testnet'>('balance');
  const [pgpSigned, setPgpSigned] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = calculateSubtotal(cartItems);
  const discountInfo = applyDiscount(subtotal, discountCode);
  const escrowFee = calculateEscrowFee(subtotal);
  const finalTotal = calculateOrderTotal(subtotal, discountInfo.discountAmount, escrowFee);

  const hasSufficientBalance = canAffordPurchase(currentUser.walletBalance, finalTotal);

  const handleConfirmOrder = () => {
    if (!hasSufficientBalance && paymentMethod === 'balance') {
      soundFx.playGlitch();
      return;
    }

    setIsProcessing(true);
    soundFx.playTerminalBeep(900, 0.1);

    setTimeout(() => {
      const orderNumber = `BVT-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const txHash = generateTxHash();
      const newBalance = Math.max(0, currentUser.walletBalance - finalTotal);

      const order: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        date: new Date().toISOString(),
        items: [...cartItems],
        totalAmount: finalTotal,
        status: 'Delivered',
        paymentMethod:
          paymentMethod === 'balance'
            ? 'Blackvault Demo Balance'
            : paymentMethod === 'escrow'
            ? 'Simulated Multi-Sig Escrow'
            : 'Testnet Simulated P2P',
        txHash,
        downloadToken: `DL-TOKEN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      };

      setIsProcessing(false);
      setCompletedOrder(order);
      soundFx.playSuccess();
      onOrderSuccess(order, newBalance);
    }, 1400);
  };

  const handleDownloadManifest = () => {
    if (!completedOrder) return;
    soundFx.playClick();

    const manifestContent = {
      simulation: 'BLACKVAULT CYBERPUNK MARKETPLACE SIMULATION',
      notice: 'ALL DATA IS FICTIONAL AND FOR DEMO USE ONLY',
      orderNumber: completedOrder.orderNumber,
      timestamp: completedOrder.date,
      txHash: completedOrder.txHash,
      status: completedOrder.status,
      paymentMethod: completedOrder.paymentMethod,
      buyer: currentUser.username,
      totalCredits: completedOrder.totalAmount,
      assets: completedOrder.items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        category: item.product.category,
        quantity: item.quantity,
        sha256: item.product.specs.sha256,
        license: item.product.specs.license,
      })),
      verificationSeal: 'ECDSA-SIMULATED-OK',
    };

    const blob = new Blob([JSON.stringify(manifestContent, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${completedOrder.orderNumber}_manifest.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050607]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#0B1010] border border-[#00FF88]/40 rounded-2xl shadow-[0_0_50px_rgba(0,255,136,0.15)] overflow-hidden my-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00FF88]/20 pb-4 mb-5">
          <div className="flex items-center gap-2 font-mono text-sm text-[#00FF88]">
            <ShieldCheck className="w-5 h-5 text-[#00FF88]" />
            <span className="font-cyber font-bold text-white uppercase text-base">
              {completedOrder ? 'TRANSACTION CONFIRMED' : 'AUTHORIZE DEMO ORDER'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#728078] hover:text-[#00FF88] p-1 cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DEMO NOTICE BANNER */}
        <div className="mb-4 p-2.5 rounded-lg bg-[#003B27]/30 border border-[#00FF88]/20 flex items-center gap-2 text-xs font-mono text-[#00FF88]">
          <Lock className="w-4 h-4 shrink-0 text-[#00FF88]" />
          <span>DEMO MODE — NO REAL MONEY INVOLVED. SIMULATED LEDGER EXECUTION.</span>
        </div>

        {!completedOrder ? (
          <div className="space-y-5">
            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="font-mono text-xs text-[#728078] uppercase block font-bold">
                SELECT SIMULATED PAYMENT CHANNEL:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {/* Method 1: Blackvault Demo Balance */}
                <div
                  onClick={() => setPaymentMethod('balance')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'balance'
                      ? 'bg-[#050607] border-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.15)]'
                      : 'bg-[#050607]/60 border-[#00FF88]/20 hover:border-[#00FF88]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-[#00FF88]" />
                    <div>
                      <span className="font-cyber text-xs font-bold text-white block">
                        Blackvault Demo Balance
                      </span>
                      <span className="font-mono text-[11px] text-[#728078]">
                        Available: {formatCredits(currentUser.walletBalance)}
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === 'balance'}
                    onChange={() => setPaymentMethod('balance')}
                    className="accent-[#00FF88]"
                  />
                </div>

                {/* Method 2: Simulated Multi-Sig Escrow */}
                <div
                  onClick={() => setPaymentMethod('escrow')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'escrow'
                      ? 'bg-[#050607] border-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.15)]'
                      : 'bg-[#050607]/60 border-[#00FF88]/20 hover:border-[#00FF88]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#00FF88]" />
                    <div>
                      <span className="font-cyber text-xs font-bold text-white block">
                        Simulated Multi-Sig Escrow (Recommended)
                      </span>
                      <span className="font-mono text-[11px] text-[#728078]">
                        Held in cold storage until manifest verification
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === 'escrow'}
                    onChange={() => setPaymentMethod('escrow')}
                    className="accent-[#00FF88]"
                  />
                </div>
              </div>
            </div>

            {/* Insufficient Funds Warning & Quick Deposit */}
            {!hasSufficientBalance && paymentMethod === 'balance' && (
              <div className="p-3 rounded-xl bg-[#FF304F]/10 border border-[#FF304F]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#FF304F]">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    Insufficient demo balance ({formatCredits(currentUser.walletBalance)} available, need {formatCredits(finalTotal)}).
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDepositFunds(500)}
                  className="px-3 py-1.5 rounded-lg bg-[#FF304F] text-white font-bold hover:bg-white hover:text-black transition-all cursor-pointer shrink-0"
                >
                  +500 DEMO BVT
                </button>
              </div>
            )}

            {/* Cryptographic Signature Option */}
            <div className="bg-[#050607] p-3 rounded-xl border border-[#00FF88]/20 flex items-center gap-3 font-mono text-xs">
              <input
                type="checkbox"
                id="pgp-sign"
                checked={pgpSigned}
                onChange={(e) => setPgpSigned(e.target.checked)}
                className="accent-[#00FF88] w-4 h-4"
              />
              <label htmlFor="pgp-sign" className="text-[#E5F5EC] cursor-pointer">
                Sign order manifest with simulated PGP key ({currentUser.pgpFingerprint.slice(0, 14)}...)
              </label>
            </div>

            {/* Order Items Summary */}
            <div className="bg-[#050607] p-3 rounded-xl border border-[#00FF88]/20 space-y-2 font-mono text-xs">
              <div className="text-[#728078] text-[10px] uppercase font-bold">
                ITEMS IN THIS ORDER ({cartItems.length}):
              </div>
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex justify-between text-[#E5F5EC]">
                  <span className="truncate max-w-[280px]">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-bold text-[#00FF88]">
                    {formatCredits(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}

              <div className="pt-2 border-t border-[#00FF88]/20 flex justify-between font-bold text-sm">
                <span>TOTAL DUE:</span>
                <span className="text-[#00FF88]">{formatCredits(finalTotal)}</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="button"
              disabled={isProcessing || (!hasSufficientBalance && paymentMethod === 'balance')}
              onClick={handleConfirmOrder}
              className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isProcessing
                  ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]'
                  : !hasSufficientBalance && paymentMethod === 'balance'
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                  : 'bg-[#00FF88] text-black hover:bg-white shadow-[0_0_20px_rgba(0,255,136,0.3)]'
              }`}
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-[#00FF88] animate-spin" />
                  <span>EXECUTING DEMO SMART TRANSACTION...</span>
                </>
              ) : (
                <>
                  <span>CONFIRM & EXECUTE DEMO ORDER</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* Order Confirmation View */
          <div className="space-y-4 text-center font-mono">
            <div className="w-14 h-14 rounded-full bg-[#003B27] border border-[#00FF88] flex items-center justify-center mx-auto text-[#00FF88] shadow-[0_0_20px_rgba(0,255,136,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-cyber font-bold text-lg text-white">
                DEMO TRANSACTION VERIFIED
              </h3>
              <p className="text-xs text-[#728078] mt-1">
                Your simulated purchase has been written to the mock ledger and delivered.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-[#050607] p-4 rounded-xl border border-[#00FF88]/30 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#728078]">ORDER ID:</span>
                <span className="text-[#00FF88] font-bold">{completedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#728078]">TX HASH:</span>
                <span className="text-[#E5F5EC] text-[10px] truncate max-w-[240px]">
                  {completedOrder.txHash}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#728078]">SETTLEMENT:</span>
                <span className="text-[#E5F5EC]">{formatCredits(completedOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#728078]">STATUS:</span>
                <span className="text-[#00FF88] font-bold">DELIVERED [DEMO CACHE]</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadManifest}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00FF88] text-black font-mono text-xs font-bold hover:bg-white transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.2)]"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD DEMO MANIFEST (.JSON)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-[#00FF88]/30 text-[#00FF88] font-mono text-xs hover:bg-[#003B27] transition-all cursor-pointer"
              >
                RETURN TO NETWORK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
