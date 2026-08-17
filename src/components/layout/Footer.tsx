import React, { useState } from 'react';
import { ShieldCheck, Heart, Send, Globe, Award, Sparkles, CheckCircle2, Youtube, Instagram, MessageCircle, Send as TelegramIcon, Truck, Mail } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategory, setIsPolicyModalOpen, setActivePolicySlug, socialLinks, showToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }
    setIsSubscribed(true);
    showToast('Subscribed! Check your inbox for your 15% discount code.');
    setNewsletterEmail('');
  };

  const openPolicy = (slug: string) => {
    setActivePolicySlug(slug);
    setIsPolicyModalOpen(true);
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 text-sm">
      {/* Top trust badges bar */}
      <div className="border-b border-zinc-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-zinc-100 text-xs uppercase tracking-wider">Atelier Craftsmanship</p>
              <p className="text-xs text-zinc-400 mt-0.5">Laser precision & luxury packaging</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-rose-400">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-zinc-100 text-xs uppercase tracking-wider">Couple Sanctuary</p>
              <p className="text-xs text-zinc-400 mt-0.5">Lifetime hosted interactive websites</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sky-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-zinc-100 text-xs uppercase tracking-wider">Pan-India Courier Network</p>
              <p className="text-xs text-zinc-400 mt-0.5">BlueDart, Delhivery & DTDC Express</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-zinc-100 text-xs uppercase tracking-wider">Buyer Protection</p>
              <p className="text-xs text-zinc-400 mt-0.5">UPI, Net Banking & Cash on Delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Brand statement */}
        <div className="lg:col-span-2 space-y-4">
          <span className="font-serif text-2xl font-bold tracking-wider text-zinc-100 uppercase">
            HARCONXS
          </span>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
            Premium commerce destination engineered for couples, handcrafted laser engravings, lifetime cloud memory portals, and bespoke digital automation.
          </p>

          {/* Social Links Icons */}
          <div className="flex items-center gap-3 pt-1">
            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-zinc-900 hover:bg-red-950/50 hover:text-red-400 border border-zinc-800 rounded-xl transition-colors cursor-pointer"
              title="Official YouTube Channel"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-zinc-900 hover:bg-pink-950/50 hover:text-pink-400 border border-zinc-800 rounded-xl transition-colors cursor-pointer"
              title="Official Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-zinc-900 hover:bg-sky-950/50 hover:text-sky-400 border border-zinc-800 rounded-xl transition-colors cursor-pointer"
              title="Official Telegram Channel"
            >
              <TelegramIcon className="w-4 h-4" />
            </a>
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-zinc-900 hover:bg-emerald-950/50 hover:text-emerald-400 border border-zinc-800 rounded-xl transition-colors cursor-pointer"
              title="WhatsApp Customer Care"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>

          <div className="pt-2">
            <p className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-2">Join Private Atelier Circle</p>
            {isSubscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-2.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
                <span>You are in! 15% discount code applied.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 outline-none flex-1"
                  required
                />
                <button
                  type="submit"
                  className="bg-zinc-100 hover:bg-white text-zinc-950 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Join</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Catalog Categories */}
        <div>
          <p className="text-xs font-semibold text-zinc-100 uppercase tracking-wider mb-3">Storefront</p>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => { setSelectedCategory('all'); setCurrentView('catalog'); }}
                className="hover:text-zinc-100 transition-colors cursor-pointer"
              >
                All Collections
              </button>
            </li>
            <li>
              <button
                onClick={() => { setSelectedCategory('couples'); setCurrentView('catalog'); }}
                className="text-rose-400 hover:text-rose-300 font-medium transition-colors cursor-pointer"
              >
                Couples & Engravings
              </button>
            </li>
            <li>
              <button
                onClick={() => { setSelectedCategory('men'); setCurrentView('catalog'); }}
                className="hover:text-zinc-100 transition-colors cursor-pointer"
              >
                Men's Watches & EDC
              </button>
            </li>
            <li>
              <button
                onClick={() => { setSelectedCategory('women'); setCurrentView('catalog'); }}
                className="hover:text-zinc-100 transition-colors cursor-pointer"
              >
                Women's Fine Jewelry
              </button>
            </li>
            <li>
              <button
                onClick={() => { setSelectedCategory('unisex'); setCurrentView('catalog'); }}
                className="hover:text-zinc-100 transition-colors cursor-pointer"
              >
                Unisex Carry Gear
              </button>
            </li>
          </ul>
        </div>

        {/* Company & Bespoke */}
        <div>
          <p className="text-xs font-semibold text-zinc-100 uppercase tracking-wider mb-3">Explore HARCONXS</p>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => setCurrentView('tracking')}
                className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Live Order Tracking</span>
                <Truck className="w-3 h-3 text-amber-400" />
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView('emails')}
                className="hover:text-zinc-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Email Logs & Receipts</span>
                <Mail className="w-3 h-3 text-zinc-400" />
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView('about-us')}
                className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>About Us & YouTube</span>
                <Youtube className="w-3 h-3 text-red-500" />
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView('contact-us')}
                className="hover:text-zinc-100 transition-colors cursor-pointer"
              >
                Contact Us & Helpdesk
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView('custom-builder')}
                className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Create Custom Order</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView('couple-builder')}
                className="hover:text-rose-300 transition-colors cursor-pointer"
              >
                Couple Website Generator
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView('account')}
                className="hover:text-zinc-100 transition-colors cursor-pointer"
              >
                Affiliate Partner Portal
              </button>
            </li>
          </ul>
        </div>

        {/* Legal & Policies */}
        <div>
          <p className="text-xs font-semibold text-zinc-100 uppercase tracking-wider mb-3">Legal & Trust</p>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => openPolicy('privacy')} className="hover:text-zinc-200 transition-colors cursor-pointer">
                Privacy Policy (v2.3)
              </button>
            </li>
            <li>
              <button onClick={() => openPolicy('terms')} className="hover:text-zinc-200 transition-colors cursor-pointer">
                Terms of Service (v3.1)
              </button>
            </li>
            <li>
              <button onClick={() => openPolicy('custom-orders')} className="hover:text-zinc-200 transition-colors cursor-pointer">
                Custom Orders & Engraving
              </button>
            </li>
            <li>
              <button onClick={() => openPolicy('shipping')} className="hover:text-zinc-200 transition-colors cursor-pointer">
                Shipping & Returns (India)
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('contact-us')} className="hover:text-zinc-200 transition-colors cursor-pointer">
                Grievance Officer
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright line */}
      <div className="border-t border-zinc-800/70 py-6 px-4 text-center text-xs text-zinc-400">
        <p>© 2026 HARCONXS SHOP. All rights reserved. Crafted with precision for India & Global connoisseurs.</p>
      </div>
    </footer>
  );
};
