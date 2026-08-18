import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { CoupleWebsiteTemplate, CoupleWebsiteProject, CoupleThemeCategory, CoupleMemoryItem } from '../../types';
import {
  Heart,
  Sparkles,
  Globe,
  Music,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  Play,
  Pause,
  Smartphone,
  Monitor,
  ArrowRight,
  Plus,
  Trash2,
  Eye,
  Sliders,
  Layers,
  ShieldCheck,
  Zap,
  Tag,
  Share2,
  ExternalLink,
  ChevronRight,
  Clock,
  Palette,
  Type,
  Video,
  Lock
} from 'lucide-react';
import { CoupleWebsiteLiveView } from './CoupleWebsiteLiveView';

const SOUNDTRACK_OPTIONS = [
  { id: 'piano-soft', name: 'Romantic Acoustic Piano', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3' },
  { id: 'sunset-lofi', name: 'Twilight Sunset Lo-Fi', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=lofi-study-112191.mp3' },
  { id: 'paris-waltz', name: 'Parisian Cafe Waltz', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8bbf8e5c8.mp3?filename=acoustic-guitars-ambient-10850.mp3' },
  { id: 'custom-url', name: 'Custom MP3 Stream / Audio URL', url: '' }
];

const THEME_CATEGORIES: (CoupleThemeCategory | 'All')[] = [
  'All',
  'Romantic',
  'Luxury',
  'Cute',
  'Minimal',
  'Wedding',
  'Long Distance'
];

export const CoupleWebsiteBuilder: React.FC = () => {
  const {
    coupleTemplates,
    coupleWebsites,
    createCoupleWebsite,
    updateCoupleWebsite,
    addToCart,
    products,
    formatPrice,
    setCurrentView,
    showToast,
    currentUser,
    selectedEditingProject,
    setSelectedEditingProject
  } = useStore();

  const [activeTab, setActiveTab] = useState<'marketplace' | 'studio' | 'fullscreen'>('studio');
  const [selectedCategory, setSelectedCategory] = useState<CoupleThemeCategory | 'All'>('All');
  
  // Builder form state initialized from selected editing project or defaults
  const [selectedTemplate, setSelectedTemplate] = useState<CoupleWebsiteTemplate>(() => {
    if (selectedEditingProject) {
      return coupleTemplates.find(t => t.id === selectedEditingProject.templateId) || coupleTemplates[0];
    }
    return coupleTemplates[0];
  });

  const [partner1Name, setPartner1Name] = useState(selectedEditingProject?.partner1Name || 'Hamza');
  const [partner2Name, setPartner2Name] = useState(selectedEditingProject?.partner2Name || 'Sarah');
  const [anniversaryDate, setAnniversaryDate] = useState(selectedEditingProject?.anniversaryDate || '2023-04-18');
  const [heroTagline, setHeroTagline] = useState(selectedEditingProject?.heroTagline || 'Two souls in synchronous orbit across the universe ❤️');
  const [ourStoryTitle, setOurStoryTitle] = useState(selectedEditingProject?.ourStoryTitle || 'Where Our Infinite Story Began');
  const [ourStoryText, setOurStoryText] = useState(
    selectedEditingProject?.ourStoryText ||
    'From our first conversation under the rain-soaked Kyoto lanterns to exploring 14 countries together. Every day with you is my favorite adventure.'
  );
  const [secretMessage, setSecretMessage] = useState(selectedEditingProject?.secretMessage || 'I would choose you in every lifetime.');
  const [subdomain, setSubdomain] = useState(selectedEditingProject?.subdomain || 'hamza-and-sarah');
  const [customDomain, setCustomDomain] = useState(selectedEditingProject?.customDomain || '');
  const [primaryColor, setPrimaryColor] = useState(selectedEditingProject?.primaryColor || '#e11d48');
  const [fontStyle, setFontStyle] = useState(selectedEditingProject?.fontStyle || 'Playfair Display');
  const [selectedSoundtrack, setSelectedSoundtrack] = useState(SOUNDTRACK_OPTIONS[0].url);
  const [customAudioUrl, setCustomAudioUrl] = useState('');
  
  const [photos, setPhotos] = useState<string[]>(
    selectedEditingProject?.photos && selectedEditingProject.photos.length > 0
      ? selectedEditingProject.photos
      : [
          'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1000&auto=format&fit=crop&q=80'
        ]
  );
  const [newPhotoInput, setNewPhotoInput] = useState('');

  const [memories, setMemories] = useState<CoupleMemoryItem[]>(
    selectedEditingProject?.memories && selectedEditingProject.memories.length > 0
      ? selectedEditingProject.memories
      : [
          {
            id: 'mem-1',
            title: 'First Date in Kyoto',
            date: '2023-04-18',
            description: 'Spilled matcha latte, laughed for three straight hours under the sakura trees, and knew right then.',
            image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80'
          },
          {
            id: 'mem-2',
            title: 'Amalfi Coast Sunset & Ring',
            date: '2025-06-20',
            description: 'The golden hour light turned the ocean purple when we promised forever.',
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80'
          }
        ]
  );

  // New memory modal / input
  const [newMemTitle, setNewMemTitle] = useState('');
  const [newMemDate, setNewMemDate] = useState('');
  const [newMemDesc, setNewMemDesc] = useState('');
  const [newMemImage, setNewMemImage] = useState('');
  const [isAddingMemory, setIsAddingMemory] = useState(false);

  // Live simulator state
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewTemplateDemo, setPreviewTemplateDemo] = useState<CoupleWebsiteTemplate | null>(null);

  // Live Timer for Simulator
  const [timeElapsed, setTimeElapsed] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(anniversaryDate).getTime();
      const now = new Date().getTime();
      const diffMs = Math.max(0, now - start);

      const totalSeconds = Math.floor(diffMs / 1000);
      const totalDays = Math.floor(totalSeconds / 86400);

      const years = Math.floor(totalDays / 365.25);
      const months = Math.floor((totalDays % 365.25) / 30.4375);
      const days = Math.floor(totalDays % 30.4375);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeElapsed({ years, months, days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  const handleAddPhoto = () => {
    if (!newPhotoInput.trim()) return;
    setPhotos(prev => [...prev, newPhotoInput.trim()]);
    setNewPhotoInput('');
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddMemory = () => {
    if (!newMemTitle.trim() || !newMemDate.trim()) {
      showToast('Please provide milestone title and date.');
      return;
    }
    const newMem: CoupleMemoryItem = {
      id: `mem-${Date.now()}`,
      title: newMemTitle.trim(),
      date: newMemDate.trim(),
      description: newMemDesc.trim() || 'A cherished chapter in our infinite love story.',
      image: newMemImage.trim() || undefined
    };
    setMemories(prev => [...prev, newMem]);
    setNewMemTitle('');
    setNewMemDate('');
    setNewMemDesc('');
    setNewMemImage('');
    setIsAddingMemory(false);
    showToast('Memory milestone added to timeline!');
  };

  const handleRemoveMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  // Compile current project state object
  const currentProjectDraft: CoupleWebsiteProject = {
    id: selectedEditingProject?.id || `cpl-${Date.now()}`,
    customerId: currentUser?.id || 'cust-guest',
    subdomain: subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    templateId: selectedTemplate.id,
    templateName: selectedTemplate.name,
    partner1Name,
    partner2Name,
    anniversaryDate,
    ourStoryTitle,
    ourStoryText,
    heroTagline,
    secretMessage,
    primaryColor,
    fontStyle,
    musicTrack: customAudioUrl || selectedSoundtrack,
    photos,
    memories,
    guestbook: selectedEditingProject?.guestbook || [
      {
        id: 'gb-init',
        author: 'Julian & Elena',
        message: 'Wishing you two lifetime of starry nights, endless laughter and infinite love!',
        date: 'Recent'
      }
    ],
    status: 'active',
    isPublished: true,
    customDomain: customDomain ? customDomain.trim().toLowerCase() : undefined,
    views: selectedEditingProject?.views || 120,
    heartsGiven: selectedEditingProject?.heartsGiven || 24,
    createdAt: selectedEditingProject?.createdAt || new Date().toISOString(),
    expiresAt: selectedEditingProject?.expiresAt || new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10).toISOString()
  };

  const handleSaveOrPublish = async () => {
    if (!subdomain.trim()) {
      showToast('Please specify a unique sanctuary subdomain.');
      return;
    }

    if (selectedEditingProject) {
      // Update existing project
      await updateCoupleWebsite(currentProjectDraft);
      setSelectedEditingProject(null);
      showToast('🎉 Sanctuary successfully updated and published to live internet!');
      setCurrentView('account');
    } else {
      // Create new website & add to cart / instant provision
      const created = createCoupleWebsite(currentProjectDraft);
      
      const digitalProduct = products.find(p => p.category === 'digital') || products[0];
      addToCart(
        digitalProduct,
        1,
        undefined,
        undefined,
        {
          names: `${partner1Name} & ${partner2Name}`,
          message: `${subdomain}.harconxsshop.com`,
          notes: `Theme: ${selectedTemplate.name} (${selectedTemplate.version || 'v2.0'})`
        },
        selectedTemplate.price
      );

      showToast(`✨ Sanctuary provisioned: ${subdomain}.harconxsshop.com added to cart.`);
      setCurrentView('checkout');
    }
  };

  const filteredTemplates = coupleTemplates.filter(t => {
    if (selectedCategory === 'All') return true;
    return t.themeCategory === selectedCategory;
  });

  // If fullscreen live view mode is active
  if (activeTab === 'fullscreen') {
    return (
      <CoupleWebsiteLiveView
        project={currentProjectDraft}
        onBack={() => setActiveTab('studio')}
      />
    );
  }

  return (
    <div className="bg-zinc-950 min-h-screen py-8 text-zinc-200 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HEADER & TABS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40" />
              <span>HARCONXS Couple Sanctuaries & Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              {selectedEditingProject ? 'Edit Couple Sanctuary' : 'Couple Website Builder & Marketplace'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-sans">
              Choose a designer theme, customize photos, memories, live counter, and publish your love sanctuary with a dedicated subdomain or custom domain.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 self-start md:self-auto shadow-lg">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'marketplace'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. Themes Marketplace</span>
            </button>
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'studio'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>2. Atelier Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('fullscreen')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all cursor-pointer flex items-center gap-2"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Sanctuary View</span>
            </button>
          </div>
        </div>

        {/* TAB 1: THEMES MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            {/* Category Pill Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {THEME_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const isSelected = selectedTemplate.id === template.id;
                return (
                  <div
                    key={template.id}
                    className={`bg-zinc-900/60 border rounded-3xl overflow-hidden transition-all duration-300 flex flex-col group ${
                      isSelected
                        ? 'border-rose-500 ring-2 ring-rose-500/30 shadow-2xl bg-zinc-900'
                        : 'border-zinc-800 hover:border-zinc-700 shadow-lg'
                    }`}
                  >
                    {/* Template Image with Hover Zoom */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                      <img
                        src={template.previewImage}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                      {/* Version & Category Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md text-zinc-200 border border-zinc-700">
                          {template.version || 'v2.0'}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950/80 backdrop-blur-md text-rose-300 border border-rose-800">
                          {template.themeCategory}
                        </span>
                      </div>

                      {template.popular && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-zinc-950 shadow-md">
                            ★ Popular
                          </span>
                        </div>
                      )}

                      {/* Demo subdomain preview link */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                        <span className="text-zinc-300 font-mono text-[11px] truncate">
                          {template.demoSubdomain}.harconxsshop.com
                        </span>
                        <span className="font-mono text-base font-bold text-amber-400">
                          {formatPrice(template.price)}
                        </span>
                      </div>
                    </div>

                    {/* Template Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-serif font-bold text-zinc-100">{template.name}</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans line-clamp-2">
                          {template.description}
                        </p>

                        {/* Feature Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {template.features.slice(0, 3).map((feat, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60"
                            >
                              ✓ {feat}
                            </span>
                          ))}
                          {template.features.length > 3 && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-zinc-400 bg-zinc-800">
                              +{template.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTemplate(template);
                            setActiveTab('fullscreen');
                          }}
                          className="py-2.5 px-3 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Demo Preview</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTemplate(template);
                            if (template.colorPalette && template.colorPalette[0]) {
                              setPrimaryColor(template.colorPalette[0]);
                            }
                            if (template.defaultFont) {
                              setFontStyle(template.defaultFont);
                            }
                            setActiveTab('studio');
                            showToast(`Template "${template.name}" activated in Atelier Studio!`);
                          }}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-600 hover:bg-rose-500 text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isSelected ? 'Active Theme' : 'Select Theme'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ATELIER CUSTOMIZER STUDIO & LIVE SIMULATOR */}
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT 5 COLS: CUSTOMIZATION CONTROLS */}
            <div className="lg:col-span-5 space-y-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
              
              {/* Active Theme Bar */}
              <div className="flex items-center justify-between bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-800 shrink-0">
                    <img src={selectedTemplate.previewImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Active Template</span>
                    <h4 className="text-xs font-serif font-bold text-white">{selectedTemplate.name} ({selectedTemplate.version || 'v2.0'})</h4>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* 1. Couple Identity & Date */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>1. Couple Names & Love Timeline</span>
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-xs">
                    <label className="font-semibold text-zinc-300">Partner 1</label>
                    <input
                      type="text"
                      value={partner1Name}
                      onChange={(e) => setPartner1Name(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-rose-500"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <label className="font-semibold text-zinc-300">Partner 2</label>
                    <input
                      type="text"
                      value={partner2Name}
                      onChange={(e) => setPartner2Name(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Relationship / Anniversary Start Date</span>
                  </label>
                  <input
                    type="date"
                    value={anniversaryDate}
                    onChange={(e) => setAnniversaryDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-rose-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-zinc-500">Powers live years, months, days, hours, mins and seconds counter.</p>
                </div>
              </div>

              {/* 2. Story Narrative & Vows */}
              <div className="space-y-3 pt-3 border-t border-zinc-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>2. Hero Tagline & Narrative</span>
                </span>

                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-zinc-300">Hero Tagline</label>
                  <input
                    type="text"
                    value={heroTagline}
                    onChange={(e) => setHeroTagline(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-zinc-300">Story Title</label>
                  <input
                    type="text"
                    value={ourStoryTitle}
                    onChange={(e) => setOurStoryTitle(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-zinc-300">Our Story Narrative</label>
                  <textarea
                    value={ourStoryText}
                    onChange={(e) => setOurStoryText(e.target.value)}
                    rows={3}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-rose-500 resize-none font-sans"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-rose-400" />
                    <span>Secret Vow / Love Note</span>
                  </label>
                  <input
                    type="text"
                    value={secretMessage}
                    onChange={(e) => setSecretMessage(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* 3. Memory Milestones */}
              <div className="space-y-3 pt-3 border-t border-zinc-800/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    3. Milestone Timeline ({memories.length})
                  </span>
                  <button
                    onClick={() => setIsAddingMemory(!isAddingMemory)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Milestone</span>
                  </button>
                </div>

                {/* Add milestone drawer */}
                {isAddingMemory && (
                  <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl space-y-2.5 text-xs">
                    <input
                      type="text"
                      placeholder="Milestone Title (e.g. The First Date)"
                      value={newMemTitle}
                      onChange={(e) => setNewMemTitle(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={newMemDate}
                        onChange={(e) => setNewMemDate(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 outline-none cursor-pointer"
                      />
                      <input
                        type="url"
                        placeholder="Photo URL (optional)"
                        value={newMemImage}
                        onChange={(e) => setNewMemImage(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 outline-none"
                      />
                    </div>
                    <textarea
                      placeholder="Description or story..."
                      value={newMemDesc}
                      onChange={(e) => setNewMemDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-100 outline-none resize-none"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setIsAddingMemory(false)}
                        className="px-3 py-1.5 bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddMemory}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg"
                      >
                        Save Milestone
                      </button>
                    </div>
                  </div>
                )}

                {/* Existing memories list */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  {memories.map((mem) => (
                    <div key={mem.id} className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-xs">
                      <div className="truncate pr-2">
                        <p className="font-bold text-zinc-200 truncate">{mem.title}</p>
                        <span className="text-[10px] font-mono text-zinc-500">{mem.date}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveMemory(mem.id)}
                        className="p-1 text-zinc-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Photos Gallery */}
              <div className="space-y-3 pt-3 border-t border-zinc-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>4. Photo Gallery Stream ({photos.length})</span>
                </span>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Add image URL (Unsplash or Cloud)..."
                    value={newPhotoInput}
                    onChange={(e) => setNewPhotoInput(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 outline-none"
                  />
                  <button
                    onClick={handleAddPhoto}
                    className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl shrink-0"
                  >
                    Add
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {photos.map((p, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-800 group">
                      <img src={p} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Soundtrack & Audio */}
              <div className="space-y-3 pt-3 border-t border-zinc-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-rose-400" />
                  <span>5. Romantic Soundtrack</span>
                </span>

                <select
                  value={selectedSoundtrack}
                  onChange={(e) => setSelectedSoundtrack(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 outline-none cursor-pointer"
                >
                  {SOUNDTRACK_OPTIONS.map((snd) => (
                    <option key={snd.id} value={snd.url}>
                      {snd.name}
                    </option>
                  ))}
                </select>

                {selectedSoundtrack === '' && (
                  <input
                    type="url"
                    placeholder="Enter custom audio stream / MP3 URL..."
                    value={customAudioUrl}
                    onChange={(e) => setCustomAudioUrl(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-100 outline-none"
                  />
                )}
              </div>

              {/* 6. Typography & Accent Color */}
              <div className="space-y-3 pt-3 border-t border-zinc-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-purple-400" />
                  <span>6. Palette & Font Typography</span>
                </span>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-300">Accent Color</label>
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-7 h-7 rounded-lg border-0 bg-transparent cursor-pointer"
                      />
                      <span className="font-mono text-zinc-400">{primaryColor}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-300">Font Face</label>
                    <select
                      value={fontStyle}
                      onChange={(e) => setFontStyle(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 outline-none cursor-pointer"
                    >
                      <option value="Playfair Display">Playfair Display (Serif)</option>
                      <option value="Cinzel">Cinzel (Atelier Royal)</option>
                      <option value="Cormorant Garamond">Cormorant (Editorial)</option>
                      <option value="Dancing Script">Dancing Script (Calligraphy)</option>
                      <option value="Montserrat">Montserrat (Modern Sans)</option>
                      <option value="Inter">Inter (Minimal Workhorse)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 7. Subdomain & Custom Domain */}
              <div className="space-y-3 pt-3 border-t border-zinc-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>7. Dedicated Subdomain & Domain</span>
                </span>

                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-zinc-300">Unique Subdomain</label>
                  <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus-within:border-emerald-500">
                    <input
                      type="text"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      className="bg-transparent outline-none flex-1 text-xs text-amber-300 font-mono"
                    />
                    <span className="text-zinc-500 font-mono text-xs">.harconxsshop.com</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono pt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Instant SSL certificate & Edge CDN provisioned</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-zinc-300">Custom Domain (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. hamzaandsarah.love"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 outline-none text-xs font-mono placeholder:text-zinc-600"
                  />
                </div>
              </div>

              {/* Action Button: Publish / Save */}
              <div className="pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={handleSaveOrPublish}
                  className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>
                    {selectedEditingProject
                      ? 'Save & Update Sanctuary'
                      : `Publish Sanctuary & Lifetime Hosting • ${formatPrice(selectedTemplate.price)}`}
                  </span>
                </button>
              </div>

            </div>

            {/* RIGHT 7 COLS: INTERACTIVE LIVE SANCTUARY SIMULATOR */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Simulator Top Nav Bar */}
              <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-2xl text-xs shadow-md">
                <div className="flex items-center gap-2 font-mono text-zinc-300 truncate">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="truncate">https://{subdomain || 'sanctuary'}.harconxsshop.com</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                      isPlayingMusic
                        ? 'bg-rose-950 border-rose-600 text-rose-300 shadow-md'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isPlayingMusic ? 'Playing' : 'Soundtrack'}</span>
                  </button>

                  <div className="flex items-center bg-zinc-800 rounded-xl p-0.5 border border-zinc-700">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1.5 rounded-lg transition-all ${
                        previewDevice === 'desktop' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                      title="Desktop viewport"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1.5 rounded-lg transition-all ${
                        previewDevice === 'mobile' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                      title="Mobile viewport"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveTab('fullscreen')}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                    title="Open Fullscreen Sanctuary"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* SIMULATOR VIEWPORT WRAPPER */}
              <div className={`mx-auto transition-all duration-300 ${previewDevice === 'mobile' ? 'max-w-xs' : 'w-full'}`}>
                <div className="rounded-3xl overflow-hidden border border-zinc-700/80 bg-zinc-950 shadow-2xl min-h-[600px] flex flex-col relative text-zinc-100">
                  
                  {/* Hero Header in simulator */}
                  <div className="relative h-64 sm:h-72 overflow-hidden flex items-center justify-center text-center p-6 bg-zinc-950">
                    <img
                      src={photos[0] || selectedTemplate.previewImage}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-35 filter blur-[0.5px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                    <div className="relative z-10 space-y-2">
                      <Heart
                        className="w-8 h-8 mx-auto animate-pulse"
                        style={{ color: primaryColor, fill: `${primaryColor}40` }}
                      />
                      <h2
                        className="text-2xl sm:text-4xl font-bold tracking-wide text-white"
                        style={{ fontFamily: fontStyle, color: primaryColor }}
                      >
                        {partner1Name} & {partner2Name}
                      </h2>
                      <p className="text-xs sm:text-sm text-rose-200/90 font-sans max-w-sm mx-auto">
                        "{heroTagline}"
                      </p>
                    </div>
                  </div>

                  {/* LIVE ANNIVERSARY COUNTER */}
                  <div className="px-6 py-4 -mt-8 relative z-20">
                    <div className="bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 shadow-xl">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 block text-center mb-2">
                        In Love For Every Second
                      </span>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-center">
                        <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
                          <span className="font-mono text-sm sm:text-lg font-bold text-zinc-100">{timeElapsed.years}</span>
                          <p className="text-[9px] text-zinc-400 uppercase">Yrs</p>
                        </div>
                        <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
                          <span className="font-mono text-sm sm:text-lg font-bold text-zinc-100">{timeElapsed.months}</span>
                          <p className="text-[9px] text-zinc-400 uppercase">Mos</p>
                        </div>
                        <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
                          <span className="font-mono text-sm sm:text-lg font-bold text-zinc-100">{timeElapsed.days}</span>
                          <p className="text-[9px] text-zinc-400 uppercase">Days</p>
                        </div>
                        <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
                          <span className="font-mono text-sm sm:text-lg font-bold text-zinc-100">{timeElapsed.hours}</span>
                          <p className="text-[9px] text-zinc-400 uppercase">Hrs</p>
                        </div>
                        <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
                          <span className="font-mono text-sm sm:text-lg font-bold text-zinc-100">{timeElapsed.minutes}</span>
                          <p className="text-[9px] text-zinc-400 uppercase">Mins</p>
                        </div>
                        <div className="bg-zinc-950/80 p-2 rounded-xl border border-rose-900/40 bg-rose-950/20">
                          <span className="font-mono text-sm sm:text-lg font-bold text-rose-400">{timeElapsed.seconds}</span>
                          <p className="text-[9px] text-rose-300 uppercase">Secs</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SIMULATOR BODY CONTENT */}
                  <div className="p-6 space-y-6 text-xs flex-1">
                    
                    {/* Story */}
                    <div>
                      <h3 className="text-base font-serif font-bold text-zinc-100 mb-2">{ourStoryTitle}</h3>
                      <p className="text-zinc-300 leading-relaxed bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 font-sans whitespace-pre-line">
                        {ourStoryText}
                      </p>
                    </div>

                    {/* Milestones Stream in Simulator */}
                    {memories.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Memory Timeline</h4>
                        <div className="space-y-2.5">
                          {memories.map((mem, idx) => (
                            <div key={idx} className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80 flex items-start gap-3">
                              {mem.image && (
                                <img src={mem.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-zinc-700 shrink-0" />
                              )}
                              <div className="truncate">
                                <span className="text-[10px] font-mono text-rose-400 font-semibold">{mem.date}</span>
                                <h5 className="font-bold text-zinc-200 truncate">{mem.title}</h5>
                                <p className="text-[11px] text-zinc-400 line-clamp-1">{mem.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Guestbook preview */}
                    <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/80 space-y-2">
                      <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Heart className="w-3 h-3 text-rose-400" />
                        <span>Interactive Guestbook Wall</span>
                      </span>
                      <p className="text-[11px] text-zinc-400 italic">"Wishing you two endless joy and romantic stargazing!" — Elena & Marcus</p>
                    </div>

                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
