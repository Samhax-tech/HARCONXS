import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Send, Globe, Award, Sparkles, CheckCircle2, Youtube, Instagram, MessageCircle, Send as TelegramIcon, Truck, Mail, HelpCircle, Star, FileText } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { socialLinks, showToast } = useStore();
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
              <p className="text-xs text-zinc-400 mt-0.5">UPI, Cards, NetBanking & COD</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Brand statement */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="font-serif text-2xl font-bold tracking-wider text-zinc-100 uppercase inline-block">
            HARCONXS
          </Link>
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
              <Link to="/shop" className="hover:text-zinc-100 transition-colors">
                All Collections
              </Link>
            </li>
            <li>
              <Link to="/shop/couples" className="text-rose-400 hover:text-rose-300 font-medium transition-colors">
                Couples & Engravings
              </Link>
            </li>
            <li>
              <Link to="/shop/men" className="hover:text-zinc-100 transition-colors">
                Men's Watches & EDC
              </Link>
            </li>
            <li>
              <Link to="/shop/women" className="hover:text-zinc-100 transition-colors">
                Women's Fine Jewelry
              </Link>
            </li>
            <li>
              <Link to="/shop/unisex" className="hover:text-zinc-100 transition-colors">
                Unisex Carry Gear
              </Link>
            </li>
            <li>
              <Link to="/categories" className="text-amber-400 hover:text-amber-300 transition-colors">
                Browse All Categories
              </Link>
            </li>
            <li>
              <Link to="/deals" className="text-amber-400 hover:text-amber-300 transition-colors">
                Special Deals & Offers
              </Link>
            </li>
            <li>
              <Link to="/best-sellers" className="hover:text-zinc-100 transition-colors">
                Best Sellers
              </Link>
            </li>
            <li>
              <Link to="/new-arrivals" className="hover:text-zinc-100 transition-colors">
                New Arrivals
              </Link>
            </li>
          </ul>
        </div>

        {/* Company & Bespoke */}
        <div>
          <p className="text-xs font-semibold text-zinc-100 uppercase tracking-wider mb-3">Explore HARCONXS</p>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/account/orders" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1">
                <span>Live Order Tracking</span>
                <Truck className="w-3 h-3 text-amber-400" />
              </Link>
            </li>
            <li>
              <Link to="/custom-products" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                <span>Create Custom Order</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </Link>
            </li>
            <li>
              <Link to="/couple-websites" className="hover:text-rose-300 transition-colors">
                Couple Website Generator
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1">
                <span>About Us & Story</span>
                <Youtube className="w-3 h-3 text-red-500" />
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-zinc-100 transition-colors">
                Contact Us & Helpdesk
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-zinc-100 transition-colors flex items-center gap-1">
                <span>Frequently Asked Questions</span>
                <HelpCircle className="w-3 h-3 text-zinc-400" />
              </Link>
            </li>
            <li>
              <Link to="/reviews" className="hover:text-zinc-100 transition-colors flex items-center gap-1">
                <span>Customer Testimonials</span>
                <Star className="w-3 h-3 text-amber-400" />
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-zinc-100 transition-colors">
                Affiliate Partner Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Policies */}
        <div>
          <p className="text-xs font-semibold text-zinc-100 uppercase tracking-wider mb-3">Legal & Trust</p>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/privacy-policy" className="hover:text-zinc-200 transition-colors flex items-center gap-1">
                <FileText className="w-3 h-3 text-zinc-500" />
                <span>Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-zinc-200 transition-colors flex items-center gap-1">
                <FileText className="w-3 h-3 text-zinc-500" />
                <span>Terms of Service</span>
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-zinc-200 transition-colors flex items-center gap-1">
                <FileText className="w-3 h-3 text-zinc-500" />
                <span>Refund & Return Policy</span>
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="hover:text-zinc-200 transition-colors flex items-center gap-1">
                <FileText className="w-3 h-3 text-zinc-500" />
                <span>Shipping Policy (India)</span>
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-zinc-200 transition-colors">
                Grievance Officer
              </Link>
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
