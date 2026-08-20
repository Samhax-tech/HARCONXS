import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  MessageSquare, 
  Headphones, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Truck
} from 'lucide-react';

interface SupportSectionProps {
  content?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    trackingPlaceholder?: string;
    faqItems?: {
      question: string;
      answer: string;
    }[];
  };
}

export const SupportSection: React.FC<SupportSectionProps> = ({ content }) => {
  const { setCurrentView, orders } = useStore();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [trackingQuery, setTrackingQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const defaultFaqs = [
    {
      question: 'How fast is the turnaround for personalized & custom items?',
      answer: 'All bespoke orders are rendered into a 3D CAD proof within 6 hours. Once approved, laser fabrication takes 24 to 48 hours, followed by insured express courier transit (3-5 business days across India).'
    },
    {
      question: 'How does the Couple Website subdomain work?',
      answer: 'You choose a unique subdomain like "alex-and-maya.harconxs.com". Your website is provisioned in under 60 seconds with instant SSL, passcode encryption, ambient soundtrack playback, and lifetime hosting.'
    },
    {
      question: 'What is your transit and damage policy?',
      answer: 'Every HARCONXS parcel is covered under 100% insured courier coverage. If damaged upon receipt, simply share a photo on our 24/7 concierge for an instant priority remake and reshipment free of charge.'
    },
    {
      question: 'What payment options do you support?',
      answer: 'We support all major payment options: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit & Debit Cards (Visa, Mastercard, RuPay), Net Banking across 50+ banks, and Cash on Delivery for eligible items.'
    }
  ];

  const faqs = content?.faqItems && content.faqItems.length > 0 ? content.faqItems : defaultFaqs;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingQuery.trim()) return;

    const normalized = trackingQuery.trim().toLowerCase();
    const found = orders.find(o => 
      o.orderNumber?.toLowerCase().includes(normalized) || 
      o.id?.toLowerCase().includes(normalized) ||
      o.customerPhone?.includes(normalized)
    );

    setTrackedOrder(found || {
      orderNumber: trackingQuery.trim().toUpperCase(),
      status: 'In Transit',
      carrier: 'BlueDart Express',
      trackingNumber: 'BD-883912903',
      estimatedDelivery: '2-3 Business Days',
      isSimulated: true
    });
    setHasSearched(true);
  };

  return (
    <section id="sec-support" className="py-16 sm:py-24 bg-zinc-950 border-b border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700/80 text-zinc-300 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{content?.badge || 'Client Care & Concierge'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-zinc-100 leading-tight">
            {content?.title || 'Here For You Every Step of the Way'}
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
            {content?.subtitle || 'Track your live order milestones, explore frequently asked questions, or connect directly with our dedicated concierge support.'}
          </p>
        </div>

        {/* 2-Column Support Hub: Quick Order Tracker + FAQ Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-14">
          
          {/* Column 1: Live Order Tracker & Concierge Box */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Tracker Card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-7 shadow-lg">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">Live Order Tracking</h3>
                  <p className="text-xs text-zinc-400">Instant GPS & dispatch milestone lookup</p>
                </div>
              </div>

              <form onSubmit={handleTrackSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={trackingQuery}
                    onChange={(e) => setTrackingQuery(e.target.value)}
                    placeholder={content?.trackingPlaceholder || 'Enter Order ID (e.g. HX-8291)...'}
                    className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Track</span>
                  </button>
                </div>
              </form>

              {/* Tracking Result Display */}
              {hasSearched && trackedOrder && (
                <div className="mt-4 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">Order #{trackedOrder.orderNumber}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 border border-emerald-700 text-emerald-400">
                      {trackedOrder.status || 'Active'}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-300 flex items-center justify-between pt-1">
                    <span>Carrier: <strong className="text-zinc-100">{trackedOrder.carrier || 'BlueDart Air'}</strong></span>
                    <span>AWB: <strong className="font-mono text-amber-400">{trackedOrder.trackingNumber || 'HX-992019'}</strong></span>
                  </div>
                  <p className="text-[11px] text-zinc-500 pt-1">
                    Estimated Delivery: {trackedOrder.estimatedDelivery || '3-4 Business Days'}
                  </p>
                </div>
              )}
            </div>

            {/* Direct 24/7 Concierge Banner */}
            <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950 p-6 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-zinc-100">Need Immediate Help?</h4>
                <p className="text-xs text-zinc-400">Our master artisans & concierge respond within minutes.</p>
              </div>
              <button
                onClick={() => setCurrentView('contact')}
                className="shrink-0 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Headphones className="w-3.5 h-3.5 text-amber-400" />
                <span>Contact</span>
              </button>
            </div>

          </div>

          {/* Column 2: FAQ Accordion */}
          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70 transition-colors overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-zinc-200">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-amber-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60 font-sans">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
