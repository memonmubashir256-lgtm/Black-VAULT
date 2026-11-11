import React, { useState } from 'react';
import { ShieldAlert, X, Info } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <button
        type="button"
        onClick={() => setMinimized(false)}
        className="fixed bottom-3 left-3 z-40 flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B1010]/90 border border-[#00FF88]/40 text-[#00FF88] font-mono text-[11px] shadow-lg hover:bg-[#003B27] transition-all cursor-pointer"
        aria-label="Show simulation disclaimer"
      >
        <Info className="w-3.5 h-3.5 text-[#00FF88]" />
        <span>SIMULATION INFO</span>
      </button>
    );
  }

  return (
    <div className="bg-[#0B1010] border-b border-[#00FF88]/30 px-3 py-1.5 text-center text-xs font-mono relative z-30 flex items-center justify-between shadow-sm">
      <div className="flex-1 flex items-center justify-center gap-2 text-[#E5F5EC]">
        <ShieldAlert className="w-3.5 h-3.5 text-[#00FF88] shrink-0" />
        <span>
          <strong className="text-[#00FF88]">DEMO ENVIRONMENT:</strong> BLACKVAULT is a fictional cyberpunk marketplace simulation. All assets, users, balances and transactions are demo data for design/educational purposes.
        </span>
      </div>
      <button
        type="button"
        onClick={() => setMinimized(true)}
        className="text-[#728078] hover:text-[#00FF88] p-1 ml-2 transition-colors cursor-pointer"
        aria-label="Minimize simulation disclaimer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
