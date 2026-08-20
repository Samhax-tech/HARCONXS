import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  RotateCcw, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  Download, 
  ExternalLink,
  ShieldCheck,
  FileText,
  MapPin,
  User,
  Plus
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { Order, ReturnRequest, RefundRecord, ShippingCarrierInfo, ShippingZoneConfig } from '../../../types';
import { enforceServerSidePermission } from '../../../services/adminAuthService';

interface OrdersAdminSectionProps {
  subSection: 'orders' | 'order-details' | 'returns' | 'refunds' | 'shipping';
  onNavigateSubSection: (sec: 'orders' | 'order-details' | 'returns' | 'refunds' | 'shipping') => void;
}

export const OrdersAdminSection: React.FC<OrdersAdminSectionProps> = ({
  subSection,
  onNavigateSubSection
}) => {
  const { orders, updateOrderStatus, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  // Return requests state
  const [returnsList, setReturnsList] = useState<ReturnRequest[]>([
    {
      id: 'rma-101',
      rmaNumber: 'RMA-2026-089',
      orderId: 'ord-8812',
      orderNumber: 'HX-90821',
      customerId: 'cust-01',
      customerName: 'Aarav Singhania',
      customerEmail: 'aarav.singhania@domain.com',
      items: [
        {
          productId: 'p1',
          productName: 'Eternal Bond Sovereign Ring Set',
          quantity: 1,
          price: 2499,
          reason: 'size_mismatch',
          condition: 'unopened'
        }
      ],
      requestedRefundAmount: 2499,
      status: 'approved',
      returnCarrier: 'BlueDart Express',
      returnTrackingAwb: 'BD-RET-992140',
      inspectionNotes: 'Client requesting ring size swap to 8. Package received in mint condition.',
      createdAt: '2026-02-18T10:30:00Z',
      updatedAt: '2026-02-19T14:20:00Z'
    },
    {
      id: 'rma-102',
      rmaNumber: 'RMA-2026-090',
      orderId: 'ord-8815',
      orderNumber: 'HX-90830',
      customerId: 'cust-04',
      customerName: 'Meera Kapoor',
      customerEmail: 'meera.k@gmail.com',
      items: [
        {
          productId: 'p3',
          productName: 'Royal Velvet Music Keepsake Box',
          quantity: 1,
          price: 1899,
          reason: 'damaged',
          condition: 'damaged'
        }
      ],
      requestedRefundAmount: 1899,
      status: 'inspected',
      returnCarrier: 'Delhivery Surface',
      returnTrackingAwb: 'DL-9938210',
      inspectionNotes: 'Hinge loosened during transit. Approved for 100% store refund or replacement.',
      createdAt: '2026-02-17T09:15:00Z',
      updatedAt: '2026-02-18T16:45:00Z'
    }
  ]);

  // Refund records state
  const [refundsList, setRefundsList] = useState<RefundRecord[]>([
    {
      id: 'ref-01',
      refundNumber: 'REF-2026-4401',
      orderId: 'ord-8815',
      orderNumber: 'HX-90830',
      customerId: 'cust-04',
      customerName: 'Meera Kapoor',
      amount: 1899,
      reason: 'Damaged music box transit claim',
      status: 'processed',
      gateway: 'Razorpay PG',
      gatewayTransactionId: 'rfnd_08249817592',
      initiatedBy: 'admin@harconxs.com',
      createdAt: '2026-02-18T17:00:00Z'
    },
    {
      id: 'ref-02',
      refundNumber: 'REF-2026-4402',
      orderId: 'ord-8799',
      orderNumber: 'HX-90799',
      customerId: 'cust-02',
      customerName: 'Devika Sharma',
      amount: 500,
      reason: 'Partial courtesy refund for courier delay',
      status: 'processed',
      gateway: 'Stripe',
      gatewayTransactionId: 're_3Mkj49817502',
      initiatedBy: 'financial_controller@harconxs.com',
      createdAt: '2026-02-16T12:00:00Z'
    }
  ]);

  // Shipping carriers & zones
  const [carriersList, setCarriersList] = useState<ShippingCarrierInfo[]>([
    {
      id: 'car-1',
      name: 'BlueDart Sovereign Air Express',
      code: 'bluedart',
      accountNumber: 'BD-HARCONXS-PRIORITY-01',
      apiKey: 'sk_live_bd_992817459182',
      isActive: true,
      trackingBaseUrl: 'https://bluedart.com/track/',
      supportsLiveTracking: true,
      ratePerKg: 140,
      deliveryDaysEstimate: '1 - 2 Business Days'
    },
    {
      id: 'car-2',
      name: 'FedEx Luxury Priority',
      code: 'fedex',
      accountNumber: 'FDX-99882104',
      apiKey: 'sk_live_fdx_48291048',
      isActive: true,
      trackingBaseUrl: 'https://fedex.com/tracking/',
      supportsLiveTracking: true,
      ratePerKg: 220,
      deliveryDaysEstimate: 'Next Morning Delivery'
    },
    {
      id: 'car-3',
      name: 'Delhivery Surface & Air',
      code: 'delhivery',
      accountNumber: 'DLV-48201',
      apiKey: 'sk_live_dlv_9921',
      isActive: true,
      trackingBaseUrl: 'https://delhivery.com/track/package/',
      supportsLiveTracking: true,
      ratePerKg: 95,
      deliveryDaysEstimate: '2 - 4 Business Days'
    }
  ]);

  const [shippingZones, setShippingZones] = useState<ShippingZoneConfig[]>([
    {
      id: 'zone-1',
      name: 'Tier 1 Metro Vault Express',
      regions: ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata'],
      baseRate: 0,
      freeShippingAbove: 999,
      estimatedDays: '1 - 2 Days',
      active: true
    },
    {
      id: 'zone-2',
      name: 'All-India Pan-State Premium',
      regions: ['Rest of India', 'Tier 2 & 3 Cities'],
      baseRate: 150,
      freeShippingAbove: 1999,
      estimatedDays: '3 - 5 Days',
      active: true
    },
    {
      id: 'zone-3',
      name: 'International Sovereign Air',
      regions: ['United States', 'United Kingdom', 'UAE', 'Singapore'],
      baseRate: 1800,
      freeShippingAbove: 15000,
      estimatedDays: '4 - 7 Days',
      active: true
    }
  ]);

  // Actions with server-side permission check
  const handleUpdateStatus = async (orderId: string, nextStatus: Order['status']) => {
    try {
      await enforceServerSidePermission('orders:edit', 'order', orderId);
      updateOrderStatus(orderId, nextStatus);
      showToast(`Order status updated to "${nextStatus.toUpperCase()}".`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Order modification requires manager role.');
    }
  };

  const handleProcessRefund = async (rma: ReturnRequest) => {
    try {
      await enforceServerSidePermission('refunds:manage', 'return_request', rma.id);
      const newRefund: RefundRecord = {
        id: `ref-${Date.now()}`,
        refundNumber: `REF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        orderId: rma.orderId,
        orderNumber: rma.orderNumber,
        customerId: rma.customerId,
        customerName: rma.customerName,
        amount: rma.requestedRefundAmount,
        reason: `RMA approval for ${rma.rmaNumber}`,
        status: 'processed',
        gateway: 'Razorpay PG',
        gatewayTransactionId: `rfnd_${Date.now()}`,
        initiatedBy: 'admin@harconxs.com',
        createdAt: new Date().toISOString()
      };
      setRefundsList(prev => [newRefund, ...prev]);
      setReturnsList(prev => prev.map(r => r.id === rma.id ? { ...r, status: 'refunded' } : r));
      showToast(`Refund of ₹${rma.requestedRefundAmount.toLocaleString()} processed via Razorpay.`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Only Financial Controller or Super Admin can issue refunds.');
    }
  };

  return (
    <div id="orders-admin-section" className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            id="tab-orders-list"
            onClick={() => onNavigateSubSection('orders')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'orders' || subSection === 'order-details' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            All Orders ({orders.length})
          </button>
          <button
            id="tab-orders-returns"
            onClick={() => onNavigateSubSection('returns')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'returns' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Returns (RMA) ({returnsList.length})
          </button>
          <button
            id="tab-orders-refunds"
            onClick={() => onNavigateSubSection('refunds')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'refunds' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Refunds ({refundsList.length})
          </button>
          <button
            id="tab-orders-shipping"
            onClick={() => onNavigateSubSection('shipping')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'shipping' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            Carriers & Shipping ({carriersList.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Server RBAC Protected
          </span>
        </div>
      </div>

      {/* 1. ORDERS LIST */}
      {subSection === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search orders by customer or order #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 min-h-[40px] rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 min-h-[40px] rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Fulfillment Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* MOBILE ORDERS CARDS (< md screens) */}
          <div className="md:hidden space-y-3">
            {orders
              .filter(o => !searchQuery || (o.customer?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || o.id.toLowerCase().includes(searchQuery.toLowerCase()))
              .filter(o => statusFilter === 'all' || o.status === statusFilter)
              .map(order => (
                <div key={order.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono font-bold text-amber-400 text-sm">{order.id}</div>
                      <div className="text-xs text-zinc-400">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        onNavigateSubSection('order-details');
                      }}
                      className="px-3 py-1.5 min-h-[36px] rounded-lg bg-zinc-800 text-amber-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Details
                    </button>
                  </div>

                  <div className="text-xs space-y-1 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Client:</span>
                      <span className="text-zinc-200 font-medium">{order.customer?.name || 'Private Client'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Total:</span>
                      <span className="font-mono font-bold text-zinc-100">₹{(order.totalAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Items:</span>
                      <span className="text-zinc-400">{order.items?.length || 1} line item(s)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-zinc-400 font-mono">Fulfillment:</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order['status'])}
                      className={`text-xs px-2.5 py-1.5 min-h-[38px] rounded-lg font-medium border bg-zinc-950 focus:outline-none ${
                        order.status === 'delivered' ? 'text-emerald-400 border-emerald-500/30' :
                        order.status === 'shipped' ? 'text-blue-400 border-blue-500/30' :
                        order.status === 'processing' ? 'text-amber-400 border-amber-500/30' :
                        order.status === 'cancelled' ? 'text-red-400 border-red-500/30' :
                        'text-zinc-300 border-zinc-700'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
          </div>

          {/* DESKTOP ORDERS TABLE (>= md screens) */}
          <div className="hidden md:block rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Fulfillment</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {orders
                  .filter(o => !searchQuery || (o.customer?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || o.id.toLowerCase().includes(searchQuery.toLowerCase()))
                  .filter(o => statusFilter === 'all' || o.status === statusFilter)
                  .map(order => (
                    <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-amber-400">{order.id}</div>
                        <div className="text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-zinc-100">{order.customer?.name || 'Private Client'}</div>
                        <div className="text-xs text-zinc-400">{order.customer?.email || 'client@domain.com'}</div>
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        {order.items?.length || 1} line item(s)
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-zinc-100">
                        ₹{(order.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          {order.paymentMethod || 'Prepaid Razorpay'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order['status'])}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium border bg-zinc-950 focus:outline-none ${
                            order.status === 'delivered' ? 'text-emerald-400 border-emerald-500/30' :
                            order.status === 'shipped' ? 'text-blue-400 border-blue-500/30' :
                            order.status === 'processing' ? 'text-amber-400 border-amber-500/30' :
                            order.status === 'cancelled' ? 'text-red-400 border-red-500/30' :
                            'text-zinc-300 border-zinc-700'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            onNavigateSubSection('order-details');
                          }}
                          className="p-2 min-w-[36px] min-h-[36px] rounded-lg text-amber-400 hover:bg-amber-400/10 transition-colors flex items-center justify-center cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. ORDER DETAILS SUBSECTION */}
      {subSection === 'order-details' && selectedOrder && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateSubSection('orders')}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700"
              >
                ← Back to Orders
              </button>
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100">
                  Order Details: <span className="text-amber-400 font-mono">{selectedOrder.id}</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()} • Verified Client
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                selectedOrder.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                selectedOrder.status === 'shipped' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {selectedOrder.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <h4 className="font-serif font-bold text-zinc-200 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  Line Items ({selectedOrder.items?.length || 0})
                </h4>
                <div className="divide-y divide-zinc-800">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-zinc-700" />
                        <div>
                          <div className="font-medium text-zinc-100 text-sm">{item.name}</div>
                          <div className="text-xs text-zinc-400 font-mono">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</div>
                          {item.customDetails && (
                            <div className="text-[11px] text-amber-400/90 font-mono mt-0.5">
                              Custom Engraving: {item.customDetails.engraving || 'N/A'}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-zinc-100">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-800 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{(selectedOrder.totalAmount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Sovereign Insured Shipping:</span>
                    <span className="font-mono text-emerald-400">Complimentary (₹0)</span>
                  </div>
                  <div className="flex justify-between text-zinc-100 font-bold text-base border-t border-zinc-800 pt-2">
                    <span>Grand Total:</span>
                    <span className="font-mono text-amber-400">₹{(selectedOrder.totalAmount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <h4 className="font-serif font-bold text-zinc-200 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  Client Information
                </h4>
                <div className="text-sm space-y-1">
                  <div className="font-medium text-zinc-100">{selectedOrder.customer?.name}</div>
                  <div className="text-zinc-400 text-xs">{selectedOrder.customer?.email}</div>
                  <div className="text-zinc-400 text-xs">{selectedOrder.customer?.phone}</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <h4 className="font-serif font-bold text-zinc-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  Delivery Destination
                </h4>
                <div className="text-xs text-zinc-300 space-y-1">
                  <div>{selectedOrder.shippingAddress?.street}</div>
                  <div>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}</div>
                  <div className="text-zinc-500">{selectedOrder.shippingAddress?.country || 'India'}</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <h4 className="font-serif font-bold text-zinc-200 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  Logistics Tracking
                </h4>
                <div className="text-xs space-y-2">
                  <div className="text-zinc-400">Carrier: <strong className="text-zinc-200">BlueDart Air Sovereign</strong></div>
                  <div className="text-zinc-400 font-mono">AWB: <strong className="text-amber-400">BD-884920194IN</strong></div>
                  <a
                    href="https://bluedart.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline"
                  >
                    Track in Carrier Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. RETURNS (RMA) SUBSECTION */}
      {subSection === 'returns' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Return Merchandise Authorizations (RMA) management, reverse logistics tracking, and inspection logs.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">RMA Ref</th>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Items & Reason</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">RMA Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {returnsList.map(rma => (
                  <tr key={rma.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-mono text-amber-400 font-bold">{rma.rmaNumber}</td>
                    <td className="py-3 px-4 font-mono text-zinc-300">{rma.orderNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-zinc-100">{rma.customerName}</div>
                      <div className="text-xs text-zinc-500">{rma.customerEmail}</div>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {rma.items.map((it, idx) => (
                        <div key={idx} className="text-zinc-300">
                          {it.productName} ({it.reason.replace('_', ' ')})
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-zinc-100">
                      ₹{rma.requestedRefundAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono uppercase ${
                        rma.status === 'refunded' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        rma.status === 'inspected' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {rma.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {rma.status !== 'refunded' && (
                        <button
                          onClick={() => handleProcessRefund(rma)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-colors"
                        >
                          Approve Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. REFUNDS SUBSECTION */}
      {subSection === 'refunds' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Direct payment gateway refund transactions ledger via Razorpay, Stripe, and manual bank wires.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Refund Ref</th>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Refund Amount</th>
                  <th className="py-3 px-4">Gateway Reference</th>
                  <th className="py-3 px-4">Initiated By</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {refundsList.map(ref => (
                  <tr key={ref.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">{ref.refundNumber}</td>
                    <td className="py-3 px-4 font-mono text-zinc-300">{ref.orderNumber}</td>
                    <td className="py-3 px-4 font-medium text-zinc-100">{ref.customerName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-red-400">-₹{ref.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-xs font-mono text-zinc-400">
                      <div>{ref.gateway}</div>
                      <div className="text-[10px] text-zinc-500">{ref.gatewayTransactionId}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-400">{ref.initiatedBy}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono uppercase">
                        {ref.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. CARRIERS & SHIPPING SUBSECTION */}
      {subSection === 'shipping' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h4 className="font-serif font-bold text-zinc-100 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-400" />
              Integrated Logistics Couriers
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {carriersList.map(car => (
                <div key={car.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-zinc-100 text-sm">{car.name}</div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-mono">
                      Connected
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 space-y-1 font-mono">
                    <div>Acc: {car.accountNumber}</div>
                    <div>Est: {car.deliveryDaysEstimate}</div>
                    <div>Rate: ₹{car.ratePerKg}/kg</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h4 className="font-serif font-bold text-zinc-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              Shipping Zones & Rates
            </h4>
            <div className="space-y-3">
              {shippingZones.map(zone => (
                <div key={zone.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-zinc-100 text-sm">{zone.name}</div>
                    <div className="text-xs text-zinc-400">{zone.regions.join(', ')}</div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-zinc-300">Base: ₹{zone.baseRate}</span>
                    <span className="text-emerald-400">Free &gt; ₹{zone.freeShippingAbove}</span>
                    <span className="text-amber-400">{zone.estimatedDays}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
