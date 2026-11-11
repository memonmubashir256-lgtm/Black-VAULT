import React, { useState } from 'react';
import {
  Shield,
  ArrowRight,
  Terminal,
  Activity,
  Layers,
  Radio,
  Lock,
  Cpu,
  Server,
  Zap,
} from 'lucide-react';
import { CyberVaultCanvas } from '../three/CyberVaultCanvas';
import { soundFx } from '../../utils/audio';

interface HeroSectionProps {
  onExploreMarketplace: () => void;
  onExploreCommunity: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreMarketplace,
  onExploreCommunity,
}) => {
  const [activeProbeNode, setActiveProbeNode] = useState('Tokyo-09');
  const [probeResult, setProbeResult] = useState<{ node: string; latency: number; status: string } | null>({
    node: 'Tokyo-09',
    latency: 14,
    status: 'ONLINE // ROUTE VERIFIED',
  });
  const [isProbing, setIsProbing] = useState(false);

  const testNodes = ['Tokyo-09', 'Zurich-Relay', 'Reykjavik-ColdVault', 'Singapore-Mesh'];

  const handleProbeNode = (node: string) => {
    soundFx.playTerminalBeep(1000, 0.05);
    setActiveProbeNode(node);
    setIsProbing(true);
    setProbeResult(null);

    setTimeout(() => {
      setIsProbing(false);
      soundFx.playSuccess();
      setProbeResult({
        node,
        latency: Math.floor(12 + Math.random() * 25),
        status: 'ONLINE // ROUTE VERIFIED [SIMULATED]',
      });
    }, 600);
  };

  return (
    <section className="relative overflow-hidden pt-4 pb-12 select-none">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00FF88]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Simulation Tag & Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#003B27]/40 border border-[#00FF88]/40 text-[#00FF88] font-mono text-xs shadow-[0_0_15px_rgba(0,255,136,0.15)]">
            <Radio className="w-3.5 h-3.5 text-[#00FF88] animate-pulse" />
            <span>FICTIONAL UNDERGROUND NETWORK // DEMO SANDBOX</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-cyber font-black tracking-wider text-white uppercase neon-text-green leading-none">
            ENTER THE UNKNOWN.
          </h1>

          <p className="text-base sm:text-lg font-mono text-[#728078] max-w-2xl mx-auto leading-relaxed">
            Explore a fictional underground digital universe. Browse encrypted shaders, tactical UI kits, 3D cyberdecks, and procedural algorithms in a safe simulated sandbox.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                soundFx.playSuccess();
                onExploreMarketplace();
              }}
              className="px-6 py-3.5 rounded-xl bg-[#00FF88] text-black font-mono text-xs font-bold hover:bg-white transition-all cursor-pointer shadow-[0_0_25px_rgba(0,255,136,0.35)] flex items-center gap-2"
              aria-label="Explore marketplace"
            >
              <span>EXPLORE MARKETPLACE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onExploreCommunity();
              }}
              className="px-6 py-3.5 rounded-xl bg-[#0B1010] border border-[#00FF88]/40 text-[#00FF88] font-mono text-xs font-bold hover:bg-[#003B27] transition-all cursor-pointer flex items-center gap-2"
              aria-label="Enter community simulation"
            >
              <Terminal className="w-4 h-4" />
              <span>THE MESH FORUM</span>
            </button>
          </div>
        </div>

        {/* 3D Cyber Vault Element */}
        <div className="relative">
          <CyberVaultCanvas interactive={true} />
        </div>

        {/* Fictional Statistics Bar (Clearly marked as simulated) */}
        <div className="bg-[#0B1010] border border-[#00FF88]/20 rounded-2xl p-5 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
            <div className="space-y-1 border-r border-[#00FF88]/15 pr-2">
              <span className="text-2xl sm:text-3xl font-cyber font-black text-white block">
                12,840
              </span>
              <span className="text-xs text-[#00FF88] block font-bold">
                FICTIONAL USERS
              </span>
              <span className="text-[10px] text-[#728078] block">Simulated directory</span>
            </div>

            <div className="space-y-1 md:border-r border-[#00FF88]/15 pr-2">
              <span className="text-2xl sm:text-3xl font-cyber font-black text-white block">
                3,250
              </span>
              <span className="text-xs text-[#00FF88] block font-bold">
                DEMO LISTINGS
              </span>
              <span className="text-[10px] text-[#728078] block">Across 8 categories</span>
            </div>

            <div className="space-y-1 border-r border-[#00FF88]/15 pr-2 pt-3 md:pt-0">
              <span className="text-2xl sm:text-3xl font-cyber font-black text-[#00FF88] block">
                98.9%
              </span>
              <span className="text-xs text-[#00FF88] block font-bold">
                SIMULATION UPTIME
              </span>
              <span className="text-[10px] text-[#728078] block">Isolated testnet</span>
            </div>

            <div className="space-y-1 pt-3 md:pt-0">
              <span className="text-2xl sm:text-3xl font-cyber font-black text-white block">
                48,210 BVT
              </span>
              <span className="text-xs text-[#00FF88] block font-bold">
                24H DEMO VOLUME
              </span>
              <span className="text-[10px] text-[#728078] block">No real currency</span>
            </div>
          </div>
        </div>

        {/* Interactive Network Node Probe */}
        <div className="bg-[#0B1010] border border-[#00FF88]/20 rounded-2xl p-5 space-y-4 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00FF88]/15 pb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#00FF88]" />
              <h3 className="font-cyber font-bold text-white text-sm">
                SIMULATED ROUTING NODE PROBE
              </h3>
            </div>
            <span className="text-[11px] text-[#728078]">
              LATENCY DIAGNOSTIC TOOL
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#728078] text-[11px]">SELECT PROBE TARGET:</span>
            {testNodes.map((node) => (
              <button
                key={node}
                type="button"
                onClick={() => handleProbeNode(node)}
                className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-all cursor-pointer ${
                  activeProbeNode === node
                    ? 'bg-[#003B27] border-[#00FF88] text-[#00FF88] font-bold shadow-[0_0_10px_rgba(0,255,136,0.2)]'
                    : 'bg-[#050607] border-[#00FF88]/20 text-[#728078] hover:text-[#E5F5EC]'
                }`}
              >
                {node}
              </button>
            ))}
          </div>

          <div className="bg-[#050607] p-3 rounded-xl border border-[#00FF88]/15 flex items-center justify-between text-xs">
            {isProbing ? (
              <div className="flex items-center gap-2 text-[#00FF88]">
                <span className="w-3 h-3 rounded-full border-2 border-t-transparent border-[#00FF88] animate-spin" />
                <span>PINGING SIMULATED NODE {activeProbeNode}...</span>
              </div>
            ) : probeResult ? (
              <div className="flex flex-wrap items-center justify-between w-full gap-2">
                <span className="text-[#00FF88] font-bold">
                  ✓ {probeResult.node}: {probeResult.status}
                </span>
                <span className="text-[#E5F5EC]">
                  ROUND-TRIP LATENCY: <strong className="text-[#00FF88]">{probeResult.latency} ms</strong>
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
