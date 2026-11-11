import React, { useState } from 'react';
import { X, Lock, Key, ShieldCheck, Terminal, User, ArrowRight } from 'lucide-react';
import { UserProfile } from '../../types';
import { CURRENT_USER, DEMO_ADMIN_USER } from '../../data/initialUsers';
import { soundFx } from '../../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [handle, setHandle] = useState('CipherRunner_09');
  const [passphrase, setPassphrase] = useState('••••••••••••');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthorizing(true);
    soundFx.playTerminalBeep(980, 0.08);

    setTimeout(() => {
      setIsAuthorizing(false);
      soundFx.playSuccess();
      const updatedUser: UserProfile = {
        ...CURRENT_USER,
        username: handle.trim() || CURRENT_USER.username,
      };
      onLoginSuccess(updatedUser);
      onClose();
    }, 800);
  };

  const handleQuickLogin = (user: UserProfile) => {
    soundFx.playSuccess();
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050607]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0B1010] border border-[#00FF88]/40 rounded-2xl p-6 shadow-2xl space-y-5 font-mono text-xs my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00FF88]/20 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#00FF88]" />
            <h3 className="font-cyber font-bold text-white text-base">
              {mode === 'login' ? 'OPERATOR LOGIN // DEMO' : 'REGISTER NEW OPERATOR'}
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

        {/* Demo Fast Logins Box */}
        <div className="bg-[#050607] p-3 rounded-xl border border-[#00FF88]/30 space-y-2">
          <span className="text-[10px] text-[#728078] uppercase block font-bold">
            1-CLICK DEMO AUTHENTICATION CREDENTIALS:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin(CURRENT_USER)}
              className="p-2 rounded-lg bg-[#003B27]/40 border border-[#00FF88]/40 hover:bg-[#003B27] text-left transition-all cursor-pointer"
            >
              <span className="text-[#00FF88] font-bold block text-xs">
                Demo Buyer
              </span>
              <span className="text-[10px] text-[#728078] block">
                {CURRENT_USER.username}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin(DEMO_ADMIN_USER)}
              className="p-2 rounded-lg bg-[#FF304F]/10 border border-[#FF304F]/40 hover:bg-[#FF304F]/20 text-left transition-all cursor-pointer"
            >
              <span className="text-[#FF304F] font-bold block text-xs">
                Root Admin
              </span>
              <span className="text-[10px] text-[#728078] block">
                {DEMO_ADMIN_USER.username}
              </span>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[#728078] block mb-1 font-bold">
              OPERATOR HANDLE:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#728078] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[#728078] block mb-1 font-bold">
              DEMO PASSKEY / PHRASE:
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#728078] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAuthorizing}
            className="w-full py-3 rounded-xl bg-[#00FF88] text-black font-bold hover:bg-white transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.25)] flex items-center justify-center gap-2"
          >
            {isAuthorizing ? (
              <span>VERIFYING DEMO CRYPTOGRAPHIC SESSION...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'CONNECT OPERATOR' : 'INITIALIZE ACCOUNT'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch mode */}
        <div className="text-center pt-2 border-t border-[#00FF88]/15 text-[#728078] text-[11px]">
          {mode === 'login' ? (
            <span>
              Need a simulated identity?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#00FF88] hover:underline cursor-pointer"
              >
                Register Demo Node
              </button>
            </span>
          ) : (
            <span>
              Already connected?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#00FF88] hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
