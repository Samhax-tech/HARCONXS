import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { CustomOrder } from '../../../types';
import {
  Sparkles,
  MessageSquare,
  Clock,
  CheckCircle2,
  ChevronRight,
  Plus,
  Truck,
  FileText,
  DollarSign,
  AlertCircle,
  Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CustomOrdersSectionProps {
  onSelectCustomOrder: (customOrderId: string) => void;
  onOpenNewCommissionModal?: () => void;
}

export const CustomOrdersSection: React.FC<CustomOrdersSectionProps> = ({
  onSelectCustomOrder,
  onOpenNewCommissionModal
}) => {
  const { currentUser, customOrders, formatPrice } = useStore();
  const navigate = useNavigate();

  if (!currentUser) return null;

  // Filter custom orders strictly for current user
  const userCustomOrders = customOrders.filter(co =>
    co.customerId === currentUser.id ||
    (co.customerEmail && co.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
  );

  const getStatusBadge = (status: CustomOrder['status']) => {
    switch (status) {
      case 'DELIVERED':
      case 'Delivered':
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case 'SHIPPED':
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Truck className="w-3 h-3" /> Dispatched
          </span>
        );
      case 'PRODUCTION':
      case 'Production':
      case 'DESIGNING':
      case 'In Design':
      case 'PACKING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <Sparkles className="w-3 h-3" /> In Production
          </span>
        );
      case 'QUOTED':
      case 'Quoted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <DollarSign className="w-3 h-3" /> Official Quote Ready
          </span>
        );
      case 'QUOTE_ACCEPTED':
      case 'PAID':
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Accepted & Paid
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
            <Clock className="w-3 h-3" /> {status.replace(/_/g, ' ')}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Submit Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Bespoke Custom Orders ({userCustomOrders.length})
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Collaborate directly with Master Artisans on unique handcrafted commissions.
          </p>
        </div>

        <button
          id="new-custom-order-btn"
          onClick={() => {
            if (onOpenNewCommissionModal) {
              onOpenNewCommissionModal();
            } else {
              navigate('/custom-orders');
            }
          }}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Submit New Bespoke Brief
        </button>
      </div>

      {/* Custom Orders List */}
      {userCustomOrders.length > 0 ? (
        <div className="space-y-4">
          {userCustomOrders.map(co => {
            const hasUnread = (co.unreadCountCustomer || 0) > 0;
            return (
              <div
                key={co.id}
                id={`custom-order-card-${co.requestNumber}`}
                className="rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition overflow-hidden p-5 sm:p-6"
              >
                {/* Meta Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-zinc-100">{co.requestNumber}</span>
                      {getStatusBadge(co.status)}
                      {hasUnread && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                          {co.unreadCountCustomer} New Message{co.unreadCountCustomer! > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-500 mt-0.5 block">
                      Submitted on {new Date(co.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {co.quote && (
                      <div className="text-right">
                        <span className="text-[11px] text-zinc-500 block">Atelier Quote</span>
                        <span className="font-mono text-sm font-bold text-amber-300">
                          {formatPrice(co.quote.amount)}
                        </span>
                      </div>
                    )}
                    <button
                      id={`open-custom-order-btn-${co.requestNumber}`}
                      onClick={() => onSelectCustomOrder(co.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      View & Chat
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Brief Details */}
                <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-500 block mb-0.5">Product Type & Occasion</span>
                    <p className="font-medium text-zinc-200">{co.productType} • {co.occasion}</p>
                  </div>

                  <div>
                    <span className="text-zinc-500 block mb-0.5">Recipient & Relationship</span>
                    <p className="font-medium text-zinc-200">{co.recipient} ({co.relationship})</p>
                  </div>

                  <div>
                    <span className="text-zinc-500 block mb-0.5">Budget Range</span>
                    <p className="font-medium text-zinc-200">{co.budgetRange}</p>
                  </div>
                </div>

                {/* Description Excerpt */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <p className="line-clamp-1 italic text-zinc-300">"{co.description}"</p>
                  <span className="text-zinc-500 text-[11px] whitespace-nowrap ml-4">
                    {co.messages.length} messages in atelier thread
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
          <h3 className="text-sm font-semibold text-zinc-200">No bespoke orders placed yet</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto mb-4">
            Create an exclusive personalized piece tailored to your vision with our master artisans.
          </p>
          <button
            onClick={() => {
              if (onOpenNewCommissionModal) onOpenNewCommissionModal();
              else navigate('/custom-orders');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Start First Custom Commission
          </button>
        </div>
      )}
    </div>
  );
};
