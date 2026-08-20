import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Heart, 
  Sparkles, 
  ArrowRight, 
  Globe, 
  Lock, 
  Music, 
  Calendar, 
  Clock, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

interface CoupleWebsitesSectionProps {
  content?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    subdomainExample?: string;
    ctaText?: string;
    ctaLink?: string;
    features?: string[];
  };
}

export const CoupleWebsitesSection: React.FC<CoupleWebsitesSectionProps> = ({ content }) => {
  const { setCurrentView } = useStore();

  // Dynamic live anniversary timer demo
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    // Start with a simulated base duration: 742 days, 14 hours, 32 mins, 45 secs
    const baseSeconds = 742 * 86400 + 14 * 3600 + 32 * 60 + 45;
    setSecondsElapsed(baseSeconds);

    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const days = Math.floor(secondsElapsed / 86400);
  const hours = Math.floor((secondsElapsed % 86400) / 3600);
  const minutes = Math.floor((secondsElapsed % 3600) / 60);
  const seconds = secondsElapsed % 60;

  const defaultFeatures = [
    'Live Second-by-Second Anniversary Clock & Milestones',
    'Interactive Memory Wall & High-Definition Photo Vault',
    'Ambient Romantic Song Player with Spotify Sync',
    'Passcode Protection & Private Visitor Guestbook',
    'Instant Subdomain Deployment with Lifetime Cloud Hosting'
  ];

  const features = content?.features && content.features.length > 0 ? content.features : defaultFeatures;

  return (
    <section id="sec-couple-websites" className="py-16 sm:py-24 bg-zinc-950 border-b border-zinc-800/80 relative overflow-hidden">
      {/* Subtle radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Narrative & Features */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-semibold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
              <span>{content?.badge || 'Digital Love Sanctuary'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-zinc-100 leading-tight">
              {content?.title || 'Private Interactive Couple Websites'}
            </h2>

            <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
              {content?.subtitle || 'Immortalize your relationship journey with a private, password-protected digital sanctuary featuring live second-by-second anniversary counters, photo archives, and ambient soundtrack playback.'}
            </p>

            {/* Feature Checklist */}
            <div className="space-y-3 pt-2">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Subdomain Sample & CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => setCurrentView('couple-builder')}
                className="bg-rose-500 hover:bg-rose-400 text-zinc-950 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{content?.ctaText || 'Build Your Sanctuary'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('couple-templates')}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 font-medium px-5 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse Sanctuary Themes</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Interactive Sanctuary Mockup Card */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-lg rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 p-6 sm:p-8 shadow-2xl overflow-hidden">
              
              {/* Card Browser Bar */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 bg-zinc-950/80 border border-zinc-800 px-3 py-1 rounded-full text-[11px] font-mono text-zinc-400">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>{content?.subdomainExample || 'alex-and-maya.harconxs.com'}</span>
                </div>
                <Globe className="w-4 h-4 text-zinc-500" />
              </div>

              {/* Couple Header in Mockup */}
              <div className="text-center space-y-2 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">Eternal Love Sanctuary</span>
                <h3 className="text-2xl font-serif font-bold text-zinc-100">Alex & Maya</h3>
                <p className="text-xs text-zinc-400">Together since October 24, 2023</p>
              </div>

              {/* Live Second Clock */}
              <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-4 sm:p-5 mb-6">
                <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-semibold mb-3">
                  <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Cherished Seconds Elapsed</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2">
                    <span className="block text-xl sm:text-2xl font-bold font-mono text-zinc-100">{days}</span>
                    <span className="text-[10px] text-zinc-400 uppercase">Days</span>
                  </div>
                  <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2">
                    <span className="block text-xl sm:text-2xl font-bold font-mono text-zinc-100">{hours}</span>
                    <span className="text-[10px] text-zinc-400 uppercase">Hours</span>
                  </div>
                  <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2">
                    <span className="block text-xl sm:text-2xl font-bold font-mono text-zinc-100">{minutes}</span>
                    <span className="text-[10px] text-zinc-400 uppercase">Mins</span>
                  </div>
                  <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-2">
                    <span className="block text-xl sm:text-2xl font-bold font-mono text-rose-400">{seconds}</span>
                    <span className="text-[10px] text-zinc-400 uppercase">Secs</span>
                  </div>
                </div>
              </div>

              {/* Music Player Bar Demo */}
              <div className="flex items-center justify-between bg-zinc-950/70 border border-zinc-800 rounded-xl p-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-200">Our Song • Perfect Symphony</p>
                    <p className="text-[10px] text-zinc-500">Playing in background</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-rose-400 font-semibold px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800">
                  LIVE SYNC
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
