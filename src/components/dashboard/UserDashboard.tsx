import React, { useState } from 'react';
import {
  LayoutDashboard,
  User,
  Package,
  Heart,
  Wallet,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Download,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Lock,
  Key,
  Flame,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { Order, Product, UserProfile, WalletTransaction } from '../../types';
import { WalletManager } from './WalletManager';
import { formatCredits, maskHash, formatTimestamp } from '../../utils/formatters';
import { soundFx } from '../../utils/audio';

interface UserDashboardProps {
  currentUser: UserProfile;
  orders: Order[];
  wishlistProducts: Product[];
  transactions: WalletTransaction[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onUpdateBalance: (newBalance: number, newTx?: WalletTransaction) => void;
  onRemoveWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  orders,
  wishlistProducts,
  transactions,
  onUpdateUser,
  onUpdateBalance,
  onRemoveWishlist,
  onAddToCart,
  onNavigate,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'orders' | 'wishlist' | 'wallet' | 'notifications' | 'settings'
  >('overview');

  // Profile Form state
  const [usernameInput, setUsernameInput] = useState(currentUser.username);
  const [emailInput, setEmailInput] = useState(currentUser.email);
  const [savedProfileNotice, setSavedProfileNotice] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playSuccess();
    onUpdateUser({
      username: usernameInput.trim() || currentUser.username,
      email: emailInput.trim() || currentUser.email,
    });
    setSavedProfileNotice(true);
    setTimeout(() => setSavedProfileNotice(false), 3000);
  };

  const generateNewPgpKey = () => {
    soundFx.playTerminalBeep(1300, 0.05);
    const chars = '0123456789ABCDEF';
    let newKey = '';
    for (let i = 0; i < 40; i++) {
      if (i > 0 && i % 4 === 0) newKey += ' ';
      if (i === 20) newKey += ' ';
      newKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    onUpdateUser({ pgpFingerprint: newKey });
  };

  const downloadOrderReceipt = (order: Order) => {
    soundFx.playClick();
    const manifest = {
      orderId: order.orderNumber,
      date: order.date,
      txHash: order.txHash,
      buyer: currentUser.username,
      status: order.status,
      items: order.items.map((i) => ({
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        sha256: i.product.specs.sha256,
      })),
      totalAmount: order.totalAmount,
      simulationNotice: 'VALIDATED DEMO RUNNER ASSET MANIFEST',
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RECEIPT_${order.orderNumber}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Welcome Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#00FF88] px-2 py-0.5 rounded bg-[#003B27] border border-[#00FF88]/30">
              OPERATOR CONSOLE
            </span>
            <span className="font-mono text-xs text-[#728078]">
              NODE: Tokyo-09 [SIM]
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-cyber font-black text-white mt-1">
            DASHBOARD // {currentUser.username}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('wallet');
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#003B27] border border-[#00FF88]/40 text-[#00FF88] font-mono text-xs font-bold hover:bg-[#00FF88] hover:text-black transition-all cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            <span>TOP UP WALLET</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1 space-y-4">
          {/* User Mini Profile Card */}
          <div className="bg-[#0B1010] border border-[#00FF88]/20 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-12 h-12 rounded-xl object-cover border border-[#00FF88]/40"
              />
              <div className="min-w-0">
                <h3 className="font-cyber font-bold text-white text-sm truncate">
                  {currentUser.username}
                </h3>
                <span className="font-mono text-[11px] text-[#00FF88] block">
                  ROLE: {currentUser.role.toUpperCase()}
                </span>
                <span className="font-mono text-[10px] text-[#728078] block">
                  Joined: {currentUser.joinedDate}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#00FF88]/15 grid grid-cols-2 gap-2 text-center font-mono">
              <div className="bg-[#050607] p-2 rounded-lg border border-[#00FF88]/15">
                <span className="text-[10px] text-[#728078] block">REPUTATION</span>
                <span className="text-xs font-bold text-[#00FF88]">
                  {currentUser.reputation}%
                </span>
              </div>
              <div className="bg-[#050607] p-2 rounded-lg border border-[#00FF88]/15">
                <span className="text-[10px] text-[#728078] block">SECURITY</span>
                <span className="text-xs font-bold text-[#00FF88]">
                  {currentUser.isTwoFactorEnabled ? '2FA ON' : 'STANDARD'}
                </span>
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="bg-[#0B1010] border border-[#00FF88]/20 rounded-2xl p-2 space-y-1 font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setActiveTab('overview');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]/40 font-bold'
                  : 'text-[#728078] hover:text-[#E5F5EC] hover:bg-[#050607]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setActiveTab('wallet');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'wallet'
                  ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]/40 font-bold'
                  : 'text-[#728078] hover:text-[#E5F5EC] hover:bg-[#050607]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wallet className="w-4 h-4" />
                <span>Demo Wallet</span>
              </div>
              <span className="text-[10px] text-[#00FF88] font-bold">
                {currentUser.walletBalance.toFixed(0)} BVT
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setActiveTab('orders');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]/40 font-bold'
                  : 'text-[#728078] hover:text-[#E5F5EC] hover:bg-[#050607]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </div>
              <span className="text-[10px] bg-[#050607] px-1.5 py-0.5 rounded text-[#728078]">
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setActiveTab('wishlist');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]/40 font-bold'
                  : 'text-[#728078] hover:text-[#E5F5EC] hover:bg-[#050607]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
              </div>
              <span className="text-[10px] bg-[#050607] px-1.5 py-0.5 rounded text-[#FF304F]">
                {wishlistProducts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                onNavigate('messages');
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[#728078] hover:text-[#E5F5EC] hover:bg-[#050607] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
              </div>
              <span className="text-[10px] text-[#00FF88]">ENCRYPTED</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setActiveTab('profile');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]/40 font-bold'
                  : 'text-[#728078] hover:text-[#E5F5EC] hover:bg-[#050607]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setActiveTab('settings');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]/40 font-bold'
                  : 'text-[#728078] hover:text-[#E5F5EC] hover:bg-[#050607]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </div>
            </button>

            <div className="pt-2 border-t border-[#00FF88]/15">
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#FF304F] hover:bg-[#FF304F]/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect Node</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Tab: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0B1010] p-4 rounded-2xl border border-[#00FF88]/30 shadow-lg">
                  <span className="text-[11px] font-mono text-[#728078] uppercase block">
                    WALLET BALANCE
                  </span>
                  <span className="text-2xl font-cyber font-bold text-[#00FF88] mt-1 block">
                    {formatCredits(currentUser.walletBalance)}
                  </span>
                  <span className="text-[10px] font-mono text-[#728078] mt-1 block">
                    + {formatCredits(currentUser.escrowBalance)} in Escrow
                  </span>
                </div>

                <div className="bg-[#0B1010] p-4 rounded-2xl border border-[#00FF88]/30 shadow-lg">
                  <span className="text-[11px] font-mono text-[#728078] uppercase block">
                    TOTAL DEMO ORDERS
                  </span>
                  <span className="text-2xl font-cyber font-bold text-white mt-1 block">
                    {orders.length}
                  </span>
                  <span className="text-[10px] font-mono text-[#00FF88] mt-1 block">
                    100% Download Verified
                  </span>
                </div>

                <div className="bg-[#0B1010] p-4 rounded-2xl border border-[#00FF88]/30 shadow-lg">
                  <span className="text-[11px] font-mono text-[#728078] uppercase block">
                    WISHLIST CACHE
                  </span>
                  <span className="text-2xl font-cyber font-bold text-[#FF304F] mt-1 block">
                    {wishlistProducts.length}
                  </span>
                  <span className="text-[10px] font-mono text-[#728078] mt-1 block">
                    Saved for simulated checkout
                  </span>
                </div>
              </div>

              {/* Cyberpunk Activity Volume Chart (SVG Spline) */}
              <div className="bg-[#0B1010] p-5 rounded-2xl border border-[#00FF88]/20 shadow-lg space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#00FF88]" />
                    <h3 className="font-cyber font-bold text-white text-sm">
                      NETWORK SPENDING VELOCITY [SIMULATED 7-DAY BVT]
                    </h3>
                  </div>
                  <span className="text-xs text-[#00FF88] font-bold">TOTAL: 1,840 BVT</span>
                </div>

                {/* SVG Cyber Chart */}
                <div className="h-32 w-full pt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100">
                    <defs>
                      <linearGradient id="cyberChartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00FF88" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#00FF88" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="25" x2="400" y2="25" stroke="#00FF88" strokeOpacity="0.1" strokeDasharray="4 4" />
                    <line x1="0" y1="50" x2="400" y2="50" stroke="#00FF88" strokeOpacity="0.1" strokeDasharray="4 4" />
                    <line x1="0" y1="75" x2="400" y2="75" stroke="#00FF88" strokeOpacity="0.1" strokeDasharray="4 4" />

                    {/* Area under curve */}
                    <path
                      d="M 0,80 Q 50,40 100,65 T 200,30 T 300,50 T 400,20 L 400,100 L 0,100 Z"
                      fill="url(#cyberChartGrad)"
                    />
                    {/* Stroke line */}
                    <path
                      d="M 0,80 Q 50,40 100,65 T 200,30 T 300,50 T 400,20"
                      fill="none"
                      stroke="#00FF88"
                      strokeWidth="2.5"
                    />
                    {/* Nodes */}
                    {[[0, 80], [100, 65], [200, 30], [300, 50], [400, 20]].map(([cx, cy], i) => (
                      <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r="4"
                        fill="#050607"
                        stroke="#00FF88"
                        strokeWidth="2"
                      />
                    ))}
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] text-[#728078] border-t border-[#00FF88]/15 pt-2">
                  <span>DAY 01</span>
                  <span>DAY 02</span>
                  <span>DAY 03</span>
                  <span>DAY 04</span>
                  <span>DAY 05</span>
                  <span>DAY 06</span>
                  <span>TODAY</span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-[#0B1010] p-5 rounded-2xl border border-[#00FF88]/20 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-cyber font-bold text-white text-sm">
                    RECENT COMPLETED ORDERS
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="font-mono text-xs text-[#00FF88] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="font-mono text-xs text-[#728078] py-4 text-center">
                    No simulated orders executed yet. Visit the Marketplace to explore assets.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {orders.slice(0, 3).map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-[#050607] p-3 rounded-xl border border-[#00FF88]/15 flex items-center justify-between font-mono text-xs"
                      >
                        <div>
                          <span className="font-bold text-[#00FF88]">{ord.orderNumber}</span>
                          <span className="text-[#728078] text-[10px] block">
                            {formatTimestamp(ord.date)} • {ord.items.length} Assets
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-white">
                            {formatCredits(ord.totalAmount)}
                          </span>
                          <button
                            type="button"
                            onClick={() => downloadOrderReceipt(ord)}
                            className="p-1.5 rounded bg-[#003B27] text-[#00FF88] hover:bg-[#00FF88] hover:text-black transition-colors cursor-pointer"
                            title="Download Manifest Receipt"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: WALLET */}
          {activeTab === 'wallet' && (
            <WalletManager
              currentUser={currentUser}
              transactions={transactions}
              onUpdateBalance={onUpdateBalance}
            />
          )}

          {/* Tab: ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-[#0B1010] p-5 rounded-2xl border border-[#00FF88]/20 shadow-lg space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-[#00FF88]/15 pb-3">
                <h3 className="font-cyber font-bold text-white text-base">
                  ALL EXECUTED ORDERS ({orders.length})
                </h3>
                <span className="text-xs text-[#728078]">
                  ECDSA SIGNED MANIFESTS
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Package className="w-12 h-12 text-[#728078] mx-auto opacity-50" />
                  <p className="text-xs text-[#728078]">No orders found in your ledger record.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-[#050607] border border-[#00FF88]/20 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00FF88]/15 pb-2 text-xs">
                        <div>
                          <span className="font-bold text-[#00FF88] text-sm">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[#728078] text-[11px] block">
                            Date: {formatTimestamp(ord.date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#003B27] text-[#00FF88] text-[10px] font-bold border border-[#00FF88]/30">
                            {ord.status}
                          </span>
                          <span className="font-bold text-white text-sm">
                            {formatCredits(ord.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {ord.items.map((it) => (
                          <div
                            key={it.product.id}
                            className="flex items-center justify-between text-xs text-[#E5F5EC]"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={it.product.image}
                                alt={it.product.name}
                                className="w-8 h-8 rounded object-cover border border-[#00FF88]/30"
                              />
                              <span className="truncate max-w-[220px]">
                                {it.quantity}x {it.product.name}
                              </span>
                            </div>
                            <span className="font-mono text-[#00FF88]">
                              {formatCredits(it.product.price * it.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Hash & Actions */}
                      <div className="pt-2 border-t border-[#00FF88]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                        <span className="text-[#728078] truncate">
                          TX: {ord.txHash}
                        </span>
                        <button
                          type="button"
                          onClick={() => downloadOrderReceipt(ord)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#003B27] border border-[#00FF88]/40 text-[#00FF88] hover:bg-[#00FF88] hover:text-black font-bold transition-all cursor-pointer text-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>DOWNLOAD ASSET MANIFEST</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="bg-[#0B1010] p-5 rounded-2xl border border-[#00FF88]/20 shadow-lg space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-[#00FF88]/15 pb-3">
                <h3 className="font-cyber font-bold text-white text-base">
                  WISHLIST ITEMS ({wishlistProducts.length})
                </h3>
                <span className="text-xs text-[#728078]">ENCRYPTED BOOKMARKS</span>
              </div>

              {wishlistProducts.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Heart className="w-12 h-12 text-[#728078] mx-auto opacity-40" />
                  <p className="text-xs text-[#728078]">Your wishlist cache is currently empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#050607] border border-[#00FF88]/20 rounded-xl p-3 flex gap-3 items-center justify-between"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 rounded-lg object-cover border border-[#00FF88]/30 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-cyber text-xs font-bold text-white truncate">
                          {p.name}
                        </h4>
                        <span className="text-[10px] text-[#728078] block">{p.category}</span>
                        <span className="text-xs font-bold text-[#00FF88]">
                          {formatCredits(p.price)}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            soundFx.playClick();
                            onAddToCart(p);
                          }}
                          className="px-2.5 py-1 rounded bg-[#003B27] text-[#00FF88] hover:bg-[#00FF88] hover:text-black font-bold text-[10px] transition-all cursor-pointer"
                        >
                          + CART
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveWishlist(p)}
                          className="px-2.5 py-1 rounded border border-[#FF304F]/30 text-[#FF304F] hover:bg-[#FF304F]/20 text-[10px] transition-all cursor-pointer"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-[#0B1010] p-6 rounded-2xl border border-[#00FF88]/20 shadow-lg space-y-6 font-mono">
              <div>
                <h3 className="font-cyber font-bold text-white text-base">
                  OPERATOR PROFILE
                </h3>
                <p className="text-xs text-[#728078] mt-1">
                  Manage your fictional identity and cryptographic credentials in the Blackvault simulation.
                </p>
              </div>

              {savedProfileNotice && (
                <div className="p-3 rounded-lg bg-[#003B27] border border-[#00FF88] text-xs text-[#00FF88] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Operator profile updated in simulation state!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="text-xs text-[#728078] block mb-1 font-bold">
                    OPERATOR USERNAME:
                  </label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl p-3 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-[#728078] block mb-1 font-bold">
                    ENCRYPTED MAIL ALIAS:
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl p-3 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
                    required
                  />
                </div>

                {/* Simulated PGP Key Box */}
                <div className="bg-[#050607] p-3 rounded-xl border border-[#00FF88]/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#728078] flex items-center gap-1.5 font-bold">
                      <Key className="w-3.5 h-3.5 text-[#00FF88]" />
                      SIMULATED PGP FINGERPRINT:
                    </span>
                    <button
                      type="button"
                      onClick={generateNewPgpKey}
                      className="text-[#00FF88] text-[10px] hover:underline cursor-pointer"
                    >
                      [GENERATE NEW]
                    </button>
                  </div>
                  <div className="text-[10px] text-[#E5F5EC] select-all break-all">
                    {currentUser.pgpFingerprint}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#00FF88] text-black font-mono text-xs font-bold hover:bg-white transition-all cursor-pointer"
                >
                  SAVE PROFILE CHANGES
                </button>
              </form>
            </div>
          )}

          {/* Tab: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-[#0B1010] p-6 rounded-2xl border border-[#00FF88]/20 shadow-lg space-y-6 font-mono text-xs">
              <div>
                <h3 className="font-cyber font-bold text-white text-base">
                  SYSTEM & SECURITY SETTINGS
                </h3>
                <p className="text-[#728078] mt-1">
                  Configure simulation parameters, audio triggers, and fictional 2-factor authentication.
                </p>
              </div>

              <div className="space-y-4 max-w-xl">
                <div className="bg-[#050607] p-4 rounded-xl border border-[#00FF88]/20 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">
                      SIMULATED 2-FACTOR AUTHENTICATION (2FA)
                    </span>
                    <span className="text-[11px] text-[#728078]">
                      Require mock hardware token confirmation on high-value orders
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      onUpdateUser({ isTwoFactorEnabled: !currentUser.isTwoFactorEnabled });
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                      currentUser.isTwoFactorEnabled
                        ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]/40'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {currentUser.isTwoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <div className="bg-[#050607] p-4 rounded-xl border border-[#00FF88]/20 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">
                      SIMULATION ROUTING NODE
                    </span>
                    <span className="text-[11px] text-[#728078]">
                      Active hop: JP-TYO-09 (Simulated Latency: 14ms)
                    </span>
                  </div>
                  <span className="text-[#00FF88] font-bold">ONLINE</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
