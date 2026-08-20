import React, { useState } from 'react';
import { 
  Tag, 
  Search, 
  Plus, 
  Gift, 
  Users, 
  Crown, 
  CreditCard, 
  Percent, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Clock,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { GiftCardRecord, LoyaltyTierInfo } from '../../../types';
import { enforceServerSidePermission } from '../../../services/adminAuthService';

interface MarketingAdminSectionProps {
  subSection: 'coupons' | 'affiliates' | 'gift-cards' | 'loyalty';
  onNavigateSubSection: (sec: 'coupons' | 'affiliates' | 'gift-cards' | 'loyalty') => void;
}

export const MarketingAdminSection: React.FC<MarketingAdminSectionProps> = ({
  subSection,
  onNavigateSubSection
}) => {
  const { showToast } = useStore();

  // Coupons
  const [coupons, setCoupons] = useState([
    {
      id: 'c-1',
      code: 'SOVEREIGN15',
      discountType: 'percentage',
      discountValue: 15,
      minOrderAmount: 2000,
      usageLimit: 500,
      usedCount: 142,
      status: 'active',
      expiresAt: '2026-06-30'
    },
    {
      id: 'c-2',
      code: 'VALENTINE2026',
      discountType: 'flat',
      discountValue: 500,
      minOrderAmount: 3000,
      usageLimit: 200,
      usedCount: 188,
      status: 'active',
      expiresAt: '2026-02-28'
    },
    {
      id: 'c-3',
      code: 'ATELIERGOLD',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 10000,
      usageLimit: 50,
      usedCount: 22,
      status: 'active',
      expiresAt: '2026-12-31'
    }
  ]);

  // Affiliates
  const [affiliates, setAffiliates] = useState([
    {
      id: 'aff-01',
      name: 'Rohan Joshi (Luxury Vows Blog)',
      code: 'ROHAN_LUXE',
      commissionRate: 10,
      totalReferrals: 38,
      totalSalesGenerated: 245000,
      pendingPayout: 24500,
      status: 'active'
    },
    {
      id: 'aff-02',
      name: 'Ananya Roy (Bridal Jewellery Insider)',
      code: 'ANANYA_ROY',
      commissionRate: 12,
      totalReferrals: 52,
      totalSalesGenerated: 380000,
      pendingPayout: 45600,
      status: 'active'
    }
  ]);

  // Gift cards
  const [giftCards, setGiftCards] = useState<GiftCardRecord[]>([
    {
      id: 'gc-01',
      code: 'HX-GIFT-8821-9042',
      initialBalance: 5000,
      currentBalance: 3200,
      currency: 'INR',
      recipientName: 'Kavya Singhal',
      recipientEmail: 'kavya@gmail.com',
      senderName: 'Siddharth Varma',
      message: 'Wishing you a joyful anniversary filled with timeless sparkle.',
      status: 'active',
      expiresAt: '2027-02-14',
      createdAt: '2026-02-14T00:00:00Z'
    },
    {
      id: 'gc-02',
      code: 'HX-GIFT-1004-7721',
      initialBalance: 10000,
      currentBalance: 10000,
      currency: 'INR',
      recipientName: 'Nisha & Arjun',
      recipientEmail: 'arjun@outlook.com',
      senderName: 'Grand Atelier Collective',
      message: 'Exclusive Sovereign wedding commission token.',
      status: 'active',
      expiresAt: '2027-12-31',
      createdAt: '2026-01-20T00:00:00Z'
    }
  ]);

  // Loyalty tiers
  const [loyaltyTiers] = useState<LoyaltyTierInfo[]>([
    {
      tier: 'standard',
      name: 'Atelier Initiate',
      minSpend: 0,
      pointsMultiplier: 1,
      perks: ['1 Point per ₹10 Spent', 'Complimentary Velvet Pouch', 'Annual Birthday Privilege Code'],
      color: 'text-zinc-300'
    },
    {
      tier: 'vip',
      name: 'Luxe Sovereign Patron',
      minSpend: 15000,
      pointsMultiplier: 1.5,
      perks: ['1.5x Points Multiplier', 'Complimentary Insured Air Express', 'Early Access to Vault Drops', 'Free Ring Resizing Service'],
      color: 'text-purple-400'
    },
    {
      tier: 'royal_sovereign',
      name: 'Imperial Crown Benefactor',
      minSpend: 50000,
      pointsMultiplier: 2,
      perks: ['2x Points Multiplier', 'Direct Master Artisan CAD Channel', 'Dedicated Private Concierge', 'Complimentary LED Spotlight Box'],
      color: 'text-amber-400'
    }
  ]);

  // Modal for new coupon
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newDiscValue, setNewDiscValue] = useState(10);
  const [newMinOrder, setNewMinOrder] = useState(1500);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enforceServerSidePermission('marketing:coupons', 'coupon', newCode);
      const newCoupon = {
        id: `c-${Date.now()}`,
        code: newCode.toUpperCase().trim(),
        discountType: 'percentage',
        discountValue: newDiscValue,
        minOrderAmount: newMinOrder,
        usageLimit: 100,
        usedCount: 0,
        status: 'active',
        expiresAt: '2026-12-31'
      };
      setCoupons(prev => [newCoupon, ...prev]);
      setIsCouponModalOpen(false);
      setNewCode('');
      showToast(`Coupon ${newCoupon.code} created and activated.`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Marketing campaign creation requires marketing role.');
    }
  };

  const handlePayoutAffiliate = async (aff: typeof affiliates[0]) => {
    try {
      await enforceServerSidePermission('marketing:affiliates', 'affiliate_payout', aff.id);
      setAffiliates(prev => prev.map(a => a.id === aff.id ? { ...a, pendingPayout: 0 } : a));
      showToast(`Commission payout of ₹${aff.pendingPayout.toLocaleString()} processed for ${aff.name}.`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Affiliate payout requires marketing or finance lead.');
    }
  };

  return (
    <div id="marketing-admin-section" className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            id="tab-marketing-coupons"
            onClick={() => onNavigateSubSection('coupons')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'coupons' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Percent className="w-4 h-4" />
            Coupons ({coupons.length})
          </button>
          <button
            id="tab-marketing-affiliates"
            onClick={() => onNavigateSubSection('affiliates')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'affiliates' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Affiliates & Partners ({affiliates.length})
          </button>
          <button
            id="tab-marketing-giftcards"
            onClick={() => onNavigateSubSection('gift-cards')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'gift-cards' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Gift className="w-4 h-4" />
            Gift Cards ({giftCards.length})
          </button>
          <button
            id="tab-marketing-loyalty"
            onClick={() => onNavigateSubSection('loyalty')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'loyalty' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Crown className="w-4 h-4" />
            Sovereign Loyalty Program
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Server RBAC Protected
          </span>
        </div>
      </div>

      {/* 1. COUPONS SUBSECTION */}
      {subSection === 'coupons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Manage promotional discount codes, percentage vouchers, and minimum checkout thresholds.
            </p>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-3.5 py-2 min-h-[40px] rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Create Coupon
            </button>
          </div>

          {/* MOBILE COUPONS CARDS (< md screens) */}
          <div className="md:hidden space-y-3">
            {coupons.map(cpn => (
              <div key={cpn.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono font-bold text-amber-400 text-sm tracking-wider">{cpn.code}</span>
                    <p className="text-xs text-zinc-400">Expires: {cpn.expiresAt}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono uppercase">
                    {cpn.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-zinc-950/60 p-2.5 rounded-xl text-xs border border-zinc-800 text-center">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Discount</span>
                    <span className="font-mono font-bold text-zinc-100">
                      {cpn.discountType === 'percentage' ? `${cpn.discountValue}%` : `₹${cpn.discountValue}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Min. Spend</span>
                    <span className="font-mono text-zinc-300">₹{cpn.minOrderAmount}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Used</span>
                    <span className="font-mono text-amber-400">{cpn.usedCount}/{cpn.usageLimit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP COUPONS TABLE (>= md screens) */}
          <div className="hidden md:block rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Min. Spend</th>
                  <th className="py-3 px-4">Usage Counter</th>
                  <th className="py-3 px-4">Expires</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {coupons.map(cpn => (
                  <tr key={cpn.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">{cpn.code}</td>
                    <td className="py-3 px-4 font-mono font-medium text-zinc-100">
                      {cpn.discountType === 'percentage' ? `${cpn.discountValue}% OFF` : `₹${cpn.discountValue} FLAT`}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-400">₹{cpn.minOrderAmount.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-zinc-300">
                      {cpn.usedCount} / {cpn.usageLimit}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-zinc-400">{cpn.expiresAt}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono uppercase">
                        {cpn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. AFFILIATES SUBSECTION */}
      {subSection === 'affiliates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Partner referral links, influencer revenue share tracking, and automated commission payouts.
            </p>
          </div>

          {/* MOBILE AFFILIATES CARDS (< md screens) */}
          <div className="md:hidden space-y-3">
            {affiliates.map(aff => (
              <div key={aff.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-zinc-100 text-sm">{aff.name}</h4>
                    <span className="text-xs font-mono font-bold text-amber-400">{aff.code}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 font-mono">
                    {aff.commissionRate}% Commission
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-zinc-950/60 p-2.5 rounded-xl text-xs border border-zinc-800">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Sales Driven</span>
                    <span className="font-mono font-bold text-zinc-100">₹{aff.totalSalesGenerated.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Pending Commission</span>
                    <span className="font-mono font-bold text-emerald-400">₹{aff.pendingPayout.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  {aff.pendingPayout > 0 ? (
                    <button
                      onClick={() => handlePayoutAffiliate(aff)}
                      className="px-4 py-1.5 min-h-[38px] rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 cursor-pointer"
                    >
                      Settle Payout
                    </button>
                  ) : (
                    <span className="text-xs text-zinc-500 font-mono py-1">Settled</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP AFFILIATES TABLE (>= md screens) */}
          <div className="hidden md:block rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Partner Name</th>
                  <th className="py-3 px-4">Referral Code</th>
                  <th className="py-3 px-4">Commission</th>
                  <th className="py-3 px-4">Sales Driven</th>
                  <th className="py-3 px-4">Pending Payout</th>
                  <th className="py-3 px-4 text-right">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {affiliates.map(aff => (
                  <tr key={aff.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-medium text-zinc-100">{aff.name}</td>
                    <td className="py-3 px-4 font-mono text-xs text-amber-400 font-bold">{aff.code}</td>
                    <td className="py-3 px-4 font-mono text-zinc-300">{aff.commissionRate}%</td>
                    <td className="py-3 px-4 font-mono font-bold text-zinc-100">₹{aff.totalSalesGenerated.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">₹{aff.pendingPayout.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      {aff.pendingPayout > 0 ? (
                        <button
                          onClick={() => handlePayoutAffiliate(aff)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30"
                        >
                          Settle Payout
                        </button>
                      ) : (
                        <span className="text-xs text-zinc-500 font-mono">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. GIFT CARDS SUBSECTION */}
      {subSection === 'gift-cards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Luxury digital and physical keepsake gift cards issued to patrons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {giftCards.map(gc => (
              <div key={gc.id} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400 tracking-wider">{gc.code}</span>
                  <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono uppercase">
                    {gc.status}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-zinc-900 to-zinc-950 border border-amber-400/30 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-zinc-400 uppercase font-mono">Remaining Balance</div>
                    <div className="text-2xl font-serif font-bold text-amber-400">₹{gc.currentBalance.toLocaleString()}</div>
                  </div>
                  <div className="text-right text-xs text-zinc-400 font-mono">
                    Initial: ₹{gc.initialBalance.toLocaleString()}
                  </div>
                </div>

                <div className="text-xs text-zinc-300 space-y-1">
                  <div><strong>Recipient:</strong> {gc.recipientName} ({gc.recipientEmail})</div>
                  <div><strong>From:</strong> {gc.senderName}</div>
                  {gc.message && <div className="text-zinc-400 italic pt-1">"{gc.message}"</div>}
                </div>

                <div className="pt-2 border-t border-zinc-800 text-[11px] font-mono text-zinc-500 flex justify-between">
                  <span>Expires: {gc.expiresAt}</span>
                  <span>Currency: {gc.currency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. LOYALTY SUBSECTION */}
      {subSection === 'loyalty' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Sovereign Loyalty Program perks, point accumulation multipliers, and patron tier thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loyaltyTiers.map(tier => (
              <div key={tier.tier} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className={`w-5 h-5 ${tier.color}`} />
                    <h4 className={`font-serif font-bold text-lg ${tier.color}`}>{tier.name}</h4>
                  </div>
                  <div className="text-xs text-zinc-400 font-mono">
                    Spend Threshold: <strong className="text-zinc-200">₹{tier.minSpend.toLocaleString()}+</strong>
                  </div>
                  <div className="text-xs text-amber-400 font-mono mt-1 font-bold">
                    {tier.pointsMultiplier}x Points Rate
                  </div>

                  <div className="space-y-2 mt-4 text-xs text-zinc-300">
                    {tier.perks.map((p, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 text-center">
                  <span className="px-3 py-1 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-mono">
                    Active Tier Configuration
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW COUPON MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-serif font-bold text-zinc-100">Create New Promo Coupon</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LUXURY20"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400 uppercase font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Discount Value (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newDiscValue}
                  onChange={(e) => setNewDiscValue(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  value={newMinOrder}
                  onChange={(e) => setNewMinOrder(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400 font-mono"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-sm cursor-pointer"
                >
                  Create & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
