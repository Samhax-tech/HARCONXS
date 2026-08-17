import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { YouTubeVideoItem } from '../../types';
import {
  Sparkles,
  Youtube,
  Instagram,
  Send,
  MessageSquare,
  Twitter,
  Github,
  Globe,
  Award,
  ShieldCheck,
  Heart,
  Cpu,
  Play,
  ExternalLink,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  const { youtubeVideos, socialLinks, setCurrentView, setSelectedCategory } = useStore();
  const [activeVideoId, setActiveVideoId] = useState<string | null>(youtubeVideos[0]?.id || null);

  const activeVideo = youtubeVideos.find(v => v.id === activeVideoId) || youtubeVideos[0];

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 pb-20">
      
      {/* 1. HERO BANNER */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The HARCONXS Atelier & Tech Collective</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-100">
            Crafting Physical Keepsakes & Digital Sanctuaries
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Founded by <strong>Hamza</strong>, HARCONXS is an India-born global brand merging precision micron laser engraving, timeless jewelry, lifetime hosted couple memory websites, and enterprise bot automation panels under one unified atelier roof.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => { setSelectedCategory('couples'); setCurrentView('catalog'); }}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Creations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-semibold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Youtube className="w-4 h-4 text-red-500" />
              <span>Watch on YouTube</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. CREATOR & FOUNDER STORY */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
                alt="Hamza - Founder of HARCONXS"
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-90" />
              
              <div className="absolute bottom-6 left-6 right-6 space-y-1">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                  FOUNDER & CHIEF ARTISAN
                </span>
                <h3 className="text-xl font-bold font-serif text-white">Hamza</h3>
                <p className="text-xs text-zinc-300">
                  Creative Technologist & Atelier Director
                </p>
              </div>
            </div>

            {/* Floating India Hub Badge */}
            <div className="absolute -bottom-4 -right-4 bg-zinc-900/95 border border-zinc-700/80 p-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs text-zinc-200 backdrop-blur-md">
              <span className="text-lg">🇮🇳</span>
              <div>
                <p className="font-bold text-white text-[11px]">Bangalore & Mumbai</p>
                <p className="text-[10px] text-zinc-400">Atelier Studio & Tech Hub</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                Our Vision & Heritage
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100 leading-tight">
                "We reject the disposable. We build keepsakes that resonate across decades."
              </h2>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed">
              HARCONXS was born out of a simple observation: conventional gifting had become sterile and automated, while modern software tools lacked human intimacy. We bridged both worlds.
            </p>

            <p className="text-sm text-zinc-400 leading-relaxed">
              When you order a piece from us—whether it is a titanium bracelet laser-etched with the exact coordinate of where you first met, an acrylic music lamp linked to your partner’s anthem, or a lifetime interactive couple sanctuary on the cloud—every detail is touched with human intention and micro-millimeter precision.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 bg-zinc-900/70 border border-zinc-800 rounded-xl">
                <p className="text-xl font-mono font-bold text-amber-400">10,000+</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Keepsakes Delivered</p>
              </div>
              <div className="p-3.5 bg-zinc-900/70 border border-zinc-800 rounded-xl">
                <p className="text-xl font-mono font-bold text-rose-400">4,500+</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Couple Websites Live</p>
              </div>
              <div className="p-3.5 bg-zinc-900/70 border border-zinc-800 rounded-xl col-span-2 sm:col-span-1">
                <p className="text-xl font-mono font-bold text-sky-400">99.9%</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Bot Cloud Uptime</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. YOUTUBE VIDEO SHOWCASE & DEMONSTRATION GALLERY */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-400 uppercase tracking-widest mb-1.5">
              <Youtube className="w-4 h-4" />
              <span>Official Video Studio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
              Watch Our Craftsmanship & Tech in Action
            </h2>
          </div>
          <a
            href={socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-red-600/20 whitespace-nowrap cursor-pointer"
          >
            <Youtube className="w-4 h-4" />
            <span>Subscribe @HARCONXS</span>
          </a>
        </div>

        {/* Featured Video Player Area */}
        {activeVideo && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-4 sm:p-6 mb-8 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Responsive Video Container */}
              <div className="lg:col-span-8 aspect-video rounded-xl overflow-hidden bg-black relative shadow-inner">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=0&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Video metadata */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-zinc-700">
                    {activeVideo.category} • {activeVideo.views}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-100 font-serif leading-snug">
                    {activeVideo.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {activeVideo.description}
                  </p>
                </div>

                <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real unboxing & fabrication stream</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Turnkey digital sanctuary walkthrough</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Video Thumbnails Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {youtubeVideos.map((video) => {
            const isCurrent = video.id === activeVideoId;
            return (
              <button
                key={video.id}
                onClick={() => setActiveVideoId(video.id)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-zinc-900 border-amber-500/80 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/50'
                    : 'bg-zinc-950 hover:bg-zinc-900 border-zinc-800'
                }`}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-2.5 bg-zinc-800">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-[10px] text-zinc-300 px-1.5 py-0.5 rounded font-mono">
                    {video.category}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-zinc-200 line-clamp-2 leading-snug">
                  {video.title}
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1">
                  {video.views} • {video.publishedDate}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. SOCIAL MEDIA CHANNELS & COMMUNITY */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-800/80">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
            Connect With Our Atelier
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
            Join the HARCONXS Community
          </h2>
          <p className="text-xs text-zinc-400">
            Follow our daily laser engraving streams, client unboxings, bot release updates, and exclusive discount drops.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          {/* YouTube */}
          <a
            href={socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-red-500/50 hover:bg-zinc-900 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
          >
            <div className="p-3 bg-red-600/10 text-red-500 rounded-xl group-hover:scale-110 transition-transform">
              <Youtube className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-zinc-200">YouTube</p>
            <span className="text-[10px] text-zinc-400">@HARCONXS</span>
          </a>

          {/* Instagram */}
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-rose-500/50 hover:bg-zinc-900 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
          >
            <div className="p-3 bg-rose-600/10 text-rose-400 rounded-xl group-hover:scale-110 transition-transform">
              <Instagram className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-zinc-200">Instagram</p>
            <span className="text-[10px] text-zinc-400">@harconxs.shop</span>
          </a>

          {/* Telegram */}
          <a
            href={socialLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-sky-500/50 hover:bg-zinc-900 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
          >
            <div className="p-3 bg-sky-600/10 text-sky-400 rounded-xl group-hover:scale-110 transition-transform">
              <Send className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-zinc-200">Telegram</p>
            <span className="text-[10px] text-zinc-400">t.me/harconxs</span>
          </a>

          {/* Discord */}
          <a
            href={socialLinks.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
          >
            <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-zinc-200">Discord</p>
            <span className="text-[10px] text-zinc-400">discord.gg/harconxs</span>
          </a>

          {/* Twitter / X */}
          <a
            href={socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
          >
            <div className="p-3 bg-zinc-800 text-zinc-300 rounded-xl group-hover:scale-110 transition-transform">
              <Twitter className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-zinc-200">Twitter / X</p>
            <span className="text-[10px] text-zinc-400">@harconxs</span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
          >
            <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-zinc-200">WhatsApp</p>
            <span className="text-[10px] text-emerald-400">Direct Chat</span>
          </a>

        </div>
      </section>

      {/* 5. ATELIER QUALITY PROMISE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto md:mx-0">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-100">Micron Fiber Laser Engraving</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every coordinate, signature, and roman numeral is calibrated to 0.02mm depth for permanent heirloom durability.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto md:mx-0">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-100">Zero-Downtime Sanctuaries</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Couple memory websites are hosted on ultra-redundant edge infrastructure with custom SSL certificates for life.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto md:mx-0">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-100">Secure Turnkey Bot Panels</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Automated membership tiers, real-time webhooks, and enterprise uptime dashboards ready to plug into your stack.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
