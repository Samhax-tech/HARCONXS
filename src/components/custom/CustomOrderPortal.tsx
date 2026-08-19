import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomOrder, CustomOrderStatus, CustomOrderAttachment, CustomOrderConversationStatus } from '../../types';
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
  Download,
  HelpCircle,
  XCircle,
  Layers,
  Palette,
  CreditCard,
  UserCheck,
  CheckCheck,
  FileCode,
  Maximize2,
  X,
  RefreshCw,
  Info
} from 'lucide-react';

interface TimelineStepMeta {
  status: CustomOrderStatus;
  label: string;
  shortLabel: string;
  description: string;
  orderIndex: number;
}

const TIMELINE_PIPELINE: TimelineStepMeta[] = [
  { status: 'REQUESTED', label: 'Brief Submitted', shortLabel: 'Requested', description: 'Brief received by Atelier Intake Engine', orderIndex: 1 },
  { status: 'UNDER_REVIEW', label: 'Feasibility Review', shortLabel: 'Reviewing', description: 'Master jeweler evaluating tolerances & metallurgy', orderIndex: 2 },
  { status: 'NEEDS_INFORMATION', label: 'Clarification Needed', shortLabel: 'Info Needed', description: 'Artisan submitted questions regarding specs', orderIndex: 3 },
  { status: 'QUOTED', label: 'Quotation Issued', shortLabel: 'Quoted', description: 'Pricing, turnaround & CAD proof ready for approval', orderIndex: 4 },
  { status: 'QUOTE_ACCEPTED', label: 'Quote Accepted', shortLabel: 'Accepted', description: 'Terms accepted, bench allocation locked', orderIndex: 5 },
  { status: 'PAYMENT_PENDING', label: 'Payment Pending', shortLabel: 'Pay Pending', description: 'Awaiting deposit or full authorization', orderIndex: 6 },
  { status: 'PAID', label: 'Payment Confirmed', shortLabel: 'Paid', description: 'Precious metals & movements reserved in vault', orderIndex: 7 },
  { status: 'DESIGNING', label: '3D CAD Modeling', shortLabel: 'Designing', description: 'Precision laser & optical 3D CAD blueprints being rendered', orderIndex: 8 },
  { status: 'CUSTOMER_REVIEW', label: 'Proof Approval', shortLabel: 'Review Proof', description: '3D blueprint submitted for your review', orderIndex: 9 },
  { status: 'APPROVED', label: 'Design Approved', shortLabel: 'Approved', description: 'CAD blueprint signed off for CNC lathe & laser engraving', orderIndex: 10 },
  { status: 'PRODUCTION', label: 'Artisan Fabrication', shortLabel: 'Production', description: 'Hand-machining, laser engraving & assembly in progress', orderIndex: 11 },
  { status: 'PACKING', label: 'White-Glove Packing', shortLabel: 'Packing', description: 'Final inspection, beeswax polish & wax-sealed packaging', orderIndex: 12 },
  { status: 'SHIPPED', label: 'Courier Transit', shortLabel: 'Dispatched', description: 'Dispatched via insured express transit with tracking', orderIndex: 13 },
  { status: 'DELIVERED', label: 'Delivered', shortLabel: 'Delivered', description: 'Keepsake received by patron', orderIndex: 14 }
];

export const CustomOrderPortal: React.FC = () => {
  const {
    customOrders,
    sendCustomOrderMessage,
    markCustomOrderMessagesAsRead,
    respondToQuote,
    uploadCustomOrderFile,
    updateCustomOrderStatus,
    subscribeToCustomOrder,
    formatPrice,
    setCurrentView,
    showToast
  } = useStore();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    customOrders.length > 0 ? customOrders[0].id : ''
  );
  const [mobileTab, setMobileTab] = useState<'details' | 'chat'>('chat');
  const [chatMessage, setChatMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [attachedDocList, setAttachedDocList] = useState<CustomOrderAttachment[]>([]);
  const [isUploadingChatFile, setIsUploadingChatFile] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeOrder = customOrders.find(co => co.id === selectedOrderId) || customOrders[0];

  // Auto select valid order ID if current was deleted/updated
  useEffect(() => {
    if (customOrders.length > 0 && !customOrders.some(co => co.id === selectedOrderId)) {
      setSelectedOrderId(customOrders[0].id);
    }
  }, [customOrders, selectedOrderId]);

  // Supabase Realtime Subscription for active order
  useEffect(() => {
    if (!activeOrder?.id) return;
    const unsubscribe = subscribeToCustomOrder(activeOrder.id, (_updated) => {
      // Order automatically updated in store
    });
    return () => {
      unsubscribe();
    };
  }, [activeOrder?.id, subscribeToCustomOrder]);

  // Mark messages as read by customer when viewing this order
  useEffect(() => {
    if (activeOrder?.id && (activeOrder.unreadCountCustomer ?? 0) > 0) {
      markCustomOrderMessagesAsRead(activeOrder.id, 'customer');
    }
  }, [activeOrder?.id, activeOrder?.unreadCountCustomer, markCustomOrderMessagesAsRead]);

  // Auto-scroll chat to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeOrder?.messages]);

  // Determine current timeline status index
  const getStatusIndex = (status: CustomOrderStatus): number => {
    const step = TIMELINE_PIPELINE.find(s => s.status === status);
    if (step) return step.orderIndex;

    switch (status) {
      case 'Submitted': return 1;
      case 'Quoted': return 4;
      case 'Paid': return 7;
      case 'In Design': return 8;
      case 'Production': return 11;
      case 'Shipped': return 13;
      case 'Delivered':
      case 'Completed': return 14;
      default: return 1;
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const textToSend = presetText || chatMessage.trim();
    if ((!textToSend && attachedFiles.length === 0 && attachedDocList.length === 0) || !activeOrder) return;

    await sendCustomOrderMessage(
      activeOrder.id,
      textToSend,
      'customer',
      {
        attachments: attachedFiles.length > 0 ? attachedFiles : undefined,
        fileAttachments: attachedDocList.length > 0 ? attachedDocList : undefined
      }
    );

    setChatMessage('');
    setAttachedFiles([]);
    setAttachedDocList([]);
    showToast('Message sent to Atelier artisan via Supabase Realtime!');
  };

  const handleChatFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeOrder) return;

    setIsUploadingChatFile(true);
    try {
      const file = files[0];
      const isImg = file.type.startsWith('image/');
      const fileExt = file.name.split('.').pop() || 'dat';
      const fileCategory: CustomOrderAttachment['category'] = isImg
        ? 'customer_reference'
        : fileExt.match(/dxf|dwg|step|stl|obj|cad/i)
        ? 'design_cad'
        : 'specification';

      const res = await uploadCustomOrderFile(file, activeOrder.id);
      if (res.success && res.url) {
        if (isImg) {
          setAttachedFiles(prev => [...prev, res.url!]);
        }
        setAttachedDocList(prev => [
          ...prev,
          {
            id: `att-${Date.now()}`,
            name: file.name,
            url: res.url!,
            fileType: file.type || 'application/octet-stream',
            fileSize: file.size,
            uploadedAt: new Date().toISOString(),
            uploaderRole: 'customer',
            category: fileCategory
          }
        ]);
        showToast('File attached securely to custom order brief.');
      } else {
        showToast('File upload failed. Please try again.');
      }
    } catch {
      showToast('Error uploading file to Supabase Storage.');
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

  const handleApproveProof = async () => {
    if (!activeOrder) return;
    await updateCustomOrderStatus(activeOrder.id, 'APPROVED', {
      notes: 'Customer approved the 3D CAD laser blueprint.'
    });
    showToast('✨ 3D Proof approved! Project queued for CNC laser fabrication.');
    setIsProofModalOpen(false);
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

  const currentOrderIdx = getStatusIndex(activeOrder.status);
  const isCancelled = activeOrder.status === 'CANCELLED';
  const isRejected = activeOrder.status === 'REJECTED';

  const getConvStatusBadge = (status?: CustomOrderConversationStatus) => {
    switch (status) {
      case 'waiting_on_artisan':
        return { label: 'Artisan Reviewing', color: 'bg-amber-950/80 border-amber-800 text-amber-300' };
      case 'waiting_on_customer':
        return { label: 'Action Required', color: 'bg-rose-950/80 border-rose-800 text-rose-300 animate-pulse' };
      case 'in_progress':
        return { label: 'Active Exchange', color: 'bg-sky-950/80 border-sky-800 text-sky-300' };
      case 'resolved':
        return { label: 'Conversation Resolved', color: 'bg-emerald-950/80 border-emerald-800 text-emerald-300' };
      case 'archived':
        return { label: 'Archived', color: 'bg-zinc-800 border-zinc-700 text-zinc-400' };
      default:
        return { label: 'Live Chat Open', color: 'bg-emerald-950/60 border-emerald-800 text-emerald-300' };
    }
  };

  const convBadge = getConvStatusBadge(activeOrder.conversationStatus);

  return (
    <div className="bg-zinc-950 min-h-screen py-6 sm:py-8 text-zinc-200 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation & Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('catalog')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Catalog</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-zinc-300">Supabase Realtime Synced</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('custom-builder')}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ New Custom Brief</span>
            </button>
          </div>
        </div>

        {/* Custom Orders Project Switcher Tabs */}
        {customOrders.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {customOrders.map(co => {
              const isSelected = selectedOrderId === co.id;
              const hasUnread = (co.unreadCountCustomer ?? 0) > 0;

              return (
                <button
                  key={co.id}
                  onClick={() => setSelectedOrderId(co.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-amber-400 text-zinc-950 font-bold border-amber-400 shadow-md'
                      : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border-zinc-800'
                  }`}
                >
                  <span className="font-mono">{co.requestNumber}</span>
                  <span>•</span>
                  <span className="truncate max-w-[120px]">{co.productType}</span>
                  {hasUnread && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[9px] animate-bounce">
                      {co.unreadCountCustomer} new
                    </span>
                  )}
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 font-bold uppercase">{co.status}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* HERO PROJECT SUMMARY CARD */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <span className="font-mono text-sm font-bold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2.5 py-1 rounded-lg">
                  {activeOrder.requestNumber}
                </span>
                <h1 className="text-lg sm:text-xl font-serif font-bold text-zinc-100">
                  {activeOrder.productType}
                </h1>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                  For {activeOrder.recipient} ({activeOrder.relationship})
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Created: <span className="font-mono text-zinc-300">{new Date(activeOrder.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span> • Turnaround Target: <strong className="text-zinc-200">{activeOrder.targetDeliveryDate || 'Standard Atelier Priority'}</strong>
              </p>
            </div>

            {/* Assigned Artisan & Chat Status Header */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <div className="w-6 h-6 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center font-bold text-[10px]">
                  {activeOrder.assignedAdminName ? activeOrder.assignedAdminName.charAt(0) : 'H'}
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase font-mono text-zinc-500 block">Assigned Artisan</span>
                  <span className="text-xs font-bold text-zinc-200">{activeOrder.assignedAdminName || 'Hamza (Master Atelier)'}</span>
                </div>
              </div>

              <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 ${convBadge.color}`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                <span>{convBadge.label}</span>
              </div>
            </div>
          </div>

          {/* 16-STATUS TIMELINE PIPELINE */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">
                Fabrication Lifecycle Pipeline ({currentOrderIdx} of 14 Steps)
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">
                {activeOrder.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Horizontal Timeline Track */}
            <div className="relative">
              <div className="overflow-x-auto no-scrollbar pb-3 pt-2">
                <div className="flex items-center min-w-[760px] relative">
                  {/* Pipeline Connector Line */}
                  <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-zinc-800 -z-0" />
                  <div
                    className="absolute top-3.5 left-4 h-0.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-700 -z-0"
                    style={{
                      width: isCancelled || isRejected
                        ? '100%'
                        : `${Math.min(100, Math.max(0, ((currentOrderIdx - 1) / (TIMELINE_PIPELINE.length - 1)) * 100))}%`
                    }}
                  />

                  {TIMELINE_PIPELINE.map((step) => {
                    const isDone = currentOrderIdx > step.orderIndex;
                    const isCurrent = currentOrderIdx === step.orderIndex && !isCancelled && !isRejected;

                    return (
                      <div
                        key={step.status}
                        className="flex-1 flex flex-col items-center text-center relative z-10 px-1"
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            isDone
                              ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                              : isCurrent
                              ? 'bg-amber-400 text-zinc-950 ring-4 ring-amber-400/30 scale-110 shadow-lg'
                              : 'bg-zinc-900 border border-zinc-700 text-zinc-500'
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.orderIndex}
                        </div>
                        <span
                          className={`text-[10px] mt-2 font-medium tracking-tight whitespace-nowrap ${
                            isCurrent
                              ? 'text-amber-400 font-bold'
                              : isDone
                              ? 'text-zinc-300'
                              : 'text-zinc-600'
                          }`}
                        >
                          {step.shortLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View Toggle Buttons */}
        <div className="flex lg:hidden bg-zinc-900/80 p-1 rounded-2xl border border-zinc-800">
          <button
            onClick={() => setMobileTab('chat')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              mobileTab === 'chat' ? 'bg-amber-400 text-zinc-950 shadow-md' : 'text-zinc-400'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Artisan Live Chat</span>
            {(activeOrder.unreadCountCustomer ?? 0) > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px]">
                {activeOrder.unreadCountCustomer}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileTab('details')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              mobileTab === 'details' ? 'bg-amber-400 text-zinc-950 shadow-md' : 'text-zinc-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Brief & Specs</span>
          </button>
        </div>

        {/* MAIN 2-COLUMN WORKSPACE: LEFT (Specs, Quotation & Dispatch) + RIGHT (Realtime Artisan Chat) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (6 cols on desktop): Quotation, Specs, Carrier Tracking */}
          <div className={`lg:col-span-6 space-y-6 ${mobileTab === 'details' ? 'block' : 'hidden lg:block'}`}>
            
            {/* 1. Official Quotation & CAD Card */}
            {activeOrder.quote && (
              <div className="bg-gradient-to-b from-amber-950/30 to-zinc-900/60 border-2 border-amber-400/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-amber-400/20 pb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    <h3 className="font-serif font-bold text-zinc-100 text-sm">Official Atelier Quotation</h3>
                  </div>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase">
                    Status: {activeOrder.quote.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono block">All-Inclusive Quote</span>
                    <p className="font-mono text-lg font-bold text-amber-400 mt-0.5">
                      {formatPrice(activeOrder.quote.amount)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono block">Bench Turnaround</span>
                    <p className="font-bold text-zinc-200 mt-0.5">
                      {activeOrder.quote.turnaroundDays} Business Days
                    </p>
                  </div>
                </div>

                {activeOrder.quote.notes && (
                  <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs">
                    <span className="text-[10px] text-zinc-500 uppercase font-mono block mb-1">Artisan Notes & metallurgy</span>
                    <p className="text-zinc-300 leading-relaxed italic">{activeOrder.quote.notes}</p>
                  </div>
                )}

                {/* CAD Design Proof Preview Box */}
                {(activeOrder.quote.designProofUrl || activeOrder.designProofUrl) && (
                  <div className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-amber-400 font-bold flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        3D Laser CAD Proof Attached
                      </span>
                      <button
                        onClick={() => setIsProofModalOpen(true)}
                        className="text-[10px] text-zinc-300 hover:text-amber-400 underline cursor-pointer"
                      >
                        Inspect Blueprint
                      </button>
                    </div>
                    <div
                      onClick={() => setIsProofModalOpen(true)}
                      className="relative h-36 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer group"
                    >
                      <img
                        src={activeOrder.quote.designProofUrl || activeOrder.designProofUrl}
                        alt="CAD Proof"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="px-3 py-1.5 rounded-lg bg-zinc-950/90 text-amber-400 font-bold text-xs flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          View Full 3D Blueprint
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quote Action Buttons */}
                {activeOrder.quote.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-amber-400/20">
                    <button
                      onClick={() => setIsRevisionModalOpen(true)}
                      className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Request Revisions
                    </button>
                    <button
                      onClick={handleAcceptQuote}
                      className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Accept Quotation</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2. Dispatch Logistics & Courier Tracking (if shipped) */}
            {activeOrder.trackingNumber && (
              <div className="bg-emerald-950/20 border border-emerald-800/60 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Truck className="w-4 h-4" />
                  <h4 className="font-serif font-bold text-sm">Insured Courier Dispatch</h4>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-mono">Carrier</span>
                    <p className="font-bold text-zinc-200 mt-0.5">{activeOrder.carrier || 'BlueDart Apex Gold'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-mono">AWB Tracking #</span>
                    <p className="font-mono font-bold text-amber-400 mt-0.5">{activeOrder.trackingNumber}</p>
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

            {/* 3. Submitted Design Specifications Brief */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4 text-xs">
              <h4 className="font-bold text-zinc-200 uppercase tracking-widest text-[11px]">Submitted Design Specifications</h4>
              
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">Inscribed Names & Dates:</span>
                <p className="text-amber-300 font-serif font-bold text-sm">
                  {activeOrder.personalText?.primaryNames || activeOrder.recipient}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                  <span>{activeOrder.personalText?.milestoneDate || 'Date: Calibrated'}</span>
                  <span>•</span>
                  <span>{activeOrder.personalText?.coordinates || 'Coordinates: Atelier Master'}</span>
                </div>
                {activeOrder.personalText?.customQuote && (
                  <p className="text-zinc-300 italic font-serif text-xs pt-1 border-t border-zinc-800">
                    "{activeOrder.personalText.customQuote}"
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-zinc-500 block">Colors / Alloys:</span>
                  <span className="text-zinc-200 font-medium">
                    {activeOrder.selectedColors?.join(', ') || activeOrder.preferredColors?.join(', ') || 'Custom'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Design Aesthetic:</span>
                  <span className="text-zinc-200 font-medium">{activeOrder.customDesign || activeOrder.preferredStyle}</span>
                </div>
              </div>

              {activeOrder.giftNote && (
                <div className="pt-2 border-t border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase block">Calligraphy Letter:</span>
                  <p className="text-amber-300/90 font-serif italic mt-0.5">"{activeOrder.giftNote}"</p>
                </div>
              )}

              {/* Uploaded Photos and Reference Drawings */}
              {activeOrder.uploadedFiles && activeOrder.uploadedFiles.length > 0 && (
                <div className="pt-2 border-t border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] uppercase block mb-2">
                    Attached Files ({activeOrder.uploadedFiles.length}):
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {activeOrder.uploadedFiles.map((url, i) => (
                      <div
                        key={i}
                        onClick={() => setPreviewImageUrl(url)}
                        className="aspect-video rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900 cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <img src={url} alt="Attached asset" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column (6 cols on desktop): Realtime Dedicated Artisan Chat */}
          <div className={`lg:col-span-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-4 sm:p-6 flex flex-col h-[680px] shadow-2xl ${mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'}`}>
            
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-zinc-100 flex items-center gap-2">
                    <span>Atelier Dedicated Artisan Chat</span>
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Direct communication with {activeOrder.assignedAdminName || 'Master Artisan'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Realtime Active
                </span>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 text-xs">
              {activeOrder.messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-2">
                  <Sparkles className="w-8 h-8 text-amber-400/60" />
                  <p className="font-serif text-sm text-zinc-300">Start the conversation with your master artisan</p>
                  <p className="text-[11px] text-zinc-500 max-w-xs">
                    Ask questions about metallurgy, laser engraving fonts, dimensional tolerances, or request 3D CAD updates.
                  </p>
                </div>
              ) : (
                activeOrder.messages.map((msg) => {
                  const isCustomer = msg.sender === 'customer';
                  const msgTime = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[10px] text-zinc-500 font-mono">{msgTime}</span>
                        <span className="text-[10px] font-bold text-zinc-400">
                          {isCustomer ? 'You' : msg.senderName}
                        </span>
                        {!isCustomer && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-400 font-mono text-[9px]">
                            Artisan
                          </span>
                        )}
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl max-w-[88%] sm:max-w-[80%] leading-relaxed ${
                          isCustomer
                            ? 'bg-amber-400 text-zinc-950 font-medium rounded-tr-none shadow-md'
                            : 'bg-zinc-850 text-zinc-200 rounded-tl-none border border-zinc-700/80 shadow-md'
                        }`}
                      >
                        {/* Admin 3D Proof Banner if attached to message */}
                        {msg.isAdminProof && (
                          <div className="mb-2 p-2 rounded-xl bg-black/20 border border-black/10 flex items-center justify-between">
                            <span className="font-bold text-[11px] flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5" />
                              {msg.adminProofTitle || 'Official 3D CAD Blueprint'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsProofModalOpen(true)}
                              className="text-[10px] underline font-bold"
                            >
                              Review & Sign-off
                            </button>
                          </div>
                        )}

                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {/* Image Attachments */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-black/10 flex flex-wrap gap-2">
                            {msg.attachments.map((att, i) => (
                              <div
                                key={i}
                                onClick={() => setPreviewImageUrl(att)}
                                className="relative w-20 h-20 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 shrink-0 cursor-pointer group"
                              >
                                <img src={att} alt="Attachment" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Maximize2 className="w-3.5 h-3.5 text-white" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* File Attachments (CAD, PDF, Blueprint docs) */}
                        {msg.fileAttachments && msg.fileAttachments.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-black/10 space-y-1.5">
                            {msg.fileAttachments.map((fileAtt) => (
                              <a
                                key={fileAtt.id}
                                href={fileAtt.url}
                                target="_blank"
                                rel="noreferrer"
                                download={fileAtt.name}
                                className={`flex items-center justify-between gap-2 p-2 rounded-xl border text-[11px] transition-colors ${
                                  isCustomer
                                    ? 'bg-black/10 border-black/15 text-zinc-950 hover:bg-black/20'
                                    : 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <FileCode className="w-4 h-4 shrink-0 text-amber-500" />
                                  <span className="truncate font-medium">{fileAtt.name}</span>
                                </div>
                                <Download className="w-3.5 h-3.5 shrink-0" />
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Read Receipts Checkmarks */}
                        <div className="mt-1 flex items-center justify-end gap-1 text-[9px] opacity-70">
                          {isCustomer && (
                            <span className="flex items-center gap-0.5">
                              {msg.isRead ? (
                                <CheckCheck className="w-3.5 h-3.5 text-zinc-900" title="Read by artisan" />
                              ) : (
                                <Check className="w-3 h-3 text-zinc-900/60" title="Sent via Supabase Realtime" />
                              )}
                            </span>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Inquiry Action Chips */}
            <div className="py-2 border-t border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
              <span className="text-zinc-500 text-[10px] uppercase font-mono shrink-0">Quick prompts:</span>
              <button
                type="button"
                onClick={() => handleSendMessage(undefined, 'Could you please provide an estimated fabrication date?')}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 whitespace-nowrap cursor-pointer transition-colors"
              >
                Estimated date?
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(undefined, 'Can we see the 3D laser CAD blueprint proof?')}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 whitespace-nowrap cursor-pointer transition-colors"
              >
                Request 3D Blueprint
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(undefined, 'Everything looks perfect, ready to proceed!')}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 whitespace-nowrap cursor-pointer transition-colors"
              >
                Looks perfect!
              </button>
            </div>

            {/* Attached files preview before sending */}
            {(attachedFiles.length > 0 || attachedDocList.length > 0) && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800">
                {attachedFiles.map((fileUrl, idx) => (
                  <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900">
                    <img src={fileUrl} alt="Attached" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-0.5 right-0.5 bg-black/80 text-white rounded p-0.5 text-[8px]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {attachedDocList.filter(d => !d.fileType.startsWith('image/')).map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-200">
                    <FileCode className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate max-w-[100px]">{doc.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachedDocList(prev => prev.filter((_, i) => i !== idx))}
                      className="text-zinc-400 hover:text-rose-400 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Composer with Supabase Storage File Attachment */}
            <form onSubmit={handleSendMessage} className="mt-2 pt-3 border-t border-zinc-800 flex items-center gap-2">
              <label
                className={`p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 rounded-xl cursor-pointer transition-colors border border-zinc-800 flex items-center justify-center ${
                  isUploadingChatFile ? 'opacity-50 pointer-events-none' : ''
                }`}
                title="Attach blueprint, CAD file, sketch or image"
              >
                {isUploadingChatFile ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                ) : (
                  <Paperclip className="w-4 h-4" />
                )}
                <input
                  type="file"
                  accept="image/*,.pdf,.svg,.dxf,.step,.stl,.cad"
                  onChange={handleChatFileUpload}
                  className="hidden"
                  disabled={isUploadingChatFile}
                />
              </label>

              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask master artisan about metallurgy, tolerances, or speed..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-400 font-sans"
              />

              <button
                type="submit"
                disabled={(!chatMessage.trim() && attachedFiles.length === 0 && attachedDocList.length === 0) || isUploadingChatFile}
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

      {/* CAD 3D PROOF PREVIEW & APPROVAL MODAL */}
      {isProofModalOpen && (activeOrder.quote?.designProofUrl || activeOrder.designProofUrl) && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-zinc-100">Artisan CAD Proof & 3D Laser Render</h3>
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

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-400">
                Approving advances project directly into CNC laser fabrication.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsProofModalOpen(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={handleApproveProof}
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve 3D Proof</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL-SIZE IMAGE PREVIEW MODAL */}
      {previewImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-3xl w-full p-4 space-y-3 shadow-2xl relative">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-mono text-zinc-400">Attached Visual Specimen</span>
              <button
                onClick={() => setPreviewImageUrl(null)}
                className="p-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-hidden rounded-2xl bg-zinc-900 flex items-center justify-center">
              <img src={previewImageUrl} alt="Preview" className="max-h-[70vh] w-auto object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
