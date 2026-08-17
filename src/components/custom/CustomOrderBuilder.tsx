import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomOrderRelationship, CustomOrderOccasion } from '../../types';
import { Sparkles, Heart, Gift, ArrowRight, CheckCircle2, UploadCloud, Calendar, DollarSign, ArrowLeft } from 'lucide-react';

export const CustomOrderBuilder: React.FC = () => {
  const { createCustomOrderRequest, setCurrentView, user } = useStore();

  const [step, setStep] = useState(1);

  // Form Fields
  const [recipient, setRecipient] = useState('Sarah');
  const [relationship, setRelationship] = useState<CustomOrderRelationship>('Girlfriend');
  const [productType, setProductType] = useState('Custom Handcrafted Mechanical Music Box with Holographic Portrait');
  const [occasion, setOccasion] = useState<CustomOrderOccasion>('Birthday');
  const [budgetRange, setBudgetRange] = useState('$100 - $250');
  const [description, setDescription] = useState('A vintage mahogany music box playing "La Vie En Rose" with an acrylic illuminated couple portrait etched with our first trip coordinates.');
  const [preferredColors, setPreferredColors] = useState('Deep Rosewood, Antique Brass Gold, Ivory');
  const [preferredStyle, setPreferredStyle] = useState('Vintage Romantic Luxury');
  const [targetDeliveryDate, setTargetDeliveryDate] = useState('2026-09-01');
  const [uploadedUrl, setUploadedUrl] = useState('https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80');

  const relationships: CustomOrderRelationship[] = [
    'Me', 'Friend', 'Best Friend', 'Girlfriend', 'Boyfriend', 'Husband', 'Wife', 'Partner', 'Family', 'Other'
  ];

  const occasions: CustomOrderOccasion[] = [
    'Birthday', 'Anniversary', "Valentine's Day", 'Wedding', 'Proposal', 'Friendship', 'Graduation', 'Celebration', 'Surprise', 'Other'
  ];

  const budgetOptions = [
    'Under $50', '$50 - $100', '$100 - $250', '$250 - $500', '$500+'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = createCustomOrderRequest({
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      recipient,
      relationship,
      occasion,
      budgetRange,
      productType,
      description,
      preferredColors: preferredColors.split(',').map(s => s.trim()),
      preferredStyle,
      uploadedFiles: [uploadedUrl],
      targetDeliveryDate
    });

    setCurrentView('custom-portal');
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-10 text-zinc-200 border-b border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>HARCONXS Bespoke Fabrication Atelier</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-100">
            CREATE SOMETHING SPECIAL ❤️
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
            Tell us your dream concept. Whether physical luxury goods, titanium engravings, or private web portals, our master artisans review your brief and send a detailed quotation with 3D design plans.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-between max-w-xl mx-auto border-b border-zinc-800 pb-4 text-xs font-medium">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 cursor-pointer ${step >= 1 ? 'text-amber-400 font-bold' : 'text-zinc-500'}`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
            <span>Recipient & Occasion</span>
          </button>
          <span className="text-zinc-700">───</span>
          <button
            onClick={() => setStep(2)}
            className={`flex items-center gap-1.5 cursor-pointer ${step >= 2 ? 'text-amber-400 font-bold' : 'text-zinc-500'}`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
            <span>Design Concept & Budget</span>
          </button>
          <span className="text-zinc-700">───</span>
          <button
            onClick={() => setStep(3)}
            className={`flex items-center gap-1.5 cursor-pointer ${step >= 3 ? 'text-amber-400 font-bold' : 'text-zinc-500'}`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
            <span>Review & Submit</span>
          </button>
        </div>

        {/* Wizard Form */}
        <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          {/* STEP 1: WHO IS IT FOR & OCCASION */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100">Step 1: Who are you creating this for?</h3>
                <p className="text-xs text-zinc-400 mt-0.5">We tailor the fabrication styling based on your relationship.</p>
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
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">Recipient Name / Monogram:</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. Sarah"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none focus:border-zinc-600"
                />
              </div>

              {/* Occasion */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">Special Occasion / Moment:</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {occasions.map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setOccasion(occ)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                        occasion === occ
                          ? 'bg-rose-500 text-white font-bold border-rose-500 shadow-md'
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:text-white'
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
                  className="px-6 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Continue to Step 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONCEPT & BUDGET */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100">Step 2: Describe your custom concept</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Provide as much detail as possible so our artisans can estimate accurately.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">Product Title / Concept Name:</label>
                <input
                  type="text"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  placeholder="e.g. Custom Titanium Engraved Pocket Compass"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none focus:border-zinc-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">Full Description & Secret Details:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe materials, engraved quotes, specific songs, dimensions, or special meanings..."
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none focus:border-zinc-600 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300">Estimated Budget Range:</label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none cursor-pointer"
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
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none cursor-pointer"
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
                    placeholder="e.g. Matte Black, Rose Gold, Emerald Green"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none focus:border-zinc-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-300">Design Aesthetic Style:</label>
                  <input
                    type="text"
                    value={preferredStyle}
                    onChange={(e) => setPreferredStyle(e.target.value)}
                    placeholder="e.g. Modern Minimalist / Vintage Luxury"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none focus:border-zinc-600"
                  />
                </div>
              </div>

              {/* Reference image preview */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">Reference Photo / Sketch URL:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={uploadedUrl}
                    onChange={(e) => setUploadedUrl(e.target.value)}
                    placeholder="Paste image URL (Unsplash or direct image link)"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 outline-none focus:border-zinc-600"
                  />
                </div>
                {uploadedUrl && (
                  <div className="mt-2 w-24 h-24 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900">
                    <img src={uploadedUrl} alt="Reference" className="w-full h-full object-cover" />
                  </div>
                )}
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
                  className="px-6 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Review Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUMMARY & SUBMIT */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100">Step 3: Review your custom brief</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Our artisans will create your custom quotation request (#CO-XXXXX) immediately.</p>
              </div>

              <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-zinc-800">
                  <div>
                    <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Recipient & Occasion</span>
                    <p className="font-bold text-zinc-100 text-sm mt-0.5">{recipient} ({relationship})</p>
                    <p className="text-rose-400 font-medium">{occasion}</p>
                  </div>

                  <div>
                    <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Budget & Target Delivery</span>
                    <p className="font-bold text-amber-400 text-sm mt-0.5">{budgetRange}</p>
                    <p className="text-zinc-400">Needed by {targetDeliveryDate}</p>
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Project Concept</span>
                  <p className="font-bold text-zinc-100 text-sm mt-0.5">{productType}</p>
                  <p className="text-zinc-300 mt-1 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                    "{description}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase tracking-wider block">Palette</span>
                    <p className="text-zinc-200">{preferredColors}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[10px] uppercase tracking-wider block">Style</span>
                    <p className="text-zinc-200">{preferredStyle}</p>
                  </div>
                </div>
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
