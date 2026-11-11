import React, { useState } from 'react';
import {
  ShieldAlert,
  Terminal,
  Package,
  Layers,
  Users,
  ShoppingBag,
  Star,
  MessageSquare,
  BarChart3,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Radio,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import {
  Product,
  ProductCategory,
  Order,
  UserProfile,
  CommunityPost,
} from '../../types';
import { ProductEditorModal } from './ProductEditorModal';
import { formatCredits, maskHash, formatTimestamp } from '../../utils/formatters';
import { soundFx } from '../../utils/audio';

interface AdminDashboardProps {
  currentUser: UserProfile;
  products: Product[];
  orders: Order[];
  users: UserProfile[];
  posts: CommunityPost[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onElevateToAdmin: () => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onDeletePost: (postId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  products,
  orders,
  users,
  posts,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onElevateToAdmin,
  onUpdateOrderStatus,
  onDeletePost,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'products'
    | 'categories'
    | 'users'
    | 'orders'
    | 'community'
    | 'analytics'
    | 'settings'
  >('overview');

  // Search in tabs
  const [productSearch, setProductSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Modals & Dialogs
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // If user is not admin, show simulated gate
  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center font-mono">
        <div className="bg-[#0B1010] border border-[#FF304F]/40 p-8 rounded-2xl shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FF304F]/10 border border-[#FF304F] flex items-center justify-center mx-auto text-[#FF304F] shadow-[0_0_20px_rgba(255,48,79,0.3)]">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-cyber font-bold text-white tracking-wider">
              RESTRICTED ROOT PROTOCOL
            </h2>
            <p className="text-xs text-[#728078] mt-2 leading-relaxed">
              ACCESS DENIED. Your current operator profile does not possess ROOT_ADMIN permissions.
              In this simulation, you can instantly elevate your credentials for demonstration.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={() => {
                soundFx.playSuccess();
                onElevateToAdmin();
              }}
              className="px-6 py-3 rounded-xl bg-[#00FF88] text-black font-mono text-xs font-bold hover:bg-white transition-all cursor-pointer shadow-[0_0_20px_rgba(0,255,136,0.3)] flex items-center gap-2 mx-auto"
            >
              <Unlock className="w-4 h-4" />
              <span>ELEVATE TO ROOT ADMIN [DEMO]</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter products in admin
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Total simulated GMV
  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 48200;

  const handleOpenAdd = () => {
    soundFx.playClick();
    setEditingProduct(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    soundFx.playClick();
    setEditingProduct(p);
    setIsEditorOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingProductId) {
      soundFx.playGlitch();
      onDeleteProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-mono">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded bg-[#003B27] text-[#00FF88] border border-[#00FF88]/30 font-bold">
              ROOT ENCLAVE ACCESS
            </span>
            <span className="text-xs text-[#728078]">OPERATOR: {currentUser.username}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-cyber font-black text-white mt-1">
            BLACKVAULT ADMIN CONTROL PANEL
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00FF88] text-black text-xs font-bold hover:bg-white transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.25)]"
          >
            <Plus className="w-4 h-4" />
            <span>ADD NEW ASSET</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Admin Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-2">
          <div className="bg-[#0B1010] border border-[#00FF88]/20 rounded-2xl p-2 space-y-1 text-xs">
            {[
              { id: 'overview', label: 'Overview Metrics', icon: Terminal },
              { id: 'products', label: 'Manage Products', icon: Package, count: products.length },
              { id: 'categories', label: 'Categories Matrix', icon: Layers },
              { id: 'users', label: 'Fictional Users', icon: Users, count: users.length },
              { id: 'orders', label: 'Demo Orders', icon: ShoppingBag, count: orders.length },
              { id: 'community', label: 'Community Posts', icon: MessageSquare, count: posts.length },
              { id: 'analytics', label: 'Simulated Analytics', icon: BarChart3 },
              { id: 'settings', label: 'Ledger Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab(item.id as any);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    active
                      ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]/40 font-bold'
                      : 'text-[#728078] hover:text-[#E5F5EC] hover:bg-[#050607]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className="text-[10px] bg-[#050607] px-1.5 py-0.5 rounded text-[#728078]">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="bg-[#0B1010] border border-[#00FF88]/20 rounded-2xl p-4 space-y-2 text-[11px] text-[#728078]">
            <div className="flex justify-between">
              <span>SYSTEM KERNEL:</span>
              <span className="text-[#00FF88]">ONLINE</span>
            </div>
            <div className="flex justify-between">
              <span>ACTIVE ESCROW:</span>
              <span className="text-white">12,500 BVT</span>
            </div>
            <div className="flex justify-between">
              <span>DISPUTE RATE:</span>
              <span className="text-[#00FF88]">0.01% [DEMO]</span>
            </div>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="lg:col-span-3 space-y-6">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-[#0B1010] p-4 rounded-2xl border border-[#00FF88]/30">
                  <span className="text-[10px] text-[#728078] uppercase block">
                    SIMULATED GMV VOLUME
                  </span>
                  <span className="text-xl sm:text-2xl font-cyber font-bold text-[#00FF88] mt-1 block">
                    {formatCredits(totalGMV)}
                  </span>
                  <span className="text-[10px] text-[#00FF88] mt-1 block">+18.4% this week</span>
                </div>

                <div className="bg-[#0B1010] p-4 rounded-2xl border border-[#00FF88]/30">
                  <span className="text-[10px] text-[#728078] uppercase block">
                    ACTIVE CATALOG ASSETS
                  </span>
                  <span className="text-xl sm:text-2xl font-cyber font-bold text-white mt-1 block">
                    {products.length}
                  </span>
                  <span className="text-[10px] text-[#728078] mt-1 block">8 Categories</span>
                </div>

                <div className="bg-[#0B1010] p-4 rounded-2xl border border-[#00FF88]/30">
                  <span className="text-[10px] text-[#728078] uppercase block">
                    REGISTERED NETRUNNERS
                  </span>
                  <span className="text-xl sm:text-2xl font-cyber font-bold text-white mt-1 block">
                    12,840
                  </span>
                  <span className="text-[10px] text-[#00FF88] mt-1 block">Simulated directory</span>
                </div>

                <div className="bg-[#0B1010] p-4 rounded-2xl border border-[#00FF88]/30">
                  <span className="text-[10px] text-[#728078] uppercase block">
                    ESCROW HEALTH
                  </span>
                  <span className="text-xl sm:text-2xl font-cyber font-bold text-[#00FF88] mt-1 block">
                    99.8%
                  </span>
                  <span className="text-[10px] text-[#728078] mt-1 block">Multi-sig verified</span>
                </div>
              </div>

              {/* Quick Products Overview */}
              <div className="bg-[#0B1010] p-5 rounded-2xl border border-[#00FF88]/20 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-cyber font-bold text-white text-sm">
                    CATALOG INVENTORY SNEAK PEEK
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('products')}
                    className="text-xs text-[#00FF88] hover:underline"
                  >
                    View All Products
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] text-[#728078] uppercase bg-[#050607]">
                      <tr>
                        <th className="py-2 px-3">PRODUCT</th>
                        <th className="py-2 px-3">CATEGORY</th>
                        <th className="py-2 px-3">PRICE</th>
                        <th className="py-2 px-3">STOCK</th>
                        <th className="py-2 px-3">SELLER</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#00FF88]/10">
                      {products.slice(0, 5).map((p) => (
                        <tr key={p.id}>
                          <td className="py-2.5 px-3 flex items-center gap-2">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-7 h-7 rounded object-cover border border-[#00FF88]/30 shrink-0"
                            />
                            <span className="text-white font-bold truncate max-w-[180px]">
                              {p.name}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[#728078]">{p.category}</td>
                          <td className="py-2.5 px-3 text-[#00FF88] font-bold">
                            {formatCredits(p.price)}
                          </td>
                          <td className="py-2.5 px-3 text-[#E5F5EC]">{p.stock}</td>
                          <td className="py-2.5 px-3 text-[#728078]">{p.seller.username}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PRODUCTS MANAGEMENT (CRUD) */}
          {activeTab === 'products' && (
            <div className="bg-[#0B1010] p-5 rounded-2xl border border-[#00FF88]/20 shadow-lg space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-[#728078] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by name, category, or ID..."
                    className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl pl-8 pr-3 py-2 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00FF88] text-black font-bold hover:bg-white transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD ASSET</span>
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] text-[#728078] uppercase bg-[#050607] border-b border-[#00FF88]/15">
                    <tr>
                      <th className="py-3 px-3">ASSET</th>
                      <th className="py-3 px-3">CATEGORY</th>
                      <th className="py-3 px-3">PRICE</th>
                      <th className="py-3 px-3">STOCK</th>
                      <th className="py-3 px-3">REPUTATION</th>
                      <th className="py-3 px-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#00FF88]/10">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#050607]/40 transition-colors">
                        <td className="py-3 px-3 flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-9 h-9 rounded-lg object-cover border border-[#00FF88]/30 shrink-0"
                          />
                          <div>
                            <span className="font-cyber font-bold text-white block truncate max-w-[200px]">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-[#728078]">ID: {p.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-[#728078]">{p.category}</td>
                        <td className="py-3 px-3 font-bold text-[#00FF88]">
                          {formatCredits(p.price)}
                        </td>
                        <td className="py-3 px-3 text-[#E5F5EC]">{p.stock}</td>
                        <td className="py-3 px-3 text-[#728078]">
                          ★ {p.rating} ({p.reviewsCount})
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(p)}
                              className="p-1.5 rounded-lg bg-[#003B27] text-[#00FF88] hover:bg-[#00FF88] hover:text-black transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingProductId(p.id)}
                              className="p-1.5 rounded-lg bg-[#FF304F]/20 text-[#FF304F] hover:bg-[#FF304F] hover:text-white transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: USERS DIRECTORY */}
          {activeTab === 'users' && (
            <div className="bg-[#0B1010] p-5 rounded-2xl border border-[#00FF88]/20 shadow-lg space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-[#00FF88]/15 pb-3">
                <h3 className="font-cyber font-bold text-white text-base">
                  FICTIONAL USERS DIRECTORY ({users.length})
                </h3>
                <span className="text-xs text-[#00FF88]">SANDBOX PROFILES</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] text-[#728078] uppercase bg-[#050607]">
                    <tr>
                      <th className="py-2.5 px-3">OPERATOR</th>
                      <th className="py-2.5 px-3">ROLE</th>
                      <th className="py-2.5 px-3">DEMO BALANCE</th>
                      <th className="py-2.5 px-3">REPUTATION</th>
                      <th className="py-2.5 px-3">JOINED</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#00FF88]/10">
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="py-3 px-3 flex items-center gap-2">
                          <img
                            src={u.avatar}
                            alt={u.username}
                            className="w-7 h-7 rounded object-cover border border-[#00FF88]/30"
                          />
                          <div>
                            <span className="text-white font-bold block">{u.username}</span>
                            <span className="text-[10px] text-[#728078]">{u.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === 'admin'
                                ? 'bg-[#FF304F]/20 text-[#FF304F]'
                                : u.role === 'seller'
                                ? 'bg-[#003B27] text-[#00FF88]'
                                : 'bg-neutral-800 text-neutral-300'
                            }`}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-[#00FF88]">
                          {formatCredits(u.walletBalance)}
                        </td>
                        <td className="py-3 px-3 text-[#E5F5EC]">{u.reputation}%</td>
                        <td className="py-3 px-3 text-[#728078]">{u.joinedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: DEMO ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="bg-[#0B1010] p-5 rounded-2xl border border-[#00FF88]/20 shadow-lg space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-[#00FF88]/15 pb-3">
                <h3 className="font-cyber font-bold text-white text-base">
                  ORDERS & ESCROW SETTLEMENT ({orders.length})
                </h3>
              </div>

              {orders.length === 0 ? (
                <p className="text-center py-8 text-[#728078]">No orders recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-[#050607] p-4 rounded-xl border border-[#00FF88]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#00FF88] text-sm">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[#728078] text-[11px]">
                            • {formatTimestamp(ord.date)}
                          </span>
                        </div>
                        <div className="text-[#728078] text-[11px] mt-1">
                          Items: {ord.items.map((i) => i.product.name).join(', ')}
                        </div>
                        <div className="text-[10px] text-[#728078] mt-0.5">
                          TX: {maskHash(ord.txHash, 8, 8)}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white text-sm">
                          {formatCredits(ord.totalAmount)}
                        </span>
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(ord.id, e.target.value as Order['status'])
                          }
                          className="bg-[#0B1010] border border-[#00FF88]/30 text-[#00FF88] px-2 py-1 rounded text-xs focus:outline-none cursor-pointer"
                        >
                          <option value="Delivered">Delivered</option>
                          <option value="Completed">Completed</option>
                          <option value="Processing">Processing</option>
                          <option value="Escrow Pending">Escrow Pending</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: COMMUNITY MODERATION */}
          {activeTab === 'community' && (
            <div className="bg-[#0B1010] p-5 rounded-2xl border border-[#00FF88]/20 shadow-lg space-y-4 text-xs">
              <h3 className="font-cyber font-bold text-white text-base">
                COMMUNITY TRANSMISSION MODERATION ({posts.length})
              </h3>
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-[#050607] p-3 rounded-xl border border-[#00FF88]/20 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-white">{post.title}</h4>
                      <span className="text-[10px] text-[#728078]">
                        Author: {post.author} • Category: {post.category} • {post.likes} Likes
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeletePost(post.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#FF304F]/20 text-[#FF304F] hover:bg-[#FF304F] hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      Remove Post
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="bg-[#0B1010] p-6 rounded-2xl border border-[#00FF88]/20 shadow-lg space-y-6 text-xs">
              <div>
                <h3 className="font-cyber font-bold text-white text-base">
                  SIMULATED LEDGER ANALYTICS
                </h3>
                <p className="text-[#728078] mt-1">
                  Synthetic network metrics, category distribution, and fictional transaction load.
                </p>
              </div>

              {/* Category Breakdown Bars */}
              <div className="space-y-3">
                <span className="font-bold text-[#00FF88] block uppercase">
                  POPULAR ASSET CATEGORIES BY TRANSACTION RATIO:
                </span>
                {[
                  { cat: 'Gaming Shaders & Assets', pct: 38 },
                  { cat: '3D Cyberdeck Models', pct: 24 },
                  { cat: 'UI Dashboards & HUD Kits', pct: 20 },
                  { cat: 'Developer Tools', pct: 12 },
                  { cat: 'Collectibles & Shards', pct: 6 },
                ].map((item) => (
                  <div key={item.cat} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white">{item.cat}</span>
                      <span className="text-[#00FF88] font-bold">{item.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#050607] rounded-full overflow-hidden border border-[#00FF88]/20">
                      <div
                        className="h-full bg-[#00FF88] rounded-full"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS & CATEGORIES */}
          {(activeTab === 'settings' || activeTab === 'categories') && (
            <div className="bg-[#0B1010] p-6 rounded-2xl border border-[#00FF88]/20 shadow-lg space-y-4 text-xs">
              <h3 className="font-cyber font-bold text-white text-base">
                SIMULATION LEDGER CONFIGURATION
              </h3>
              <p className="text-[#728078]">
                Configure internal simulation escrow fee, default gas parameters, and active nodes.
              </p>
              <div className="bg-[#050607] p-4 rounded-xl border border-[#00FF88]/20 space-y-2">
                <div className="flex justify-between">
                  <span>ESCROW FEE:</span>
                  <span className="text-[#00FF88]">2.0%</span>
                </div>
                <div className="flex justify-between">
                  <span>SANDBOX ISOLATION:</span>
                  <span className="text-[#00FF88]">STRICT [SAFE]</span>
                </div>
                <div className="flex justify-between">
                  <span>HASH ALGORITHM:</span>
                  <span className="text-white">SHA-256 + ECDSA</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Product Add / Edit Modal */}
      <ProductEditorModal
        product={editingProduct}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={(saved) => {
          if (editingProduct) {
            onUpdateProduct(saved);
          } else {
            onAddProduct(saved);
          }
        }}
      />

      {/* Delete Confirmation Dialog */}
      {deletingProductId && (
        <div
          className="fixed inset-0 z-50 bg-[#050607]/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setDeletingProductId(null)}
        >
          <div
            className="w-full max-w-sm bg-[#0B1010] border border-[#FF304F] rounded-2xl p-6 shadow-2xl space-y-4 text-center font-mono text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-[#FF304F]/20 border border-[#FF304F] flex items-center justify-center mx-auto text-[#FF304F]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-cyber font-bold text-white text-base">
                DELETE ASSET FROM LEDGER?
              </h3>
              <p className="text-[#728078] text-xs mt-1">
                Are you sure you want to purge this product from the simulated catalog?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProductId(null)}
                className="py-2.5 rounded-xl border border-neutral-700 text-[#728078] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-2.5 rounded-xl bg-[#FF304F] text-white font-bold hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                CONFIRM DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
