import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Lock,
  ShieldCheck,
  Search,
  MoreVertical,
  CheckCheck,
  Radio,
  Zap,
} from 'lucide-react';
import { ChatConversation, ChatMessage, UserProfile } from '../../types';
import { formatTimestamp } from '../../utils/formatters';
import { soundFx } from '../../utils/audio';

interface MessagingTerminalProps {
  conversations: ChatConversation[];
  currentUser: UserProfile;
  onSendMessage: (conversationId: string, text: string) => void;
}

export const MessagingTerminal: React.FC<MessagingTerminalProps> = ({
  conversations,
  currentUser,
  onSendMessage,
}) => {
  const [selectedConvId, setSelectedConvId] = useState<string>(
    conversations[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');
  const [isTypingSimulated, setIsTypingSimulated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation =
    conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    const sentText = inputText.trim();
    setInputText('');
    soundFx.playClick();
    onSendMessage(activeConversation.id, sentText);

    // Simulate contact reply after a brief moment
    setIsTypingSimulated(true);
    setTimeout(() => {
      setIsTypingSimulated(false);
      soundFx.playTerminalBeep(940, 0.05);

      const sampleReplies = [
        `Transmission acknowledged. Encrypted handshake validated on node: ${activeConversation.participantName}.`,
        `Checked the manifest for your request. The demo assets are synced to your vault cache.`,
        `Understood. Signing this communication with our simulated key (0x8F9...2A10).`,
        `Affirmative. The PBR shaders compile cleanly on latest WebGL 2 runtimes. Let me know if you need customized uniforms!`,
      ];
      const randomReply =
        sampleReplies[Math.floor(Math.random() * sampleReplies.length)];

      const replyMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: activeConversation.participantId,
        senderName: activeConversation.participantName,
        recipientId: currentUser.id,
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        encrypted: true,
        isSelf: false,
      };

      activeConversation.messages.push(replyMsg);
      activeConversation.lastMessage = randomReply;
      activeConversation.lastMessageTime = replyMsg.timestamp;
      scrollToBottom();
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Terminal Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#003B27] text-[#00FF88] border border-[#00FF88]/30">
              P2P ENCRYPTED TERMINAL
            </span>
            <span className="font-mono text-xs text-[#728078]">
              SIMULATED ONION ROUTE [ACTIVE]
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-cyber font-black text-white mt-1">
            TERMINAL MESSAGING DISPATCH
          </h1>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#00FF88] bg-[#0B1010] border border-[#00FF88]/30 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-[#00FF88]" />
          <span>END-TO-END ENCRYPTED SIMULATION</span>
        </div>
      </div>

      {/* Main Messaging Window */}
      <div className="bg-[#0B1010] border border-[#00FF88]/30 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[620px]">
        {/* Left: Conversations Directory */}
        <div className="border-r border-[#00FF88]/20 flex flex-col bg-[#050607]">
          {/* Header */}
          <div className="p-4 border-b border-[#00FF88]/15 bg-[#0B1010]">
            <h3 className="font-cyber font-bold text-white text-sm mb-2">
              CONTACT CHANNELS
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#728078] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter contacts..."
                className="w-full bg-[#050607] border border-[#00FF88]/20 rounded-lg pl-8 pr-3 py-1.5 font-mono text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#00FF88]/10">
            {conversations.map((conv) => {
              const isSelected = conv.id === selectedConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedConvId(conv.id);
                  }}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#003B27]/40 border-l-4 border-[#00FF88]'
                      : 'hover:bg-[#0B1010]/50'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={conv.participantAvatar}
                      alt={conv.participantName}
                      className="w-10 h-10 rounded-xl object-cover border border-[#00FF88]/30 shrink-0"
                    />
                    {conv.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00FF88] border-2 border-[#050607] rounded-full animate-pulse" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-cyber text-xs font-bold text-white truncate">
                        {conv.participantName}
                      </h4>
                      <span className="font-mono text-[9px] text-[#728078]">
                        {conv.lastMessageTime}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#00FF88] block truncate">
                      {conv.participantRole}
                    </span>
                    <p className="font-mono text-[11px] text-[#728078] truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Area */}
        <div className="md:col-span-2 flex flex-col justify-between bg-[#0B1010]">
          {/* Chat Header */}
          {activeConversation && (
            <div className="p-4 border-b border-[#00FF88]/20 bg-[#050607] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={activeConversation.participantAvatar}
                    alt={activeConversation.participantName}
                    className="w-9 h-9 rounded-xl object-cover border border-[#00FF88]/40"
                  />
                  {activeConversation.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00FF88] rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="font-cyber font-bold text-white text-sm">
                    {activeConversation.participantName}
                  </h3>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-[#728078]">
                    <span className="text-[#00FF88]">
                      {activeConversation.online ? 'CONNECTED [ONLINE]' : 'STANDBY'}
                    </span>
                    <span>•</span>
                    <span>PGP: VERIFIED</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#00FF88]">
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CHANNEL #09</span>
              </div>
            </div>
          )}

          {/* Messages Scroll View */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            {/* Encryption notice at start of chat */}
            <div className="p-2.5 rounded-lg bg-[#050607] border border-[#00FF88]/20 text-center text-[10px] text-[#728078] max-w-sm mx-auto">
              Simulated end-to-end chat channel established. Messages are encrypted locally in memory.
            </div>

            {activeConversation?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.isSelf ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 leading-relaxed ${
                    msg.isSelf
                      ? 'bg-[#003B27] text-[#E5F5EC] border border-[#00FF88]/40 shadow-[0_0_10px_rgba(0,255,136,0.15)] rounded-br-none'
                      : 'bg-[#050607] text-[#E5F5EC] border border-[#00FF88]/20 rounded-bl-none'
                  }`}
                >
                  <p className="text-xs">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-[#728078] mt-1 px-1">
                  <span>{msg.timestamp}</span>
                  {msg.isSelf && <CheckCheck className="w-3 h-3 text-[#00FF88]" />}
                </div>
              </div>
            ))}

            {isTypingSimulated && (
              <div className="flex items-center gap-1.5 text-[11px] text-[#00FF88] font-mono pl-2">
                <span className="w-1.5 h-1.5 bg-[#00FF88] rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-[#00FF88] rounded-full animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 bg-[#00FF88] rounded-full animate-bounce delay-200" />
                <span className="ml-1 text-[#728078]">
                  {activeConversation?.participantName} is composing encrypted response...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Message Input */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-[#00FF88]/20 bg-[#050607] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Transmit message to simulated contact..."
              className="flex-1 bg-[#0B1010] border border-[#00FF88]/30 rounded-xl px-4 py-2.5 font-mono text-xs text-[#E5F5EC] focus:border-[#00FF88] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#00FF88] text-black font-mono text-xs font-bold hover:bg-white transition-all cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.3)] flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">SEND</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
