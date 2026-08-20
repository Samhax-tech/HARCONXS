import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Star, 
  MessageSquare, 
  MapPin, 
  Crown, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Clock,
  Send,
  UserCheck
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { CustomerRecord, CustomerAddressItem, Review } from '../../../types';
import { enforceServerSidePermission } from '../../../services/adminAuthService';

interface CustomersAdminSectionProps {
  subSection: 'customers' | 'customer-details' | 'addresses' | 'reviews' | 'support';
  onNavigateSubSection: (sec: 'customers' | 'customer-details' | 'addresses' | 'reviews' | 'support') => void;
}

export const CustomersAdminSection: React.FC<CustomersAdminSectionProps> = ({
  subSection,
  onNavigateSubSection
}) => {
  const { reviews, approveReview, rejectReview, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');

  // Customers data
  const [customersList, setCustomersList] = useState<CustomerRecord[]>([
    {
      id: 'cust-01',
      name: 'Aarav Singhania',
      email: 'aarav.singhania@domain.com',
      phone: '+91 98201 88412',
      tier: 'royal_sovereign',
      totalOrders: 6,
      totalSpent: 48500,
      avgOrderValue: 8083,
      lastOrderDate: '2026-02-18',
      status: 'active',
      tags: ['Bespoke Patron', 'Gold Collector', 'High LTV'],
      notes: 'Commissioned couple wedding website + bespoke 18K sovereign rings.',
      rewardPoints: 4850,
      customOrdersCount: 2,
      createdAt: '2025-11-10T00:00:00Z'
    },
    {
      id: 'cust-02',
      name: 'Devika Sharma',
      email: 'devika.s@lifestyle.in',
      phone: '+91 97110 39201',
      tier: 'vip',
      totalOrders: 3,
      totalSpent: 12400,
      avgOrderValue: 4133,
      lastOrderDate: '2026-02-14',
      status: 'active',
      tags: ['Valentine Buyer', 'Keepsake Lover'],
      notes: 'Ordered velvet music box and silver magnetic pendants.',
      rewardPoints: 1240,
      customOrdersCount: 1,
      createdAt: '2026-01-05T00:00:00Z'
    },
    {
      id: 'cust-03',
      name: 'Karan Malhotra',
      email: 'karan.m@techcorp.io',
      phone: '+91 99304 10294',
      tier: 'vip',
      totalOrders: 2,
      totalSpent: 8999,
      avgOrderValue: 4499,
      lastOrderDate: '2026-02-01',
      status: 'active',
      tags: ['Bot Panel Admin'],
      notes: 'Subscribed to Enterprise Telegram E-commerce Bot.',
      rewardPoints: 900,
      customOrdersCount: 0,
      createdAt: '2026-01-18T00:00:00Z'
    },
    {
      id: 'cust-04',
      name: 'Meera Kapoor',
      email: 'meera.k@gmail.com',
      phone: '+91 98402 77192',
      tier: 'standard',
      totalOrders: 1,
      totalSpent: 1899,
      avgOrderValue: 1899,
      lastOrderDate: '2026-02-17',
      status: 'active',
      tags: ['First Time Buyer'],
      notes: 'RMA request processed for transit damage.',
      rewardPoints: 190,
      customOrdersCount: 0,
      createdAt: '2026-02-15T00:00:00Z'
    }
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(customersList[0] || null);

  // Address book
  const [addressBook] = useState<CustomerAddressItem[]>([
    {
      id: 'addr-01',
      customerId: 'cust-01',
      customerName: 'Aarav Singhania',
      addressType: 'shipping',
      isDefault: true,
      street: 'Penthouse 4B, Sovereign Towers, Worli Sea Face',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400030',
      country: 'India',
      phone: '+91 98201 88412'
    },
    {
      id: 'addr-02',
      customerId: 'cust-02',
      customerName: 'Devika Sharma',
      addressType: 'shipping',
      isDefault: true,
      street: 'Villa 12, Palm Meadows, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560066',
      country: 'India',
      phone: '+91 97110 39201'
    },
    {
      id: 'addr-03',
      customerId: 'cust-03',
      customerName: 'Karan Malhotra',
      addressType: 'shipping',
      isDefault: true,
      street: '72 Cyber City Phase 2, DLF',
      city: 'Gurugram',
      state: 'Haryana',
      postalCode: '122002',
      country: 'India',
      phone: '+91 99304 10294'
    }
  ]);

  // Support Tickets
  const [supportTickets, setSupportTickets] = useState([
    {
      id: 'tkt-401',
      ticketNumber: 'TKT-2026-881',
      customerId: 'cust-01',
      customerName: 'Aarav Singhania',
      subject: 'Inquiry on CAD ring engraving font preview',
      priority: 'high',
      status: 'in_progress',
      department: 'Custom Atelier',
      messages: [
        { sender: 'Aarav Singhania', text: 'Hello Atelier team, can we preview the Roman numeral font before final laser casting?', time: '10:14 AM' },
        { sender: 'Support Concierge', text: 'Certainly Aarav, our lead artisan is preparing the 3D high-res render.', time: '10:30 AM' }
      ],
      createdAt: '2026-02-19T10:14:00Z'
    },
    {
      id: 'tkt-402',
      ticketNumber: 'TKT-2026-882',
      customerId: 'cust-03',
      customerName: 'Karan Malhotra',
      subject: 'Webhook endpoint integration for Telegram Bot',
      priority: 'medium',
      status: 'resolved',
      department: 'Technical & APIs',
      messages: [
        { sender: 'Karan Malhotra', text: 'Webhook verified and working flawlessly on AWS lambda.', time: 'Yesterday' }
      ],
      createdAt: '2026-02-18T14:22:00Z'
    }
  ]);

  const [activeTicket, setActiveTicket] = useState(supportTickets[0] || null);
  const [ticketReply, setTicketReply] = useState('');

  // Server-side permission enforced actions
  const handleModerateReview = async (id: string, action: 'approve' | 'reject') => {
    try {
      await enforceServerSidePermission('reviews:moderate', 'review', id);
      if (action === 'approve') {
        approveReview(id);
        showToast('Review approved and published to store.');
      } else {
        rejectReview(id);
        showToast('Review flagged as rejected.');
      }
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Review moderation requires manager role.');
    }
  };

  const handleSendTicketReply = async () => {
    if (!ticketReply.trim() || !activeTicket) return;
    try {
      await enforceServerSidePermission('support:manage', 'support_ticket', activeTicket.id);
      const newMsg = {
        sender: 'Harconxs Concierge (You)',
        text: ticketReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setSupportTickets(prev => prev.map(t => t.id === activeTicket.id ? { ...t, messages: [...t.messages, newMsg] } : t));
      setActiveTicket(prev => prev ? { ...prev, messages: [...prev.messages, newMsg] } : null);
      setTicketReply('');
      showToast('Support reply dispatched to client.');
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Support ticket actions require concierge role.');
    }
  };

  return (
    <div id="customers-admin-section" className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            id="tab-customers-directory"
            onClick={() => onNavigateSubSection('customers')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'customers' || subSection === 'customer-details' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Customers Directory ({customersList.length})
          </button>
          <button
            id="tab-customers-addresses"
            onClick={() => onNavigateSubSection('addresses')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'addresses' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Address Book ({addressBook.length})
          </button>
          <button
            id="tab-customers-reviews"
            onClick={() => onNavigateSubSection('reviews')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'reviews' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Star className="w-4 h-4" />
            Reviews Moderation ({reviews.length})
          </button>
          <button
            id="tab-customers-support"
            onClick={() => onNavigateSubSection('support')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'support' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Support Helpdesk ({supportTickets.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Server RBAC Protected
          </span>
        </div>
      </div>

      {/* 1. CUSTOMERS DIRECTORY */}
      {subSection === 'customers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search customers by name, phone or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Tiers</option>
                <option value="royal_sovereign">Royal Sovereign</option>
                <option value="vip">VIP Tier</option>
                <option value="standard">Standard Tier</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Orders</th>
                  <th className="py-3 px-4">Lifetime Value (LTV)</th>
                  <th className="py-3 px-4">Reward Points</th>
                  <th className="py-3 px-4">Tags</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {customersList
                  .filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()))
                  .filter(c => tierFilter === 'all' || c.tier === tierFilter)
                  .map(cust => (
                    <tr key={cust.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-zinc-100">{cust.name}</div>
                        <div className="text-xs text-zinc-500">{cust.email} • {cust.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase flex items-center gap-1 w-fit ${
                          cust.tier === 'royal_sovereign' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30' :
                          cust.tier === 'vip' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {cust.tier === 'royal_sovereign' && <Crown className="w-3 h-3" />}
                          {cust.tier.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">{cust.totalOrders} order(s)</td>
                      <td className="py-3 px-4 font-mono font-bold text-zinc-100">₹{cust.totalSpent.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono text-amber-400">{cust.rewardPoints.toLocaleString()} pts</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {cust.tags.map((t, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedCustomer(cust);
                            onNavigateSubSection('customer-details');
                          }}
                          className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-400/10 transition-colors"
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

      {/* 2. CUSTOMER DETAILS */}
      {subSection === 'customer-details' && selectedCustomer && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateSubSection('customers')}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs hover:bg-zinc-700"
              >
                ← Back to Customers
              </button>
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-100 flex items-center gap-2">
                  {selectedCustomer.name}
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    {selectedCustomer.tier.replace('_', ' ').toUpperCase()}
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Client ID: <span className="font-mono text-zinc-300">{selectedCustomer.id}</span> • Member since {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400">Total Spend</div>
              <div className="text-xl font-serif font-bold text-amber-400 mt-1">₹{selectedCustomer.totalSpent.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400">Total Orders</div>
              <div className="text-xl font-serif font-bold text-zinc-100 mt-1">{selectedCustomer.totalOrders}</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400">Average Order Value</div>
              <div className="text-xl font-serif font-bold text-zinc-100 mt-1">₹{selectedCustomer.avgOrderValue.toLocaleString()}</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400">Reward Balance</div>
              <div className="text-xl font-serif font-bold text-emerald-400 mt-1">{selectedCustomer.rewardPoints} pts</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <h4 className="font-serif font-bold text-zinc-200">Patron Concierge Notes</h4>
            <p className="text-sm text-zinc-300 bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
              {selectedCustomer.notes || 'No custom notes logged.'}
            </p>
          </div>
        </div>
      )}

      {/* 3. ADDRESS BOOK */}
      {subSection === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Verified patron shipping destinations and vault delivery instructions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {addressBook.map(addr => (
              <div key={addr.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-zinc-100 text-sm">{addr.customerName}</div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-400/10 text-amber-400 font-mono">
                    DEFAULT SHIPPING
                  </span>
                </div>
                <div className="text-xs text-zinc-300 space-y-1">
                  <div>{addr.street}</div>
                  <div>{addr.city}, {addr.state} {addr.postalCode}</div>
                  <div className="text-zinc-500">{addr.country}</div>
                  <div className="text-zinc-400 pt-1 font-mono">{addr.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. REVIEWS MODERATION */}
      {subSection === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Moderate verified client reviews and approve testimonial display across store product pages.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Reviewer</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Review Content</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {reviews.map(rev => (
                  <tr key={rev.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4">
                      <div className="font-medium text-zinc-100">{rev.userName}</div>
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified Patron
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-zinc-400">{rev.productName || rev.productId}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs max-w-xs">
                      <div className="font-medium text-zinc-200">{rev.title}</div>
                      <div className="text-zinc-400 line-clamp-2">{rev.comment}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-mono uppercase ${
                        rev.isApproved ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {rev.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!rev.isApproved ? (
                          <button
                            onClick={() => handleModerateReview(rev.id, 'approve')}
                            className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleModerateReview(rev.id, 'reject')}
                            className="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs border border-red-500/30"
                          >
                            Hide
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. SUPPORT HELPDESK */}
      {subSection === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket list */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-zinc-200 text-sm">Active Inquiries</h4>
            {supportTickets.map(tkt => (
              <div
                key={tkt.id}
                onClick={() => setActiveTicket(tkt)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeTicket?.id === tkt.id ? 'bg-zinc-900 border-amber-400/50 shadow-md shadow-amber-400/5' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-amber-400 font-bold">{tkt.ticketNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                    tkt.priority === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {tkt.priority}
                  </span>
                </div>
                <div className="font-medium text-sm text-zinc-100">{tkt.customerName}</div>
                <div className="text-xs text-zinc-400 truncate mt-0.5">{tkt.subject}</div>
              </div>
            ))}
          </div>

          {/* Ticket Chat / Resolution Pane */}
          {activeTicket && (
            <div className="lg:col-span-2 p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between h-[450px]">
              <div>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h4 className="font-serif font-bold text-zinc-100">{activeTicket.subject}</h4>
                    <p className="text-xs text-zinc-400">Client: {activeTicket.customerName} • Dept: {activeTicket.department}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    {activeTicket.status.toUpperCase()}
                  </span>
                </div>

                {/* Conversation message stream */}
                <div className="py-4 space-y-3 overflow-y-auto max-h-64">
                  {activeTicket.messages.map((m, idx) => (
                    <div key={idx} className={`p-3 rounded-xl max-w-md text-xs ${
                      m.sender.includes('Concierge') || m.sender.includes('You') ? 'bg-amber-400/10 border border-amber-400/20 text-zinc-200 ml-auto' : 'bg-zinc-950 border border-zinc-800 text-zinc-300'
                    }`}>
                      <div className="font-bold text-amber-400 mb-1 flex items-center justify-between">
                        <span>{m.sender}</span>
                        <span className="text-[10px] text-zinc-500">{m.time}</span>
                      </div>
                      <p>{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply box */}
              <div className="flex items-center gap-2 pt-3 border-t border-zinc-800">
                <input
                  type="text"
                  placeholder="Type concierge response to client..."
                  value={ticketReply}
                  onChange={(e) => setTicketReply(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendTicketReply()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400 focus:outline-none"
                />
                <button
                  onClick={handleSendTicketReply}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  Reply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
