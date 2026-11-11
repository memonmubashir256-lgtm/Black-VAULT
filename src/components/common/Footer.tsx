import React from 'react';
import { Shield, Terminal, Radio, ExternalLink, Cpu, GitBranch } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#050607] border-t border-[#00FF88]/20 font-mono text-xs text-[#728078] mt-20 relative select-none">
      {/* Upper Terminal Diagnostic Strip */}
      <div className="border-b border-[#00FF88]/15 bg-[#0B1010]/50 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#00FF88]">
              <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
              RELAY STATUS: ONLINE [SIMULATED]
            </span>
            <span className="hidden sm:inline text-[#728078]">|</span>
            <span className="hidden sm:inline">PING: 14ms (Tokyo-SimNode)</span>
          </div>

          <div className="flex items-center gap-4 text-[#728078]">
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-[#00FF88]" />
              LOAD: 12.4%
            </span>
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-[#00FF88]" />
              BLOCK: #502,918
            </span>
            <span className="flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5 text-[#00FF88]" />
              DEV BUILD: 2026.11
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#003B27] border border-[#00FF88]/40 flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#00FF88]" />
              </div>
              <span className="font-cyber font-black text-white text-base tracking-wider">
                BLACKVAULT
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#728078]">
              A fictional dark web inspired cyberpunk marketplace simulation designed for creative entertainment, 3D interactive demonstration, and UI/UX architecture.
            </p>
            <div className="text-[10px] text-[#00FF88] bg-[#003B27]/30 border border-[#00FF88]/20 p-2 rounded">
              ENVIRONMENT: ISOLATED TEST SANDBOX
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-cyber text-white uppercase text-xs tracking-wider mb-3 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#00FF88]" />
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('marketplace')}
                  className="hover:text-[#00FF88] transition-colors"
                >
                  Marketplace Index
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('categories')}
                  className="hover:text-[#00FF88] transition-colors"
                >
                  Category Matrix
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('community')}
                  className="hover:text-[#00FF88] transition-colors"
                >
                  The Mesh Community
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-[#00FF88] transition-colors"
                >
                  Operator Dashboard
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="hover:text-[#00FF88] transition-colors text-[#00FF88]"
                >
                  Admin Control Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="font-cyber text-white uppercase text-xs tracking-wider mb-3">
              Asset Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('marketplace')}
                  className="hover:text-[#00FF88] transition-colors"
                >
                  Gaming Shaders & Assets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('marketplace')}
                  className="hover:text-[#00FF88] transition-colors"
                >
                  Tactical UI Templates
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('marketplace')}
                  className="hover:text-[#00FF88] transition-colors"
                >
                  3D Cyberdeck Models
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('marketplace')}
                  className="hover:text-[#00FF88] transition-colors"
                >
                  Developer Tool Demos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('marketplace')}
                  className="hover:text-[#00FF88] transition-colors"
                >
                  Holographic Concept Art
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Safety & Disclaimer Notice */}
          <div className="space-y-3">
            <h4 className="font-cyber text-white uppercase text-xs tracking-wider">
              Simulation Guidelines
            </h4>
            <p className="text-[11px] leading-relaxed">
              All transactions utilize synthetic in-memory BVT test credits. No real cryptocurrency, fiat currency, credit cards, or actual dark web connectivity is supported.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[#728078]">
              <span>SHA-256 CHECK: PASSED</span>
              <span>•</span>
              <span>ZERO TRACKING</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-[#00FF88]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 BLACKVAULT. FICTIONAL CYBERPUNK UNDERGROUND SIMULATION.</p>
          <div className="flex items-center gap-4 text-[#728078]">
            <span className="text-[#00FF88]">ENCRYPTION: AES-256-GCM [SIMULATED]</span>
            <span>RESTRICTED ACCESS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
