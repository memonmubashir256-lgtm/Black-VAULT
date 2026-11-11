import React, { useEffect, useState } from 'react';
import { Terminal, ShieldCheck, Cpu, Database, Radio, FastForward } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  'BIOS REVISION 2.4.99 // BLACKVAULT MICRO-KERNEL INITIALIZING',
  'ESTABLISHING ENCRYPTED PROXY HOPS: [TOR-SIM-01] -> [I2P-NODE-44] -> [ONION-RELAY-9]',
  'MOUNTING VOLATILE MEMORY SPACE... 16384 MB ALLOCATED',
  'INITIALIZING QUANTUM-RESISTANT ECDSA DEMO KEYPAIR...',
  'SYNCING FICTIONAL SIMULATED ESCROW LEDGER AT BLOCK #491,208...',
  'SANDBOX ISOLATION LAYER VERIFIED: ZERO EXTERNAL EXPOSURE CONFIRMED',
  'DECRYPTING BLACKVAULT REPOSITORY DATABASE...',
  'SIMULATION ENVIRONMENT INITIALIZED // ALL SERVICES ONLINE',
];

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    // Check if ?autostart=1 is present
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        onComplete();
        return;
      }
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGlitching(true);
          soundFx.playSuccess();
          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 8) + 4;
        const boundedNext = Math.min(100, next);

        // Update log index based on percentage
        const logIdx = Math.min(
          BOOT_LOGS.length - 1,
          Math.floor((boundedNext / 100) * BOOT_LOGS.length)
        );
        setCurrentLogIndex(logIdx);
        soundFx.playTerminalBeep(700 + logIdx * 60, 0.03);

        return boundedNext;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#050607] flex flex-col items-center justify-center p-4 select-none ${
        isGlitching ? 'filter invert duration-100' : ''
      }`}
    >
      {/* Background Cyber Grid & Scanline */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 cyber-scanlines opacity-50 pointer-events-none" />

      {/* Skip button for accessibility and quick testing */}
      <button
        type="button"
        onClick={() => {
          soundFx.playClick();
          onComplete();
        }}
        className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#00FF88]/40 bg-[#0B1010]/80 text-[#00FF88] font-mono text-xs hover:bg-[#003B27] hover:border-[#00FF88] transition-all cursor-pointer z-10"
        aria-label="Skip boot sequence"
      >
        <FastForward className="w-3.5 h-3.5" />
        <span>SKIP BOOT</span>
      </button>

      <div className="w-full max-w-xl relative z-10">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[#00FF88]/30 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#00FF88] animate-pulse" />
            <span className="font-mono text-xs text-[#00FF88] font-bold tracking-widest uppercase">
              BOOT SEQUENCE // PROXY NODE ACTIVE
            </span>
          </div>
          <span className="font-mono text-xs text-[#728078]">PORT: 3000 [LOCAL-SIM]</span>
        </div>

        {/* Brand Banner */}
        <div className="text-center my-6">
          <div className="inline-block px-3 py-1 rounded bg-[#003B27]/40 border border-[#00FF88]/30 text-[#00FF88] font-mono text-xs tracking-widest mb-3">
            FICTIONAL CYBERPUNK SIMULATION
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-cyber text-white tracking-widest neon-text-green mb-2">
            BLACKVAULT
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#00FF88] tracking-widest uppercase opacity-90">
            UNDERGROUND DIGITAL NETWORK
          </p>
        </div>

        {/* Progress Display */}
        <div className="bg-[#0B1010] p-4 rounded-xl border border-[#00FF88]/30 shadow-2xl space-y-4">
          <div className="flex justify-between items-center font-mono text-xs">
            <span className="text-[#728078] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#00FF88]" />
              INITIALIZING DECRYPTION KERNEL
            </span>
            <span className="text-[#00FF88] font-bold text-sm">{progress}%</span>
          </div>

          {/* Neon Progress Bar */}
          <div className="w-full h-2.5 bg-[#050607] rounded-full overflow-hidden p-0.5 border border-[#00FF88]/40">
            <div
              className="h-full bg-[#00FF88] rounded-full transition-all duration-150 relative"
              style={{
                width: `${progress}%`,
                boxShadow: '0 0 12px #00FF88',
              }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-2 bg-white opacity-80 animate-ping" />
            </div>
          </div>

          {/* Console Log Terminal Window */}
          <div className="h-28 bg-[#050607] rounded-lg p-3 font-mono text-[11px] text-[#728078] overflow-hidden flex flex-col justify-end border border-[#00FF88]/20">
            {BOOT_LOGS.slice(0, currentLogIndex + 1).map((log, idx) => (
              <div
                key={idx}
                className={`truncate leading-relaxed ${
                  idx === currentLogIndex ? 'text-[#00FF88] font-bold' : 'text-[#728078]'
                }`}
              >
                &gt; {log}
              </div>
            ))}
          </div>

          {/* Simulation Disclaimer Badge */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#00FF88]/20 text-[11px] font-mono text-[#728078]">
            <ShieldCheck className="w-4 h-4 text-[#00FF88] shrink-0" />
            <span>
              SANDBOX NOTICE: Fictional simulation environment. No real funds, networks, or dark-web access.
            </span>
          </div>
        </div>

        {/* System Badges */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-center font-mono text-[10px] text-[#728078]">
          <div className="bg-[#0B1010]/60 p-2 rounded border border-[#00FF88]/15 flex items-center justify-center gap-1">
            <Radio className="w-3 h-3 text-[#00FF88]" />
            <span>NODE: ENCRYPTED</span>
          </div>
          <div className="bg-[#0B1010]/60 p-2 rounded border border-[#00FF88]/15 flex items-center justify-center gap-1">
            <Database className="w-3 h-3 text-[#00FF88]" />
            <span>LEDGER: VERIFIED</span>
          </div>
          <div className="bg-[#0B1010]/60 p-2 rounded border border-[#00FF88]/15 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#00FF88]" />
            <span>DEMO: ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
