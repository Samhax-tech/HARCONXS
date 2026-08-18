import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Search, ChevronDown, HelpCircle, Truck, Heart, ShieldCheck, Terminal, Gift, MessageSquare } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'custom-1': true,
    'shipping-1': true
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const faqData = [
    {
      id: 'custom-1',
      category: 'custom',
      categoryName: 'Custom Orders & Engraving',
      question: 'How do I personalize my order or laser inscription?',
      answer: 'On any customizable product page, you can type your preferred couple names, anniversary coordinates, soundwave audio recordings, or upload reference images before placing the order. For fully custom commissions, use our Bespoke Atelier builder to receive a free 3D design proof and quotation from our lead jewelers.'
    },
    {
      id: 'custom-2',
      category: 'custom',
      categoryName: 'Custom Orders & Engraving',
      question: 'What materials and metals are used for HARCONXS jewelry and gear?',
      answer: 'We exclusively forge our pieces from surgical grade 316L Stainless Steel, Solid 925 Sterling Silver, 18K Solid Gold / Rose Gold Vermeil, Aerospace-grade Titanium, and Genuine Full-Grain Vegetable-Tanned Leather.'
    },
    {
      id: 'shipping-1',
      category: 'shipping',
      categoryName: 'Shipping & Delivery (India & Global)',
      question: 'What are the delivery timelines across India?',
      answer: 'Standard bespoke engraving takes 24–48 hours in our atelier. Priority dispatch via BlueDart Apex, Delhivery Express, or DTDC Air delivers within 2–4 business days to metro cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune) and 3–5 days to tier-2/3 cities.'
    },
    {
      id: 'shipping-2',
      category: 'shipping',
      categoryName: 'Shipping & Delivery (India & Global)',
      question: 'Do you offer Cash on Delivery (COD)?',
      answer: 'Yes! Cash on Delivery is available for all standard catalog items with a minimal verification OTP. For high-value custom laser inscriptions above ₹5,000 or fine gold commissions, a 20% advance token is required to start forging.'
    },
    {
      id: 'websites-1',
      category: 'websites',
      categoryName: 'Couple Websites & Digital Portals',
      question: 'How does the Couple Website builder work?',
      answer: 'When you select a Couple Website template, you configure your custom subdomain (e.g. alex-and-sarah.harconxsshop.com), upload your relationship milestone photos, love story narrative, romantic audio background track, and love counter date. Once activated, your sanctuary stays live permanently with high-speed SSL hosting.'
    },
    {
      id: 'websites-2',
      category: 'websites',
      categoryName: 'Couple Websites & Digital Portals',
      question: 'Can my guests leave messages or memories on our website?',
      answer: 'Yes! All couple website templates include an interactive Love Wall / Guestbook where friends and family can write congratulations, upload memory photos, and leave heart wishes.'
    },
    {
      id: 'bot-1',
      category: 'bots',
      categoryName: 'Bot Panels & API Subscriptions',
      question: 'How do I integrate Telegram or Discord bot panels?',
      answer: 'After subscribing to an automation tier, you receive an instant API secret key and dashboard access. You can configure automated subscription billing, broadcast channels, webhook listeners, and auto-moderation rules with 99.9% uptime.'
    },
    {
      id: 'returns-1',
      category: 'returns',
      categoryName: 'Returns, Exchanges & Warranty',
      question: 'What is the return and replacement policy?',
      answer: 'We provide a 7-Day Hassle-Free Replacement for any defective item, sizing discrepancies, or transit damage. Hand-engraved bespoke custom orders come with an Atelier Authenticity Guarantee and free repair or re-polishing.'
    }
  ];

  const filteredFaqs = faqData.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-zinc-950 min-h-screen py-10 text-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Breadcrumbs items={[{ label: 'Help Center' }, { label: 'FAQ' }]} />

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>HARCONXS Help & Concierge</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Everything you need to know about our physical keepsakes, bespoke laser engraving, couple websites, and cloud bot panels.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., shipping time, materials, couple website)..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors shadow-xl"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'custom', label: 'Custom & Engraving' },
            { id: 'shipping', label: 'Shipping & Delivery' },
            { id: 'websites', label: 'Couple Websites' },
            { id: 'bots', label: 'Bot Panels & APIs' },
            { id: 'returns', label: 'Returns & Warranty' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/10'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 pt-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/40 rounded-3xl border border-zinc-800 p-6 space-y-3">
              <HelpCircle className="w-8 h-8 text-zinc-500 mx-auto" />
              <p className="text-sm font-semibold text-zinc-300">No matching questions found</p>
              <p className="text-xs text-zinc-500">Have a specific question? Contact our 24/7 Concierge.</p>
              <Link
                to="/contact"
                className="inline-block px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl"
              >
                Contact Concierge
              </Link>
            </div>
          ) : (
            filteredFaqs.map(item => {
              const isOpen = Boolean(openItems[item.id]);
              return (
                <div
                  key={item.id}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-zinc-900/80 cursor-pointer"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-amber-400 uppercase">{item.categoryName}</span>
                      <h3 className="text-sm font-bold text-zinc-100">{item.question}</h3>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-amber-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 font-sans">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Contact CTA */}
        <div className="p-6 bg-gradient-to-r from-amber-950/40 to-zinc-900 border border-amber-800/40 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <div>
            <h3 className="text-sm font-bold font-serif text-white">Still have questions?</h3>
            <p className="text-xs text-zinc-400">Our customer team is available on WhatsApp and email 7 days a week.</p>
          </div>
          <Link
            to="/contact"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl whitespace-nowrap"
          >
            Chat with Concierge
          </Link>
        </div>
      </div>
    </div>
  );
};
