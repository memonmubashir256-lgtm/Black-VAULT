export type ProductCategory =
  | 'All'
  | 'Digital Art'
  | 'Gaming Assets'
  | 'UI Templates'
  | 'Software Demos'
  | '3D Models'
  | 'Collectibles'
  | 'Developer Tools'
  | 'Digital Accessories';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number; // in BVT (demo credits)
  originalPrice?: number;
  seller: {
    username: string;
    avatar: string;
    rating: number;
    salesCount: number;
    verified: boolean;
  };
  rating: number;
  reviewsCount: number;
  description: string;
  features: string[];
  specs: {
    fileFormat: string;
    fileSize: string;
    license: string;
    sha256: string;
    version: string;
  };
  image: string;
  tags: string[];
  stock: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  dateAdded: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Completed' | 'Processing' | 'Escrow Pending' | 'Delivered';
  paymentMethod: string;
  txHash: string;
  downloadToken: string;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'refund' | 'escrow_hold';
  amount: number;
  description: string;
  timestamp: string;
  txHash: string;
  status: 'Confirmed' | 'Pending';
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: 'user' | 'seller' | 'admin';
  walletBalance: number;
  escrowBalance: number;
  joinedDate: string;
  reputation: number;
  isTwoFactorEnabled: boolean;
  pgpFingerprint: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  authorBadge: string;
  category: string;
  content: string;
  tags: string[];
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  timestamp: string;
  pinned?: boolean;
  comments: CommunityComment[];
}

export interface CommunityComment {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  timestamp: string;
  encrypted: boolean;
  isSelf: boolean;
}

export interface ChatConversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: string;
  online: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  type: 'order' | 'security' | 'system' | 'message';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}
