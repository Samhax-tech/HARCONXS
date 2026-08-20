import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomOrderRelationship, CustomOrderOccasion, CustomOrderPersonalText } from '../../types';
import { Analytics } from '../../services/analyticsService';
import {
  Sparkles,
  Heart,
  Gift,
  ArrowRight,
  CheckCircle2,
  UploadCloud,
  Calendar,
  DollarSign,
  ArrowLeft,
  X,
  FileText,
  Image as ImageIcon,
  Loader2,
  Package,
  ShieldCheck,
  Palette,
  Type,
  MapPin,
  Clock,
  Compass,
  Layers,
  Sparkle,
  Eye,
  Check,
  AlertCircle
} from 'lucide-react';

interface CuratedCustomProduct {
  id: string;
  name: string;
  category: string;
  tagline: string;
  startingPrice: number;
  image: string;
  materials: string[];
  badges: string[];
}

const CURATED_CUSTOM_PRODUCTS: CuratedCustomProduct[] = [
  {
    id: 'prod-music-box',
    name: 'Titanium Mechanical Music Box with Holographic Portrait',
    category: 'Couples & Keepsakes',
    tagline: 'Precision 18-note Japanese mechanical movement housed in aerospace titanium with laser-engraved 3D optical crystal.',
    startingPrice: 160,
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80',
    materials: ['Grade 5 Titanium', 'Mahogany Wood', 'Optical Crystal', 'Sankyo Gold Movement'],
    badges: ['Most Popular', 'Bespoke Tune']
  },
  {
    id: 'prod-kinetic-box',
    name: 'Celestial Coordinates Rotating Dual-Axis Kinetic Ring Box',
    category: 'Proposal & Wedding',
    tagline: 'Dual planetary brass gears rotate upon opening to elevate ring cushions under a warm halo LED beam.',
    startingPrice: 220,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
    materials: ['Swiss Brass Gears', 'Brushed Titanium', 'Midnight Velvet', 'Micro-LED Halo'],
    badges: ['Patent Mechanism', 'Proposal Ready']
  },
  {
    id: 'prod-damascus-ring',
    name: 'Hand-Forged Damascus Steel Custom Ring with Starlight Inlay',
    category: 'Jewelry & Rings',
    tagline: '120-layer folded meteorite steel inlaid with crushed opal, starlight luminescence, and personal micro-engraving.',
    startingPrice: 185,
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80',
    materials: ['Damascus Meteorite Steel', 'Gia-Certified Inlay', 'Luminescent Core'],
    badges: ['Hand-Forged', 'Lifetime Fit']
  },
  {
    id: 'prod-star-lamp',
    name: 'Starlight 3D Holographic Couple Crystal Lamp & Constellation Map',
    category: 'Home & Atmosphere',
    tagline: 'Internal laser micro-fracture mapping your exact sky constellation at the moment you first met or married.',
    startingPrice: 125,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
    materials: ['K9 Optical Crystal', 'Walnut Wood Base', 'Touch Dimming LED', 'NASA Star Data'],
    badges: ['Astronomy Grounded', 'Custom Map']
  },
  {
    id: 'prod-leather-vault',
    name: 'Italian Full-Grain Monogrammed Leather Keepsake & Watch Vault',
    category: 'Leather & Accessories',
    tagline: 'Tuscan vegetable-tanned bridle leather with hand-stitched linen thread, solid brass hardware, and personalized blind debossing.',
    startingPrice: 140,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    materials: ['Tuscan Full-Grain Leather', 'French Waxed Thread', 'Solid Antiqued Brass'],
    badges: ['Artisan Leather', 'Heirloom Grade']
  },
  {
    id: 'prod-digital-portal',
    name: 'Bespoke Interactive Couple Sanctuary & Digital Web Portal',
    category: 'Digital Experience',
    tagline: 'Custom private subdomain website with live relationship clocks, memory constellation, secret voice memos, and animated photo archive.',
    startingPrice: 95,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    materials: ['Custom Subdomain', 'Cloud Serverless', 'Realtime Chat', 'Audio Player'],
    badges: ['Instant Launch', 'Interactive Web']
  },
  {
    id: 'prod-soundwave-pendant',
    name: 'Custom Aerospace Engraved Pendant with Secret Soundwave QR',
    category: 'Jewelry & Keepsakes',
    tagline: 'Your recorded voice note or heartbeat waveform micro-machined in precious metal with an interactive scannable cipher.',
    startingPrice: 110,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
    materials: ['Sterling Silver 925 / 18K Gold', 'Laser Waveform', 'Micro-Cipher Link'],
    badges: ['Audio Keepsake', 'Waterproof']
  },
  {
    id: 'prod-unique-concept',
    name: 'Completely Unique Custom Concept (Artisan Consultation)',
    category: 'Bespoke Commission',
    tagline: 'Have an extraordinary idea not listed above? Describe your vision and our master jewelers and engineers will create CAD schematics from scratch.',
    startingPrice: 150,
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&auto=format&fit=crop&q=80',
    materials: ['Any Metal Alloy', 'Rare Woods', 'Smart Electronics', 'Precious Gemstones'],
    badges: ['1-on-1 Consultation', 'Unlimited Scope']
  }
];

const RECIPIENT_OPTIONS: { id: CustomOrderRelationship; label: string; icon: string; desc: string }[] = [
  { id: 'girlfriend', label: 'Girlfriend', icon: '❤️', desc: 'Romantic, thoughtful & personalized gifts' },
  { id: 'boyfriend', label: 'Boyfriend', icon: '💙', desc: 'Precision tech, watches, leather & engraved keepsakes' },
  { id: 'husband', label: 'Husband', icon: '💍', desc: 'Milestone anniversaries, luxury accessories & bespoke heirlooms' },
  { id: 'wife', label: 'Wife', icon: '💎', desc: 'Fine custom jewelry, crystal star maps & romantic music boxes' },
  { id: 'friend', label: 'Friend / Best Friend', icon: '✨', desc: 'Celebratory tokens, soundwave pendants & friendship keepsakes' },
  { id: 'family member', label: 'Family Member', icon: '🏡', desc: 'Parents, siblings & cherished generational family heirlooms' },
  { id: 'couple', label: 'Couple / Partner', icon: '🥂', desc: 'Matching sets, dual kinetic boxes & couple web sanctuaries' },
  { id: 'other', label: 'Myself / Other', icon: '🌟', desc: 'Personal bespoke creations & custom digital experiences' }
];

const OCCASIONS: CustomOrderOccasion[] = [
  'Birthday',
  'Anniversary',
  "Valentine's Day",
  'Proposal',
  'Wedding',
  'Friendship',
  'Graduation',
  'Celebration',
  'Surprise',
  'Just Because',
  'Other'
];

const DESIGN_STYLES = [
  {
    id: 'vintage-atelier',
    name: 'Vintage Romantic Atelier',
    desc: 'Ornate Victorian filigree, hand-applied wax seal engraving, warm antique gold and deep rosewood tones.'
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimalist Bauhaus',
    desc: 'Clean geometric lines, chamfered titanium edges, high-contrast monochrome and brushed satin metal.'
  },
  {
    id: 'celestial-cosmos',
    name: 'Celestial Star Atlas & Nebula',
    desc: 'Astronomical orbit paths, deep space midnight pigments, constellation coordinate grids, and starlight inlays.'
  },
  {
    id: 'botanical-monogram',
    name: 'Botanical Floral Monogram',
    desc: 'Delicate laurel wreaths, hand-drawn vine flourishes, pressed botanical motifs with 24K gold foil accents.'
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Hologram & Tech Core',
    desc: 'Precision laser-scribed circuit lines, edge-lit optical acrylic, dark obsidian carbon and glowing LED elements.'
  },
  {
    id: 'royal-heraldry',
    name: 'Renaissance Royal Heraldry',
    desc: 'Roman numerals, heraldic crests, archival serif typography, and dual-layer engraved relief shields.'
  }
];

const FONTS_AVAILABLE = [
  { id: 'Royal Calligraphy', name: 'Royal Calligraphy (Cormorant Garamond Italic)', css: 'font-serif italic tracking-wide' },
  { id: 'Minimal Modern Sans', name: 'Minimal Modern Sans (Montserrat / Inter)', css: 'font-sans font-bold tracking-tight' },
  { id: 'Classic Roman Serif', name: 'Classic Roman Serif (Playfair Display)', css: 'font-serif font-medium tracking-normal' },
  { id: 'Gothic Monogram', name: 'Gothic Architectural Monogram (Cinzel Decorative)', css: 'font-serif font-black tracking-widest uppercase' }
];

const COLOR_SWATCHES = [
  { name: '18K Yellow Gold Inlay', color: '#E5A93C', bg: 'bg-[#E5A93C]' },
  { name: 'Atelier Rose Gold', color: '#E09F8C', bg: 'bg-[#E09F8C]' },
  { name: 'Brushed Titanium Silver', color: '#C0C0C0', bg: 'bg-[#C0C0C0]' },
  { name: 'Matte Midnight Obsidian', color: '#18181B', bg: 'bg-[#18181B]' },
  { name: 'Deep Rosewood Mahogany', color: '#581C1A', bg: 'bg-[#581C1A]' },
  { name: 'Royal Emerald Malachite', color: '#064E3B', bg: 'bg-[#064E3B]' },
  { name: 'Deep Velvet Burgundy', color: '#4C0519', bg: 'bg-[#4C0519]' },
  { name: 'Brushed Damascus Steel', color: '#52525B', bg: 'bg-[#52525B]' }
];

export const CustomOrderBuilder: React.FC = () => {
  const {
    createCustomOrderRequest,
    setCurrentView,
    currentUser,
    packagingOptions,
    uploadCustomOrderFile,
    formatPrice,
    showToast
  } = useStore();

  // Wizard Steps (1 to 6)
  // Step 1: Recipient & Relationship
  // Step 2: Product Base Selection & Occasion
  // Step 3: Design Style & Personal Text
  // Step 4: Images & Photo Uploads (Personal & Reference via Supabase Storage)
  // Step 5: Colors, Packaging & Calligraphy Note
  // Step 6: Live 3D Keepsake Preview & Dispatch
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [recipient, setRecipient] = useState<string>('Sarah Al-Mansoor');
  const [relationship, setRelationship] = useState<CustomOrderRelationship>('girlfriend');
  const [occasion, setOccasion] = useState<CustomOrderOccasion>('Birthday');
  const [selectedProduct, setSelectedProduct] = useState<CuratedCustomProduct>(CURATED_CUSTOM_PRODUCTS[0]);
  const [customProductTitle, setCustomProductTitle] = useState<string>('');
  const [budgetRange, setBudgetRange] = useState<string>('$150 - $300');

  React.useEffect(() => {
    Analytics.trackCustomOrderStarted({
      recipient,
      relationship,
      occasion
    });
  }, []);

  // Customization & Style
  const [selectedDesignStyle, setSelectedDesignStyle] = useState<string>(DESIGN_STYLES[0].name);
  const [personalText, setPersonalText] = useState<CustomOrderPersonalText>({
    primaryNames: 'Hamza & Sarah',
    milestoneDate: '2024-09-15',
    coordinates: '48.8584° N, 2.2945° E',
    customQuote: 'Every note in this melody is a chapter in our infinite story. Forever yours.',
    typographyFont: 'Royal Calligraphy',
    engravingPlacement: 'Inside Box Lid & Outer Bezel'
  });

  // Uploaded Photos & References
  const [uploadedPersonalImages, setUploadedPersonalImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80'
  ]);
  const [uploadedReferenceImages, setUploadedReferenceImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'
  ]);
  const [isUploadingPersonal, setIsUploadingPersonal] = useState<boolean>(false);
  const [isUploadingRef, setIsUploadingRef] = useState<boolean>(false);

  // Colors & Options
  const [selectedColors, setSelectedColors] = useState<string[]>([
    'Deep Rosewood Mahogany',
    '18K Yellow Gold Inlay',
    'Matte Midnight Obsidian'
  ]);
  const [customOptions, setCustomOptions] = useState<Record<string, string>>({
    'Mechanism Tune': "Can't Help Falling in Love (18-Note Sankyo Gold)",
    'Engraving Depth': '0.45mm Micro-Diamond Scribed',
    'Lid Interior Finish': 'Midnight Velvet Padding'
  });

  // Packaging & Gift Note
  const [selectedPackagingId, setSelectedPackagingId] = useState<string>(
    packagingOptions.length > 0 ? packagingOptions[0].id : 'pkg-luxury'
  );
  const [giftNote, setGiftNote] = useState<string>(
    'To my dearest Sarah, happy birthday! May this melody always bring you back to our starlit night in Paris.'
  );
  const [customerNotes, setCustomerNotes] = useState<string>(
    'Please ensure the star coordinates are centered directly beneath our names, and calibrate the music box speed to gentle tempo.'
  );
  const [targetDeliveryDate, setTargetDeliveryDate] = useState<string>('2026-09-20');

  // Supabase Storage file handlers
  const handleUploadPersonalPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPersonal(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await uploadCustomOrderFile(files[i]);
        if (res.success && res.url) {
          urls.push(res.url);
        }
      }
      setUploadedPersonalImages(prev => [...prev, ...urls]);
      showToast(`${urls.length} personal portrait(s) uploaded to Supabase Storage.`);
    } catch {
      showToast('Failed to upload images to Supabase Storage.');
    } finally {
      setIsUploadingPersonal(false);
      e.target.value = '';
    }
  };

  const handleUploadReferencePhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingRef(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await uploadCustomOrderFile(files[i]);
        if (res.success && res.url) {
          urls.push(res.url);
        }
      }
      setUploadedReferenceImages(prev => [...prev, ...urls]);
      showToast(`${urls.length} reference drawing(s) stored in Supabase Storage.`);
    } catch {
      showToast('Failed to upload reference files.');
    } finally {
      setIsUploadingRef(false);
      e.target.value = '';
    }
  };

  const toggleColor = (colorName: string) => {
    if (selectedColors.includes(colorName)) {
      if (selectedColors.length > 1) {
        setSelectedColors(prev => prev.filter(c => c !== colorName));
      }
    } else {
      setSelectedColors(prev => [...prev, colorName]);
    }
  };

  const handleSubmitCustomOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const customerName = currentUser?.fullName || 'Distinguished Patron';
    const customerEmail = currentUser?.email || 'patron@harconxs.com';
    const customerId = currentUser?.id || `cust-${Date.now()}`;

    const effectiveProductType = selectedProduct.id === 'prod-unique-concept' && customProductTitle.trim()
      ? customProductTitle.trim()
      : selectedProduct.name;

    const allUploadedFiles = [...uploadedPersonalImages, ...uploadedReferenceImages];

    const description = `Bespoke custom creation for ${recipient} (${relationship}) on occasion of ${occasion}. Style: ${selectedDesignStyle}. Colors: ${selectedColors.join(', ')}. Details: ${customerNotes || 'Fabrication per specs.'}`;

    const createdOrder = createCustomOrderRequest({
      customerId,
      customerName,
      customerEmail,
      recipient,
      relationship,
      occasion,
      budgetRange,
      productType: effectiveProductType,
      customDesign: selectedDesignStyle,
      personalText,
      uploadedImages: uploadedPersonalImages,
      referenceImages: uploadedReferenceImages,
      uploadedFiles: allUploadedFiles,
      selectedColors,
      preferredColors: selectedColors,
      preferredStyle: selectedDesignStyle,
      customOptions,
      selectedPackagingId,
      giftNote,
      customerNotes,
      description,
      targetDeliveryDate
    });

    showToast(`✨ Custom order ${createdOrder.requestNumber} registered in Atelier!`);
    setCurrentView('custom-portal');
  };

  const selectedPkg = packagingOptions.find(p => p.id === selectedPackagingId) || packagingOptions[0];

  return (
    <div className="bg-zinc-950 min-h-screen py-10 text-zinc-200 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Atelier Top Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/80 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>HARCONXS Bespoke Gifting & Fabrication Studio</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-zinc-100 tracking-tight">
            CREATE SOMETHING SPECIAL ❤️
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans max-w-2xl mx-auto">
            Design a one-of-a-kind bespoke keepsake for your partner, friend, or family. Complete the guided customization wizard to receive 3D CAD blueprints, an official quotation, and direct artisan consultation.
          </p>
        </div>

        {/* 6-Step Multi-Stage Navigation Tabs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs font-medium border-b border-zinc-800 pb-4">
          {[
            { num: 1, label: 'Recipient' },
            { num: 2, label: 'Product Base' },
            { num: 3, label: 'Design & Text' },
            { num: 4, label: 'Photos & Assets' },
            { num: 5, label: 'Packaging & Note' },
            { num: 6, label: 'Preview & Launch' }
          ].map(s => {
            const isCurrent = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                  isCurrent
                    ? 'bg-amber-400 text-zinc-950 font-bold border-amber-400 shadow-lg shadow-amber-400/20'
                    : isCompleted
                    ? 'bg-zinc-900 text-amber-300 border-zinc-700 hover:border-zinc-600'
                    : 'bg-zinc-950/60 text-zinc-500 border-zinc-800/80 hover:text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <span className="text-[10px] font-mono font-bold">0{s.num}</span>
                  )}
                </div>
                <span className="truncate text-[11px]">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Wizard Form Container */}
        <form onSubmit={handleSubmitCustomOrder} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">

          {/* ========================================================================= */}
          {/* STEP 1: SELECT RECIPIENT & RELATIONSHIP */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">Step 01 / 06</span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 mt-1">Who is this special creation for?</h2>
                <p className="text-xs text-zinc-400 mt-1">Select the recipient relationship to tailor our artisan recommendations.</p>
              </div>

              {/* Recipient Relationship Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {RECIPIENT_OPTIONS.map(opt => {
                  const isSelected = relationship.toLowerCase() === opt.id.toLowerCase();
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setRelationship(opt.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-950/40 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                          : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{opt.icon}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                      <div>
                        <h3 className={`text-sm font-bold ${isSelected ? 'text-amber-300' : 'text-zinc-200'}`}>{opt.label}</h3>
                        <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed line-clamp-2">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Recipient Details & Occasion Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800/80 text-xs">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1.5">
                    Recipient Full Name / Nickname <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="e.g. Sarah, Alexander, My Love"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 outline-none focus:border-amber-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1.5">
                    Special Occasion <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value as CustomOrderOccasion)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 outline-none focus:border-amber-400 text-xs cursor-pointer"
                  >
                    {OCCASIONS.map(occ => (
                      <option key={occ} value={occ}>{occ}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="flex justify-end pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!recipient.trim()}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Select Product Base</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: SELECT PRODUCT BASE & BUDGET */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">Step 02 / 06</span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 mt-1">Choose your Bespoke Canvas</h2>
                <p className="text-xs text-zinc-400 mt-1">Select from our signature mechanical, celestial, and precious metal foundations.</p>
              </div>

              {/* Curated Product Base Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {CURATED_CUSTOM_PRODUCTS.map(prod => {
                  const isSelected = selectedProduct.id === prod.id;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-amber-950/40 border-amber-400 shadow-xl ring-1 ring-amber-400/50'
                          : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="aspect-video rounded-xl overflow-hidden mb-3 relative bg-zinc-950">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[9px] font-mono font-bold text-amber-300 border border-zinc-700">
                            {prod.badges[0] || prod.category}
                          </span>
                        </div>
                        <h3 className={`text-xs font-bold leading-snug line-clamp-2 ${isSelected ? 'text-amber-300' : 'text-zinc-100'}`}>
                          {prod.name}
                        </h3>
                        <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                          {prod.tagline}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500 font-mono">From</span>
                        <span className="text-xs font-bold text-amber-400 font-mono">
                          {formatPrice(prod.startingPrice)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* If "Completely Unique Concept" is selected, show custom title input */}
              {selectedProduct.id === 'prod-unique-concept' && (
                <div className="bg-zinc-950 p-4 rounded-2xl border border-amber-500/50 space-y-2 text-xs">
                  <label className="block text-amber-300 font-bold">
                    Describe Your Custom Concept Title:
                  </label>
                  <input
                    type="text"
                    value={customProductTitle}
                    onChange={(e) => setCustomProductTitle(e.target.value)}
                    placeholder="e.g. Damascus Steel Chess Set with LED Coordinates"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-100 outline-none focus:border-amber-400 text-xs"
                  />
                </div>
              )}

              {/* Budget Range & Estimated Target Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800 text-xs">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1.5">Estimated Budget Preference</label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 outline-none focus:border-amber-400 text-xs cursor-pointer"
                  >
                    <option value="$50 - $100">$50 - $100 (Standard Personalization)</option>
                    <option value="$100 - $250">$100 - $250 (Bespoke Keepsakes & Music Boxes)</option>
                    <option value="$250 - $500">$250 - $500 (Dual Kinetic Mechanisms & Damascus)</option>
                    <option value="$500 - $1,000">$500 - $1,000 (Fine 18K Gold & Precious Stones)</option>
                    <option value="$1,000+">$1,000+ (Master Atelier Full Custom Commission)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1.5">Target Delivery Date (Optional)</label>
                  <input
                    type="date"
                    value={targetDeliveryDate}
                    onChange={(e) => setTargetDeliveryDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 outline-none focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="flex justify-between pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Design & Engraving Text</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: CHOOSE DESIGN STYLE & PERSONAL TEXT */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">Step 03 / 06</span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 mt-1">Design Style & Personal Text Inscription</h2>
                <p className="text-xs text-zinc-400 mt-1">Specify names, milestone dates, star coordinates, and engraving fonts.</p>
              </div>

              {/* Design Style Selector */}
              <div>
                <label className="block text-zinc-300 font-bold text-xs mb-2">Select Design & Aesthetic Motif:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {DESIGN_STYLES.map(style => {
                    const isSelected = selectedDesignStyle === style.name;
                    return (
                      <div
                        key={style.id}
                        onClick={() => setSelectedDesignStyle(style.name)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-400 shadow-md'
                            : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <h4 className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-zinc-200'}`}>{style.name}</h4>
                        <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">{style.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Personal Text Fields */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-4 text-xs">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Personal Inscription Details</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">Names / Initials</label>
                    <input
                      type="text"
                      value={personalText.primaryNames || ''}
                      onChange={(e) => setPersonalText({ ...personalText, primaryNames: e.target.value })}
                      placeholder="e.g. Hamza & Sarah"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Milestone Date</label>
                    <input
                      type="text"
                      value={personalText.milestoneDate || ''}
                      onChange={(e) => setPersonalText({ ...personalText, milestoneDate: e.target.value })}
                      placeholder="e.g. 2024-09-15 or Sept 15, 2024"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">GPS / Star Coordinates</label>
                    <input
                      type="text"
                      value={personalText.coordinates || ''}
                      onChange={(e) => setPersonalText({ ...personalText, coordinates: e.target.value })}
                      placeholder="e.g. 48.8584° N, 2.2945° E"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Secret Inscribed Quote / Love Note Excerpt</label>
                  <textarea
                    rows={2}
                    value={personalText.customQuote || ''}
                    onChange={(e) => setPersonalText({ ...personalText, customQuote: e.target.value })}
                    placeholder="e.g. Every note in this melody is a chapter in our infinite story. Forever yours."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-100 outline-none focus:border-amber-400 leading-relaxed resize-none"
                  />
                </div>

                {/* Typography Choice */}
                <div className="pt-2 border-t border-zinc-800">
                  <label className="block text-zinc-400 mb-2 font-medium">Select Calligraphy / Laser Typography Font:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {FONTS_AVAILABLE.map(font => {
                      const isSelected = personalText.typographyFont === font.id;
                      return (
                        <button
                          key={font.id}
                          type="button"
                          onClick={() => setPersonalText({ ...personalText, typographyFont: font.id })}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-950/50 border-amber-400 text-amber-300'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                          }`}
                        >
                          <span className="text-[10px] text-zinc-500 block font-mono">{font.id}</span>
                          <span className={`text-sm mt-1 block ${font.css}`}>
                            {personalText.primaryNames || 'Hamza & Sarah'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="flex justify-between pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Upload Photos & Assets</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: UPLOAD IMAGES (SUPABASE STORAGE) */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">Step 04 / 06</span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 mt-1">Upload Photos & Reference Drawings</h2>
                <p className="text-xs text-zinc-400 mt-1">Files are stored securely in Supabase Storage and delivered directly to the laser artisan bench.</p>
              </div>

              {/* 2 Upload Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Personal Recipient / Couple Photos for 3D Engraving */}
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <div>
                      <h4 className="font-bold text-zinc-100">1. Couple / Recipient Portraits</h4>
                      <p className="text-[10px] text-zinc-500">Used for 3D laser crystal engraving, portrait cameos & holograms</p>
                    </div>
                  </div>

                  <label className="border-2 border-dashed border-zinc-800 hover:border-amber-400/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-zinc-900/40 hover:bg-zinc-900/80">
                    <UploadCloud className="w-8 h-8 text-amber-400 mb-2" />
                    <span className="font-bold text-zinc-200">Upload Couple Photos</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">PNG, JPG, HEIC up to 25MB</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleUploadPersonalPhotos}
                      disabled={isUploadingPersonal}
                      className="hidden"
                    />
                  </label>

                  {isUploadingPersonal && (
                    <div className="flex items-center justify-center gap-2 text-amber-400 font-mono text-[11px]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Syncing to Supabase Storage Bucket...</span>
                    </div>
                  )}

                  {uploadedPersonalImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      {uploadedPersonalImages.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900 group">
                          <img src={url} alt="Personal" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setUploadedPersonalImages(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-black/80 hover:bg-rose-600 text-white rounded p-1 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Design Reference Sketches / Blueprints */}
                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-400" />
                    <div>
                      <h4 className="font-bold text-zinc-100">2. Reference Sketches & Blueprints</h4>
                      <p className="text-[10px] text-zinc-500">Inspiration photos, hand sketches, CAD drawings or monograms</p>
                    </div>
                  </div>

                  <label className="border-2 border-dashed border-zinc-800 hover:border-amber-400/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-zinc-900/40 hover:bg-zinc-900/80">
                    <UploadCloud className="w-8 h-8 text-amber-400 mb-2" />
                    <span className="font-bold text-zinc-200">Upload Reference Images</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">Vector, SVG, PDF, Images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.svg"
                      onChange={handleUploadReferencePhotos}
                      disabled={isUploadingRef}
                      className="hidden"
                    />
                  </label>

                  {isUploadingRef && (
                    <div className="flex items-center justify-center gap-2 text-amber-400 font-mono text-[11px]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Storing references in Supabase Storage...</span>
                    </div>
                  )}

                  {uploadedReferenceImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      {uploadedReferenceImages.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900 group">
                          <img src={url} alt="Reference" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setUploadedReferenceImages(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-black/80 hover:bg-rose-600 text-white rounded p-1 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Navigation Footer */}
              <div className="flex justify-between pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Colors, Packaging & Gift Note</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: COLORS, PACKAGING & GIFT MESSAGE */}
          {/* ========================================================================= */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">Step 05 / 06</span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 mt-1">Materials, Packaging & Calligraphy Letter</h2>
                <p className="text-xs text-zinc-400 mt-1">Select metal alloys, presentation vault, and handwritten wax-sealed gift note.</p>
              </div>

              {/* Color & Material Palette */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-zinc-300">Select Metal Alloys & Finish Swatches (Multi-select):</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {COLOR_SWATCHES.map(sw => {
                    const isSelected = selectedColors.includes(sw.name);
                    return (
                      <button
                        key={sw.name}
                        type="button"
                        onClick={() => toggleColor(sw.name)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-400 shadow-sm'
                            : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-white/20 shrink-0 shadow-inner"
                          style={{ backgroundColor: sw.color }}
                        />
                        <span className={`text-[11px] font-medium leading-tight truncate ${isSelected ? 'text-amber-300 font-bold' : 'text-zinc-300'}`}>
                          {sw.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Packaging Options */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-zinc-300">Select Presentation Box / Vault Case:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {packagingOptions.map(pkg => {
                    const isSelected = selectedPackagingId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackagingId(pkg.id)}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-950/50 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                            : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div>
                          {pkg.image && (
                            <div className="aspect-video rounded-xl overflow-hidden mb-2 bg-zinc-950">
                              <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <h4 className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-zinc-200'}`}>{pkg.name}</h4>
                          <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed line-clamp-2">{pkg.description}</p>
                        </div>
                        <div className="pt-2 mt-2 border-t border-zinc-800 flex items-center justify-between text-[11px]">
                          <span className="text-zinc-500">Add-on</span>
                          <span className="font-bold text-amber-400 font-mono">
                            {pkg.price > 0 ? formatPrice(pkg.price) : 'Included'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Calligraphy Wax-Sealed Gift Note */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 uppercase font-mono tracking-wider">Handwritten Calligraphy Card Note</span>
                  <span className="text-[10px] text-zinc-500">Printed on 300gsm cotton rag paper</span>
                </div>

                <textarea
                  rows={3}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Enter your personal gift message to be wax-sealed inside the presentation box..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-amber-200 font-serif italic text-sm outline-none focus:border-amber-400 leading-relaxed resize-none"
                />

                <div>
                  <label className="block text-zinc-400 mb-1 text-[11px]">Special Artisan Machining Instructions & Notes:</label>
                  <input
                    type="text"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="e.g. Please polish the bevels to a mirror finish and calibrate music tempo"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 text-xs outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="flex justify-between pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Review & Live 3D Preview</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6: LIVE 3D PREVIEW & SUBMIT CUSTOM ORDER */}
          {/* ========================================================================= */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-4">
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">Step 06 / 06</span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 mt-1">Review Your Custom Brief & Live Preview</h2>
                <p className="text-xs text-zinc-400 mt-1">Review all specifications before submitting to our master artisans for quotation and CAD proofing.</p>
              </div>

              {/* Live Preview Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Visual Mock & Inscription Proof */}
                <div className="lg:col-span-7 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 rounded-3xl border-2 border-amber-500/50 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-800">
                      Bespoke Masterpiece Proof
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      Recipient: <strong className="text-zinc-200">{recipient}</strong>
                    </span>
                  </div>

                  {/* Primary Product Visual */}
                  <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 relative">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
                      <span className="text-[10px] uppercase font-mono text-amber-400 font-bold tracking-widest">{selectedDesignStyle}</span>
                      <h3 className="text-lg font-serif font-bold text-white leading-tight mt-0.5">
                        {selectedProduct.id === 'prod-unique-concept' && customProductTitle ? customProductTitle : selectedProduct.name}
                      </h3>
                    </div>
                  </div>

                  {/* Live Inscription Visualizer */}
                  <div className="bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800 space-y-2 text-center">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono block">Simulated Laser Inscription</span>
                    <h4 className={`text-xl text-amber-300 ${
                      personalText.typographyFont === 'Royal Calligraphy'
                        ? 'font-serif italic'
                        : personalText.typographyFont === 'Gothic Monogram'
                        ? 'font-serif font-black tracking-widest uppercase'
                        : personalText.typographyFont === 'Classic Roman Serif'
                        ? 'font-serif'
                        : 'font-sans font-bold'
                    }`}>
                      {personalText.primaryNames || 'Hamza & Sarah'}
                    </h4>

                    <div className="flex items-center justify-center gap-3 text-xs text-zinc-400 font-mono">
                      <span>{personalText.milestoneDate || '2024-09-15'}</span>
                      <span>•</span>
                      <span className="text-amber-400/80">{personalText.coordinates || '48.8584° N, 2.2945° E'}</span>
                    </div>

                    {personalText.customQuote && (
                      <p className="text-xs text-zinc-300 italic font-serif mt-2 px-4 py-2 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
                        "{personalText.customQuote}"
                      </p>
                    )}
                  </div>

                  {/* Attached Photos Preview */}
                  {(uploadedPersonalImages.length > 0 || uploadedReferenceImages.length > 0) && (
                    <div className="space-y-2 pt-2 border-t border-zinc-800">
                      <span className="text-[10px] uppercase font-mono text-zinc-400 block font-bold">
                        Attached Assets ({uploadedPersonalImages.length + uploadedReferenceImages.length}):
                      </span>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {[...uploadedPersonalImages, ...uploadedReferenceImages].map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="Asset"
                            className="w-14 h-14 rounded-xl object-cover border border-zinc-700 bg-zinc-950 shrink-0"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Order Specs Summary */}
                <div className="lg:col-span-5 bg-zinc-950 p-6 rounded-3xl border border-zinc-800 space-y-4 text-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-serif font-bold text-sm text-zinc-100 uppercase tracking-widest border-b border-zinc-800 pb-2">
                      Commission Specifications
                    </h3>

                    <div className="space-y-2 divide-y divide-zinc-900 text-xs">
                      <div className="flex justify-between py-1">
                        <span className="text-zinc-400">Recipient:</span>
                        <span className="font-bold text-zinc-200">{recipient} ({relationship})</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-zinc-400">Occasion:</span>
                        <span className="font-bold text-zinc-200">{occasion}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-zinc-400">Design Motif:</span>
                        <span className="font-bold text-amber-300">{selectedDesignStyle}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-zinc-400">Materials:</span>
                        <span className="font-medium text-zinc-200 truncate max-w-[180px]">{selectedColors.join(', ')}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-zinc-400">Packaging Vault:</span>
                        <span className="font-medium text-amber-300">{selectedPkg?.name || 'Luxury Box'}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-zinc-400">Budget Range:</span>
                        <span className="font-bold text-amber-400 font-mono">{budgetRange}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-zinc-400">Target Date:</span>
                        <span className="font-medium text-zinc-200">{targetDeliveryDate || 'Flexible'}</span>
                      </div>
                    </div>

                    {giftNote && (
                      <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-amber-400 block font-bold">Wax-Sealed Gift Note:</span>
                        <p className="text-amber-200/90 font-serif italic text-xs leading-relaxed">"{giftNote}"</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/40">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Free CAD 3D Render & Quotation before any financial commitment.</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Submit Custom Order to Atelier</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Navigation Footer */}
              <div className="flex justify-start pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Packaging</span>
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
