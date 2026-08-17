import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomOrder, CustomOrderStatus } from '../../types';
import { Sparkles, MessageSquare, Send, CheckCircle2, Clock, DollarSign, Package, Truck, ArrowLeft, ShieldCheck } from 'lucide-react';

export const CustomOrderPortal: React.FC = () => {
  const { customOrders, sendCustomOrderMessage, respondToQuote, formatPrice, setCurrentView, showToast } = useStore();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    customOrders.length > 0 ? customOrders[0].id : ''
  );
  const [chatMessage, setChatMessage] = useState('');

  const activeOrder = customOrders.find(co => co.id === selectedOrderId) || customOrders[0];

  const pipelineSteps: { status: CustomOrderStatus; label: string }[] = [
    { status: 'Submitted', label: 'Requirement Submitted' },
    { status: 'Quoted', label: 'Quote Issued' },
    { status: 'Paid', label: 'Payment Confirmed' },
    { status: 'In Design', label: 'Atelier Design' },
    { status: 'Production', label: 'Fabrication' },
    { status: 'Shipped', label: 'Shipped & Delivered' }
  ];

  const getStepIndex = (status: CustomOrderStatus) => {
    switch (status) {
      case 'Submitted': return 0;
      case 'Quoted': return 1;
      case 'Paid': return 2;
      case 'In Design': return 3;
      case 'Production': return 4;
      case 'Shipped':
      case 'Delivered':
      case 'Completed': return 5;
      default: return 0;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeOrder) return;
    sendCustomOrderMessage(activeOrder.id, chatMessage, 'customer');
    setChatMessage('');
    showToast('Message sent to Atelier artisan.');
  };

  if (!activeOrder) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-200 py-16 text-center">
        <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold">No Custom Orders Found</h2>
        <p className="text-xs text-zinc-400 mt-1">Submit your first custom brief with our interactive wizard.</p>
        <button
          onClick={() => setCurrentView('custom-builder')}
          className="mt-4 px-5 py-2.5 bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl"
        >
          Create Custom Order
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

          <button
            onClick={() => setCurrentView('custom-builder')}
            className="px-3.5 py-1.5 bg-amber-950/50 hover:bg-amber-900/50 border border-amber-800/60 text-amber-300 font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ New Custom Request</span>
          </button>
        </div>

        {/* Requests Switcher Tabs */}
        {customOrders.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {customOrders.map(co => (
              <button
                key={co.id}
                onClick={() => setSelectedOrderId(co.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedOrderId === co.id
                    ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                    : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {co.requestNumber} • {co.productType.substring(0, 20)}...
              </button>
            ))}
          </div>
        )}

        {/* MAIN PROJECT HERO & PROGRESS PIPELINE */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-amber-400">{activeOrder.requestNumber}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800">
                  {activeOrder.status}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 mt-1">{activeOrder.productType}</h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Recipient: <strong className="text-zinc-200">{activeOrder.recipient} ({activeOrder.relationship})</strong> • Occasion: <strong className="text-zinc-200">{activeOrder.occasion}</strong>
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-xs text-zinc-500 uppercase tracking-wider block">Estimated Budget</span>
              <span className="text-lg font-bold text-zinc-100 font-mono">{activeOrder.budgetRange}</span>
              <p className="text-[11px] text-zinc-400">Target Delivery: {activeOrder.targetDeliveryDate || 'Flexible'}</p>
            </div>
          </div>

          {/* 6-Step Visual Milestone Pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {pipelineSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div
                  key={step.status}
                  className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'bg-amber-950/40 border-amber-500/80 shadow-md'
                      : isCompleted
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                      : 'bg-zinc-950/40 border-zinc-800/60 text-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold">0{idx + 1}</span>
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="text-xs font-semibold leading-tight">{step.label}</p>
                </div>
              );
            })}
          </div>

        </div>

        {/* 2 COLS: QUOTATION & MESSAGING */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left 6 cols: Quotation Card & Project Specs */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Quotation Status Card */}
            {activeOrder.quote ? (
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-amber-500/50 rounded-2xl p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-bold text-zinc-100">Atelier Quotation Ready</h3>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">Valid until {activeOrder.quote.validUntil}</span>
                </div>

                <div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Custom Fabrication & Materials</span>
                    <span className="text-base font-bold text-zinc-100 font-mono">{formatPrice(activeOrder.quote.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Turnaround Time</span>
                    <span className="font-semibold text-zinc-200">{activeOrder.quote.turnaroundDays} business days</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Packaging Included</span>
                    <span className="font-semibold text-zinc-200">{activeOrder.quote.packagingIncluded}</span>
                  </div>
                  <p className="pt-2 border-t border-zinc-800 text-zinc-300 leading-relaxed italic">
                    "{activeOrder.quote.notes}"
                  </p>
                </div>

                {activeOrder.quote.status === 'pending_review' ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => respondToQuote(activeOrder.id, true)}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
                    >
                      Accept Quote & Launch Fabrication
                    </button>
                    <button
                      onClick={() => respondToQuote(activeOrder.id, false)}
                      className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium border border-zinc-800 cursor-pointer"
                    >
                      Request Revisions
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-950/50 border border-emerald-800/60 rounded-xl flex items-center gap-2 text-xs text-emerald-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Quote Accepted! Project is currently under active production.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center space-y-3">
                <Clock className="w-8 h-8 text-amber-400 mx-auto" />
                <h3 className="text-sm font-bold text-zinc-200">Quotation In Progress</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Our master jewelers and engineers are reviewing your sketches and calculating material requirements. Expect your quote in &lt;12 hours.
                </p>
              </div>
            )}

            {/* Brief Reference & Details */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-3 text-xs">
              <h4 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px]">Submitted Design Brief</h4>
              <p className="text-zinc-300 leading-relaxed font-sans">{activeOrder.description}</p>
              
              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
                <div>
                  <span className="text-zinc-500 block">Colors:</span>
                  <span className="text-zinc-200">{activeOrder.preferredColors.join(', ')}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Style:</span>
                  <span className="text-zinc-200">{activeOrder.preferredStyle}</span>
                </div>
              </div>

              {activeOrder.uploadedFiles.length > 0 && (
                <div className="pt-2">
                  <span className="text-zinc-500 text-[11px] block mb-1.5">Attached Reference Sketches:</span>
                  <div className="flex gap-2">
                    {activeOrder.uploadedFiles.map((url, i) => (
                      <img key={i} src={url} alt="" className="w-20 h-20 rounded-xl object-cover border border-zinc-700 bg-zinc-900" />
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right 6 cols: Live Customer ↔ Admin Messaging */}
          <div className="lg:col-span-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col h-[520px]">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-4">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-zinc-100">Atelier Direct Chat</h3>
              <span className="text-xs text-zinc-500 ml-auto flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Artisan Online
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
                    <span className="text-[10px] text-zinc-500 mb-0.5">{msg.senderName}</span>
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                        isCustomer
                          ? 'bg-amber-400 text-zinc-950 font-medium rounded-tr-none'
                          : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-zinc-800 flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask about materials, engraving depth, or progress..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-600"
              />
              <button
                type="submit"
                className="p-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl transition-colors cursor-pointer"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
