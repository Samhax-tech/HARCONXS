import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../../context/StoreContext';
import { CustomOrder, CustomOrderStatus } from '../../../types';
import {
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Send,
  Paperclip,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  FileText,
  DollarSign,
  ShieldCheck,
  ExternalLink,
  RotateCw,
  Image as ImageIcon
} from 'lucide-react';

interface CustomOrderDetailViewProps {
  customOrderId: string;
  onBack: () => void;
}

export const CustomOrderDetailView: React.FC<CustomOrderDetailViewProps> = ({
  customOrderId,
  onBack
}) => {
  const {
    customOrders,
    formatPrice,
    sendCustomOrderMessage,
    markCustomOrderMessagesAsRead,
    respondToQuote,
    uploadCustomOrderFile,
    showToast
  } = useStore();

  const customOrder = customOrders.find(co => co.id === customOrderId || co.requestNumber === customOrderId);

  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mark unread messages as read when opening project
  useEffect(() => {
    if (customOrder && (customOrder.unreadCountCustomer || 0) > 0) {
      markCustomOrderMessagesAsRead(customOrder.id, 'customer');
    }
  }, [customOrder?.id, markCustomOrderMessagesAsRead]);

  // Scroll to bottom of message thread
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [customOrder?.messages]);

  if (!customOrder) {
    return (
      <div className="p-8 text-center bg-zinc-900/60 rounded-2xl border border-zinc-800">
        <AlertCircle className="w-10 h-10 mx-auto mb-2 text-zinc-500" />
        <p className="text-zinc-300 text-sm font-semibold">Custom Order not found</p>
        <button
          onClick={onBack}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Custom Orders
        </button>
      </div>
    );
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || isSending) return;

    setIsSending(true);
    await sendCustomOrderMessage(customOrder.id, messageText.trim(), 'customer');
    setMessageText('');
    setIsSending(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const res = await uploadCustomOrderFile(file, customOrder.id);
    setIsUploading(false);

    if (res.success) {
      await sendCustomOrderMessage(
        customOrder.id,
        `Shared attachment: ${res.fileName}`,
        'customer',
        { attachments: [res.url] }
      );
      showToast(`Uploaded ${res.fileName} to artisan bench.`);
    } else {
      showToast(res.error || 'Failed to upload file.');
    }
  };

  const handleAcceptQuote = async () => {
    await respondToQuote(customOrder.id, true);
  };

  const handleRequestRevision = async () => {
    if (!revisionNote.trim()) {
      showToast('Please provide details for the requested revisions.');
      return;
    }
    await respondToQuote(customOrder.id, false, revisionNote.trim());
    setShowRevisionModal(false);
    setRevisionNote('');
  };

  // 8-stage bespoke pipeline stages
  const pipelineStages: { status: CustomOrderStatus; label: string }[] = [
    { status: 'REQUESTED', label: 'Brief Submitted' },
    { status: 'UNDER_REVIEW', label: 'Artisan Review' },
    { status: 'QUOTED', label: 'Quote Issued' },
    { status: 'QUOTE_ACCEPTED', label: 'Quote Accepted' },
    { status: 'DESIGNING', label: 'Design & CAD' },
    { status: 'PRODUCTION', label: 'Atelier Crafting' },
    { status: 'PACKING', label: 'Luxury Packing' },
    { status: 'SHIPPED', label: 'Dispatched & Insured' }
  ];

  const currentStageIndex = pipelineStages.findIndex(s => s.status === customOrder.status);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-serif font-bold text-zinc-100">{customOrder.requestNumber}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {customOrder.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Bespoke Commission for {customOrder.recipient} ({customOrder.occasion})
            </p>
          </div>
        </div>

        {customOrder.assignedAdminName && (
          <div className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900/80 px-3.5 py-2 rounded-xl border border-zinc-800">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Assigned Artisan: <strong className="text-amber-300">{customOrder.assignedAdminName}</strong></span>
          </div>
        )}
      </div>

      {/* 8-Stage Milestone Pipeline Tracker */}
      <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-5">
          Atelier Fabrication Progress
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {pipelineStages.map((stage, idx) => {
            const isCompleted = idx <= (currentStageIndex >= 0 ? currentStageIndex : 0);
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={stage.status}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/5'
                    : isCompleted
                    ? 'bg-zinc-900/90 border-zinc-700 text-zinc-200'
                    : 'bg-zinc-950/40 border-zinc-800 text-zinc-600'
                }`}
              >
                <div className="w-5 h-5 mx-auto mb-1.5 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : idx + 1}
                </div>
                <span className="text-[11px] font-medium leading-tight block">{stage.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Atelier Quotation Card */}
      {customOrder.quote && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/30 shadow-xl shadow-amber-500/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">Official Atelier Quotation & Proposal</h3>
                <p className="text-xs text-zinc-400">Issued by HARCONXS Master Artisan</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-zinc-500 block">Total Quotation</span>
              <span className="font-mono text-xl font-bold text-amber-300">{formatPrice(customOrder.quote.amount)}</span>
            </div>
          </div>

          <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-300">
            <div>
              <span className="text-zinc-500 block mb-0.5">Estimated Turnaround</span>
              <p className="font-semibold text-zinc-100">{customOrder.quote.turnaroundDays} Business Days</p>
            </div>
            <div>
              <span className="text-zinc-500 block mb-0.5">Packaging Included</span>
              <p className="font-semibold text-zinc-100">{customOrder.quote.packagingIncluded}</p>
            </div>
            <div>
              <span className="text-zinc-500 block mb-0.5">Quotation Status</span>
              <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
                {customOrder.quote.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {customOrder.quote.notes && (
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300 mb-4">
              <span className="font-medium text-amber-300 block mb-1">Artisan Fabrication Notes:</span>
              <p>{customOrder.quote.notes}</p>
            </div>
          )}

          {customOrder.quote.designProofUrl && (
            <div className="mb-4">
              <span className="text-xs text-zinc-400 block mb-2">CAD Proof / Design Rendering:</span>
              <div className="w-48 h-32 rounded-xl bg-zinc-950 overflow-hidden border border-zinc-700">
                <img
                  src={customOrder.quote.designProofUrl}
                  alt="Design Proof"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}

          {/* Accept / Revise Buttons */}
          {customOrder.quote.status === 'pending_review' && (
            <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => setShowRevisionModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
              >
                Request Revisions / Adjustments
              </button>
              <button
                onClick={handleAcceptQuote}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition shadow-sm"
              >
                Accept Quotation & Reserve Artisan Bench
              </button>
            </div>
          )}
        </div>
      )}

      {/* Two Column Grid: Brief Specs & Live Artisan Chat Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Commission Brief Details */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4 text-xs">
          <h3 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            Commission Brief
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-zinc-500 block mb-0.5">Product Type</span>
              <p className="font-medium text-zinc-200">{customOrder.productType}</p>
            </div>
            <div>
              <span className="text-zinc-500 block mb-0.5">Recipient & Occasion</span>
              <p className="font-medium text-zinc-200">{customOrder.recipient} ({customOrder.relationship}) • {customOrder.occasion}</p>
            </div>
            <div>
              <span className="text-zinc-500 block mb-0.5">Budget Range</span>
              <p className="font-medium text-zinc-200">{customOrder.budgetRange}</p>
            </div>
            {customOrder.selectedColors?.length > 0 && (
              <div>
                <span className="text-zinc-500 block mb-0.5">Color Palette</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {customOrder.selectedColors.map((col, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] border border-zinc-700">
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <span className="text-zinc-500 block mb-0.5">Client Requirements</span>
              <p className="text-zinc-300 leading-relaxed bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
                {customOrder.description}
              </p>
            </div>
            {customOrder.referenceImages && customOrder.referenceImages.length > 0 && (
              <div>
                <span className="text-zinc-500 block mb-1">Attached References:</span>
                <div className="grid grid-cols-3 gap-2">
                  {customOrder.referenceImages.map((img, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-zinc-950 overflow-hidden border border-zinc-800">
                      <img src={img} alt="Reference" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Real-Time Artisan Chat Thread */}
        <div className="lg:col-span-2 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col h-[500px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-200">Artisan Studio Messaging</h4>
                <p className="text-[10px] text-zinc-500">Live direct channel with HARCONXS atelier</p>
              </div>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
            {customOrder.messages.map(msg => {
              const isCustomer = msg.sender === 'customer';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-zinc-400">{msg.senderName}</span>
                    <span className="text-[9px] text-zinc-600">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isCustomer
                        ? 'bg-amber-500 text-zinc-950 rounded-tr-none font-medium'
                        : 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700/60'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {msg.attachments.map((att, i) => (
                          <div key={i} className="rounded-lg overflow-hidden border border-black/10 max-w-[200px]">
                            <img src={att} alt="Attachment" className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-800 flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700 transition"
              title="Attach CAD or reference image"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={isUploading ? 'Uploading file...' : 'Type message to Master Artisan...'}
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />

            <button
              type="submit"
              disabled={!messageText.trim() || isSending}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Revision Request Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-semibold text-zinc-100">Request Quotation Revision</h3>
            <p className="text-xs text-zinc-400">
              Explain what parameters you would like adjusted (budget, material choice, turnaround speed, or design scope).
            </p>
            <textarea
              rows={4}
              value={revisionNote}
              onChange={e => setRevisionNote(e.target.value)}
              placeholder="e.g. Could we adjust to platinum finish and 10-day turnaround?"
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestRevision}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950"
              >
                Send Revision Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
