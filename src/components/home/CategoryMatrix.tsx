import React from 'react';
import {
  Palette,
  Gamepad2,
  Layout,
  Code2,
  Box,
  Gem,
  Terminal,
  Headphones,
  ArrowRight,
} from 'lucide-react';
import { ProductCategory } from '../../types';
import { soundFx } from '../../utils/audio';

interface CategoryMatrixProps {
  onSelectCategory: (category: ProductCategory) => void;
}

const CATEGORIES_DATA: {
  category: ProductCategory;
  icon: React.ElementType;
  description: string;
  count: number;
}[] = [
  {
    category: 'Gaming Assets',
    icon: Gamepad2,
    description: 'Volumetric GLSL shaders, weapon skins, and particle VFX.',
    count: 640,
  },
  {
    category: '3D Models',
    icon: Box,
    description: 'Retrofuturistic cyberdecks, drones, and mecha hard-surfaces.',
    count: 480,
  },
  {
    category: 'UI Templates',
    icon: Layout,
    description: 'Sci-fi holographic HUD kits, Figma tokens, and terminal dashboards.',
    count: 320,
  },
  {
    category: 'Digital Art',
    icon: Palette,
    description: '8K cyberpunk concept art, parallax layers, and vector matrices.',
    count: 510,
  },
  {
    category: 'Developer Tools',
    icon: Terminal,
    description: 'AST code obfuscators, packet route inspectors, and terminal CLI tools.',
    count: 290,
  },
  {
    category: 'Software Demos',
    icon: Code2,
    description: 'Audio frequency visualizers and WebGL steganography sandboxes.',
    count: 180,
  },
  {
    category: 'Collectibles',
    icon: Gem,
    description: 'Encrypted Genesis shards and procedural holographic relics.',
    count: 95,
  },
  {
    category: 'Digital Accessories',
    icon: Headphones,
    description: 'Dark synthwave presets, dystopian audio drones, and terminal fonts.',
    count: 340,
  },
];

export const CategoryMatrix: React.FC<CategoryMatrixProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#00FF88]/20 pb-4">
          <div>
            <span className="font-mono text-xs text-[#00FF88] uppercase tracking-wider block">
              TAXONOMY INDEX // 8 DEPARTMENTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-cyber font-black text-white">
              ASSET CATEGORIES MATRIX
            </h2>
          </div>
          <p className="font-mono text-xs text-[#728078] max-w-sm">
            Select a specialized department to filter verified simulated digital goods.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES_DATA.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.category}
                onClick={() => {
                  soundFx.playClick();
                  onSelectCategory(item.category);
                }}
                className="group relative bg-[#0B1010] border border-[#00FF88]/20 hover:border-[#00FF88] rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.15)] cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#003B27] border border-[#00FF88]/40 flex items-center justify-center text-[#00FF88] group-hover:scale-110 group-hover:neon-glow-green transition-all mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-cyber font-bold text-white text-base group-hover:text-[#00FF88] transition-colors">
                    {item.category}
                  </h3>
                  <p className="text-xs text-[#728078] mt-1.5 leading-relaxed font-mono">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#00FF88]/15 flex items-center justify-between font-mono text-xs">
                  <span className="text-[#00FF88]">{item.count} DEMO ASSETS</span>
                  <ArrowRight className="w-4 h-4 text-[#728078] group-hover:text-[#00FF88] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
