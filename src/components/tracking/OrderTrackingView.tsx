import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  ExternalLink,
  Copy,
  Sparkles,
  ShieldCheck,
  Send,
  AlertCircle,
  FileText,
  RefreshCw,
  Mail,
  Box,
  ChevronRight,
  Printer
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface OrderTrackingViewProps {
  initialOrderId?: string;
  onClose?: () => void;
  standalone?: boolean;
}

const MILESTONES: { status: OrderStatus; label: string; description: string }[] = [
  { status: 'Paid', label: 'Payment Authorized', description: 'Order verified & payment cleared securely' },
  { status: 'Processing', label: 'Artisan Workshop', description: 'Assigned to master jeweler & laser engraving queue' },
  { status: 'Production', label: 'Laser Engraving & QA', description: 'Precision diamond-tip laser engraving & quality inspection' },
  { status: 'Packed', label: 'Luxury Gift Packaging', description: 'Sealed in velvet box with certificate of authenticity' },
  { status: 'Shipped', label: 'Dispatched via Courier', description: 'Handed over to express courier with air waybill' },
  { status: 'Out for Delivery', label: 'Out for Delivery', description: 'Assigned to local courier for doorstep delivery' },
  { status: 'Delivered', label: 'Delivered to Customer', description: 'Package signed and safely received' }
];

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  initialOrderId,
  standalone = false
}) => {
  const {
    orders,
    formatPrice,
    updateOrderStatus,
    showToast,
    currentUser,
    setCurrentView,
    addEmailNotification
  } = useStore();

  const [searchQuery, setSearchQuery] = useState(initialOrderId || '');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    initialOrderId || orders[0]?.id || ''
  );
  const [hasCopiedAwb, setHasCopiedAwb] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Find order by ID or orderNumber or trackingNumber
  const matchedOrder = useMemo(() => {
    if (!selectedOrderId && !searchQuery) return orders[0] || null;

    const query = searchQuery.trim().toUpperCase();
    if (!query) {
      return orders.find(o => o.id === selectedOrderId) || orders[0] || null;
    }

    return (
      orders.find(o => o.orderNumber.toUpperCase() === query) ||
      orders.find(o => o.id.toUpperCase() === query) ||
      orders.find(o => o.trackingNumber?.toUpperCase() === query) ||
      orders.find(o => o.id === selectedOrderId) ||
      null
    );
  }, [orders, selectedOrderId, searchQuery]);

  const handleSelectOrder = (ord: Order) => {
    setSelectedOrderId(ord.id);
    setSearchQuery(ord.orderNumber);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (matchedOrder) {
      setSelectedOrderId(matchedOrder.id);
      showToast(`Tracking details loaded for ${matchedOrder.orderNumber}`);
    } else {
      showToast(`No order found matching "${searchQuery}". Try selecting an active order.`);
    }
  };

  const handleCopyTracking = (awb?: string) => {
    if (!awb) return;
    navigator.clipboard.writeText(awb);
    setHasCopiedAwb(true);
    showToast(`Tracking number ${awb} copied to clipboard!`);
    setTimeout(() => setHasCopiedAwb(false), 3000);
  };

  const handleSimulateNextStep = () => {
    if (!matchedOrder) return;
    setIsSimulating(true);

    const statusOrder: OrderStatus[] = [
      'Paid',
      'Processing',
      'Production',
      'Packed',
      'Shipped',
      'Out for Delivery',
      'Delivered'
    ];

    const currentIndex = statusOrder.indexOf(matchedOrder.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const nextStatus = statusOrder[nextIndex];

    setTimeout(() => {
      const carrier = matchedOrder.carrier || 'BlueDart Express';
      const trackingNo = matchedOrder.trackingNumber || `BD-${Math.floor(10000000 + Math.random() * 90000000)}`;
      updateOrderStatus(matchedOrder.id, nextStatus, carrier, trackingNo);
      setIsSimulating(false);
      showToast(`Logistics milestone advanced to: ${nextStatus}`);
    }, 400);
  };

  const handleResendEmail = () => {
    if (!matchedOrder) return;
    showToast(`✉️ Live tracking update email dispatched to ${matchedOrder.customerEmail}`);
  };

  const getMilestoneIndex = (status: OrderStatus) => {
    const map: Record<string, number> = {
      'Payment Pending': 0,
      'Paid': 0,
      'Processing': 1,
      'Customization Required': 1,
      'Production': 2,
      'Packed': 3,
      'Shipped': 4,
      'Out for Delivery': 5,
      'Delivered': 6
    };
    return map[status] ?? 1;
  };

  const currentStep = matchedOrder ? getMilestoneIndex(matchedOrder.status) : 0;

  return (
    <div className={`space-y-6 ${standalone ? 'max-w-6xl mx-auto py-8 px-4 sm:px-6' : ''}`}>
      {/* Top Search & Filter Bar */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 flex items-center gap-2.5">
              <Truck className="w-6 h-6 text-amber-400" />
              <span>Real-Time Order & Logistics Tracking</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Enter your HARCONXS Order ID (e.g. HX-94821) or Courier Air Waybill to track live status updates.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. HX-84912)"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-700/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 whitespace-nowrap cursor-pointer transition-all"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Quick Order Selector Pills */}
        {orders.length > 0 && (
          <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
            <span className="text-[11px] text-zinc-500 font-semibold whitespace-nowrap">Your Orders:</span>
            {orders.slice(0, 5).map((ord) => (
              <button
                key={ord.id}
                onClick={() => handleSelectOrder(ord)}
                className={`px-3 py-1 rounded-lg border font-mono text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  matchedOrder?.id === ord.id
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {ord.orderNumber} • <span className="text-zinc-500">{ord.status}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* No Order Selected State */}
      {!matchedOrder ? (
        <div className="p-12 text-center bg-zinc-900/40 rounded-3xl border border-zinc-800 space-y-4">
          <Package className="w-12 h-12 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-200">No matching order found</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Please double check the order number or place your first order from our handcrafted catalog.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('catalog')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        /* Order Tracking Details Panel */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main 2-Column: Live Tracking & Stepper */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status Hero Card */}
            <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl font-bold text-white tracking-wider">
                      {matchedOrder.orderNumber}
                    </span>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Placed on {new Date(matchedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • Customer: <strong className="text-zinc-200">{matchedOrder.customerName}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full font-mono text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700/80 uppercase tracking-wider">
                    ● {matchedOrder.status}
                  </span>
                </div>
              </div>

              {/* Courier & AWB Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Logistics Partner</span>
                  <span className="font-bold text-zinc-200 flex items-center gap-1.5 mt-0.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    {matchedOrder.carrier || 'BlueDart Express'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Air Waybill (AWB)</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono font-bold text-amber-400">
                      {matchedOrder.trackingNumber || 'BD-84910294'}
                    </span>
                    <button
                      onClick={() => handleCopyTracking(matchedOrder.trackingNumber || 'BD-84910294')}
                      className="text-zinc-500 hover:text-zinc-300 cursor-pointer p-0.5"
                      title="Copy AWB"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Estimated Arrival</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    {matchedOrder.status === 'Delivered' ? 'Delivered' : 'Within 2-3 Business Days'}
                  </span>
                </div>
              </div>

              {/* Interactive Stepper Progress Bar */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-zinc-300">Live Journey Milestone</span>
                  <span className="font-mono text-[11px] text-amber-400 font-bold">
                    Step {currentStep + 1} of {MILESTONES.length}
                  </span>
                </div>

                {/* Horizontal / Stepper Visualizer */}
                <div className="relative">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-zinc-800">
                    <div
                      style={{ width: `${((currentStep + 1) / MILESTONES.length) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                    ></div>
                  </div>
                </div>

                {/* Milestone Checklist */}
                <div className="space-y-3 pt-2">
                  {MILESTONES.map((m, index) => {
                    const isPassed = index <= currentStep;
                    const isCurrent = index === currentStep;

                    return (
                      <div
                        key={m.status}
                        className={`flex items-start gap-3.5 p-3 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-amber-950/20 border-amber-500/50 shadow-lg'
                            : isPassed
                            ? 'bg-zinc-900/40 border-zinc-800'
                            : 'bg-zinc-950/30 border-zinc-800/40 opacity-40'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isCurrent
                              ? 'bg-amber-400 text-zinc-950 font-bold animate-pulse'
                              : isPassed
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-zinc-800 text-zinc-600'
                          }`}
                        >
                          {isPassed && !isCurrent ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-bold font-mono">{index + 1}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4
                              className={`text-xs font-bold ${
                                isCurrent ? 'text-amber-300' : isPassed ? 'text-zinc-100' : 'text-zinc-400'
                              }`}
                            >
                              {m.label}
                            </h4>
                            {isCurrent && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-2 py-0.5 rounded-md border border-amber-800">
                                In Progress
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{m.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Simulation & Actions Bar */}
              <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimulateNextStep}
                    disabled={isSimulating}
                    className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-700 flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Advance to next courier milestone in demo mode"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSimulating ? 'animate-spin' : ''}`} />
                    <span>Advance Milestone</span>
                  </button>

                  <button
                    onClick={handleResendEmail}
                    className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-700 flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Resend email tracking dispatch"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Resend Email Receipt</span>
                  </button>
                </div>

                <div className="text-[11px] text-zinc-500 font-mono">
                  Origin: HARCONXS Atelier, Bangalore
                </div>
              </div>
            </div>

            {/* Live Transit Log / Timeline Events */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-serif font-bold text-sm text-zinc-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Logistics Checkpoint History</span>
              </h3>

              <div className="space-y-3">
                {matchedOrder.timeline.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs">
                    <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-zinc-200">{event.status}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{event.description}</p>
                      {event.location && (
                        <span className="text-[10px] text-amber-400/80 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Package Details & Destination */}
          <div className="space-y-6">
            
            {/* Package Contents */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-serif font-bold text-sm text-zinc-100 flex items-center gap-2">
                <Box className="w-4 h-4 text-amber-400" />
                <span>Package Contents ({matchedOrder.items.length} items)</span>
              </h3>

              <div className="space-y-3">
                {matchedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs text-zinc-100 truncate">{item.product.name}</h4>
                        <p className="text-[11px] text-zinc-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-400 shrink-0">
                        {formatPrice((item.customPrice ?? item.variant?.price ?? item.product.price) * item.quantity)}
                      </span>
                    </div>

                    {/* Laser Engraving Preview if personalized */}
                    {item.personalization?.names && (
                      <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/40 text-[11px] space-y-1">
                        <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                          <Sparkles className="w-3 h-3" />
                          <span>Custom Engraving Applied:</span>
                        </div>
                        <p className="font-serif italic text-rose-200">"{item.personalization.names}"</p>
                        {item.personalization.date && (
                          <p className="text-rose-400/80 text-[10px]">Date: {item.personalization.date}</p>
                        )}
                      </div>
                    )}

                    {/* Packaging Box */}
                    {item.packaging && (
                      <div className="text-[10px] text-amber-400 flex items-center gap-1">
                        <span>Box: {item.packaging.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-zinc-800 space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(matchedOrder.subtotal)}</span>
                </div>
                {matchedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatPrice(matchedOrder.discount)}</span>
                  </div>
                )}
                {matchedOrder.packagingFee > 0 && (
                  <div className="flex justify-between">
                    <span>Packaging</span>
                    <span>+{formatPrice(matchedOrder.packagingFee)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Logistics</span>
                  <span>{matchedOrder.shippingFee === 0 ? 'FREE' : formatPrice(matchedOrder.shippingFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-white text-sm pt-2 border-t border-zinc-800">
                  <span>Total Paid</span>
                  <span className="font-mono text-amber-400">{formatPrice(matchedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Destination Address */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-3">
              <h3 className="font-serif font-bold text-sm text-zinc-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Delivery Destination</span>
              </h3>
              
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs space-y-1 text-zinc-300">
                <p className="font-bold text-white">{matchedOrder.shippingAddress.fullName}</p>
                <p>{matchedOrder.shippingAddress.street}</p>
                <p>{matchedOrder.shippingAddress.city}, {matchedOrder.shippingAddress.state} - {matchedOrder.shippingAddress.zip}</p>
                <p className="text-[11px] text-zinc-500">{matchedOrder.shippingAddress.country}</p>
                {matchedOrder.customerPhone && (
                  <p className="text-[11px] text-amber-400 pt-1">Phone: {matchedOrder.customerPhone}</p>
                )}
              </div>
            </div>

            {/* Need Help CTA */}
            <div className="p-5 rounded-3xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Harconxs Logistics Guarantee</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                All packages are insured against loss or transit damage. Contact our 24/7 atelier support for priority delivery rescheduling.
              </p>
              <button
                onClick={() => setCurrentView('contact-us')}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer transition-all"
              >
                Contact Dispatch Support
              </button>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
