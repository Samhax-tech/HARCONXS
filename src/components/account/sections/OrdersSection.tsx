import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { Order } from '../../../types';
import {
  Package,
  Search,
  Truck,
  FileText,
  RotateCw,
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  Star
} from 'lucide-react';

interface OrdersSectionProps {
  onSelectOrder: (orderId: string) => void;
  onTrackOrder: (orderId: string) => void;
  onOpenInvoice?: (order: Order) => void;
  onReviewProduct?: (productId: string, orderId: string) => void;
}

export const OrdersSection: React.FC<OrdersSectionProps> = ({
  onSelectOrder,
  onTrackOrder,
  onOpenInvoice,
  onReviewProduct
}) => {
  const { currentUser, orders, formatPrice, addToCart, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'>('ALL');

  if (!currentUser) return null;

  // Filter orders strictly for current user
  const userOrders = orders.filter(ord =>
    ord.customerId === currentUser.id ||
    (ord.customerEmail && ord.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
  );

  const filteredOrders = userOrders.filter(ord => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.items.some(it => it.title?.toLowerCase().includes(searchTerm.toLowerCase()) || it.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ord.trackingNumber && ord.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PROCESSING') return ord.status === 'Processing' || ord.status === 'Paid';
    if (statusFilter === 'SHIPPED') return ord.status === 'Shipped';
    if (statusFilter === 'DELIVERED') return ord.status === 'Delivered';
    if (statusFilter === 'CANCELLED') return ord.status === 'Cancelled' || ord.status === 'Refunded';
    return true;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Truck className="w-3.5 h-3.5" />
            In Transit
          </span>
        );
      case 'Processing':
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Crafting & Processing
          </span>
        );
      case 'Cancelled':
      case 'Refunded':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
            {status}
          </span>
        );
    }
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      if (item.product) {
        addToCart(item.product, item.quantity, item.variant, item.packaging, item.personalization);
      }
    });
    showToast(`Added ${order.items.length} items from ${order.orderNumber} to your bag!`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-zinc-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            Order History & Logistics
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Track atelier fabrication, live carrier logistics, and view official tax invoices.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            id="search-orders-input"
            type="text"
            placeholder="Search by #order, item..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {(['ALL', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition border ${
              statusFilter === tab
                ? 'bg-amber-500 text-zinc-950 border-amber-400 font-semibold shadow-sm'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              id={`order-card-${order.orderNumber}`}
              className="rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition overflow-hidden p-5 sm:p-6"
            >
              {/* Order Meta Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-zinc-100">{order.orderNumber}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <span className="text-xs text-zinc-500 mt-0.5 block">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="text-xs text-zinc-500 block">Total Amount</span>
                    <span className="font-mono text-base font-bold text-amber-300">{formatPrice(order.total)}</span>
                  </div>
                  <button
                    id={`view-order-detail-btn-${order.orderNumber}`}
                    onClick={() => onSelectOrder(order.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition"
                  >
                    Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Items Preview */}
              <div className="py-4 space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 overflow-hidden border border-zinc-700/60 flex-shrink-0">
                        <img
                          src={item.product?.images?.[0] || '/images/default.jpg'}
                          alt={item.product?.name || 'Item'}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-zinc-200 line-clamp-1">{item.product?.name || 'Atelier Item'}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span className="font-mono">{formatPrice(item.customPrice || item.product?.price || 0)}</span>
                          {item.variant && (
                            <>
                              <span>•</span>
                              <span className="text-zinc-500">{item.variant.name || item.variant.size}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {order.status === 'Delivered' && onReviewProduct && (
                      <button
                        onClick={() => onReviewProduct(item.product?.id || item.id, order.id)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 whitespace-nowrap"
                      >
                        <Star className="w-3 h-3" />
                        Write Review
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Order Logistics Footer & Quick Actions */}
              <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Truck className="w-4 h-4 text-amber-400" />
                  {order.trackingNumber ? (
                    <span>
                      Carrier: <strong className="text-zinc-200 font-medium">{order.carrier || 'Express Logistics'}</strong> (AWB: <span className="font-mono text-zinc-300">{order.trackingNumber}</span>)
                    </span>
                  ) : (
                    <span>Order is preparing in HARCONXS Atelier</span>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    id={`track-order-btn-${order.orderNumber}`}
                    onClick={() => onTrackOrder(order.id)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    Track Shipment
                  </button>

                  {onOpenInvoice && (
                    <button
                      id={`invoice-order-btn-${order.orderNumber}`}
                      onClick={() => onOpenInvoice(order)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Invoice
                    </button>
                  )}

                  <button
                    id={`reorder-btn-${order.orderNumber}`}
                    onClick={() => handleReorder(order)}
                    className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
                    title="Reorder all items"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
          <h3 className="text-sm font-semibold text-zinc-200">No orders found</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'ALL'
              ? 'No orders matched your active filters or search terms.'
              : 'You have not placed any orders yet. Discover our latest bespoke collections.'}
          </p>
        </div>
      )}
    </div>
  );
};
