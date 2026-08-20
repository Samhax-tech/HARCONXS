import React from 'react';
import { PageSection } from '../../types';
import { useStore } from '../../context/StoreContext';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Gift, 
  Heart, 
  Bot, 
  Star, 
  CheckCircle2, 
  HelpCircle, 
  Mail, 
  ChevronRight, 
  ShoppingBag,
  ExternalLink,
  Flame,
  Truck,
  RotateCcw,
  Headphones
} from 'lucide-react';

interface PageSectionRendererProps {
  section: PageSection;
  previewMode?: boolean;
  isLiveStorefront?: boolean;
  onSelectSection?: (section: PageSection) => void;
  isSelected?: boolean;
}

export const PageSectionRenderer: React.FC<PageSectionRendererProps> = ({
  section,
  previewMode = false,
  isLiveStorefront = false,
  onSelectSection,
  isSelected = false
}) => {
  const { 
    products, 
    formatPrice, 
    setCurrentView, 
    setSelectedProductId, 
    addToCart, 
    coupleTemplates, 
    botPanelServices 
  } = useStore();

  const isVisible = section.is_visible !== false && !section.isHidden && section.is_hidden !== true;

  // On customer storefront or in clean preview mode: completely hide inactive sections without any placeholder
  if (!isVisible) {
    if (isLiveStorefront || previewMode || !onSelectSection) {
      return null;
    }
    // Only in the admin editor studio with click handlers do we show the draft indicator
    return (
      <div 
        id={`hidden-${section.id}`}
        onClick={() => onSelectSection?.(section)}
        className="p-3 bg-zinc-900/60 border border-dashed border-zinc-700/60 rounded-xl text-xs text-zinc-500 text-center cursor-pointer hover:border-amber-500/50 transition-colors"
      >
        <span className="font-mono text-zinc-400">[{section.section_type || section.sectionType}]</span> {section.name || 'Section'} (Hidden on storefront)
      </div>
    );
  }

  const content = section.content_json || {};
  const settings = section.settings_json || {};
  const bgColor = settings.bg_color || 'transparent';
  const textColor = settings.text_color || 'inherit';

  const wrapperClass = `relative transition-all duration-200 ${
    isSelected ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-zinc-950 rounded-xl' : ''
  } ${onSelectSection ? 'cursor-pointer hover:outline hover:outline-1 hover:outline-amber-500/40' : ''}`;

  const renderSectionContent = () => {
    switch (section.section_type) {
      // 1. ANNOUNCEMENT BAR
      case 'announcement_bar':
        return (
          <div 
            id={`section-${section.id}`}
            style={{ backgroundColor: bgColor !== 'transparent' ? bgColor : '#b45309', color: textColor }}
            className="py-2.5 px-4 text-center text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-200" />
            <span>{content.text || 'Complimentary Worldwide Shipping on Bespoke Commissions over ₹4,999'}</span>
            {content.link_url && (
              <span className="underline font-semibold ml-2 cursor-pointer hover:opacity-80">
                {content.link_text || 'Explore'} →
              </span>
            )}
          </div>
        );

      // 2. HERO
      case 'hero':
        return (
          <div 
            id={`section-${section.id}`}
            style={{ backgroundColor: bgColor !== 'transparent' ? bgColor : undefined }}
            className="relative overflow-hidden py-16 sm:py-24 px-6 sm:px-12 text-center bg-gradient-to-b from-zinc-900/80 via-zinc-950 to-zinc-950 border-b border-zinc-800/80"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              {content.badge && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{content.badge}</span>
                </div>
              )}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-zinc-100 tracking-tight leading-tight">
                {content.title || 'Exquisite Handcrafted Gifting & Private Sanctuary Web Experiences'}
              </h1>
              <p className="text-sm sm:text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
                {content.subtitle || 'Indulge in artisanal luxury gifts, custom interactive couple memories, and bespoke bot digital integrations.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button 
                  onClick={() => !previewMode && setCurrentView('shop')}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <span>{content.cta_primary_text || 'Discover Catalog'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {content.cta_secondary_text && (
                  <button 
                    onClick={() => !previewMode && setCurrentView('couple-builder')}
                    className="px-6 py-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 font-medium text-sm border border-zinc-700 transition-all flex items-center gap-2"
                  >
                    <span>{content.cta_secondary_text}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      // 3. BANNERS
      case 'banners':
        return (
          <div 
            id={`section-${section.id}`}
            style={{ backgroundColor: bgColor !== 'transparent' ? bgColor : undefined }}
            className="py-8 px-6 max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(content.banners || [
                {
                  title: 'Artisanal Bespoke Wooden Plaques',
                  tag: 'Handcrafted Perfection',
                  desc: 'Laser-etched natural rosewood with gold-leaf inlay',
                  btnText: 'Commission Yours'
                },
                {
                  title: 'Private Couple Digital Sanctuaries',
                  tag: 'Forever Encrypted',
                  desc: 'Interactive love timelines, music players & memory vaults',
                  btnText: 'Build Sanctuary'
                }
              ]).map((b: any, i: number) => (
                <div 
                  key={i} 
                  className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">{b.tag}</span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100">{b.title}</h3>
                    <p className="text-sm text-zinc-400">{b.desc}</p>
                  </div>
                  <div className="pt-6">
                    <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                      {b.btnText || 'Explore'} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // 4. CATEGORIES
      case 'categories':
        return (
          <div 
            id={`section-${section.id}`}
            className="py-10 px-6 max-w-7xl mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">{content.title || 'Curated Atelier Collections'}</h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">{content.subtitle || 'Explore our premier handcrafted categories'}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(content.items || [
                { name: 'Custom Gifts', icon: 'Gift', count: '18 Items', view: 'custom-gifts' },
                { name: 'Couple Sanctuaries', icon: 'Heart', count: '12 Templates', view: 'couple-websites' },
                { name: 'Luxury Plaques', icon: 'Sparkles', count: '24 Designs', view: 'shop' },
                { name: 'Bot Panels', icon: 'Bot', count: '8 Suites', view: 'bot-panels' }
              ]).map((cat: any, i: number) => (
                <div 
                  key={i}
                  className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-center hover:border-amber-500/50 hover:bg-zinc-900 transition-all"
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    {cat.icon === 'Heart' ? <Heart className="w-5 h-5" /> :
                     cat.icon === 'Bot' ? <Bot className="w-5 h-5" /> :
                     cat.icon === 'Sparkles' ? <Sparkles className="w-5 h-5" /> :
                     <Gift className="w-5 h-5" />}
                  </div>
                  <h4 className="font-semibold text-zinc-200 text-sm">{cat.name}</h4>
                  <span className="text-[11px] text-zinc-500">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // 5. FEATURED PRODUCTS / BEST SELLERS / NEW ARRIVALS
      case 'featured_products':
      case 'best_sellers':
      case 'new_arrivals':
        const displayProducts = products.slice(0, content.limit || 4);
        return (
          <div 
            id={`section-${section.id}`}
            className="py-12 px-6 max-w-7xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                  {content.title || (section.section_type === 'best_sellers' ? 'Best Sellers' : section.section_type === 'new_arrivals' ? 'New Arrivals' : 'Featured Masterpieces')}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">{content.subtitle || 'Handcrafted to sovereign perfection'}</p>
              </div>
              <span className="text-xs font-medium text-amber-400 flex items-center gap-1 cursor-pointer">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.map((p) => (
                <div 
                  key={p.id}
                  className="group rounded-2xl bg-zinc-900/70 border border-zinc-800/80 overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-square overflow-hidden bg-zinc-950">
                    <img 
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&q=80'} 
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {p.isBestSeller && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-amber-500 text-zinc-950 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Flame className="w-3 h-3" /> Best Seller
                      </span>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>{p.category}</span>
                      <div className="flex items-center text-amber-400 gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{p.rating || 5.0}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-zinc-100 text-sm line-clamp-1">{p.name}</h3>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bold text-amber-400 text-base">{formatPrice(p.price)}</span>
                      <button 
                        onClick={() => !previewMode && addToCart(p, 1)}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // 6. CUSTOM GIFTS
      case 'custom_gifts':
        return (
          <div 
            id={`section-${section.id}`}
            className="py-12 px-6 max-w-7xl mx-auto"
          >
            <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/80 p-8 sm:p-12">
              <div className="max-w-2xl space-y-4">
                <span className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-semibold uppercase tracking-widest">
                  <Gift className="w-4 h-4" /> {content.badge || 'Bespoke Atelier Commission'}
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-100">
                  {content.title || 'Create One-of-a-Kind Personalized Gifts'}
                </h2>
                <p className="text-sm sm:text-base text-zinc-400 font-light">
                  {content.subtitle || 'Work directly with our master craftsmen. Upload custom artwork, choose premium woods and metals, and inspect 3D prototypes.'}
                </p>
                <div className="pt-4">
                  <button 
                    onClick={() => !previewMode && setCurrentView('custom-order')}
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/20"
                  >
                    {content.cta_text || 'Start Custom Order'} →
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      // 7. COUPLE WEBSITES
      case 'couple_websites':
        return (
          <div 
            id={`section-${section.id}`}
            className="py-12 px-6 max-w-7xl mx-auto"
          >
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1 text-rose-400 text-xs font-semibold uppercase tracking-widest">
                <Heart className="w-3.5 h-3.5 fill-rose-400" /> {content.badge || 'Digital Love Sanctuaries'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100 mt-1">
                {content.title || 'Private Interactive Couple Websites'}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                {content.subtitle || 'Celebrate your story with custom subdomains, timeline milestones, and Spotify audio synch.'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {coupleTemplates.slice(0, 3).map((tmpl) => (
                <div 
                  key={tmpl.id}
                  className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-rose-500/40 transition-all space-y-3"
                >
                  <div className="h-40 rounded-xl bg-zinc-950 overflow-hidden relative">
                    <img 
                      src={tmpl.previewThumbnail || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&q=80'} 
                      alt={tmpl.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-zinc-900/90 text-amber-300 text-[10px] font-bold">
                      {tmpl.tier}
                    </span>
                  </div>
                  <h4 className="font-bold text-zinc-100 text-sm">{tmpl.name}</h4>
                  <p className="text-xs text-zinc-400 line-clamp-2">{tmpl.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      // 8. BOT PANELS
      case 'bot_panels':
        return (
          <div 
            id={`section-${section.id}`}
            className="py-12 px-6 max-w-7xl mx-auto"
          >
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1 text-cyan-400 text-xs font-semibold uppercase tracking-widest">
                <Bot className="w-3.5 h-3.5" /> {content.badge || 'Developer & Automation Suites'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100 mt-1">
                {content.title || 'Enterprise Telegram & Discord Bot Consoles'}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                {content.subtitle || 'High-throughput bot hosting, webhook pipelines & analytics'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {botPanelServices.slice(0, 3).map((bot) => (
                <div 
                  key={bot.id}
                  className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-cyan-500/40 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {bot.tier}
                    </span>
                    <span className="font-bold text-zinc-100 text-sm">₹{bot.monthlyPriceInr}/mo</span>
                  </div>
                  <h4 className="font-bold text-zinc-100 text-base">{bot.name}</h4>
                  <p className="text-xs text-zinc-400">{bot.tagline}</p>
                </div>
              ))}
            </div>
          </div>
        );

      // 9. TESTIMONIALS / REVIEWS
      case 'testimonials':
      case 'reviews':
        return (
          <div 
            id={`section-${section.id}`}
            className="py-12 px-6 max-w-7xl mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                {content.title || 'Celebrated by Over 10,000+ Patrons'}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">{content.subtitle || 'Verified feedback from our global community'}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(content.reviews || [
                { name: 'Dr. Siddharth Rao', title: 'Flawless Craftsmanship', text: 'The personalized wooden constellation plaque exceeded all expectations. The finish is museum-grade.', rating: 5 },
                { name: 'Ananya & Kabir', title: 'Magical Couple Website', text: 'Our wedding guests were blown away by our private domain sanctuary with audio playlist integration.', rating: 5 },
                { name: 'Meera Kapoor', title: 'Top-tier Packaging', text: 'Arrived in a stunning velvet gift box with personalized wax seal. Truly luxury gifting redefined.', rating: 5 }
              ]).map((rev: any, i: number) => (
                <div 
                  key={i}
                  className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3"
                >
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <h4 className="font-bold text-zinc-200 text-sm">"{rev.title}"</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{rev.text}</p>
                  <div className="pt-2 text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{rev.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // 10. FAQ
      case 'faq':
        return (
          <div 
            id={`section-${section.id}`}
            className="py-12 px-6 max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                {content.title || 'Frequently Asked Questions'}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">{content.subtitle || 'Everything you need to know about commissions & delivery'}</p>
            </div>
            <div className="space-y-4">
              {(content.items || [
                { q: 'How long does a bespoke gift commission take?', a: 'Standard production takes 2-4 business days. Express rush atelier turnaround (24h) is available at checkout.' },
                { q: 'Can I preview my custom couple website before publishing?', a: 'Yes! Our real-time visual sanctuary builder allows full live interactive testing with customizable passwords.' },
                { q: 'Are all gifts delivered in signature luxury packaging?', a: 'Every item includes complimentary archival gift-wrapping with optional royal velvet chests and gold wax seals.' }
              ]).map((faq: any, i: number) => (
                <div key={i} className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
                  <h4 className="font-semibold text-zinc-100 text-sm flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    {faq.q}
                  </h4>
                  <p className="text-xs text-zinc-400 pl-6 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        );

      // 11. CALL TO ACTION (CTA)
      case 'cta':
        return (
          <div 
            id={`section-${section.id}`}
            className="py-12 px-6 max-w-6xl mx-auto"
          >
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-amber-600/20 via-zinc-900 to-zinc-950 border border-amber-500/30 text-center space-y-6">
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-100">
                {content.title || 'Experience Sovereign Luxury Gifting Today'}
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto">
                {content.subtitle || 'Join our elite circle of patrons. Complimentary concierge design support on all custom commissions.'}
              </p>
              <button 
                onClick={() => !previewMode && setCurrentView('shop')}
                className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all inline-flex items-center gap-2"
              >
                <span>{content.button_text || 'Explore Atelier Catalog'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      // 12. NEWSLETTER
      case 'newsletter':
        return (
          <div 
            id={`section-${section.id}`}
            className="py-12 px-6 max-w-3xl mx-auto text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-zinc-100">{content.title || 'Join the Atelier Gazette'}</h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
              {content.subtitle || 'Receive private invitations to limited-edition drops, artisan stories, and VIP discounts.'}
            </p>
            <div className="flex max-w-md mx-auto gap-2 pt-2">
              <input 
                type="email" 
                placeholder="Enter your private email..." 
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              />
              <button className="px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-semibold text-xs hover:bg-amber-400 transition-colors">
                {content.button_text || 'Subscribe'}
              </button>
            </div>
          </div>
        );

      // 13. FOOTER
      case 'footer':
        return (
          <footer 
            id={`section-${section.id}`}
            className="py-12 px-6 border-t border-zinc-800/80 bg-zinc-950 text-xs text-zinc-400 mt-12"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-8">
              <div className="space-y-3">
                <span className="font-serif font-bold text-base tracking-widest text-zinc-100">HARCONXS</span>
                <p className="text-zinc-500 text-[11px] leading-relaxed">
                  The sovereign destination for handcrafted gifts, digital sanctuaries & automated intelligence suites.
                </p>
              </div>
              <div>
                <h5 className="font-semibold text-zinc-200 mb-3">Atelier Collections</h5>
                <ul className="space-y-2 text-zinc-400">
                  <li>Custom Wooden Plaques</li>
                  <li>Couple Love Sanctuaries</li>
                  <li>Developer Bot Suites</li>
                  <li>Luxury Gift Packaging</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-zinc-200 mb-3">Client Services</h5>
                <ul className="space-y-2 text-zinc-400">
                  <li>Order Tracking</li>
                  <li>Bespoke Consultation</li>
                  <li>Authenticity Guarantee</li>
                  <li>VIP Membership</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-zinc-200 mb-3">Security & Trust</h5>
                <div className="space-y-2 text-[11px] text-zinc-500">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Encrypted
                  </div>
                  <div>GST Verified & Registered</div>
                  <div>© {new Date().getFullYear()} HARCONXS Atelier. All rights reserved.</div>
                </div>
              </div>
            </div>
          </footer>
        );

      default:
        return (
          <div 
            id={`section-${section.id}`}
            className="p-8 border border-dashed border-zinc-800 rounded-2xl text-center space-y-2"
          >
            <h3 className="font-serif font-bold text-zinc-200">{section.name}</h3>
            <p className="text-xs text-zinc-500 font-mono">[{section.section_type}] Custom Section</p>
          </div>
        );
    }
  };

  return (
    <div 
      className={wrapperClass}
      onClick={() => onSelectSection?.(section)}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 z-20 px-2.5 py-1 rounded bg-amber-500 text-zinc-950 font-bold text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Selected Section
        </div>
      )}
      {renderSectionContent()}
    </div>
  );
};
