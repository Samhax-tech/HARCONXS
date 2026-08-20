import React from 'react';
import { useStore } from '../../../context/StoreContext';
import { Order } from '../../../types';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  MapPin,
  CreditCard,
  Download,
  RotateCw,
  Star,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface OrderDetailViewProps {
  orderId: string;
  onBack: () => void;
  onTrack: (orderId: string) => void;
  onOpenInvoice?: (order: Order) => void;
  onReviewProduct?: (productId: string, orderId: string) => void;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  orderId,
  onBack,
  onTrack,
  onOpenInvoice,
  onReviewProduct
}) => {
  const { orders, formatPrice, addToCart, showToast } = useStore();
  const order = orders.find(o => o.id === orderId || o.orderNumber === orderId);

  if (!order) {
    return (
      <div className="p-8 text-center bg-zinc-900/60 rounded-2xl border border-zinc-800">
        <AlertCircle className="w-10 h-10 mx-auto mb-2 text-zinc-500" />
        <p className="text-zinc-300 text-sm font-semibold">Order not found</p>
        <button
          onClick={onBack}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </button>
      </div>
    );
  }

  const handleReorder = () => {
    order.items.forEach(item => {
      if (item.product) {
        addToCart(item.product, item.quantity, item.variant, item.packaging, item.personalization);
      }
    });
    showToast(`Added items from ${order.orderNumber} to your bag.`);
  };

  // Milestone Progress Calculation
  const stages = [
    { label: 'Confirmed', status: 'Paid', done: true },
    { label: 'Crafting', status: 'Processing', done: order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' },
    { label: 'Dispatched', status: 'Shipped', done: order.status === 'Shipped' || order.status === 'Delivered' },
    { label: 'Delivered', status: 'Delivered', done: order.status === 'Delivered' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Return Navigation */}
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
              <h2 className="text-xl font-serif font-bold text-zinc-100">{order.orderNumber}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onTrack(order.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition shadow-sm"
          >
            <Truck className="w-3.5 h-3.5" />
            Live Tracking
          </button>

          {onOpenInvoice && (
            <button
              onClick={() => onOpenInvoice(order)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              Tax Invoice
            </button>
          )}

          <button
            onClick={handleReorder}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-700 transition"
            title="Reorder items"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Milestone Bar */}
      <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-5">Fulfillment Pipeline</h3>
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-zinc-800 w-full z-0" />
          {stages.map((stg, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  stg.done
                    ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                }`}
              >
                {stg.done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[11px] mt-2 font-medium ${stg.done ? 'text-zinc-200' : 'text-zinc-500'}`}>
                {stg.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Itemized Products List */}
      <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden">
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/90 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-200">Purchased Items ({order.items.length})</h3>
          <span className="text-xs text-zinc-500">All prices in INR (₹)</span>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {order.items.map((item, idx) => (
            <div key={idx} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-zinc-800 overflow-hidden border border-zinc-700/60 flex-shrink-0">
                  <img
                    src={item.product?.images?.[0] || '/images/default.jpg'}
                    alt={item.product?.name || 'Item'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-100">{item.product?.name || 'Atelier Item'}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mt-1">
                    <span>Qty: <strong className="text-zinc-200">{item.quantity}</strong></span>
                    <span>•</span>
                    <span className="font-mono text-zinc-300">{formatPrice(item.customPrice || item.product?.price || 0)} each</span>
                    {item.variant && (
                      <>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] border border-zinc-700">
                          {item.variant.name || item.variant.size}
                        </span>
                      </>
                    )}
                  </div>
                  {item.personalization && (
                    <div className="mt-2 text-[11px] text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 inline-block">
                      Engraving / Customization: "{item.personalization.names || item.personalization.message || 'Bespoke Inscription'}"
                    </div>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                <span className="font-mono text-sm font-bold text-amber-300">
                  {formatPrice((item.customPrice || item.product?.price || 0) * item.quantity)}
                </span>
                {order.status === 'Delivered' && onReviewProduct && (
                  <button
                    onClick={() => onReviewProduct(item.product?.id || item.id, order.id)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <Star className="w-3 h-3" />
                    Write Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Order Summary Breakdown & Delivery Logistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Breakdown */}
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            Financial Breakdown
          </h3>
          <div className="space-y-2 text-xs text-zinc-400 pt-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono text-zinc-200">{formatPrice(order.subtotal)}</span>
            </div>
            {order.packagingFee ? (
              <div className="flex justify-between">
                <span>Luxury Packaging:</span>
                <span className="font-mono text-zinc-200">{formatPrice(order.packagingFee)}</span>
              </div>
            ) : null}
            {order.discount ? (
              <div className="flex justify-between text-emerald-400">
                <span>Promotional Discount:</span>
                <span className="font-mono">-{formatPrice(order.discount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span>Insured Shipping:</span>
              <span className="font-mono text-zinc-200">
                {order.shippingFee === 0 ? 'FREE (Luxury Patron)' : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST / Taxes:</span>
              <span className="font-mono text-zinc-200">{formatPrice(order.tax)}</span>
            </div>
            <div className="border-t border-zinc-800 pt-3 flex justify-between text-sm font-bold text-zinc-100">
              <span>Grand Total:</span>
              <span className="font-mono text-amber-300 text-base">{formatPrice(order.total)}</span>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-zinc-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Verified Razorpay / Supabase PG Transaction
          </div>
        </div>

        {/* Shipping & Delivery Address */}
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            Delivery Destination
          </h3>
          <div className="text-xs text-zinc-300 space-y-1 pt-1">
            <p className="font-semibold text-zinc-100">{order.shippingAddress?.fullName || order.customerName}</p>
            <p className="text-zinc-400">{order.shippingAddress?.street}</p>
            <p className="text-zinc-400">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
            </p>
            <p className="text-zinc-500">{order.shippingAddress?.country} • {order.shippingAddress?.phone || order.customerPhone || 'N/A'}</p>
          </div>

          {order.trackingNumber && (
            <div className="mt-4 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/90 text-xs">
              <span className="text-zinc-400 block">Carrier Tracking:</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono text-amber-300 font-semibold">{order.trackingNumber}</span>
                <button
                  onClick={() => onTrack(order.id)}
                  className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                >
                  Track <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
