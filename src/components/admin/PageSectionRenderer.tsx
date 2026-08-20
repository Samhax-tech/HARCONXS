import React from 'react';
import { PageSection } from '../../types';
import { useStore } from '../../context/StoreContext';
import { HeroSection } from '../home/HeroSection';
import { FeaturedSection } from '../home/FeaturedSection';
import { CategoryGrid } from '../home/CategoryGrid';
import { CoupleWebsitesSection } from '../home/CoupleWebsitesSection';
import { CustomServicesSection } from '../home/CustomServicesSection';
import { SupportSection } from '../home/SupportSection';
import { TrustBenefitsSection } from '../home/TrustBenefitsSection';
import { CtaSection } from '../home/CtaSection';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Gift, 
  Heart, 
  Star, 
  CheckCircle2, 
  HelpCircle, 
  Mail, 
  ChevronRight, 
  ShoppingBag,
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
    addToCart 
  } = useStore();

  const isVisible = (section as any).is_visible !== false && !section.isHidden && (section as any).is_hidden !== true;

  // On customer storefront or in clean preview mode: completely hide inactive sections
  if (!isVisible) {
    if (isLiveStorefront || previewMode || !onSelectSection) {
      return null;
    }
    return (
      <div 
        id={`hidden-${section.id}`}
        onClick={() => onSelectSection?.(section)}
        className="p-3 bg-zinc-900/60 border border-dashed border-zinc-700/60 rounded-xl text-xs text-zinc-500 text-center cursor-pointer hover:border-amber-500/50 transition-colors"
      >
        <span className="font-mono text-zinc-400">[{section.sectionType || (section as any).section_type}]</span> {section.name || 'Section'} (Hidden on storefront)
      </div>
    );
  }

  const sectionType = section.sectionType || (section as any).section_type;
  const content = section.content || (section as any).content_json || {};
  const settings = section.settings || (section as any).settings_json || {};
  const bgColor = settings.backgroundColor || (settings as any).bg_color || 'transparent';
  const textColor = settings.textColor || (settings as any).text_color || 'inherit';

  const wrapperClass = `relative transition-all duration-200 ${
    isSelected ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-zinc-950 rounded-xl' : ''
  } ${onSelectSection ? 'cursor-pointer hover:outline hover:outline-1 hover:outline-amber-500/40' : ''}`;

  const renderSectionContent = () => {
    switch (sectionType) {
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
        return <HeroSection content={content} />;

      // 3. FEATURED PRODUCTS / BEST SELLERS / NEW ARRIVALS
      case 'featured_products':
      case 'best_sellers':
      case 'new_arrivals':
        return <FeaturedSection content={content} />;

      // 4. CATEGORIES
      case 'categories':
        return <CategoryGrid content={content} />;

      // 5. COUPLE WEBSITES
      case 'couple_websites':
        return <CoupleWebsitesSection content={content} />;

      // 6. CUSTOM SERVICES / CUSTOM GIFTS
      case 'custom_gifts':
        return <CustomServicesSection content={content} />;

      // 7. SUPPORT / CLIENT CARE
      case 'support':
        return <SupportSection content={content} />;

      // 8. TRUST / VALUE PILLARS
      case 'trust_benefits':
        return <TrustBenefitsSection content={content} />;

      // 9. CALL TO ACTION (CTA)
      case 'cta':
        return <CtaSection content={content} />;

      // 10. TESTIMONIALS / REVIEWS
      case 'testimonials':
      case 'reviews':
        const reviewsList = content.testimonials || content.reviews || [
          { name: 'Dr. Siddharth Rao', title: 'Flawless Craftsmanship', text: 'The personalized wooden constellation plaque exceeded all expectations. The finish is museum-grade.', rating: 5, author: 'Dr. Siddharth Rao' },
          { name: 'Ananya & Kabir', title: 'Magical Couple Website', text: 'Our wedding guests were blown away by our private domain sanctuary with audio playlist integration.', rating: 5, author: 'Ananya & Kabir' },
          { name: 'Meera Kapoor', title: 'Top-tier Packaging', text: 'Arrived in a stunning velvet gift box with personalized wax seal. Truly luxury gifting redefined.', rating: 5, author: 'Meera Kapoor' }
        ];

        return (
          <div 
            id={`section-${section.id}`}
            className="py-16 px-6 max-w-7xl mx-auto border-b border-zinc-800/80"
          >
            <div className="text-center mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">Verified Notes</span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-zinc-100 mt-1">
                {content.title || 'Echoes From Our Patrons'}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">{content.subtitle || 'Verified evaluations collected after confirmed parcel delivery'}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviewsList.map((rev: any, i: number) => (
                <div 
                  key={i}
                  className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-3"
                >
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  {rev.quote ? (
                    <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">"{rev.quote}"</p>
                  ) : (
                    <>
                      {rev.title && <h4 className="font-bold text-zinc-200 text-sm">"{rev.title}"</h4>}
                      <p className="text-xs text-zinc-400 leading-relaxed">{rev.text}</p>
                    </>
                  )}
                  <div className="pt-2 text-xs font-medium text-zinc-300 flex items-center justify-between border-t border-zinc-800/80">
                    <span className="font-semibold text-zinc-200">{rev.author || rev.name}</span>
                    <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                      <CheckCircle2 className="w-3 h-3" /> Verified Order
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // 11. FAQ
      case 'faq':
        return <SupportSection content={{ title: content.title, subtitle: content.subtitle, faqItems: content.items }} />;

      // 12. NEWSLETTER
      case 'newsletter':
        return (
          <div 
            id={`section-${section.id}`}
            className="py-16 px-6 max-w-3xl mx-auto text-center space-y-4 border-b border-zinc-800/80"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">{content.title || 'Join the Atelier Gazette'}</h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto font-sans">
              {content.subtitle || 'Receive private invitations to limited-edition drops, artisan stories, and VIP discounts.'}
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2 pt-2">
              <input 
                type="email" 
                placeholder={content.inputPlaceholder || 'Enter your patron email...'} 
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700/80 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
              <button className="px-6 py-3 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors shrink-0 cursor-pointer">
                {content.buttonText || 'Subscribe'}
              </button>
            </div>
          </div>
        );

      // 13. BANNERS
      case 'banners':
        return (
          <div 
            id={`section-${section.id}`}
            style={{ backgroundColor: bgColor !== 'transparent' ? bgColor : undefined }}
            className="py-12 px-6 max-w-7xl mx-auto border-b border-zinc-800/80"
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
                  className="relative p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">{b.tag}</span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100">{b.title}</h3>
                    <p className="text-sm text-zinc-400">{b.desc}</p>
                  </div>
                  <div className="pt-6">
                    <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 cursor-pointer">
                      {b.btnText || 'Explore'} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
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
