import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomOrderRelationship, CustomOrderOccasion } from '../../types';
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
  Palette
} from 'lucide-react';

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

  const [step, setStep] = useState<number>(1);

  // Form Fields
  const [recipient, setRecipient] = useState('Sarah');
  const [relationship, setRelationship] = useState<CustomOrderRelationship>('Girlfriend');
  const [productType, setProductType] = useState('Custom Titanium Mechanical Music Box with Laser Hologram');
  const [occasion, setOccasion] = useState<CustomOrderOccasion>('Birthday');
  const [budgetRange, setBudgetRange] = useState('₹10,000 - ₹25,000');
  const [description, setDescription] = useState('A hand-polished mahogany and aerospace titanium keepsake box playing "Can\'t Help Falling in Love", with precision laser engraved starry sky coordinates and illuminated couple portrait.');
  const [preferredColors, setPreferredColors] = useState('Deep Rosewood, Antique Gold, Matte Black');
  const [preferredStyle, setPreferredStyle] = useState('Vintage Romantic Atelier Luxury');
  const [targetDeliveryDate, setTargetDeliveryDate] = useState('2026-09-15');
  const [selectedPackagingId, setSelectedPackagingId] = useState<string>(
    packagingOptions.length > 0 ? packagingOptions[0].id : ''
  );
  const [giftNote, setGiftNote] = useState('To the love of my life, every note in this melody is a chapter in our infinite story. Forever yours.');
  
  // File Uploads State
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80'
  ]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const relationships: CustomOrderRelationship[] = [
    'Me', 'Friend', 'Best Friend', 'Girlfriend', 'Boyfriend', 'Husband', 'Wife', 'Partner', 'Family', 'Other'
  ];

  const occasions: CustomOrderOccasion[] = [
    'Birthday', 'Anniversary', "Valentine's Day", 'Wedding', 'Proposal', 'Friendship', 'Graduation', 'Celebration', 'Surprise', 'Other'
  ];

  const budgetOptions = [
    'Under ₹5,000',
    '₹5,000 - ₹10,000',
    '₹10,000 - ₹25,000',
    '₹25,000 - ₹50,000',
    '₹50,000+'
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(`Uploading ${files.length} file(s) to Supabase Storage...`);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadCustomOrderFile(file);
        if (res.success && res.url) {
          newUrls.push(res.url);
        }
      }
      setUploadedFiles(prev => [...prev, ...newUrls]);
      showToast(`${newUrls.length} file(s) securely attached to brief!`);
    } catch (err: any) {
      showToast(`Upload error: ${err?.message || 'Failed to upload files.'}`);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
      e.target.value = '';
    }
  };

  const removeUploadedFile = (indexToRemove: number) => {
    setUploadedFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const customerName = currentUser?.fullName || 'Distinguished Patron';
    const customerEmail = currentUser?.email || 'patron@harconxs.com';
    const customerId = currentUser?.id || `cust-${Date.now()}`;

    const newReq = createCustomOrderRequest({
      customerId,
      customerName,
      customerEmail,
      recipient,
      relationship,
      occasion,
      budgetRange,
      productType,
      description,
      preferredColors: preferredColors.split(',').map(s => s.trim()).filter(Boolean),
      preferredStyle,
      uploadedFiles,
      selectedPackagingId,
      giftNote,
      targetDeliveryDate
    });

    setCurrentView('custom-portal');
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-10 text-zinc-200 border-b border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Atelier Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>HARCONXS Bespoke Fabrication Atelier</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-100 tracking-tight">
            CREATE SOMETHING SPECIAL ❤️
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
            Tell us your dream concept. From physical luxury jewelry, mechanical timepieces, and aerospace engravings to private web portals, our master artisans review your brief and send an official quotation with 3D CAD design plans.
          </p>
        </div>

        {/* 4-Step Progress Navigation */}
        <div className="grid grid-cols-4 gap-2 max-w-2xl mx-auto text-xs font-medium border-b border-zinc-800 pb-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-xl text-center transition-colors cursor-pointer ${
              step === 1 ? 'bg-amber-400 text-zinc-950 font-bold' : step > 1 ? 'text-amber-400 font-semibold' : 'text-zinc-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0">1</span>
            <span className="truncate">Recipient</span>
          </button>

          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-xl text-center transition-colors cursor-pointer ${
              step === 2 ? 'bg-amber-400 text-zinc-950 font-bold' : step > 2 ? 'text-amber-400 font-semibold' : 'text-zinc-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0">2</span>
            <span className="truncate">Concept & Specs</span>
          </button>

          <button
            type="button"
            onClick={() => setStep(3)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-xl text-center transition-colors cursor-pointer ${
              step === 3 ? 'bg-amber-400 text-zinc-950 font-bold' : step > 3 ? 'text-amber-400 font-semibold' : 'text-zinc-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0">3</span>
            <span className="truncate">Packaging & Note</span>
          </button>

          <button
            type="button"
            onClick={() => setStep(4)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2 rounded-xl text-center transition-colors cursor-pointer ${
              step === 4 ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0">4</span>
            <span className="truncate">Review & Dispatch</span>
          </button>
        </div>

        {/* Wizard Form */}
        <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          {/* STEP 1: WHO IS IT FOR & OCCASION */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-400" />
                  <span>Step 1: Who are you creating this for?</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">We tailor the fabrication styling and presentation based on your relationship.</p>
              </div>

              {/* Relationship Pills */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">Relationship:</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {relationships.map((rel) => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => setRelationship(rel)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                        relationship === rel
                          ? 'bg-amber-400 text-zinc-950 font-bold border-amber-400 shadow-md'
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">Recipient Name / Monogram Signature:</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. Sarah / Alexander"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none focus:border-amber-400"
                />
              </div>

              {/* Occasion */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">Special Occasion / Milestone:</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {occasions.map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setOccasion(occ)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                        occasion === occ
                          ? 'bg-rose-500 text-white font-bold border-rose-500 shadow-md'
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-amber-400/10"
                >
                  <span>Continue to Step 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONCEPT & SPECS */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-amber-400" />
                  <span>Step 2: Describe your custom concept</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Provide as much detail as possible so our artisans can estimate materials and machining time.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">Product Concept Title:</label>
                <input
                  type="text"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  placeholder="e.g. Custom Laser-Engraved Damascus Steel Ring with Meteorite Core"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">Detailed Description & Secret Engravings:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe dimensions, metal alloys, engraved dates, coordinates, custom melody, or physical mechanisms..."
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300">Estimated Budget Range:</label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none cursor-pointer focus:border-amber-400"
                  >
                    {budgetOptions.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300">Target Delivery Date:</label>
                  <input
                    type="date"
                    value={targetDeliveryDate}
                    onChange={(e) => setTargetDeliveryDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none cursor-pointer focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300">Preferred Color Palette:</label>
                  <input
                    type="text"
                    value={preferredColors}
                    onChange={(e) => setPreferredColors(e.target.value)}
                    placeholder="e.g. Midnight Black, 24K Gold, Emerald Green"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300">Design Aesthetic Style:</label>
                  <input
                    type="text"
                    value={preferredStyle}
                    onChange={(e) => setPreferredStyle(e.target.value)}
                    placeholder="e.g. Modern Minimalist / Vintage Royal Luxury"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-amber-400/10"
                >
                  <span>Continue to Packaging & Note</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CUSTOM PACKAGING & GIFT MESSAGE */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100 flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-400" />
                  <span>Step 3: Select Bespoke Packaging & Gift Card</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Every custom creation is unboxed with high ceremony.</p>
              </div>

              {/* Packaging Options Cards */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">Select Presentation Box:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {packagingOptions.map(pkg => {
                    const isSelected = selectedPackagingId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackagingId(pkg.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-400 shadow-lg'
                            : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="h-28 rounded-xl overflow-hidden bg-zinc-950">
                            <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-xs text-zinc-100">{pkg.name}</h4>
                              <span className="font-mono text-[11px] text-amber-400 font-semibold">
                                {pkg.price === 0 ? 'Included' : `+${formatPrice(pkg.price)}`}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-1 leading-snug">{pkg.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`}>
                            {isSelected ? '● Selected' : '○ Choose'}
                          </span>
                          {pkg.isPopular && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[9px] font-bold">
                              Atelier Signature
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Handwritten Calligraphy Note */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-zinc-300">Wax-Sealed Handwritten Gift Letter:</label>
                <textarea
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  rows={3}
                  placeholder="Type your heartfelt message for our master calligrapher to hand-inscribe with gold leaf ink..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none focus:border-amber-400 font-serif leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-amber-400/10"
                >
                  <span>Continue to Uploads & Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUPABASE STORAGE UPLOADS & FINAL SUBMIT */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-amber-400" />
                  <span>Step 4: Attach Reference Sketches & Dispatch Brief</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Upload photos, CAD drawings, vectors, or monogram sketches via Supabase Storage.</p>
              </div>

              {/* Supabase Storage Upload Dropzone */}
              <div className="p-6 border-2 border-dashed border-zinc-800 hover:border-amber-400/60 rounded-2xl bg-zinc-950/60 text-center space-y-3 transition-colors">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-amber-400">
                  {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
                </div>

                <div>
                  <label className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer inline-flex items-center gap-1.5 shadow-md">
                    <ImageIcon className="w-4 h-4" />
                    <span>Upload Reference Images & CAD</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.svg,.psd,.stl,.obj"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  <p className="text-[11px] text-zinc-400 mt-2">
                    Supports PNG, JPG, WEBP, SVG, PDF, PSD, 3D STL up to 25MB. Stored securely in Supabase Storage.
                  </p>
                </div>

                {isUploading && (
                  <p className="text-xs text-amber-300 animate-pulse font-mono">{uploadProgress}</p>
                )}
              </div>

              {/* Uploaded Files Grid */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-zinc-300">Attached Brief Assets ({uploadedFiles.length}):</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {uploadedFiles.map((url, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-video">
                        <img src={url} alt={`Asset ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeUploadedFile(idx)}
                          className="absolute top-1.5 right-1.5 p-1 bg-black/80 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                          title="Remove file"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Brief Review Summary Card */}
              <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Project Concept</span>
                    <p className="font-bold text-zinc-100 text-sm mt-0.5">{productType}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-mono text-[10px] font-bold">
                    {budgetRange}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-300">
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block">Recipient</span>
                    <p className="font-semibold text-zinc-200">{recipient} ({relationship}) • {occasion}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase block">Target Completion</span>
                    <p className="font-semibold text-zinc-200">{targetDeliveryDate}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase block">Fabrication Details</span>
                  <p className="text-zinc-300 mt-1 italic leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                    "{description}"
                  </p>
                </div>

                {giftNote && (
                  <div className="pt-2 border-t border-zinc-800/80">
                    <span className="text-zinc-500 text-[10px] uppercase block">Wax-Sealed Note</span>
                    <p className="text-amber-200/90 font-serif italic mt-0.5">"{giftNote}"</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-sm rounded-xl shadow-xl flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Dispatch Custom Request (#CO)</span>
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};
