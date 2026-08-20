import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  FileText, 
  MessageSquare, 
  Gift, 
  Send, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  ArrowRight,
  Eye,
  Layers,
  UploadCloud,
  Box
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { CustomOrder, CustomQuoteRecord } from '../../../types';
import { enforceServerSidePermission } from '../../../services/adminAuthService';

interface CustomOrdersAdminSectionProps {
  subSection: 'custom' | 'quotes' | 'custom-order-chat' | 'packaging';
  onNavigateSubSection: (sec: 'custom' | 'quotes' | 'custom-order-chat' | 'packaging') => void;
}

export const CustomOrdersAdminSection: React.FC<CustomOrdersAdminSectionProps> = ({
  subSection,
  onNavigateSubSection
}) => {
  const { customOrders, updateCustomOrderStatus, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(customOrders[0] || null);

  // Quotes state
  const [quotesList, setQuotesList] = useState<CustomQuoteRecord[]>([
    {
      id: 'q-01',
      quoteNumber: 'QUO-2026-901',
      orderId: 'co-1',
      customerName: 'Aarav Singhania',
      customerEmail: 'aarav.singhania@domain.com',
      projectTitle: '18K White Gold Dual Solitaire Ring Set',
      estimatedPrice: 65000,
      depositRequired: 32500,
      leadTimeDays: 14,
      packagingName: 'Imperial Velvet Dual Box with Custom Monogram',
      specsSummary: 'VS1 clarity certified lab-grown diamonds, custom hand-engraved cursive Roman date.',
      cadProofUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
      status: 'accepted',
      validUntil: '2026-03-01',
      createdAt: '2026-02-15T00:00:00Z',
      updatedAt: '2026-02-16T00:00:00Z'
    },
    {
      id: 'q-02',
      quoteNumber: 'QUO-2026-902',
      orderId: 'co-2',
      customerName: 'Devika Sharma',
      customerEmail: 'devika.s@lifestyle.in',
      projectTitle: 'Platinum Infinity Constellation Pendant',
      estimatedPrice: 28000,
      depositRequired: 14000,
      leadTimeDays: 10,
      packagingName: 'Royal Midnight Blue LED Keepsake Vault',
      specsSummary: 'Platinum 950 with sapphire center micro-pave setting.',
      status: 'sent',
      validUntil: '2026-03-05',
      createdAt: '2026-02-18T00:00:00Z',
      updatedAt: '2026-02-18T00:00:00Z'
    }
  ]);

  // Luxury packaging catalog
  const [packagingCatalog, setPackagingCatalog] = useState([
    {
      id: 'pkg-1',
      name: 'Imperial Velvet Sovereign Box (Burgundy / Gold)',
      cost: 450,
      stock: 48,
      dimensions: '12cm × 12cm × 6cm',
      description: 'Plush velvet lining with brass hinge closure and gold foil crest.',
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'pkg-2',
      name: 'Royal Midnight LED Spotlight Ring Vault',
      cost: 650,
      stock: 26,
      dimensions: '10cm × 10cm × 8cm',
      description: 'Warm 3000K internal spotlight that activates upon opening.',
      imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'pkg-3',
      name: 'Handmade Wax-Sealed Parchment Letter & Ribbon',
      cost: 150,
      stock: 120,
      dimensions: 'A5 Parchment',
      description: 'Hand-dipped gold sealing wax with custom couple initials seal.',
      imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&auto=format&fit=crop&q=80'
    }
  ]);

  // Chat conversation state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'client', text: 'Hi Atelier, I uploaded reference sketches for our 5th anniversary pendant.', time: 'Yesterday 4:20 PM' },
    { sender: 'artisan', text: 'Greetings! Our master jeweler reviewed the sketches and created the initial 3D CAD render.', time: 'Yesterday 5:45 PM' },
    { sender: 'artisan', text: 'We recommend 18K white gold with platinum prongs for maximum brilliance.', time: 'Today 9:15 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Server-side permission enforced actions
  const handleUpdateCustomStatus = async (orderId: string, nextStatus: CustomOrder['status']) => {
    try {
      await enforceServerSidePermission('custom_orders:status', 'custom_order', orderId);
      updateCustomOrderStatus(orderId, nextStatus);
      showToast(`Custom order status updated to "${nextStatus.toUpperCase()}".`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Only Atelier Artisan or Super Admin can change custom order progression.');
    }
  };

  const handleSendArtisanChat = async () => {
    if (!chatInput.trim()) return;
    try {
      await enforceServerSidePermission('custom_orders:chat', 'custom_order_chat', selectedOrder?.id);
      const newMsg = {
        sender: 'artisan',
        text: chatInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, newMsg]);
      setChatInput('');
      showToast('Artisan message dispatched to client portal.');
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Artisan communication permission required.');
    }
  };

  return (
    <div id="custom-orders-admin-section" className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            id="tab-custom-orders"
            onClick={() => onNavigateSubSection('custom')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'custom' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Custom Orders ({customOrders.length})
          </button>
          <button
            id="tab-custom-quotes"
            onClick={() => onNavigateSubSection('quotes')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'quotes' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Quotes & CAD ({quotesList.length})
          </button>
          <button
            id="tab-custom-chat"
            onClick={() => onNavigateSubSection('custom-order-chat')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'custom-order-chat' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Artisan Direct Chat
          </button>
          <button
            id="tab-custom-packaging"
            onClick={() => onNavigateSubSection('packaging')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'packaging' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Box className="w-4 h-4" />
            Luxury Packaging ({packagingCatalog.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Server RBAC Protected
          </span>
        </div>
      </div>

      {/* 1. CUSTOM ORDERS LIST */}
      {subSection === 'custom' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search bespoke commissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 min-h-[40px] rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* MOBILE CUSTOM ORDERS CARDS (< md screens) */}
          <div className="md:hidden space-y-3">
            {customOrders
              .filter(co => !searchQuery || (co.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) || co.id.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(order => (
                <div key={order.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono font-bold text-amber-400 text-sm">{order.id}</div>
                      <div className="text-xs text-zinc-300 font-medium">{order.customerName || 'Patron'}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-zinc-100 bg-zinc-800 px-2.5 py-1 rounded-lg">
                      {order.quote ? `₹${order.quote.amount.toLocaleString()}` : (order.budgetRange || 'Flexible')}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800">
                    <div className="text-zinc-300 font-medium">{order.productType || 'Custom Atelier Commission'}</div>
                    <div className="text-zinc-400 text-[11px]">{order.personalText?.engravingPlacement ? `Engraving: "${order.personalText.engravingPlacement}"` : (order.preferredStyle ? `Style: ${order.preferredStyle}` : 'Standard Custom')}</div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateCustomStatus(order.id, e.target.value as CustomOrder['status'])}
                      className="text-xs px-2.5 py-1.5 min-h-[38px] rounded-lg font-medium border bg-zinc-950 border-amber-400/30 text-amber-400 focus:outline-none"
                    >
                      <option value="REQUESTED">1. Pending Review</option>
                      <option value="QUOTED">2. Quote Dispatched</option>
                      <option value="PRODUCTION">3. In Atelier Casting</option>
                      <option value="DELIVERED">4. Polished & Inspected</option>
                      <option value="REJECTED">Declined</option>
                    </select>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        onNavigateSubSection('custom-order-chat');
                      }}
                      className="px-3.5 py-1.5 min-h-[38px] rounded-lg bg-zinc-800 text-amber-400 hover:bg-zinc-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Artisan Chat
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* DESKTOP CUSTOM ORDERS TABLE (>= md screens) */}
          <div className="hidden md:block rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Commission ID</th>
                  <th className="py-3 px-4">Patron</th>
                  <th className="py-3 px-4">Specs & Metal</th>
                  <th className="py-3 px-4">Budget Est.</th>
                  <th className="py-3 px-4">Crafting Pipeline</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {customOrders
                  .filter(co => !searchQuery || (co.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) || co.id.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(order => (
                    <tr key={order.id} className="hover:bg-zinc-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">{order.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-zinc-100">{order.customerName}</div>
                        <div className="text-xs text-zinc-500">{order.customerEmail}</div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <div className="text-zinc-200">{order.productType || 'Custom Commission'}</div>
                        <div className="text-zinc-400">{order.personalText?.engravingPlacement ? `Engraved: "${order.personalText.engravingPlacement}"` : (order.preferredStyle || 'Standard Custom')}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-zinc-100">
                        {order.quote ? `₹${order.quote.amount.toLocaleString()}` : (order.budgetRange || 'Flexible')}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateCustomStatus(order.id, e.target.value as CustomOrder['status'])}
                          className="text-xs px-2.5 py-1 rounded-lg font-medium border bg-zinc-950 border-amber-400/30 text-amber-400 focus:outline-none"
                        >
                          <option value="REQUESTED">1. Pending Review</option>
                          <option value="QUOTED">2. Quote Dispatched</option>
                          <option value="PRODUCTION">3. In Atelier Casting</option>
                          <option value="DELIVERED">4. Polished & Inspected</option>
                          <option value="REJECTED">Declined</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            onNavigateSubSection('custom-order-chat');
                          }}
                          className="px-3 py-1.5 min-h-[36px] rounded-lg bg-zinc-800 text-amber-400 hover:bg-zinc-700 text-xs font-medium cursor-pointer"
                        >
                          Artisan Chat
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. QUOTES & CAD SUBSECTION */}
      {subSection === 'quotes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Formal custom jewelry quotes, 3D CAD models, milestone deposits, and artisan lead-time schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quotesList.map(quote => (
              <div key={quote.id} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">{quote.quoteNumber}</span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono uppercase ${
                    quote.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {quote.status}
                  </span>
                </div>

                {quote.cadProofUrl && (
                  <div className="h-44 rounded-xl overflow-hidden border border-zinc-800 relative">
                    <img src={quote.cadProofUrl} alt={quote.projectTitle} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/70 text-[10px] font-mono text-amber-400 backdrop-blur-sm">
                      3D CAD Render Proof
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-serif font-bold text-zinc-100 text-base">{quote.projectTitle}</h4>
                  <div className="text-xs text-zinc-400 mt-1">Client: {quote.customerName} ({quote.customerEmail})</div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs font-mono">
                  <div>
                    <span className="text-zinc-500">Estimate:</span>
                    <div className="font-bold text-amber-400 text-sm">₹{quote.estimatedPrice.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-zinc-500">50% Deposit:</span>
                    <div className="font-bold text-emerald-400 text-sm">₹{quote.depositRequired.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-zinc-500">Lead Time:</span>
                    <div className="text-zinc-300">{quote.leadTimeDays} Business Days</div>
                  </div>
                  <div>
                    <span className="text-zinc-500">Valid Until:</span>
                    <div className="text-zinc-300">{quote.validUntil}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ARTISAN DIRECT CHAT */}
      {subSection === 'custom-order-chat' && (
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h4 className="font-serif font-bold text-zinc-100">Bespoke Artisan & Patron Channel</h4>
              <p className="text-xs text-zinc-400">Order: <span className="text-amber-400 font-mono">{selectedOrder?.id || 'CO-8891'}</span> • Live Synchronized</p>
            </div>
          </div>

          <div className="space-y-3 py-2 overflow-y-auto max-h-80">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`p-3.5 rounded-xl max-w-md text-xs ${
                msg.sender === 'artisan' ? 'bg-amber-400/10 border border-amber-400/20 text-zinc-200 ml-auto' : 'bg-zinc-950 border border-zinc-800 text-zinc-300'
              }`}>
                <div className="font-bold text-amber-400 mb-1 flex items-center justify-between">
                  <span>{msg.sender === 'artisan' ? 'Lead Master Artisan' : 'Patron Client'}</span>
                  <span className="text-[10px] text-zinc-500">{msg.time}</span>
                </div>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
            <input
              type="text"
              placeholder="Send artisan guidance or upload CAD update..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendArtisanChat()}
              className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400 focus:outline-none"
            />
            <button
              onClick={handleSendArtisanChat}
              className="px-4 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </div>
        </div>
      )}

      {/* 4. LUXURY PACKAGING */}
      {subSection === 'packaging' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Luxury keepsake presentation packaging, velvet boxes, spotlight LED vaults, and custom seal stationery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packagingCatalog.map(pkg => (
              <div key={pkg.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="h-40 rounded-xl overflow-hidden border border-zinc-800">
                  <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-serif font-bold text-zinc-100 text-sm">{pkg.name}</h4>
                <p className="text-xs text-zinc-400 line-clamp-2">{pkg.description}</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800 font-mono">
                  <span className="text-zinc-400">Cost: ₹{pkg.cost}</span>
                  <span className="text-emerald-400">{pkg.stock} in stock</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
