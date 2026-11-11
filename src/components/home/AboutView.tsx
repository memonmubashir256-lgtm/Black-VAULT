import React from 'react';
import {
  ShieldAlert,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Lock,
  FileCode,
  Radio,
  CheckCircle2,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-mono select-none">
      {/* Title */}
      <div className="border-b border-[#00FF88]/20 pb-6 text-center">
        <span className="text-xs px-2.5 py-0.5 rounded bg-[#003B27] text-[#00FF88] border border-[#00FF88]/30 font-bold uppercase">
          PROJECT ARCHITECTURE & MANIFESTO
        </span>
        <h1 className="text-3xl sm:text-5xl font-cyber font-black text-white mt-3">
          ABOUT BLACKVAULT
        </h1>
        <p className="text-xs sm:text-sm text-[#728078] max-w-xl mx-auto mt-2">
          A cyberpunk underground marketplace simulation crafted for design excellence, Three.js 3D interaction, and educational exploration.
        </p>
      </div>

      {/* Safety & Compliance Box */}
      <div className="bg-[#0B1010] border border-[#00FF88]/40 p-6 rounded-2xl shadow-xl space-y-3">
        <div className="flex items-center gap-2.5 text-[#00FF88]">
          <ShieldAlert className="w-5 h-5 text-[#00FF88]" />
          <h2 className="font-cyber font-bold text-white text-base">
            MANDATORY SIMULATION DISCLAIMER
          </h2>
        </div>
        <p className="text-xs text-[#E5F5EC] leading-relaxed">
          BLACKVAULT is strictly a <strong>fictional, simulated creative experience</strong>.
          None of the listings, transactions, currencies, or user profiles are real.
          No illegal items, contraband, credentials, malware, weapons, or genuine dark web services exist here.
          All balances use in-memory synthetic BVT test credits. No real cryptocurrency, fiat currency, or payment gateways are integrated.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0B1010] p-5 rounded-2xl border border-[#00FF88]/20 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#003B27] border border-[#00FF88]/40 flex items-center justify-center text-[#00FF88]">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-cyber font-bold text-white text-sm">
            Three.js 3D Core
          </h3>
          <p className="text-xs text-[#728078] leading-relaxed">
            Procedurally constructed multi-part cryptographic vault core with rotating gimbal rings, cyber grid terrain, particle vortex, and software WebGL compatibility.
          </p>
        </div>

        <div className="bg-[#0B1010] p-5 rounded-2xl border border-[#00FF88]/20 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#003B27] border border-[#00FF88]/40 flex items-center justify-center text-[#00FF88]">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-cyber font-bold text-white text-sm">
            Simulated Escrow Engine
          </h3>
          <p className="text-xs text-[#728078] leading-relaxed">
            Pure deterministic math models calculate subtotal, promo code reductions, mock escrow collateral, and generate simulated SHA-256 and ECDSA manifests.
          </p>
        </div>

        <div className="bg-[#0B1010] p-5 rounded-2xl border border-[#00FF88]/20 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#003B27] border border-[#00FF88]/40 flex items-center justify-center text-[#00FF88]">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="font-cyber font-bold text-white text-sm">
            Zero-Asset Audio Synth
          </h3>
          <p className="text-xs text-[#728078] leading-relaxed">
            Real-time futuristic sound effects (keystrokes, scanner beeps, glitch sweeps, payment chimes) synthesized purely via Web Audio API oscillators with instant mute toggle.
          </p>
        </div>
      </div>

      {/* Tech Stack Specs */}
      <div className="bg-[#0B1010] p-6 rounded-2xl border border-[#00FF88]/20 space-y-4">
        <h3 className="font-cyber font-bold text-white text-base flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00FF88]" />
          TECHNICAL SYSTEM ARCHITECTURE
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-[#050607] p-3 rounded-xl border border-[#00FF88]/15 space-y-1">
            <span className="text-[#00FF88] font-bold">FRONTEND LAYER:</span>
            <p className="text-[#728078]">
              React 19 + TypeScript + Tailwind CSS v4 + Motion animations
            </p>
          </div>

          <div className="bg-[#050607] p-3 rounded-xl border border-[#00FF88]/15 space-y-1">
            <span className="text-[#00FF88] font-bold">3D SCENE PIPELINE:</span>
            <p className="text-[#728078]">
              Three.js r160+ with RoomEnvironment, procedural geometries, and software WebGL fallbacks
            </p>
          </div>

          <div className="bg-[#050607] p-3 rounded-xl border border-[#00FF88]/15 space-y-1">
            <span className="text-[#00FF88] font-bold">STATE & PERSISTENCE:</span>
            <p className="text-[#728078]">
              Reactive React state with localStorage caching for orders, wallet, and theme settings
            </p>
          </div>

          <div className="bg-[#050607] p-3 rounded-xl border border-[#00FF88]/15 space-y-1">
            <span className="text-[#00FF88] font-bold">ROLE AUTHORIZATION:</span>
            <p className="text-[#728078]">
              Decoupled role verification supporting Standard User and Elevated Root Admin modes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
