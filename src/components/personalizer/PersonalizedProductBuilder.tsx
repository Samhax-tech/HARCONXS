import React, { useState } from 'react';
import { Product, PackagingOption, PersonalizationConfig } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Heart, Check, Gift, Type, Calendar, Image, ShieldCheck } from 'lucide-react';

interface Props {
  product: Product;
  selectedPackaging: PackagingOption;
  onPackagingChange: (pkg: PackagingOption) => void;
  onAddToCart: (personalization: PersonalizationConfig) => void;
}

export const PersonalizedProductBuilder: React.FC<Props> = ({
  product,
  selectedPackaging,
  onPackagingChange,
  onAddToCart
}) => {
  const { packagingOptions, formatPrice } = useStore();

  const [names, setNames] = useState('Alex & Sarah');
  const [date, setDate] = useState('2024-06-18');
  const [message, setMessage] = useState('Where forever began 37.7749° N, 122.4194° W');
  const [fontFamily, setFontStyle] = useState('Playfair Display');
  const [colorTheme, setColorTheme] = useState('Rose Gold & Obsidian');
  const [giftNote, setGiftNote] = useState('With all my love across all lifetimes.');

  const fonts = [
    { name: 'Playfair Display', label: 'Classic Serif', style: 'font-serif' },
    { name: 'Inter', label: 'Clean Modern', style: 'font-sans' },
    { name: 'Courier New', label: 'Vintage Typewriter', style: 'font-mono' },
  ];

  const colorThemes = [
    { name: 'Rose Gold & Obsidian', hex: '#f43f5e', border: 'border-rose-500' },
    { name: 'Pure 24K Champagne Gold', hex: '#fbbf24', border: 'border-amber-400' },
    { name: 'Brushed Silver Titanium', hex: '#94a3b8', border: 'border-slate-300' },
    { name: 'Midnight Matte Stealth', hex: '#27272a', border: 'border-zinc-500' }
  ];

  const handleFinish = () => {
    const config: PersonalizationConfig = {
      names,
      date,
      message,
      fontFamily,
      colorTheme,
      giftNote
    };
    onAddToCart(config);
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 sm:p-7 space-y-6">
      
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-zinc-100">Live Personalization Atelier</h3>
            <p className="text-xs text-zinc-400">Laser engraved precision with real-time preview</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 uppercase tracking-wider">
          Included Free
        </span>
      </div>

      {/* LIVE VISUAL PREVIEW CONTAINER */}
      <div className="relative rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-950 p-6 shadow-inner text-center">
        <div className="absolute top-3 left-3 text-[10px] font-mono text-zinc-500 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          LIVE LASER PREVIEW
        </div>

        <div className="max-w-md mx-auto py-6 space-y-3">
          {/* Simulated metallic plate preview */}
          <div className="p-6 rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-700/80 shadow-2xl space-y-3">
            <Heart className="w-6 h-6 text-rose-500 mx-auto fill-rose-500/20" />
            
            <p className={`text-xl sm:text-2xl font-bold tracking-wide text-zinc-100 ${
              fontFamily === 'Playfair Display' ? 'font-serif' : fontFamily === 'Courier New' ? 'font-mono' : 'font-sans'
            }`}>
              {names || 'Your Names Here'}
            </p>

            <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              <span>{date || 'Date'}</span>
            </div>

            <p className="text-xs text-zinc-400 italic max-w-xs mx-auto border-t border-zinc-800 pt-2 font-mono">
              "{message || 'Your custom message or GPS coordinates'}"
            </p>

            <div className="pt-2 text-[10px] text-zinc-500 uppercase tracking-widest">
              Finish: {colorTheme}
            </div>
          </div>
        </div>
      </div>

      {/* Personalization Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        
        {/* Names */}
        <div className="space-y-1.5">
          <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-amber-400" />
            <span>Names or Initials to Engrave</span>
          </label>
          <input
            type="text"
            value={names}
            onChange={(e) => setNames(e.target.value)}
            placeholder="e.g. Liam & Maya"
            maxLength={40}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 outline-none focus:border-zinc-600"
          />
        </div>

        {/* Date */}
        <div className="space-y-1.5">
          <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Special Date / Milestone</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 outline-none focus:border-zinc-600 cursor-pointer"
          />
        </div>

        {/* Custom Message */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="font-semibold text-zinc-200 flex items-center justify-between">
            <span>Custom Message, Coordinates, or Roman Numerals</span>
            <span className="text-[11px] text-zinc-500 font-normal">{message.length}/100</span>
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. 40.7128° N, 74.0060° W or 'Always in my orbit'"
            maxLength={100}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 outline-none focus:border-zinc-600"
          />
        </div>

        {/* Font Selection */}
        <div className="space-y-1.5">
          <label className="font-semibold text-zinc-200">Typography Engraving Style</label>
          <div className="grid grid-cols-3 gap-2">
            {fonts.map((f) => (
              <button
                key={f.name}
                type="button"
                onClick={() => setFontStyle(f.name)}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                  fontFamily === f.name
                    ? 'bg-zinc-800 border-zinc-500 text-white font-bold'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className={f.style}>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Metallic Finish / Tone */}
        <div className="space-y-1.5">
          <label className="font-semibold text-zinc-200">Precious Metal Finish</label>
          <select
            value={colorTheme}
            onChange={(e) => setColorTheme(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 outline-none cursor-pointer"
          >
            {colorThemes.map(ct => (
              <option key={ct.name} value={ct.name}>{ct.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* LUXURY PACKAGING SELECTION */}
      <div className="pt-4 border-t border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-zinc-100 text-xs flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-rose-400" />
            <span>Select Presentation & Unboxing Packaging</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {packagingOptions.map((pkg) => {
            const isSelected = selectedPackaging.id === pkg.id;

            return (
              <div
                key={pkg.id}
                onClick={() => onPackagingChange(pkg)}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-zinc-900 border-amber-500/80 shadow-md'
                    : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <img src={pkg.image} alt={pkg.name} className="w-12 h-12 rounded-lg object-cover bg-zinc-900 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-zinc-100 text-xs truncate">{pkg.name}</p>
                    <span className="font-mono text-xs font-bold text-amber-400 shrink-0 ml-1">
                      {pkg.price === 0 ? 'FREE' : `+${formatPrice(pkg.price)}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">{pkg.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gift Card Note */}
      <div className="space-y-1.5 text-xs">
        <label className="font-semibold text-zinc-200">Handwritten-Style Gift Card Message (Optional)</label>
        <textarea
          value={giftNote}
          onChange={(e) => setGiftNote(e.target.value)}
          rows={2}
          placeholder="Add a sweet secret note inside the envelope..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 outline-none focus:border-zinc-600 resize-none"
        />
      </div>

      {/* Confirm & Add To Bag */}
      <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-zinc-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Laser engraving guarantee & free remake warranty</span>
        </div>

        <button
          onClick={handleFinish}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Confirm & Add Personalized Bag</span>
        </button>
      </div>

    </div>
  );
};
