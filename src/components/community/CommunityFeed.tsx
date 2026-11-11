import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Heart,
  Pin,
  Send,
  Plus,
  Hash,
  Flame,
  Search,
  CheckCircle2,
  X,
} from 'lucide-react';
import { CommunityPost, UserProfile } from '../../types';
import { formatTimestamp } from '../../utils/formatters';
import { soundFx } from '../../utils/audio';

interface CommunityFeedProps {
  posts: CommunityPost[];
  currentUser: UserProfile;
  onAddPost: (post: CommunityPost) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  posts,
  currentUser,
  onAddPost,
  onLikePost,
  onAddComment,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Create Post Modal
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Tech Discussion');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('shaders, webgl');

  const categories = ['All', 'Announcements', 'Tech Discussion', 'Showcase', 'Asset Exchange'];

  const filteredPosts = posts.filter((p) => {
    const matchesCategory = selectedTag === 'All' || p.category === selectedTag;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    soundFx.playSuccess();
    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const post: CommunityPost = {
      id: `post-${Date.now()}`,
      title: newTitle.trim(),
      author: currentUser.username,
      authorAvatar: currentUser.avatar,
      authorBadge: currentUser.role === 'admin' ? 'SYSTEM OPERATOR' : 'NETRUNNER',
      category: newCategory,
      content: newContent.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ['simulation'],
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      timestamp: new Date().toISOString(),
      comments: [],
    };

    onAddPost(post);
    setNewTitle('');
    setNewContent('');
    setIsCreatingPost(false);
  };

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    soundFx.playClick();
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Community Banner */}
      <div className="bg-[#0B1010] border border-[#00FF88]/30 rounded-2xl p-6 mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00FF88]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#003B27] text-[#00FF88] border border-[#00FF88]/30">
                THE MESH // FICTIONAL FORUM
              </span>
              <span className="font-mono text-xs text-[#728078]">
                2,410 SIMULATED ACTIVE NODES
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-cyber font-black text-white">
              UNDERGROUND COMMUNITY FEED
            </h1>
            <p className="font-mono text-xs text-[#728078] mt-1 max-w-xl">
              Discuss GLSL shaders, 3D asset rigging, procedural models, and safe cryptographic demo protocols with fellow simulated netrunners.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setIsCreatingPost(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00FF88] text-black font-mono text-xs font-bold hover:bg-white transition-all cursor-pointer shadow-[0_0_20px_rgba(0,255,136,0.3)] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE TRANSMISSION</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Feed + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Posts Feed */}
        <div className="lg:col-span-3 space-y-4">
          {/* Category Tabs & Search */}
          <div className="bg-[#0B1010] p-3 rounded-xl border border-[#00FF88]/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-mono text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedTag(cat)}
                  className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                    selectedTag === cat
                      ? 'bg-[#003B27] text-[#00FF88] border border-[#00FF88]/40 font-bold'
                      : 'text-[#728078] hover:text-[#E5F5EC]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#728078] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mesh transmissions..."
                className="w-full sm:w-56 bg-[#050607] border border-[#00FF88]/20 rounded-lg pl-8 pr-3 py-1.5 font-mono text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
              />
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className={`bg-[#0B1010] rounded-2xl border p-5 transition-all shadow-md ${
                  post.pinned
                    ? 'border-[#00FF88]/50 shadow-[0_0_20px_rgba(0,255,136,0.1)]'
                    : 'border-[#00FF88]/20 hover:border-[#00FF88]/40'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.author}
                      className="w-10 h-10 rounded-xl object-cover border border-[#00FF88]/30"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-cyber font-bold text-white text-sm">
                          {post.author}
                        </span>
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-[#003B27] text-[#00FF88] border border-[#00FF88]/30">
                          {post.authorBadge}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-[#728078]">
                        {formatTimestamp(post.timestamp)} • in {post.category}
                      </span>
                    </div>
                  </div>

                  {post.pinned && (
                    <div className="flex items-center gap-1 font-mono text-[10px] text-[#00FF88] bg-[#003B27]/40 px-2 py-1 rounded border border-[#00FF88]/30">
                      <Pin className="w-3 h-3" />
                      <span>PINNED TRANSMISSION</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <h3 className="font-cyber font-bold text-white text-base mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-[#E5F5EC] leading-relaxed mb-4">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#050607] text-[#00FF88] border border-[#00FF88]/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Post Footer Actions */}
                <div className="flex items-center justify-between border-t border-[#00FF88]/15 pt-3 font-mono text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playTerminalBeep(980, 0.04);
                        onLikePost(post.id);
                      }}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        post.isLiked ? 'text-[#FF304F]' : 'text-[#728078] hover:text-[#FF304F]'
                      }`}
                      aria-label="Like post"
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveCommentPostId(
                          activeCommentPostId === post.id ? null : post.id
                        )
                      }
                      className="flex items-center gap-1.5 text-[#728078] hover:text-[#00FF88] transition-colors cursor-pointer"
                      aria-label="View comments"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments.length} Comments</span>
                    </button>
                  </div>

                  <span className="text-[10px] text-[#728078]">
                    POST ID: {post.id}
                  </span>
                </div>

                {/* Comments Section */}
                {activeCommentPostId === post.id && (
                  <div className="mt-4 pt-4 border-t border-[#00FF88]/15 space-y-3 font-mono text-xs animate-in fade-in duration-150">
                    {/* Add Comment Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                        placeholder="Write a simulated transmission reply..."
                        className="flex-1 bg-[#050607] border border-[#00FF88]/30 rounded-xl px-3 py-2 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendComment(post.id)}
                        className="px-4 py-2 rounded-xl bg-[#00FF88] text-black font-bold hover:bg-white transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Existing Comments */}
                    <div className="space-y-2 pt-2">
                      {post.comments.map((c) => (
                        <div
                          key={c.id}
                          className="bg-[#050607] p-2.5 rounded-xl border border-[#00FF88]/15 space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-2">
                              <img
                                src={c.authorAvatar}
                                alt={c.author}
                                className="w-4 h-4 rounded-full object-cover"
                              />
                              <span className="font-bold text-[#E5F5EC]">{c.author}</span>
                            </div>
                            <span className="text-[#728078] text-[9px]">
                              {formatTimestamp(c.timestamp)}
                            </span>
                          </div>
                          <p className="text-[#728078] text-xs pl-6">{c.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Right Column: Trending Topics & Mesh Network Stats */}
        <aside className="lg:col-span-1 space-y-4 font-mono text-xs">
          {/* Trending Topics Card */}
          <div className="bg-[#0B1010] border border-[#00FF88]/20 rounded-2xl p-4 space-y-3 shadow-lg">
            <h3 className="font-cyber font-bold text-white text-sm flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#FF304F]" />
              TRENDING TOPICS
            </h3>
            <div className="space-y-2">
              {[
                { tag: 'threejs', count: '142 posts' },
                { tag: 'volumetric-fog', count: '98 posts' },
                { tag: 'cyberdeck', count: '84 posts' },
                { tag: 'escrow-protocol', count: '56 posts' },
                { tag: 'gltf-shaders', count: '41 posts' },
              ].map((item) => (
                <div
                  key={item.tag}
                  onClick={() => setSearchQuery(item.tag)}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#050607] hover:border-[#00FF88]/40 border border-transparent transition-all cursor-pointer"
                >
                  <span className="text-[#00FF88] font-bold">#{item.tag}</span>
                  <span className="text-[10px] text-[#728078]">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Operators Card */}
          <div className="bg-[#0B1010] border border-[#00FF88]/20 rounded-2xl p-4 space-y-3 shadow-lg">
            <h3 className="font-cyber font-bold text-white text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00FF88]" />
              ACTIVE OPERATORS
            </h3>
            <div className="space-y-2">
              {[
                { name: '0xGhost', role: 'Shader Dev', status: 'Online' },
                { name: 'CipherQueen', role: 'UI Architect', status: 'Online' },
                { name: 'Viper_99', role: '3D Modeler', status: 'Online' },
                { name: 'NexusOps', role: 'Support Guard', status: 'Online' },
              ].map((user) => (
                <div
                  key={user.name}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#050607]"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
                    <div>
                      <span className="text-white font-bold block">{user.name}</span>
                      <span className="text-[9px] text-[#728078]">{user.role}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#00FF88]">ACTIVE</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* New Post Modal */}
      {isCreatingPost && (
        <div
          className="fixed inset-0 z-50 bg-[#050607]/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsCreatingPost(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0B1010] border border-[#00FF88]/40 rounded-2xl p-6 shadow-2xl space-y-4 font-mono text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#00FF88]/20 pb-3">
              <h3 className="font-cyber font-bold text-white text-base">
                DISPATCH NEW TRANSMISSION
              </h3>
              <button
                type="button"
                onClick={() => setIsCreatingPost(false)}
                className="text-[#728078] hover:text-[#00FF88] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-[#728078] block mb-1 font-bold">TOPIC TITLE:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Real-time normal map generation benchmark..."
                  className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl p-3 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[#728078] block mb-1 font-bold">CATEGORY:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl p-3 text-xs text-[#00FF88] focus:border-[#00FF88] focus:outline-none cursor-pointer"
                >
                  <option value="Tech Discussion">Tech Discussion</option>
                  <option value="Showcase">Showcase</option>
                  <option value="Asset Exchange">Asset Exchange</option>
                  <option value="Announcements">Announcements</option>
                </select>
              </div>

              <div>
                <label className="text-[#728078] block mb-1 font-bold">CONTENT BODY:</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Transmit your message to the Mesh network..."
                  className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl p-3 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none h-28"
                  required
                />
              </div>

              <div>
                <label className="text-[#728078] block mb-1 font-bold">TAGS (COMMA SEPARATED):</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="threejs, glsl, shaders"
                  className="w-full bg-[#050607] border border-[#00FF88]/30 rounded-xl p-3 text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingPost(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-700 text-[#728078] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#00FF88] text-black font-bold hover:bg-white transition-all cursor-pointer"
                >
                  BROADCAST TRANSMISSION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
