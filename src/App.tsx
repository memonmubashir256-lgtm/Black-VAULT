import React, { useState, useEffect } from 'react';
import { BootSequence } from './components/intro/BootSequence';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/home/HeroSection';
import { CategoryMatrix } from './components/home/CategoryMatrix';
import { AboutView } from './components/home/AboutView';
import { ProductCard } from './components/marketplace/ProductCard';
import { ProductDetailModal } from './components/marketplace/ProductDetailModal';
import { MarketplaceFilters } from './components/marketplace/MarketplaceFilters';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CommunityFeed } from './components/community/CommunityFeed';
import { MessagingTerminal } from './components/messages/MessagingTerminal';
import { AuthModal } from './components/auth/AuthModal';

import {
  Product,
  ProductCategory,
  CartItem,
  Order,
  UserProfile,
  WalletTransaction,
  CommunityPost,
  ChatConversation,
} from './types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from './data/initialProducts';
import { INITIAL_POSTS } from './data/initialPosts';
import { INITIAL_CONVERSATIONS } from './data/initialMessages';
import { CURRENT_USER, DEMO_ADMIN_USER, INITIAL_USERS_DIRECTORY } from './data/initialUsers';
import { soundFx } from './utils/audio';

const ALL_CATEGORIES: ProductCategory[] = [
  'All',
  'Gaming Assets',
  '3D Models',
  'UI Templates',
  'Digital Art',
  'Developer Tools',
  'Software Demos',
  'Collectibles',
  'Digital Accessories',
];

export default function App() {
  const [hasBooted, setHasBooted] = useState(false);
  const [currentView, setCurrentView] = useState<string>('home');

  // Application State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['bv-prod-02', 'bv-prod-05']);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-init-01',
      orderNumber: 'BVT-ORD-849201',
      date: '2026-03-08T12:00:00Z',
      items: [{ product: INITIAL_PRODUCTS[1], quantity: 1 }],
      totalAmount: 142.80,
      status: 'Delivered',
      paymentMethod: 'Simulated Multi-Sig Escrow',
      txHash: '0x8849f2c84021bb77401928374619283746192837',
      downloadToken: 'DL-INIT-TOKEN-99',
    },
  ]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx-01',
      type: 'deposit',
      amount: 1500,
      description: 'Initial Fictional Testnet Credit',
      timestamp: '2026-03-01T09:00:00Z',
      txHash: '0x1234567890abcdef1234567890abcdef12345678',
      status: 'Confirmed',
    },
    {
      id: 'tx-02',
      type: 'purchase',
      amount: 142.80,
      description: 'Order #BVT-ORD-849201 (Neural GLSL)',
      timestamp: '2026-03-08T12:00:00Z',
      txHash: '0x8849f2c84021bb77401928374619283746192837',
      status: 'Confirmed',
    },
  ]);

  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [usersDirectory, setUsersDirectory] = useState<UserProfile[]>(INITIAL_USERS_DIRECTORY);
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);

  // Marketplace Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [maxPrice, setMaxPrice] = useState(600);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Active Modals
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDiscountCode, setCheckoutDiscountCode] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Auto skip boot if ?autostart=1
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        setHasBooted(true);
      }
    }
  }, []);

  // Filter products logic
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesPrice = p.price <= maxPrice;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesPrice && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    // Default featured
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  // Paginated products
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Cart operations
  const handleAddToCart = (product: Product) => {
    soundFx.playClick();
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    soundFx.playClick();
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter((id) => id !== product.id);
      }
      return [...prev, product.id];
    });
  };

  // Buy Now direct trigger
  const handleBuyNow = (product: Product) => {
    setCartItems([{ product, quantity: 1 }]);
    setSelectedProductDetail(null);
    setCheckoutDiscountCode('');
    setIsCheckoutOpen(true);
  };

  // Checkout Success
  const handleOrderSuccess = (order: Order, newWalletBalance: number) => {
    setOrders((prev) => [order, ...prev]);
    setCurrentUser((prev) => ({
      ...prev,
      walletBalance: newWalletBalance,
    }));
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: 'purchase',
        amount: order.totalAmount,
        description: `Order #${order.orderNumber} Checkout`,
        timestamp: new Date().toISOString(),
        txHash: order.txHash,
        status: 'Confirmed',
      },
      ...prev,
    ]);
    setCartItems([]);
  };

  // Wallet updates
  const handleUpdateBalance = (newBalance: number, newTx?: WalletTransaction) => {
    setCurrentUser((prev) => ({ ...prev, walletBalance: newBalance }));
    if (newTx) {
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  // Navigation helper
  const handleNavigate = (view: string, categoryFilter?: string) => {
    soundFx.playClick();
    setCurrentView(view);
    if (categoryFilter && ALL_CATEGORIES.includes(categoryFilter as ProductCategory)) {
      setSelectedCategory(categoryFilter as ProductCategory);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch Role (User vs Admin)
  const handleSwitchUserRole = (role: 'user' | 'admin') => {
    soundFx.playSuccess();
    if (role === 'admin') {
      setCurrentUser(DEMO_ADMIN_USER);
    } else {
      setCurrentUser(CURRENT_USER);
    }
  };

  // Admin Product CRUD handlers
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  // Community handlers
  const handleAddPost = (newPost: CommunityPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
              isLiked: !p.isLiked,
            }
          : p
      )
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: currentUser.username,
            authorAvatar: currentUser.avatar,
            content: text,
            timestamp: new Date().toISOString(),
            likes: 0,
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
  };

  // Messaging handlers
  const handleSendMessage = (conversationId: string, text: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.username,
            recipientId: conv.participantId,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            encrypted: true,
            isSelf: true,
          };
          return {
            ...conv,
            lastMessage: text,
            lastMessageTime: newMsg.timestamp,
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );
  };

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#050607] text-[#E5F5EC] flex flex-col relative">
      {/* Background Cyber Grid & Scanline layers */}
      <div className="fixed inset-0 cyber-grid-bg opacity-25 pointer-events-none" />
      <div className="fixed inset-0 cyber-scanlines opacity-40 pointer-events-none z-30" />

      {/* Cinematic Boot Sequence (Only on initial load or replay) */}
      {!hasBooted && (
        <BootSequence onComplete={() => setHasBooted(true)} />
      )}

      {/* Top Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Main Cyber Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        unreadMessagesCount={1}
        currentUser={currentUser}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSwitchUserRole={handleSwitchUserRole}
      />

      {/* Dynamic View Container */}
      <main className="flex-1 relative z-10">
        {/* VIEW: HOME */}
        {currentView === 'home' && (
          <div className="space-y-12">
            <HeroSection
              onExploreMarketplace={() => handleNavigate('marketplace')}
              onExploreCommunity={() => handleNavigate('community')}
            />

            {/* Featured Listings Carousel / Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#00FF88]/20 pb-4">
                <div>
                  <span className="font-mono text-xs text-[#00FF88] uppercase tracking-wider block">
                    CURATED VAULT PICKS
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-cyber font-black text-white">
                    FEATURED ASSETS
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavigate('marketplace')}
                  className="font-mono text-xs text-[#00FF88] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>VIEW ALL 3,250 DEMO ASSETS</span>
                  <span>→</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products
                  .filter((p) => p.isFeatured)
                  .slice(0, 4)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={wishlistIds.includes(product.id)}
                      onViewDetails={(p) => setSelectedProductDetail(p)}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
              </div>
            </section>

            {/* 8-Department Category Matrix */}
            <CategoryMatrix
              onSelectCategory={(cat) => handleNavigate('marketplace', cat)}
            />
          </div>
        )}

        {/* VIEW: MARKETPLACE */}
        {currentView === 'marketplace' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#003B27] text-[#00FF88] border border-[#00FF88]/30">
                  BLACKVAULT STOREFRONT
                </span>
                <span className="font-mono text-xs text-[#728078]">
                  SIMULATED COMMERCE PROTOCOL
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-cyber font-black text-white">
                EXPLORE DIGITAL MARKETPLACE
              </h1>
            </div>

            {/* Filters Bar */}
            <MarketplaceFilters
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                setCurrentPage(1);
              }}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              sortBy={sortBy}
              onSortChange={(s) => setSortBy(s)}
              viewMode={viewMode}
              onViewModeChange={(m) => setViewMode(m)}
              maxPrice={maxPrice}
              onMaxPriceChange={(val) => {
                setMaxPrice(val);
                setCurrentPage(1);
              }}
              onResetFilters={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSortBy('featured');
                setMaxPrice(600);
                setCurrentPage(1);
              }}
              categories={ALL_CATEGORIES}
              totalResults={sortedProducts.length}
            />

            {/* Product Grid / List */}
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#0B1010] border border-[#00FF88]/20 rounded-2xl p-8 space-y-3 font-mono">
                <h3 className="font-cyber font-bold text-white text-lg">
                  NO SIMULATED ASSETS MATCHED
                </h3>
                <p className="text-xs text-[#728078] max-w-sm mx-auto">
                  Try adjusting your search query, increasing maximum price filter, or selecting another category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setMaxPrice(600);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#00FF88] text-black font-bold text-xs hover:bg-white transition-all cursor-pointer"
                >
                  RESET FILTERS
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
                    : 'space-y-4'
                }
              >
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onViewDetails={(p) => setSelectedProductDetail(p)}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6 font-mono text-xs">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-[#00FF88]/30 bg-[#0B1010] text-[#00FF88] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#003B27] cursor-pointer"
                >
                  PREV
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-8 h-8 rounded-lg font-bold transition-all cursor-pointer ${
                        currentPage === pNum
                          ? 'bg-[#00FF88] text-black shadow-[0_0_10px_rgba(0,255,136,0.3)]'
                          : 'bg-[#0B1010] border border-[#00FF88]/20 text-[#728078] hover:text-white'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-[#00FF88]/30 bg-[#0B1010] text-[#00FF88] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#003B27] cursor-pointer"
                >
                  NEXT
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW: CATEGORIES */}
        {currentView === 'categories' && (
          <div className="py-6">
            <CategoryMatrix
              onSelectCategory={(cat) => handleNavigate('marketplace', cat)}
            />
          </div>
        )}

        {/* VIEW: COMMUNITY */}
        {currentView === 'community' && (
          <CommunityFeed
            posts={posts}
            currentUser={currentUser}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
          />
        )}

        {/* VIEW: MESSAGES */}
        {currentView === 'messages' && (
          <MessagingTerminal
            conversations={conversations}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
          />
        )}

        {/* VIEW: DASHBOARD */}
        {currentView === 'dashboard' && (
          <UserDashboard
            currentUser={currentUser}
            orders={orders}
            wishlistProducts={wishlistProducts}
            transactions={transactions}
            onUpdateUser={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
            onUpdateBalance={handleUpdateBalance}
            onRemoveWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
            onLogout={() => setIsAuthOpen(true)}
          />
        )}

        {/* VIEW: ADMIN */}
        {currentView === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            products={products}
            orders={orders}
            users={usersDirectory}
            posts={posts}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onElevateToAdmin={() => handleSwitchUserRole('admin')}
            onUpdateOrderStatus={(orderId, status) =>
              setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, status } : o))
              )
            }
            onDeletePost={(postId) =>
              setPosts((prev) => prev.filter((p) => p.id !== postId))
            }
          />
        )}

        {/* VIEW: ABOUT */}
        {currentView === 'about' && <AboutView />}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={(code) => {
          setIsCartOpen(false);
          setCheckoutDiscountCode(code);
          setIsCheckoutOpen(true);
        }}
        onExploreMarketplace={() => handleNavigate('marketplace')}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        discountCode={checkoutDiscountCode}
        currentUser={currentUser}
        onOrderSuccess={handleOrderSuccess}
        onDepositFunds={(amount) => {
          const res = handleUpdateBalance(currentUser.walletBalance + amount);
        }}
      />

      {/* Product Details Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        isWishlisted={selectedProductDetail ? wishlistIds.includes(selectedProductDetail.id) : false}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleWishlist={handleToggleWishlist}
        onSelectProduct={(p) => setSelectedProductDetail(p)}
        allProducts={products}
        initialReviews={INITIAL_REVIEWS}
      />

      {/* Auth Demo Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* Cyberpunk Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
