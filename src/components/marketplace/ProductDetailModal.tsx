import React, { useState } from 'react';
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  HardDrive,
  Copy,
  Check,
  Send,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Product, Review } from '../../types';
import { formatCredits } from '../../utils/formatters';
import { soundFx } from '../../utils/audio';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  allProducts: Product[];
  initialReviews: Review[];
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  isWishlisted,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onSelectProduct,
  allProducts,
  initialReviews,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');
  const [copiedHash, setCopiedHash] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  // New Review state
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!product) return null;

  const handleCopyHash = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(product.specs.sha256);
      setCopiedHash(true);
      soundFx.playTerminalBeep(1100, 0.04);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    soundFx.playSuccess();
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: 'CipherRunner_09 [You]',
      rating: newRating,
      date: new Date().toISOString().split('T')[0],
      comment: newComment.trim(),
      verifiedPurchase: true,
    };
    setReviews([newRev, ...reviews]);
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050607]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#0B1010] border border-[#00FF88]/40 rounded-2xl shadow-[0_0_50px_rgba(0,255,136,0.15)] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#00FF88]/20 bg-[#050607]">
          <div className="flex items-center gap-2 font-mono text-xs text-[#00FF88]">
            <Zap className="w-4 h-4 text-[#00FF88]" />
            <span className="font-bold tracking-wider uppercase">
              ENCRYPTED ASSET MANIFEST // {product.id}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#728078] hover:text-[#00FF88] hover:bg-[#0B1010] transition-colors cursor-pointer"
            aria-label="Close product details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gallery Column */}
            <div className="space-y-3">
              <div className="relative aspect-video sm:aspect-square w-full rounded-xl overflow-hidden bg-[#050607] border border-[#00FF88]/30">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 cyber-scanlines opacity-50 pointer-events-none" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded bg-[#050607]/90 text-[#00FF88] border border-[#00FF88]/40 font-mono text-xs uppercase">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* SHA-256 Fingerprint Box */}
              <div className="bg-[#050607] p-3 rounded-lg border border-[#00FF88]/20 font-mono text-[11px] space-y-1">
                <div className="flex items-center justify-between text-[#728078]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00FF88]" />
                    SHA-256 CHECKSUM HASH:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyHash}
                    className="flex items-center gap-1 text-[#00FF88] hover:underline cursor-pointer"
                  >
                    {copiedHash ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
                <div className="text-[#E5F5EC] break-all select-all font-mono text-[10px]">
                  {product.specs.sha256}
                </div>
              </div>
            </div>

            {/* Details Column */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-cyber font-bold text-white mb-2">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3 text-xs font-mono text-[#728078] mb-4">
                  <span className="flex items-center gap-1 text-[#00FF88]">
                    <Star className="w-4 h-4 fill-[#00FF88] text-[#00FF88]" />
                    <span className="font-bold">{product.rating}</span>
                    <span>({product.reviewsCount} reviews)</span>
                  </span>
                  <span>•</span>
                  <span>STOCK: {product.stock} DEMO UNITS</span>
                </div>

                {/* Pricing Block */}
                <div className="bg-[#050607] p-4 rounded-xl border border-[#00FF88]/30 mb-4">
                  <span className="text-xs font-mono text-[#728078] block">DEMO PRICE</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-[#00FF88]">
                      {formatCredits(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm font-mono text-[#728078] line-through">
                        {formatCredits(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-[#728078] mt-1">
                    Includes simulated multi-sig escrow protection & instant cryptographic verification.
                  </p>
                </div>

                {/* Seller Card */}
                <div className="bg-[#050607] p-3 rounded-xl border border-[#00FF88]/20 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.seller.avatar}
                      alt={product.seller.username}
                      className="w-10 h-10 rounded-lg object-cover border border-[#00FF88]/40"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-[#E5F5EC]">
                          {product.seller.username}
                        </span>
                        {product.seller.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF88]" />
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-[#728078]">
                        Reputation: {product.seller.rating * 20}% • {product.seller.salesCount} Sales
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#00FF88] border border-[#00FF88]/30 px-2 py-1 rounded bg-[#003B27]/40">
                    VERIFIED SELLER
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#00FF88]/20">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      onAddToCart(product);
                    }}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#003B27] border border-[#00FF88]/40 text-[#00FF88] hover:bg-[#00FF88] hover:text-black font-mono text-xs font-bold transition-all cursor-pointer"
                    aria-label="Add to cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO CART</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playSuccess();
                      onBuyNow(product);
                    }}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#00FF88] text-black hover:bg-white font-mono text-xs font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                    aria-label="Buy now with demo checkout"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>BUY NOW [DEMO]</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg border font-mono text-xs transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'border-[#FF304F] bg-[#FF304F]/20 text-[#FF304F]'
                      : 'border-[#00FF88]/20 bg-[#050607] text-[#728078] hover:text-[#FF304F]'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span>{isWishlisted ? 'IN YOUR WISHLIST' : 'SAVE TO WISHLIST'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-[#00FF88]/20 flex gap-4 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-2 border-b-2 font-bold cursor-pointer transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#00FF88] text-[#00FF88]'
                  : 'border-transparent text-[#728078] hover:text-white'
              }`}
            >
              OVERVIEW & FEATURES
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`pb-2 border-b-2 font-bold cursor-pointer transition-colors ${
                activeTab === 'specs'
                  ? 'border-[#00FF88] text-[#00FF88]'
                  : 'border-transparent text-[#728078] hover:text-white'
              }`}
            >
              TECHNICAL SPECIFICATIONS
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 border-b-2 font-bold cursor-pointer transition-colors ${
                activeTab === 'reviews'
                  ? 'border-[#00FF88] text-[#00FF88]'
                  : 'border-transparent text-[#728078] hover:text-white'
              }`}
            >
              REVIEWS ({reviews.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <p className="text-sm text-[#E5F5EC] leading-relaxed">
                {product.description}
              </p>

              <div>
                <h4 className="font-mono text-xs text-[#00FF88] uppercase tracking-wider mb-2 font-bold">
                  KEY DELIVERABLES:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#E5F5EC]">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 bg-[#050607] p-2 rounded border border-[#00FF88]/15">
                      <span className="text-[#00FF88] font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-mono text-xs text-[#728078] uppercase tracking-wider mb-2">
                  TAGS:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#003B27]/40 text-[#00FF88] border border-[#00FF88]/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#050607] p-3 rounded-lg border border-[#00FF88]/20 flex items-center gap-3">
                  <FileCode className="w-5 h-5 text-[#00FF88]" />
                  <div>
                    <span className="text-[#728078] text-[10px] block">FILE FORMAT</span>
                    <span className="text-[#E5F5EC] font-bold">{product.specs.fileFormat}</span>
                  </div>
                </div>

                <div className="bg-[#050607] p-3 rounded-lg border border-[#00FF88]/20 flex items-center gap-3">
                  <HardDrive className="w-5 h-5 text-[#00FF88]" />
                  <div>
                    <span className="text-[#728078] text-[10px] block">ARCHIVE SIZE</span>
                    <span className="text-[#E5F5EC] font-bold">{product.specs.fileSize}</span>
                  </div>
                </div>

                <div className="bg-[#050607] p-3 rounded-lg border border-[#00FF88]/20 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#00FF88]" />
                  <div>
                    <span className="text-[#728078] text-[10px] block">LICENSE TYPE</span>
                    <span className="text-[#E5F5EC] font-bold">{product.specs.license}</span>
                  </div>
                </div>

                <div className="bg-[#050607] p-3 rounded-lg border border-[#00FF88]/20 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#00FF88]" />
                  <div>
                    <span className="text-[#728078] text-[10px] block">BUILD VERSION</span>
                    <span className="text-[#E5F5EC] font-bold">{product.specs.version}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Write Review Form */}
              <form onSubmit={handleAddReview} className="bg-[#050607] p-4 rounded-xl border border-[#00FF88]/30 space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-[#00FF88]">WRITE A DEMO REVIEW</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="cursor-pointer p-0.5"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= newRating ? 'fill-[#00FF88] text-[#00FF88]' : 'text-[#728078]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share simulated feedback on asset topology, shader performance, or documentation..."
                  className="w-full bg-[#0B1010] border border-[#00FF88]/20 rounded-lg p-2.5 font-mono text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none h-20"
                  required
                />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#728078]">
                    Reviews are saved into demo state.
                  </span>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#00FF88] text-black font-mono text-xs font-bold hover:bg-white transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Review</span>
                  </button>
                </div>

                {reviewSubmitted && (
                  <p className="text-xs font-mono text-[#00FF88]">
                    ✓ Demo review published successfully!
                  </p>
                )}
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#050607] p-3.5 rounded-xl border border-[#00FF88]/15 space-y-2 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#E5F5EC]">{rev.author}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#003B27] text-[#00FF88] border border-[#00FF88]/30">
                            VERIFIED BUYER
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[#00FF88]">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[#728078] leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-[#728078] block">{rev.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="pt-4 border-t border-[#00FF88]/20">
              <h4 className="font-mono text-xs text-[#00FF88] uppercase tracking-wider mb-3 font-bold">
                RELATED ASSETS IN {product.category.toUpperCase()}:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      soundFx.playClick();
                      onSelectProduct(rel);
                    }}
                    className="p-2.5 rounded-xl bg-[#050607] border border-[#00FF88]/20 hover:border-[#00FF88] transition-all cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-12 h-12 rounded object-cover border border-[#00FF88]/30 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-cyber text-xs text-white truncate">{rel.name}</p>
                      <p className="font-mono text-xs font-bold text-[#00FF88]">
                        {formatCredits(rel.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
