import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomOrder, CustomOrderStatus } from '../../types';
import {
  Sparkles,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  Truck,
  ArrowLeft,
  ShieldCheck,
  UploadCloud,
  FileText,
  ExternalLink,
  AlertCircle,
  Paperclip,
  Image as ImageIcon,
  Check,
  ChevronRight,
  Eye,
  Download
} from 'lucide-react';

export const CustomOrderPortal: React.FC = () => {
  const {
    customOrders,
    sendCustomOrderMessage,
    respondToQuote,
    uploadCustomOrderFile,
    subscribeToCustomOrder,
    formatPrice,
    setCurrentView,
    showToast
  } = useStore();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    customOrders.length > 0 ? customOrders[0].id : ''
  );
  const [chatMessage, setChatMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [isUploadingChatFile, setIsUploadingChatFile] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeOrder = customOrders.find(co => co.id === selectedOrderId) || customOrders[0];

  // Supabase Realtime Subscription for active order
  useEffect(() => {
    if (!activeOrder?.id) return;
    const unsubscribe = subscribeToCustomOrder(activeOrder.id, (updated) => {
      // Realtime update hook
    });
    return () => {
      unsubscribe();
    };
  }, [activeOrder?.id, subscribeToCustomOrder]);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeOrder?.messages]);

  const pipelineSteps: { status: CustomOrderStatus; label: string; sub: string }[] = [
    { status: 'Submitted', label: '1. Brief Submitted', sub: 'Artisans reviewing requirements' },
    { status: 'Quoted', label: '2. Quote Issued', sub: 'Pricing & CAD proof ready' },
    { status: 'Paid', label: '3. Payment Verified', sub: 'Materials reserved & queued' },
    { status: 'In Design', label: '4. Atelier 3D Design', sub: 'CAD laser modeling & proofing' },
    { status: 'Production', label: '5. Fabrication', sub: 'Hand-machining & engraving' },
    { status: 'Shipped', label: '6. Dispatched', sub: 'Courier transit & tracking' },
    { status: 'Delivered', label: '7. Delivered', sub: 'Keepsake received by patron' }
  ];

  const getStepIndex = (status: CustomOrderStatus) => {
    switch (status) {
      case 'Submitted': return 0;
      case 'Quoted': return 1;
      case 'Paid': return 2;
      case 'In Design': return 3;
      case 'Production': return 4;
      case 'Shipped': return 5;
      case 'Delivered':
      case 'Completed': return 6;
      default: return 0;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!chatMessage.trim() && attachedFiles.length === 0) || !activeOrder) return;

    await sendCustomOrderMessage(
      activeOrder.id,
      chatMessage.trim(),
      'customer',
      attachedFiles.length > 0 ? attachedFiles : undefined
    );

    setChatMessage('');
    setAttachedFiles([]);
    showToast('Message sent to Atelier artisan in realtime!');
  };

  const handleChatFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeOrder) return;

    setIsUploadingChatFile(true);
    try {
      const file = files[0];
      const res = await uploadCustomOrderFile(file, activeOrder.id);
      if (res.success && res.url) {
        setAttachedFiles(prev => [...prev, res.url]);
        showToast('Image attached to message.');
      }
    } catch {
      showToast('Failed to upload chat file.');
    } finally {
      setIsUploadingChatFile(false);
      e.target.value = '';
    }
  };

  const handleAcceptQuote = async () => {
    if (!activeOrder) return;
    await respondToQuote(activeOrder.id, true);
  };

  const handleRequestRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder || !revisionNote.trim()) return;
    await respondToQuote(activeOrder.id, false, revisionNote);
    setIsRevisionModalOpen(false);
    setRevisionNote('');
  };

  if (!activeOrder) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-200 py-16 text-center border-b border-zinc-800">
        <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold font-serif">No Custom Orders Found</h2>
        <p className="text-xs text-zinc-400 mt-1">Submit your first custom brief with our interactive bespoke wizard.</p>
        <button
          onClick={() => setCurrentView('custom-builder')}
          className="mt-5 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl shadow-lg cursor-pointer"
        >
          Create Bespoke Custom Order
        </button>
      </div>
    );
  }

  const currentStepIdx = getStepIndex(activeOrder.status);

  return (
    <div className="bg-zinc-950 min-h-screen py-8 text-zinc-200 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <button
            onClick={() => setCurrentView('catalog')}
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Store Catalog</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Supabase Realtime Live Sync
            </span>

            <button
              onClick={() => setCurrentView('custom-builder')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ New Custom Brief</span>
            </button>
          </div>
        </div>

        {/* Requests Switcher Tabs */}
        {customOrders.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {customOrders.map(co => (
              <button
                key={co.id}
                onClick={() => setSelectedOrderId(co.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
                  selectedOrderId === co.id
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-md'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <span className="font-mono">{co.requestNumber}</span>
                <span>•</span>
                <span className="truncate max-w-[140px]">{co.productType}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 font-bold uppercase">{co.status}</span>
              </button>
            ))}
          </div>
        )}

        {/* HERO PROJECT SUMMARY & PIPELINE */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/80">
                  {activeOrder.requestNumber}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800">
                  Status: {activeOrder.status}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 mt-2">
                {activeOrder.productType}
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Recipient: <strong className="text-zinc-200">{activeOrder.recipient} ({activeOrder.relationship})</strong> • Occasion: <strong className="text-zinc-200">{activeOrder.occasion}</strong>
              </p>
            </div>

            <div className="text-left md:text-right bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-mono">Estimated Budget</span>
              <span className="text-lg font-bold text-amber-400 font-mono">{activeOrder.budgetRange}</span>
              <p className="text-[11px] text-zinc-400 mt-0.5">Target: {activeOrder.targetDeliveryDate || 'Flexible'}</p>
            </div>
          </div>

          {/* 7-Step Lifecycle Milestone Pipeline */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
              <span>Fabrication Lifecycle Progress</span>
              <span className="text-amber-400 font-bold">Step {currentStepIdx + 1} of {pipelineSteps.length}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {pipelineSteps.map((step, idx) => {
                const isCompleted = idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div
                    key={step.status}
                    className={`p-3 rounded-2xl border flex flex-col justify-between transition-all ${
                      isCurrent
                        ? 'bg-amber-950/50 border-amber-400 shadow-lg shadow-amber-400/10'
                        : isCompleted
                        ? 'bg-zinc-900 border-emerald-800/80 text-zinc-200'
                        : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-amber-400' : isCompleted ? 'text-emerald-400' : 'text-zinc-600'}`}>
                        0{idx + 1}
                      </span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                      ) : null}
                    </div>
                    <div>
                      <p className={`text-xs font-bold leading-tight ${isCurrent ? 'text-amber-300' : isCompleted ? 'text-zinc-100' : 'text-zinc-500'}`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-1 leading-tight">{step.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 2 COLS: LEFT (QUOTATION / SPECS / SHIPPING) & RIGHT (REALTIME ARTISAN CHAT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (6 cols): Quotation Card, Logistics Tracking & Design Specs */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. Atelier Quotation Ready Card */}
            {activeOrder.quote ? (
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-serif font-bold text-zinc-100">Official Atelier Quotation</h3>
                      <span className="text-[10px] text-zinc-400 font-mono">Valid until {activeOrder.quote.validUntil}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono ${
                    activeOrder.quote.status === 'accepted'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : activeOrder.quote.status === 'revised'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {activeOrder.quote.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-zinc-900/90 rounded-2xl p-4 border border-zinc-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Custom Fabrication & Machining</span>
                    <span className="text-lg font-bold text-zinc-100 font-mono">{formatPrice(activeOrder.quote.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Turnaround Time</span>
                    <span className="font-semibold text-zinc-200 font-mono">{activeOrder.quote.turnaroundDays} Business Days</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Presentation Box Included</span>
                    <span className="font-semibold text-amber-300">{activeOrder.quote.packagingIncluded}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Express Insured Shipping</span>
                    <span className="font-semibold text-emerald-400">FREE Atelier Vault Transit</span>
                  </div>

                  {activeOrder.quote.notes && (
                    <p className="pt-2 border-t border-zinc-800 text-zinc-300 leading-relaxed italic bg-zinc-950/60 p-3 rounded-xl">
                      "{activeOrder.quote.notes}"
                    </p>
                  )}
                </div>

                {/* 3D CAD Design Proof Preview (if provided by admin) */}
                {(activeOrder.quote.designProofUrl || activeOrder.designProofUrl) && (
                  <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700 shrink-0">
                        <img
                          src={activeOrder.quote.designProofUrl || activeOrder.designProofUrl}
                          alt="CAD Proof"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono text-amber-400 block font-bold">CAD Proof Available</span>
                        <p className="text-xs font-semibold text-zinc-200">Laser Blueprint & 3D Render</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsProofModalOpen(true)}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Proof</span>
                    </button>
                  </div>
                )}

                {/* Quote Action Buttons */}
                {activeOrder.quote.status === 'pending_review' || activeOrder.quote.status === 'revised' ? (
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={handleAcceptQuote}
                      className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept Quote & Launch Fabrication</span>
                    </button>
                    <button
                      onClick={() => setIsRevisionModalOpen(true)}
                      className="w-full sm:w-auto px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-800 cursor-pointer"
                    >
                      Request Revisions
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 bg-emerald-950/50 border border-emerald-800/80 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-300 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Quote Accepted! Materials machined & registered in Atelier ledger.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 text-center space-y-3">
                <Clock className="w-8 h-8 text-amber-400 mx-auto" />
                <h3 className="text-sm font-bold text-zinc-200 font-serif">Quotation Under Artisan Review</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Our master jewelers and aerospace machining engineers are analyzing your brief, calculating titanium tolerances, and creating a preliminary 3D rendering. Expect your quotation in &lt;12 hours.
                </p>
              </div>
            )}

            {/* 2. Shipping & Logistics Live Tracking Card */}
            {(activeOrder.status === 'Shipped' || activeOrder.status === 'Delivered') && (
              <div className="bg-zinc-900/60 border border-emerald-500/40 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-serif font-bold text-zinc-100">Live Courier Dispatch</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {activeOrder.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-mono">Carrier</span>
                    <p className="font-bold text-zinc-200 mt-0.5">{activeOrder.carrier || 'BlueDart Apex Gold'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-mono">AWB Tracking #</span>
                    <p className="font-mono font-bold text-amber-400 mt-0.5">{activeOrder.trackingNumber || 'HX-DEL-984210'}</p>
                  </div>
                </div>

                {activeOrder.trackingUrl && (
                  <a
                    href={activeOrder.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Track with Courier Network</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* 3. Detailed Design Brief Specs */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 space-y-4 text-xs">
              <h4 className="font-bold text-zinc-200 uppercase tracking-widest text-[11px]">Submitted Design Brief</h4>
              <p className="text-zinc-300 leading-relaxed font-sans bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
                "{activeOrder.description}"
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-1 text-[11px]">
                <div>
                  <span className="text-zinc-500 block">Colors:</span>
                  <span className="text-zinc-200 font-medium">{activeOrder.preferredColors.join(', ')}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Aesthetic:</span>
                  <span className="text-zinc-200 font-medium">{activeOrder.preferredStyle}</span>
                </div>
              </div>

              {activeOrder.giftNote && (
                <div className="pt-2 border-t border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase block">Calligraphy Letter:</span>
                  <p className="text-amber-300/90 font-serif italic mt-0.5">"{activeOrder.giftNote}"</p>
                </div>
              )}

              {activeOrder.uploadedFiles.length > 0 && (
                <div className="pt-2 border-t border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase block mb-2">Attached Sketches & Assets ({activeOrder.uploadedFiles.length}):</span>
                  <div className="grid grid-cols-3 gap-2">
                    {activeOrder.uploadedFiles.map((url, i) => (
                      <div key={i} className="aspect-video rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900">
                        <img src={url} alt="Sketch" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column (6 cols): Realtime Customer ↔ Artisan Messaging */}
          <div className="lg:col-span-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 flex flex-col h-[650px] shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-serif font-bold text-zinc-100">Atelier Direct Artisan Chat</h3>
              </div>
              <span className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Artisan Live
              </span>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
              {activeOrder.messages.map((msg) => {
                const isCustomer = msg.sender === 'customer';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400">
                        {isCustomer ? 'You' : msg.senderName}
                      </span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                        isCustomer
                          ? 'bg-amber-400 text-zinc-950 font-medium rounded-tr-none shadow-md'
                          : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700 shadow-md'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Attachments inside chat message */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-black/10 flex gap-2 overflow-x-auto">
                          {msg.attachments.map((att, i) => (
                            <img
                              key={i}
                              src={att}
                              alt="Attachment"
                              className="w-20 h-20 rounded-xl object-cover border border-zinc-700 bg-zinc-900 shrink-0"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Upload preview inside chat composer */}
            {attachedFiles.length > 0 && (
              <div className="flex gap-2 pt-2 border-t border-zinc-800">
                {attachedFiles.map((fileUrl, idx) => (
                  <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900">
                    <img src={fileUrl} alt="Attached" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-0.5 right-0.5 bg-black/80 text-white rounded p-0.5 text-[8px]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Bar with Supabase Storage File Attachments */}
            <form onSubmit={handleSendMessage} className="mt-3 pt-3 border-t border-zinc-800 flex items-center gap-2">
              <label className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 rounded-xl cursor-pointer transition-colors border border-zinc-800" title="Attach file or photo">
                <Paperclip className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*,.pdf,.svg"
                  onChange={handleChatFileUpload}
                  className="hidden"
                  disabled={isUploadingChatFile}
                />
              </label>

              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask artisan about metal alloy, laser depth, or delivery date..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-400 font-sans"
              />

              <button
                type="submit"
                disabled={(!chatMessage.trim() && attachedFiles.length === 0) || isUploadingChatFile}
                className="p-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-zinc-950 font-bold rounded-xl transition-all cursor-pointer shadow-md"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* REVISION REQUEST MODAL */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-serif font-bold text-zinc-100">Request Quotation / Design Revision</h3>
            <p className="text-xs text-zinc-400">
              Tell the master artisan what adjustments you'd like made to pricing, materials, turnaround time, or dimensions.
            </p>

            <form onSubmit={handleRequestRevision} className="space-y-4 text-xs">
              <textarea
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                rows={4}
                placeholder="e.g. Could we upgrade the casing to 24K gold foil inlay and reduce turnaround to 5 business days?"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-100 outline-none focus:border-amber-400 resize-none leading-relaxed"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsRevisionModalOpen(false)}
                  className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl cursor-pointer"
                >
                  Submit Revision Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CAD 3D PROOF PREVIEW MODAL */}
      {isProofModalOpen && (activeOrder.quote?.designProofUrl || activeOrder.designProofUrl) && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-zinc-100">Artisan CAD Proof & 3D Render</h3>
                <span className="text-[10px] text-zinc-500 font-mono">Reference: {activeOrder.requestNumber}</span>
              </div>
              <button
                onClick={() => setIsProofModalOpen(false)}
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <img
                src={activeOrder.quote?.designProofUrl || activeOrder.designProofUrl}
                alt="CAD Proof Detailed"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsProofModalOpen(false)}
                className="px-5 py-2 bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl"
              >
                Close Blueprint
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
