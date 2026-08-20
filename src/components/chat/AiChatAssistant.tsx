import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Sparkles,
  Send,
  X,
  Bot,
  ArrowRight,
  Package,
  ShieldCheck,
  Headphones,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Tag,
  Heart,
  ChevronRight,
  Lock
} from 'lucide-react';
import { ApiChatResponse, ApiChatAction } from '../../types';
import { handleApiV1Request } from '../../services/apiCoreService';
import { Analytics } from '../../services/analyticsService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actions?: ApiChatAction[];
  orderLookupResult?: ApiChatResponse['orderLookupResult'];
  ticketOffer?: ApiChatResponse['ticketOffer'];
  createdTicket?: ApiChatResponse['createdTicket'];
  relatedProducts?: ApiChatResponse['relatedProducts'];
  sourcesUsed?: string[];
  isError?: boolean;
}

export const AiChatAssistant: React.FC = () => {
  const {
    products,
    orders,
    customOrders,
    policies,
    currentUser,
    isUserLoggedIn,
    setIsAuthModalOpen,
    setCurrentView,
    setSelectedProductId,
    setSelectedTrackingOrderId,
    createTicket,
    formatPrice
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string>(() => `conv_${Date.now()}`);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      text: `Welcome to **HARCONXS Atelier**! I am your AI concierge.\n\nI can assist you with:\n- **Bespoke Luxury Gifts & Jewelry** (Men, Women, Couples)\n- **Custom 3D Laser Engraving & Briefs** (#CO Quotes)\n- **Digital Couple Sanctuaries** (Live counters & subdomains)\n- **Bot Panels & Developer APIs**\n- **Authenticated Live Order & Courier Tracking**`,
      timestamp: new Date().toISOString(),
      sourcesUsed: ['HARCONXS Atelier Master Knowledge Base (v3.0)']
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeSuggestions, setActiveSuggestions] = useState<string[]>([
    'Where is my order?',
    'Couple gifts under $50',
    'How do custom orders work?',
    'What is a couple website?',
    'What are shipping & delivery times?'
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (userText: string) => {
    if (!userText.trim() || isTyping) return;

    const query = userText.trim();
    const userMsgId = `usr_${Date.now()}`;

    Analytics.trackChatStarted({ initialTopic: query, source: 'ai_concierge' });

    setMessages(prev => [
      ...prev,
      {
        id: userMsgId,
        role: 'user',
        text: query,
        timestamp: new Date().toISOString()
      }
    ]);
    setInput('');
    setIsTyping(true);

    try {
      // Execute through the private internal HARCONXS API engine (/api/v1/chat)
      // Note: This calls the server-side API handler without exposing any AI API keys to the browser
      let chatResponseData: ApiChatResponse;

      try {
        const fetchRes = await fetch('/api/v1/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-HARCONXS-Internal': 'true'
          },
          body: JSON.stringify({
            message: query,
            conversationId,
            customerId: currentUser?.id,
            customerEmail: currentUser?.email,
            context: {
              customerName: currentUser?.name,
              isLoggedIn: isUserLoggedIn
            }
          })
        });

        if (fetchRes.ok) {
          const json = await fetchRes.json();
          chatResponseData = json.data;
        } else {
          throw new Error('API server returned error');
        }
      } catch {
        // Fallback to internal direct handler with full grounded store context
        const localApiResult = await handleApiV1Request({
          method: 'POST',
          path: '/chat',
          headers: {
            'x-harconxs-api-key': 'hx_live_internal_chat_client'
          },
          body: {
            message: query,
            conversationId,
            customerId: currentUser?.id,
            customerEmail: currentUser?.email,
            context: {
              customerName: currentUser?.name,
              isLoggedIn: isUserLoggedIn
            }
          },
          storeContext: {
            products,
            orders,
            customOrders,
            policies
          }
        });

        chatResponseData = localApiResult.body.data;
      }

      if (chatResponseData) {
        if (chatResponseData.conversationId) {
          setConversationId(chatResponseData.conversationId);
        }

        if (chatResponseData.suggestions && chatResponseData.suggestions.length > 0) {
          setActiveSuggestions(chatResponseData.suggestions);
        }

        setMessages(prev => [
          ...prev,
          {
            id: `asst_${Date.now()}`,
            role: 'assistant',
            text: chatResponseData.reply,
            timestamp: chatResponseData.timestamp || new Date().toISOString(),
            actions: chatResponseData.actions,
            orderLookupResult: chatResponseData.orderLookupResult,
            ticketOffer: chatResponseData.ticketOffer,
            createdTicket: chatResponseData.createdTicket,
            relatedProducts: chatResponseData.relatedProducts,
            sourcesUsed: chatResponseData.sourcesUsed
          }
        ]);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          text: `I apologize, but our secure connection experienced a brief interruption. Our Artisan Concierge team remains available to assist you.`,
          timestamp: new Date().toISOString(),
          isError: true,
          ticketOffer: {
            offer: true,
            subject: `Inquiry: ${query.substring(0, 40)}`,
            category: 'General',
            reason: 'Connection interruption fallback'
          }
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: ApiChatAction) => {
    if (action.actionType === 'create_ticket') {
      // Create a support ticket in store context and navigate
      const created = createTicket(
        'Inquiry via AI Concierge',
        'General',
        `Customer asked: "${input || 'Support inquiry'}"\n\nTriggered from AI Concierge modal.`,
        currentUser?.name,
        currentUser?.email
      );
      setCurrentView('support');
      setIsOpen(false);
      return;
    }

    if (action.view === 'auth') {
      setIsAuthModalOpen(true);
      return;
    }

    if (action.view) {
      setCurrentView(action.view);
    }

    if (action.orderId) {
      setSelectedTrackingOrderId(action.orderId);
    }

    if (action.productId) {
      setSelectedProductId(action.productId);
    }

    setIsOpen(false);
  };

  const handleTicketEscalation = (subject?: string, category?: string) => {
    createTicket(
      subject || 'General Inquiry via AI Concierge',
      (category as any) || 'General',
      `Customer requested human artisan care through AI Concierge.`,
      currentUser?.name,
      currentUser?.email
    );
    setCurrentView('support');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 sm:p-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 shadow-2xl transition-all transform hover:scale-105 flex items-center gap-2 font-bold text-xs cursor-pointer border border-amber-300/40"
          aria-label="Open AI Concierge"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="hidden sm:inline tracking-wide font-serif">Ask AI Concierge</span>
          {isUserLoggedIn && (
            <span className="w-2 h-2 rounded-full bg-emerald-700 ring-2 ring-white/50" />
          )}
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 left-4 sm:left-auto sm:w-[440px] max-w-[calc(100vw-32px)] sm:max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[85vh]">
          
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-zinc-100 tracking-wide font-serif">HARCONXS AI Concierge</h3>
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[9px] font-mono text-amber-400 uppercase font-semibold">
                    v1.4 API
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isUserLoggedIn ? (
                    <span className="text-emerald-400 font-mono truncate max-w-[180px]">
                      Verified: {currentUser?.email}
                    </span>
                  ) : (
                    <span className="font-mono text-zinc-400">Grounded in Live Store Data</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-zinc-400 hover:text-zinc-200 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant';

              return (
                <div key={m.id} className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
                  <div
                    className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed ${
                      isAssistant
                        ? m.isError
                          ? 'bg-rose-950/40 text-rose-200 border border-rose-800/60 rounded-tl-none'
                          : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-tl-none shadow-sm'
                        : 'bg-amber-400 text-zinc-950 font-medium rounded-tr-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line prose prose-invert prose-xs text-xs font-sans">
                      {m.text}
                    </div>

                    {/* Order Lookup Result Card */}
                    {m.orderLookupResult && (
                      <div className="mt-3 p-3 rounded-xl bg-zinc-950 border border-amber-500/30 text-zinc-200">
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2">
                          <span className="font-mono font-bold text-amber-400 text-[11px] flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5" />
                            #{m.orderLookupResult.orderNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[9px] uppercase">
                            {m.orderLookupResult.status}
                          </span>
                        </div>

                        <div className="space-y-1 text-[11px] text-zinc-300">
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Carrier:</span>
                            <span className="font-medium text-zinc-200">{m.orderLookupResult.carrier}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Tracking:</span>
                            <span className="font-mono text-amber-300">{m.orderLookupResult.trackingNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Estimated Delivery:</span>
                            <span className="font-medium text-zinc-200">{m.orderLookupResult.estimatedDelivery}</span>
                          </div>
                          {m.orderLookupResult.itemsSummary && (
                            <div className="pt-1.5 border-t border-zinc-800/80 text-[10px] text-zinc-400 truncate">
                              {m.orderLookupResult.itemsSummary}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Created Ticket Card */}
                    {m.createdTicket && (
                      <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <div>
                            <div className="font-bold text-[11px]">Ticket #{m.createdTicket.ticketNumber} Logged</div>
                            <div className="text-[10px] text-emerald-300/80">Status: {m.createdTicket.status}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentView('support');
                            setIsOpen(false);
                          }}
                          className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg font-bold text-[10px] cursor-pointer"
                        >
                          View Ticket
                        </button>
                      </div>
                    )}

                    {/* Related Products Preview */}
                    {m.relatedProducts && m.relatedProducts.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-zinc-800/80 space-y-2">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          Curated Recommendations
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                          {m.relatedProducts.map((rp) => (
                            <button
                              key={rp.id}
                              onClick={() => {
                                setSelectedProductId(rp.id);
                                setCurrentView('product-detail');
                                setIsOpen(false);
                              }}
                              className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 hover:border-amber-500/40 flex items-center justify-between transition-colors text-left cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                {rp.imageUrl ? (
                                  <img src={rp.imageUrl} alt={rp.name} className="w-8 h-8 rounded-lg object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                                    <Package className="w-4 h-4" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium text-zinc-200 text-[11px] truncate max-w-[170px]">{rp.name}</div>
                                  <div className="text-amber-400 font-bold text-[10px]">{formatPrice(rp.price)}</div>
                                </div>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sources Used Badge */}
                    {m.sourcesUsed && m.sourcesUsed.length > 0 && (
                      <div className="mt-2 text-[9px] text-zinc-500 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-zinc-500" />
                        <span>Grounded in: {m.sourcesUsed.join(' • ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Interactive Action Buttons */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.actions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(act)}
                          className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-400 rounded-xl font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Direct Support Escalation Offer */}
                  {m.ticketOffer && !m.createdTicket && (
                    <div className="mt-2">
                      <button
                        onClick={() => handleTicketEscalation(m.ticketOffer?.subject, m.ticketOffer?.category)}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 rounded-xl font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Headphones className="w-3.5 h-3.5" />
                        <span>Contact HARCONXS Support (Open Ticket)</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs w-fit">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce delay-200" />
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">Querying grounded knowledge...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-900 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {activeSuggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSend(suggestion)}
                className="px-2.5 py-1 rounded-lg bg-zinc-900/90 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800 text-[10px] whitespace-nowrap cursor-pointer transition-colors shrink-0"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-zinc-900/80 border-t border-zinc-800 flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about orders, bespoke engravings, websites..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-400/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:hover:bg-amber-400 text-zinc-950 rounded-xl font-bold transition-all cursor-pointer shadow-sm"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
