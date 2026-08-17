import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { CoupleWebsiteTemplate, CoupleWebsiteProject } from '../../types';
import { Heart, Sparkles, Globe, Music, Calendar, Image, CheckCircle2, Play, Pause, Smartphone, Monitor, ArrowRight } from 'lucide-react';

export const CoupleWebsiteBuilder: React.FC = () => {
  const { coupleTemplates, createCoupleWebsite, addToCart, products, formatPrice, setCurrentView, showToast, user } = useStore();

  const [selectedTemplate, setSelectedTemplate] = useState<CoupleWebsiteTemplate>(coupleTemplates[0]);
  const [partner1Name, setPartner1Name] = useState('Alex');
  const [partner2Name, setPartner2Name] = useState('Sarah');
  const [anniversaryDate, setAnniversaryDate] = useState('2024-04-18');
  const [heroTagline, setHeroTagline] = useState('Two hearts in infinite orbit ❤️');
  const [ourStoryTitle, setOurStoryTitle] = useState('Where Our Universe Began');
  const [ourStoryText, setOurStoryText] = useState('From our first rainy evening under the streetlights to travelling 12 countries together. Every moment with you feels like home.');
  const [subdomain, setSubdomain] = useState('alex-and-sarah');
  const [primaryColor, setPrimaryColor] = useState('#e11d48');
  const [fontStyle, setFontStyle] = useState('Playfair Display');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Live timer state
  const [timeElapsed, setTimeElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(anniversaryDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeElapsed({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  const handleLaunchProject = () => {
    const newProject = createCoupleWebsite({
      customerId: user.id,
      subdomain: subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      templateId: selectedTemplate.id,
      partner1Name,
      partner2Name,
      anniversaryDate,
      ourStoryTitle,
      ourStoryText,
      heroTagline,
      primaryColor,
      fontStyle,
      photos: [
        'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80'
      ],
      memories: [
        {
          id: 'mem-1',
          title: 'The First Date',
          date: anniversaryDate,
          description: 'Spilled matcha latte, laughed for three straight hours, and knew right then.'
        }
      ],
      guestbook: [
        {
          id: 'gb-1',
          author: 'Hamza & Friends',
          message: 'Wishing you two endless joy and romantic stargazing forever!',
          date: 'Today'
        }
      ],
      status: 'active'
    });

    const digitalProduct = products.find(p => p.category === 'digital') || products[0];
    addToCart(digitalProduct, 1, undefined, undefined, {
      names: `${partner1Name} & ${partner2Name}`,
      message: `${subdomain}.harconxsshop.com`
    }, selectedTemplate.price);

    setCurrentView('account');
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-10 text-zinc-200 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>HARCONXS Digital Sanctuaries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-100">
            Couple Website Builder & Host
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
            Build your private interactive love sanctuary. Includes live relationship timer, photo timeline, background music, guestbook, and lifetime fast global hosting.
          </p>
        </div>

        {/* 2-COLUMN BUILDER WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 5 COLS: CONTROLS & CUSTOMIZER */}
          <div className="lg:col-span-5 space-y-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 shadow-xl">
            
            {/* Template Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-200">1. Select Romantic Theme Template</label>
              <div className="grid grid-cols-2 gap-2.5">
                {coupleTemplates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tmpl)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedTemplate.id === tmpl.id
                        ? 'bg-zinc-900 border-rose-500/80 ring-1 ring-rose-500/30'
                        : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <p className="font-bold text-zinc-100 text-xs truncate">{tmpl.name}</p>
                    <span className="text-[10px] text-rose-400 font-medium">{tmpl.themeCategory}</span>
                    <p className="font-mono text-xs text-amber-400 font-semibold mt-1">{formatPrice(tmpl.price)}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Couple Names */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-zinc-300">Partner 1</label>
                <input
                  type="text"
                  value={partner1Name}
                  onChange={(e) => setPartner1Name(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 outline-none focus:border-zinc-600"
                />
              </div>
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-zinc-300">Partner 2</label>
                <input
                  type="text"
                  value={partner2Name}
                  onChange={(e) => setPartner2Name(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 outline-none focus:border-zinc-600"
                />
              </div>
            </div>

            {/* Anniversary Date */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Relationship Start Date (Powers live counter)</span>
              </label>
              <input
                type="date"
                value={anniversaryDate}
                onChange={(e) => setAnniversaryDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 outline-none focus:border-zinc-600 cursor-pointer"
              />
            </div>

            {/* Subdomain */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sanctuary Dedicated Subdomain</span>
              </label>
              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100">
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  className="bg-transparent outline-none flex-1 text-xs text-amber-300 font-mono"
                />
                <span className="text-zinc-500 font-mono text-xs">.harconxsshop.com</span>
              </div>
            </div>

            {/* Hero Tagline & Story */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-zinc-300">Hero Tagline</label>
              <input
                type="text"
                value={heroTagline}
                onChange={(e) => setHeroTagline(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 outline-none focus:border-zinc-600"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-zinc-300">Our Story Narrative</label>
              <textarea
                value={ourStoryText}
                onChange={(e) => setOurStoryText(e.target.value)}
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 outline-none focus:border-zinc-600 resize-none"
              />
            </div>

            {/* Publish & Host CTA */}
            <div className="pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={handleLaunchProject}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Heart className="w-4 h-4" />
                <span>Publish Sanctuary & Host • {formatPrice(selectedTemplate.price)} Lifetime</span>
              </button>
            </div>

          </div>

          {/* RIGHT 7 COLS: LIVE INTERACTIVE SANCTUARY SIMULATOR */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Simulator Top Bar */}
            <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-xs">
              <div className="flex items-center gap-2 font-mono text-zinc-400 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>https://{subdomain}.harconxsshop.com</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 cursor-pointer ${
                    isPlayingMusic ? 'bg-rose-950 border-rose-600 text-rose-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}
                  title="Toggle romantic soundtrack"
                >
                  <Music className="w-3.5 h-3.5" />
                  <span>{isPlayingMusic ? 'Playing' : 'Music'}</span>
                </button>

                <div className="flex items-center bg-zinc-800 rounded-lg p-0.5 border border-zinc-700">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1 rounded ${previewDevice === 'desktop' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1 rounded ${previewDevice === 'mobile' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* LIVE PREVIEW CONTAINER */}
            <div className={`mx-auto transition-all duration-300 ${previewDevice === 'mobile' ? 'max-w-xs' : 'w-full'}`}>
              <div className="rounded-3xl overflow-hidden border border-zinc-700 bg-zinc-950 shadow-2xl min-h-[560px] flex flex-col relative text-zinc-100">
                
                {/* Hero Header with Couple Photo background */}
                <div className="relative h-64 sm:h-72 overflow-hidden flex items-center justify-center text-center p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent">
                  <img
                    src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1000&auto=format&fit=crop&q=80"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-35 filter blur-[1px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />

                  <div className="relative z-10 space-y-2">
                    <Heart className="w-8 h-8 text-rose-500 mx-auto fill-rose-500/40 animate-pulse" />
                    <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wide">
                      {partner1Name} & {partner2Name}
                    </h2>
                    <p className="text-xs sm:text-sm text-rose-300 font-sans">{heroTagline}</p>
                  </div>
                </div>

                {/* LIVE ANNIVERSARY COUNTER */}
                <div className="px-6 py-4 -mt-8 relative z-20">
                  <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 shadow-xl">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 block text-center mb-2">
                      In Love For
                    </span>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
                        <span className="font-mono text-base sm:text-xl font-bold text-zinc-100">{timeElapsed.days}</span>
                        <p className="text-[10px] text-zinc-400 uppercase">Days</p>
                      </div>
                      <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
                        <span className="font-mono text-base sm:text-xl font-bold text-zinc-100">{timeElapsed.hours}</span>
                        <p className="text-[10px] text-zinc-400 uppercase">Hours</p>
                      </div>
                      <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
                        <span className="font-mono text-base sm:text-xl font-bold text-zinc-100">{timeElapsed.minutes}</span>
                        <p className="text-[10px] text-zinc-400 uppercase">Mins</p>
                      </div>
                      <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
                        <span className="font-mono text-base sm:text-xl font-bold text-rose-400">{timeElapsed.seconds}</span>
                        <p className="text-[10px] text-zinc-400 uppercase">Secs</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STORY & MEMORIES */}
                <div className="p-6 space-y-6 text-xs">
                  <div>
                    <h3 className="text-base font-serif font-bold text-zinc-100 mb-2">{ourStoryTitle}</h3>
                    <p className="text-zinc-300 leading-relaxed bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80 font-sans">
                      {ourStoryText}
                    </p>
                  </div>

                  {/* Photo Stream */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Memory Timeline</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl overflow-hidden border border-zinc-800 aspect-video bg-zinc-900 relative group">
                        <img
                          src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&auto=format&fit=crop&q=80"
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-end p-2 text-[10px] font-medium text-white">
                          First Summer Trip
                        </div>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-zinc-800 aspect-video bg-zinc-900 relative group">
                        <img
                          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format&fit=crop&q=80"
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-end p-2 text-[10px] font-medium text-white">
                          Amalfi Sunset
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Guestbook */}
                  <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/80 space-y-2">
                    <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">Friends & Family Guestbook</span>
                    <p className="text-[11px] text-zinc-400 italic">"Wishing you two endless joy and adventures!" — Elena & Marcus</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
