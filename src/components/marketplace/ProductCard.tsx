import React from 'react';
import { ShoppingBag, Star, Heart, Eye, CheckCircle2, Shield } from 'lucide-react';
import { Product } from '../../types';
import { formatCredits, maskHash } from '../../utils/formatters';
import { soundFx } from '../../utils/audio';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  isWishlisted: boolean;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = 'grid',
  isWishlisted,
  onViewDetails,
  onAddToCart,
  onToggleWishlist,
}) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playClick();
    onAddToCart(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundFx.playTerminalBeep(980, 0.04);
    onToggleWishlist(product);
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onViewDetails(product)}
        className="group relative bg-[#0B1010] border border-[#00FF88]/20 hover:border-[#00FF88] rounded-xl p-4 transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,255,136,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer"
      >
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-[#050607] border border-[#00FF88]/30">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 cyber-scanlines opacity-40 pointer-events-none" />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#003B27] text-[#00FF88] border border-[#00FF88]/30 uppercase">
                {product.category}
              </span>
              <span className="font-mono text-[10px] text-[#728078]">
                ID: {product.id}
              </span>
            </div>
            <h3 className="font-cyber font-bold text-white group-hover:text-[#00FF88] transition-colors truncate text-sm sm:text-base">
              {product.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-[#728078] font-mono">
              <span className="flex items-center gap-1 text-[#00FF88]">
                <Star className="w-3.5 h-3.5 fill-[#00FF88] text-[#00FF88]" />
                {product.rating} ({product.reviewsCount})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>By {product.seller.username}</span>
                {product.seller.verified && (
                  <CheckCircle2 className="w-3 h-3 text-[#00FF88]" />
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-[#00FF88]/15 pt-3 sm:pt-0">
          <div className="text-right">
            <div className="font-mono text-lg font-bold text-[#00FF88]">
              {formatCredits(product.price)}
            </div>
            {product.originalPrice && (
              <span className="font-mono text-xs text-[#728078] line-through block">
                {formatCredits(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isWishlisted
                  ? 'border-[#FF304F] bg-[#FF304F]/20 text-[#FF304F]'
                  : 'border-[#00FF88]/20 bg-[#050607] text-[#728078] hover:text-[#FF304F]'
              }`}
              title="Add to Wishlist"
              aria-label={`Wishlist ${product.name}`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#003B27] border border-[#00FF88]/40 hover:bg-[#00FF88] hover:text-black font-mono text-xs font-bold text-[#00FF88] transition-all cursor-pointer"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group relative bg-[#0B1010] border border-[#00FF88]/20 hover:border-[#00FF88] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,136,0.18)] flex flex-col justify-between cursor-pointer"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#050607]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 cyber-scanlines opacity-50 pointer-events-none" />

        {/* Category Pill */}
        <div className="absolute top-2.5 left-2.5">
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#050607]/90 text-[#00FF88] border border-[#00FF88]/40 backdrop-blur-sm uppercase">
            {product.category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg border backdrop-blur-sm transition-all cursor-pointer ${
            isWishlisted
              ? 'border-[#FF304F] bg-[#FF304F]/30 text-[#FF304F]'
              : 'border-[#00FF88]/30 bg-[#050607]/80 text-[#728078] hover:text-[#FF304F]'
          }`}
          title="Wishlist"
          aria-label={`Wishlist ${product.name}`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* SHA-256 Checksum Tag */}
        <div className="absolute bottom-1.5 left-2.5 right-2.5 flex items-center justify-between font-mono text-[9px] text-[#728078] bg-[#050607]/80 px-2 py-0.5 rounded border border-[#00FF88]/15">
          <span className="flex items-center gap-1">
            <Shield className="w-2.5 h-2.5 text-[#00FF88]" />
            SHA: {maskHash(product.specs.sha256, 4, 4)}
          </span>
          <span className="text-[#00FF88]">VERIFIED</span>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-cyber font-bold text-white group-hover:text-[#00FF88] transition-colors text-sm sm:text-base line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-[#728078] line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Seller & Rating Bar */}
        <div className="pt-2 border-t border-[#00FF88]/15 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <img
              src={product.seller.avatar}
              alt={product.seller.username}
              className="w-5 h-5 rounded-full object-cover border border-[#00FF88]/30"
            />
            <span className="text-[#E5F5EC] text-[11px] truncate max-w-[80px]">
              {product.seller.username}
            </span>
            {product.seller.verified && (
              <CheckCircle2 className="w-3 h-3 text-[#00FF88]" />
            )}
          </div>

          <div className="flex items-center gap-1 text-[#00FF88] text-[11px]">
            <Star className="w-3 h-3 fill-[#00FF88] text-[#00FF88]" />
            <span>{product.rating}</span>
            <span className="text-[#728078]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#00FF88]/15">
          <div>
            <span className="font-mono text-sm sm:text-base font-bold text-[#00FF88] block">
              {formatCredits(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-[10px] text-[#728078] line-through block -mt-0.5">
                {formatCredits(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundFx.playClick();
                onViewDetails(product);
              }}
              className="p-2 rounded-lg bg-[#050607] border border-[#00FF88]/30 text-[#728078] hover:text-[#00FF88] hover:border-[#00FF88] transition-colors cursor-pointer"
              title="View Technical Details"
              aria-label={`View details for ${product.name}`}
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#003B27] border border-[#00FF88]/40 hover:bg-[#00FF88] hover:text-black font-mono text-xs font-bold text-[#00FF88] transition-all cursor-pointer"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
