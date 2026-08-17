import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Sparkles, Copy, Check, ArrowRight, Tag, Clock } from 'lucide-react';

export const PopupBanner: React.FC = () => {
  const {
    popupBanner,
    isPopupBannerDismissed,
    dismissPopupBanner,
    applyCoupon,
    setCurrentView,
    setSelectedCategory,
    showToast
  } = useStore();

  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 42, seconds: 15 });

  useEffect(() => {
    if (!popupBanner.enabled || isPopupBannerDismissed) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, (popupBanner.showDelaySeconds || 2) * 1000);

    return () => clearTimeout(timer);
  }, [popupBanner.enabled, popupBanner.showDelaySeconds, isPopupBannerDismissed]);

  // Live Countdown ticker
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible || !popupBanner.enabled || isPopupBannerDismissed) return null;

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(popupBanner.couponCode);
    setCopied(true);
    applyCoupon(popupBanner.couponCode);
    showToast(`Code "${popupBanner.couponCode}" copied & applied automatically!`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCtaClick = () => {
    applyCoupon(popupBanner.couponCode);
    dismissPopupBanner();
    if (popupBanner.ctaView === 'custom-builder') {
      setCurrentView('custom-builder');
    } else if (popupBanner.ctaView === 'couple-builder') {
      setCurrentView('couple-builder');
    } else {
      setSelectedCategory('all');
      setCurrentView('catalog');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100 flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={dismissPopupBanner}
          className="absolute top-3 right-3 z-10 p-1.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-full transition-colors cursor-pointer border border-zinc-700/50"
          aria-label="Close discount popup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Image / Visual */}
        <div className="md:w-5/12 relative h-36 md:h-auto overflow-hidden bg-zinc-900">
          <img
            src={popupBanner.imageUrl || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'}
            alt="Promotion"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-950 via-transparent to-transparent opacity-80" />
          
          <div className="absolute top-3 left-3 bg-amber-500 text-zinc-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-md tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{popupBanner.badgeText || 'SPECIAL OFFER'}</span>
          </div>
        </div>

        {/* Right Content */}
        <div className="p-6 md:w-7/12 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
              HARCONXS ATELIER DEAL
            </span>
            <h3 className="text-lg font-serif font-bold text-zinc-100 leading-tight">
              {popupBanner.title}
            </h3>
            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              {popupBanner.description}
            </p>
          </div>

          {/* Coupon Box */}
          <div className="p-2.5 bg-zinc-900 border border-dashed border-amber-500/50 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-zinc-400 uppercase block leading-none">Use Promo Code</span>
                <span className="font-mono text-sm font-bold text-amber-300 tracking-wider">
                  {popupBanner.couponCode}
                </span>
              </div>
            </div>
            <button
              onClick={handleCopyCoupon}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Applied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <span className="flex items-center gap-1 text-[11px] text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>Offer expires in:</span>
            </span>
            <div className="flex gap-1 font-mono text-[11px] font-bold text-zinc-200">
              <span className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">{String(timeLeft.hours).padStart(2, '0')}h</span>
              <span>:</span>
              <span className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">{String(timeLeft.minutes).padStart(2, '0')}m</span>
              <span>:</span>
              <span className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
          </div>

          {/* CTA & Dismiss Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleCtaClick}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10 transition-all cursor-pointer"
            >
              <span>{popupBanner.ctaText || 'Shop Now With Discount'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={dismissPopupBanner}
              className="w-full text-center text-[11px] text-zinc-400 hover:text-zinc-300 py-1 transition-colors cursor-pointer"
            >
              No thanks, continue browsing
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
