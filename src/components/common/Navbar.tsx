import React, { useState } from 'react';
import {
  Shield,
  ShoppingBag,
  Heart,
  MessageSquare,
  User,
  Volume2,
  VolumeX,
  Menu,
  X,
  Wallet,
  Terminal,
  Layers,
  Users,
  Info,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { formatCredits } from '../../utils/formatters';
import { soundFx } from '../../utils/audio';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, categoryFilter?: string) => void;
  cartCount: number;
  wishlistCount: number;
  unreadMessagesCount: number;
  currentUser: UserProfile;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onSwitchUserRole: (role: 'user' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  cartCount,
  wishlistCount,
  unreadMessagesCount,
  currentUser,
  onOpenCart,
  onOpenAuth,
  onSwitchUserRole,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundFx.isMuted());
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const toggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  const navLinks = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (viewId: string) => {
    soundFx.playClick();
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#050607]/90 backdrop-blur-md border-b border-[#00FF88]/20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="BLACKVAULT Home"
        >
          <div className="w-9 h-9 rounded-lg bg-[#003B27] border border-[#00FF88]/40 flex items-center justify-center group-hover:border-[#00FF88] group-hover:neon-glow-green transition-all">
            <Shield className="w-5 h-5 text-[#00FF88]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-cyber font-black text-lg tracking-wider text-white group-hover:text-[#00FF88] transition-colors">
                BLACKVAULT
              </span>
              <span className="text-[9px] font-mono px-1 rounded bg-[#003B27] text-[#00FF88] border border-[#00FF88]/30">
                v3.2
              </span>
            </div>
            <p className="text-[10px] font-mono text-[#728078] tracking-widest hidden sm:block -mt-1">
              ENCRYPTED SIMULATION
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = currentView === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  active
                    ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]/50 shadow-[0_0_10px_rgba(0,255,136,0.2)]'
                    : 'text-[#728078] hover:text-[#E5F5EC] hover:bg-[#0B1010]'
                }`}
                aria-label={`Navigate to ${link.label}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Synthesizer Mute Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 rounded-lg border border-[#00FF88]/20 bg-[#0B1010] text-[#728078] hover:text-[#00FF88] hover:border-[#00FF88]/40 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Cyber SFX' : 'Mute Cyber SFX'}
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#00FF88]" />}
          </button>

          {/* Demo Wallet Balance Pill */}
          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B1010] border border-[#00FF88]/30 hover:border-[#00FF88] hover:neon-glow-green transition-all cursor-pointer"
            aria-label={`Demo Wallet Balance: ${formatCredits(currentUser.walletBalance)}`}
          >
            <Wallet className="w-4 h-4 text-[#00FF88]" />
            <div className="text-left font-mono leading-none">
              <span className="text-[9px] text-[#728078] block">WALLET [DEMO]</span>
              <span className="text-xs font-bold text-[#00FF88]">
                {formatCredits(currentUser.walletBalance)}
              </span>
            </div>
          </button>

          {/* Messages Button with unread badge */}
          <button
            type="button"
            onClick={() => handleNavClick('messages')}
            className="relative p-2 rounded-lg border border-[#00FF88]/20 bg-[#0B1010] text-[#728078] hover:text-[#00FF88] hover:border-[#00FF88]/40 transition-colors cursor-pointer"
            aria-label={`Messages (${unreadMessagesCount} unread)`}
          >
            <MessageSquare className="w-4 h-4" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00FF88] text-black font-mono text-[9px] font-bold flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            className="relative hidden sm:flex p-2 rounded-lg border border-[#00FF88]/20 bg-[#0B1010] text-[#728078] hover:text-[#FF304F] hover:border-[#FF304F]/40 transition-colors cursor-pointer"
            aria-label={`Wishlist (${wishlistCount} items)`}
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF304F] text-white font-mono text-[9px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onOpenCart();
            }}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#003B27] border border-[#00FF88]/50 text-[#00FF88] hover:bg-[#00FF88] hover:text-black font-mono text-xs font-bold transition-all cursor-pointer"
            aria-label={`Shopping Cart (${cartCount} items)`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden xs:inline">CART</span>
            <span className="w-4 h-4 rounded bg-[#050607] text-[#00FF88] group-hover:bg-black group-hover:text-[#00FF88] text-[10px] flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* User Account / Role Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 p-1 rounded-lg border border-[#00FF88]/30 bg-[#0B1010] hover:border-[#00FF88] transition-colors cursor-pointer"
              aria-label="User account menu"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-7 h-7 rounded object-cover border border-[#00FF88]/40"
              />
              <span className="hidden lg:block font-mono text-xs text-[#E5F5EC] max-w-[100px] truncate">
                {currentUser.username}
              </span>
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0B1010] border border-[#00FF88]/30 shadow-2xl p-2 font-mono text-xs z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-[#00FF88]/20">
                  <p className="text-[10px] text-[#728078] uppercase">CONNECTED OPERATOR</p>
                  <p className="font-bold text-[#E5F5EC] truncate">{currentUser.username}</p>
                  <p className="text-[10px] text-[#00FF88] mt-0.5">
                    ROLE: {currentUser.role.toUpperCase()}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick('dashboard');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-[#E5F5EC] hover:bg-[#003B27] hover:text-[#00FF88] rounded transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Dashboard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick('admin');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-[#E5F5EC] hover:bg-[#003B27] hover:text-[#00FF88] rounded transition-colors"
                  >
                    <Terminal className="w-3.5 h-3.5 text-[#00FF88]" />
                    <span>Admin Panel [CRUD]</span>
                  </button>

                  {/* Role Switcher Demo */}
                  <div className="px-3 py-2 border-t border-[#00FF88]/20 mt-1">
                    <span className="text-[10px] text-[#728078] block mb-1">
                      SIMULATION ROLE:
                    </span>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          onSwitchUserRole('user');
                          setUserDropdownOpen(false);
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-mono text-center transition-all ${
                          currentUser.role === 'user'
                            ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]/40'
                            : 'bg-[#050607] text-[#728078] hover:text-white'
                        }`}
                      >
                        Buyer/User
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSwitchUserRole('admin');
                          setUserDropdownOpen(false);
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-mono text-center transition-all ${
                          currentUser.role === 'admin'
                            ? 'bg-[#FF304F]/20 text-[#FF304F] border border-[#FF304F]/40'
                            : 'bg-[#050607] text-[#728078] hover:text-white'
                        }`}
                      >
                        Root Admin
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-[#728078] hover:text-[#00FF88] hover:bg-[#050607] rounded transition-colors mt-1 border-t border-[#00FF88]/15"
                  >
                    <span>Switch / Auth Demo</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-[#00FF88]/20 bg-[#0B1010] text-[#728078] hover:text-[#00FF88]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1010] border-b border-[#00FF88]/20 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = currentView === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider ${
                  active
                    ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]/50'
                    : 'text-[#728078] hover:text-white hover:bg-[#050607]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#00FF88]/20 flex items-center justify-between">
            <span className="font-mono text-xs text-[#728078]">Demo Wallet Balance:</span>
            <span className="font-mono text-xs text-[#00FF88] font-bold">
              {formatCredits(currentUser.walletBalance)}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
