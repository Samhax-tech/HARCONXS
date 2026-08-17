import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, MessageSquare, Send, X, Bot, ArrowRight, Heart, Gift, Package, ShieldCheck } from 'lucide-react';

export const AiChatAssistant: React.FC = () => {
  const { products, orders, customOrders, coupleTemplates, botPanelServices, formatPrice, setCurrentView, setSelectedProductId } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; action?: { label: string; view: any; productId?: string } }>>([
    {
      role: 'assistant',
      text: 'Welcome to HARCONXS Atelier! I am your AI concierge. I can recommend personalized gifts, calculate budgets, track your custom commissions, or explain our bot panels.'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'Couple gifts under $50',
    'How do custom orders work?',
    'What is a couple website?',
    'Telegram bot panel plans'
  ];

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const query = userText.toLowerCase();

      // Rule-based smart reasoning backed by live store data
      if (query.includes('under') && (query.includes('50') || query.includes('$50'))) {
        const matching = products.filter(p => p.price <= 50);
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: `I found ${matching.length} wonderful items under $50, including the "${matching[0]?.name}" for ${formatPrice(matching[0]?.price || 38)}. Would you like to view our catalog?`,
            action: { label: 'Explore Catalog', view: 'catalog' }
          }
        ]);
      } else if (query.includes('couple') || query.includes('girlfriend') || query.includes('boyfriend')) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: 'For romantic partnerships, our most cherished creations are the Personalized Projection Necklaces, Custom Coordinates Rings, and our Hosted Digital Love Sanctuaries with real-time anniversary counters!',
            action: { label: 'Launch Couple Builder', view: 'couple-builder' }
          }
        ]);
      } else if (query.includes('custom') || query.includes('quote') || query.includes('bespoke')) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: 'You can commission any concept with our "Create Something Special" bespoke atelier! Fill out a 3-step brief with your target delivery date, and our master jewelers will issue a 3D plan and official quotation (#CO).',
            action: { label: 'Start Custom Brief', view: 'custom-builder' }
          }
        ]);
      } else if (query.includes('bot') || query.includes('telegram') || query.includes('discord')) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: 'HARCONXS Cloud powers high-concurrency bot portals for Telegram VIP communities, Discord server moderation, and WhatsApp CRM. Includes private billing and webhook token rotation.',
            action: { label: 'View Bot Panels', view: 'bot-panels' }
          }
        ]);
      } else if (query.includes('track') || query.includes('order')) {
        const latestOrder = orders[0];
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: latestOrder
              ? `Your latest order ${latestOrder.orderNumber} is currently "${latestOrder.status}" via ${latestOrder.carrier} (Tracking: ${latestOrder.trackingNumber}).`
              : 'You can track all physical packages and custom commission progress in your My Account portal.',
            action: { label: 'View Orders', view: 'account' }
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: `I understand! We offer fine curated luxury goods, free custom laser engravings, bespoke commissions, and cloud bot infrastructure. How may I best assist you today?`,
            action: { label: 'Browse Products', view: 'catalog' }
          }
        ]);
      }
    }, 700);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 shadow-2xl transition-all transform hover:scale-105 flex items-center gap-2.5 font-bold text-xs cursor-pointer"
        >
          <Sparkles className="w-5 h-5" />
          <span className="hidden sm:inline">Ask AI Concierge</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[550px]">
          
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-100">HARCONXS AI Concierge</h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Store Intelligence
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m, i) => {
              const isAssistant = m.role === 'assistant';

              return (
                <div key={i} className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      isAssistant
                        ? 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-tl-none'
                        : 'bg-amber-400 text-zinc-950 font-medium rounded-tr-none'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Action Link if provided */}
                  {m.action && (
                    <button
                      onClick={() => {
                        setCurrentView(m.action!.view);
                        if (m.action!.productId) setSelectedProductId(m.action!.productId);
                        setIsOpen(false);
                      }}
                      className="mt-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 border border-amber-500/40 rounded-xl font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{m.action.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse delay-200" />
                <span className="text-[11px] ml-1">Consulting catalog database...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-[10px] whitespace-nowrap cursor-pointer transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-zinc-900/60 border-t border-zinc-800 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about gifts, quotes, or tracking..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-600"
            />
            <button
              type="submit"
              className="p-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-bold transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
