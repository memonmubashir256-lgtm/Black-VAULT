import React, { useState } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { Product, ProductCategory } from '../../types';
import { soundFx } from '../../utils/audio';

interface ProductEditorModalProps {
  product: Product | null; // null if adding new
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const CATEGORIES: ProductCategory[] = [
  'Digital Art',
  'Gaming Assets',
  'UI Templates',
  'Software Demos',
  '3D Models',
  'Collectibles',
  'Developer Tools',
  'Digital Accessories',
];

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState<ProductCategory>(
    product?.category || 'Gaming Assets'
  );
  const [price, setPrice] = useState<number>(product?.price || 120);
  const [description, setDescription] = useState(product?.description || '');
  const [image, setImage] = useState(
    product?.image ||
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80'
  );
  const [fileFormat, setFileFormat] = useState(product?.specs.fileFormat || 'ZIP / GLTF');
  const [fileSize, setFileSize] = useState(product?.specs.fileSize || '64.5 MB');
  const [license, setLicense] = useState(
    product?.specs.license || 'Fictional Commercial License'
  );
  const [stock, setStock] = useState<number>(product?.stock || 50);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccess();

    const savedProduct: Product = {
      id: product?.id || `bv-prod-${Date.now()}`,
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      price: Number(price),
      seller: product?.seller || {
        username: 'RootArchivist',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        rating: 5.0,
        salesCount: 1,
        verified: true,
      },
      rating: product?.rating || 5.0,
      reviewsCount: product?.reviewsCount || 0,
      description: description.trim(),
      features: product?.features || [
        'High fidelity cyberpunk asset',
        'Clean topology and PBR texture map passes',
        'Instant cryptographic download verification',
      ],
      specs: {
        fileFormat,
        fileSize,
        license,
        sha256:
          product?.specs.sha256 ||
          'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        version: product?.specs.version || 'v1.0.0',
      },
      image,
      tags: product?.tags || ['cyberpunk', 'simulation', 'asset'],
      stock: Number(stock),
      dateAdded: product?.dateAdded || new Date().toISOString().split('T')[0],
      isFeatured: product?.isFeatured ?? false,
      isNewArrival: product?.isNewArrival ?? true,
    };

    onSave(savedProduct);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050607]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0B1010] border border-[#00FF88]/40 rounded-2xl p-6 shadow-2xl space-y-4 font-mono text-xs my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#00FF88]/20 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00FF88]" />
            <h3 className="font-cyber font-bold text-white text-base">
              {product ? `EDIT ASSET // ${product.id}` : 'ADD NEW SIMULATED LISTING'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#728078] hover:text-[#00FF88] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#728078] block mb-1 font-bold">ASSET TITLE:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Holographic Cyber Deck 3D"
                className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl p-2.5 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[#728078] block mb-1 font-bold">CATEGORY:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl p-2.5 text-xs text-[#00FF88] focus:border-[#00FF88] focus:outline-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#728078] block mb-1 font-bold">
                DEMO PRICE (BVT CREDITS):
              </label>
              <input
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl p-2.5 text-xs text-[#00FF88] font-bold focus:border-[#00FF88] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[#728078] block mb-1 font-bold">AVAILABLE STOCK UNITS:</label>
              <input
                type="number"
                min="1"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl p-2.5 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[#728078] block mb-1 font-bold">IMAGE URL:</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl p-2.5 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[#728078] block mb-1 font-bold">DESCRIPTION:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Technical summary of this digital product..."
              className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl p-2.5 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none h-20"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[#728078] block mb-1 font-bold">FILE FORMAT:</label>
              <input
                type="text"
                value={fileFormat}
                onChange={(e) => setFileFormat(e.target.value)}
                className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl p-2.5 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-[#728078] block mb-1 font-bold">ARCHIVE SIZE:</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl p-2.5 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-[#728078] block mb-1 font-bold">LICENSE:</label>
              <input
                type="text"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl p-2.5 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#00FF88]/20 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-neutral-700 text-[#728078] hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00FF88] text-black font-bold hover:bg-white transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.3)]"
            >
              SAVE ASSET TO CATALOG
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
