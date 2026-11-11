import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { CartItem } from '../../types';
import {
  calculateSubtotal,
  applyDiscount,
  calculateEscrowFee,
  calculateOrderTotal,
} from '../../utils/cartRules';
import { formatCredits } from '../../utils/formatters';
import { soundFx } from '../../utils/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: (discountCode: string) => void;
  onExploreMarketplace: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onExploreMarketplace,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotal = calculateSubtotal(cartItems);
  const discountInfo = applyDiscount(subtotal, appliedPromo);
  const escrowFee = calculateEscrowFee(subtotal);
  const finalTotal = calculateOrderTotal(subtotal, discountInfo.discountAmount, escrowFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyDiscount(subtotal, promoInput);
    if (result.isValid) {
      soundFx.playSuccess();
      setAppliedPromo(result.code);
      setPromoMessage({
        text: `Promo ${result.code} applied: ${(result.discountRate * 100).toFixed(0)}% OFF!`,
        success: true,
      });
    } else {
      soundFx.playGlitch();
      setPromoMessage({
        text: 'Invalid promo code. Try CYBER2026 or BLACKVAULT',
        success: false,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050607]/80 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0B1010] border-l border-[#00FF88]/30 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#00FF88]/20 bg-[#050607] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#00FF88]" />
            <h2 className="font-cyber font-bold text-white text-base">
              SECURE CART // {cartItems.reduce((acc, i) => acc + i.quantity, 0)} ITEMS
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#728078] hover:text-[#00FF88] cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#003B27]/40 border border-[#00FF88]/30 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-[#00FF88] opacity-60" />
              </div>
              <div>
                <h3 className="font-cyber text-white font-bold text-base mb-1">
                  CART IS EMPTY
                </h3>
                <p className="font-mono text-xs text-[#728078] max-w-xs">
                  Your encrypted order cache contains no assets. Explore the simulated catalog to add digital items.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onExploreMarketplace();
                }}
                className="px-4 py-2 rounded-xl bg-[#00FF88] text-black font-mono text-xs font-bold hover:bg-white transition-all cursor-pointer"
              >
                EXPLORE MARKETPLACE
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="bg-[#050607] border border-[#00FF88]/20 rounded-xl p-3 flex gap-3 items-center justify-between"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-lg object-cover border border-[#00FF88]/30 shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <h4 className="font-cyber text-xs font-bold text-white truncate">
                    {item.product.name}
                  </h4>
                  <span className="font-mono text-[10px] text-[#728078] block">
                    {item.product.category} • {formatCredits(item.product.price)} each
                  </span>
                  <span className="font-mono text-xs font-bold text-[#00FF88]">
                    {formatCredits(item.product.price * item.quantity)}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-[#728078] hover:text-[#FF304F] transition-colors cursor-pointer"
                    aria-label={`Remove ${item.product.name} from cart`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1.5 bg-[#0B1010] border border-[#00FF88]/20 rounded p-0.5 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="w-5 h-5 flex items-center justify-center text-[#728078] hover:text-[#00FF88] cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-4 text-center font-bold text-[#E5F5EC]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      className="w-5 h-5 flex items-center justify-center text-[#728078] hover:text-[#00FF88] cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo Code & Order Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-[#00FF88]/20 bg-[#050607] space-y-3">
            {/* Promo code form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#728078]" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="PROMO CODE (e.g. CYBER2026)"
                  className="w-full bg-[#0B1010] border border-[#00FF88]/30 rounded-lg pl-8 pr-3 py-1.5 font-mono text-xs text-[#E5F5EC] uppercase placeholder:normal-case focus:outline-none focus:border-[#00FF88]"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#003B27] border border-[#00FF88]/40 text-[#00FF88] hover:bg-[#00FF88] hover:text-black font-mono text-xs font-bold transition-all cursor-pointer"
              >
                APPLY
              </button>
            </form>

            {promoMessage && (
              <p
                className={`text-[11px] font-mono flex items-center gap-1 ${
                  promoMessage.success ? 'text-[#00FF88]' : 'text-[#FF304F]'
                }`}
              >
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{promoMessage.text}</span>
              </p>
            )}

            {/* Price Calculations Table */}
            <div className="space-y-1.5 font-mono text-xs pt-2 border-t border-[#00FF88]/15">
              <div className="flex justify-between text-[#728078]">
                <span>SUBTOTAL:</span>
                <span className="text-[#E5F5EC]">{formatCredits(subtotal)}</span>
              </div>

              {discountInfo.discountAmount > 0 && (
                <div className="flex justify-between text-[#00FF88]">
                  <span>DISCOUNT ({discountInfo.code}):</span>
                  <span>-{formatCredits(discountInfo.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#728078]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#00FF88]" />
                  ESCROW PROTECTION (2%):
                </span>
                <span className="text-[#E5F5EC]">+{formatCredits(escrowFee)}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#00FF88]/20">
                <span className="font-cyber">ESTIMATED TOTAL:</span>
                <span className="text-[#00FF88] text-base">{formatCredits(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              type="button"
              onClick={() => {
                soundFx.playSuccess();
                onProceedToCheckout(appliedPromo);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00FF88] text-black font-mono text-xs font-bold hover:bg-white transition-all cursor-pointer shadow-[0_0_20px_rgba(0,255,136,0.25)]"
              aria-label="Proceed to checkout"
            >
              <span>PROCEED TO DEMO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
