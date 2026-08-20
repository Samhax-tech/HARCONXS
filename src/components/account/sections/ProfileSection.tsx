import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  User,
  Mail,
  Phone,
  Crown,
  Sparkles,
  MapPin,
  Package,
  Heart,
  ShoppingBag,
  Clock,
  Edit3,
  CheckCircle2,
  Gift,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface ProfileSectionProps {
  onNavigateTab: (tab: string) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ onNavigateTab }) => {
  const {
    currentUser,
    orders,
    customOrders,
    coupleWebsites,
    wishlist,
    updateUser,
    redeemLoyaltyPoints,
    formatPrice
  } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [redeemAmount, setRedeemAmount] = useState(100);

  if (!currentUser) {
    return (
      <div className="p-8 text-center text-zinc-400 bg-zinc-900/50 rounded-2xl border border-zinc-800">
        <User className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
        <p>Please log in to access your profile details.</p>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, phone });
    setIsEditing(false);
  };

  const defaultAddress = currentUser.addresses?.find(a => a.isDefault) || currentUser.addresses?.[0];
  const userOrders = orders.filter(o => 
    o.customerId === currentUser.id || 
    (o.customerEmail && o.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
  );
  const totalSpent = userOrders.reduce((sum, ord) => sum + ord.total, 0);

  // Loyalty Tier Calculation
  const loyaltyPoints = currentUser.loyaltyPoints || 0;
  let tierName = 'HARCONXS Patron';
  let tierBadgeColor = 'from-amber-700 to-amber-900 border-amber-600/40 text-amber-200';
  let nextTierPoints = 500;
  let tierProgress = Math.min(100, Math.round((loyaltyPoints / 500) * 100));

  if (loyaltyPoints >= 1000) {
    tierName = 'Royal Sovereign VIP';
    tierBadgeColor = 'from-amber-400 via-amber-500 to-yellow-600 border-amber-400 text-zinc-950 font-bold';
    nextTierPoints = 2000;
    tierProgress = 100;
  } else if (loyaltyPoints >= 500) {
    tierName = 'Atelier Connoisseur';
    tierBadgeColor = 'from-zinc-300 via-zinc-400 to-zinc-500 border-zinc-300 text-zinc-950 font-semibold';
    nextTierPoints = 1000;
    tierProgress = Math.min(100, Math.round(((loyaltyPoints - 500) / 500) * 100));
  }

  return (
    <div className="space-y-6">
      {/* Profile Header Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-200 text-zinc-950 flex items-center justify-center font-serif text-3xl font-bold shadow-xl border-2 border-amber-400/30">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-serif font-bold text-zinc-100">{currentUser.name || 'Valued Patron'}</h2>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-gradient-to-r ${tierBadgeColor} shadow-sm border`}>
                  <Crown className="w-3 h-3" />
                  {tierName}
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-zinc-500" /> {currentUser.email}</span>
                {currentUser.phone && (
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-zinc-500" /> {currentUser.phone}</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="edit-profile-btn"
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
            <button
              id="view-orders-quick-btn"
              onClick={() => onNavigateTab('orders')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium transition shadow-lg shadow-amber-500/10"
            >
              <Package className="w-3.5 h-3.5" />
              My Orders ({userOrders.length})
            </button>
          </div>
        </div>

        {/* Edit Profile Inline Drawer */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name</label>
              <input
                id="edit-profile-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Phone Number</label>
              <input
                id="edit-profile-phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                id="save-profile-btn"
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Account Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigateTab('orders')}
          className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition text-left group"
        >
          <div className="flex items-center justify-between text-zinc-500 group-hover:text-amber-400 transition mb-3">
            <Package className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{userOrders.length}</div>
          <div className="text-xs text-zinc-400 mt-0.5">Total Orders</div>
        </button>

        <button
          onClick={() => onNavigateTab('wishlist')}
          className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition text-left group"
        >
          <div className="flex items-center justify-between text-zinc-500 group-hover:text-rose-400 transition mb-3">
            <Heart className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{wishlist.length}</div>
          <div className="text-xs text-zinc-400 mt-0.5">Wishlist Items</div>
        </button>

        <button
          onClick={() => onNavigateTab('custom')}
          className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition text-left group"
        >
          <div className="flex items-center justify-between text-zinc-500 group-hover:text-purple-400 transition mb-3">
            <Sparkles className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{customOrders.length}</div>
          <div className="text-xs text-zinc-400 mt-0.5">Custom Orders</div>
        </button>

        <button
          onClick={() => onNavigateTab('websites')}
          className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition text-left group"
        >
          <div className="flex items-center justify-between text-zinc-500 group-hover:text-emerald-400 transition mb-3">
            <ShoppingBag className="w-5 h-5" />
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{coupleWebsites.length}</div>
          <div className="text-xs text-zinc-400 mt-0.5">Couple Sanctuaries</div>
        </button>
      </div>

      {/* Two Column Layout: Loyalty Points & Delivery Address */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loyalty & Rewards Card */}
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">HARCONXS Atelier Rewards</h3>
                  <p className="text-xs text-zinc-400">Earn points on every luxury commission</p>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {loyaltyPoints} Points
              </span>
            </div>

            {/* Tier Progress Bar */}
            <div className="space-y-2 my-4">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Tier: <strong className="text-zinc-200">{tierName}</strong></span>
                <span>{loyaltyPoints} / {nextTierPoints} pts to next tier</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${tierProgress}%` }}
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 mb-4 text-xs text-zinc-300 flex items-center justify-between">
              <span>Available Store Credit:</span>
              <span className="font-semibold text-emerald-400 font-mono text-sm">
                {formatPrice(currentUser.storeCredit || 0)}
              </span>
            </div>
          </div>

          {loyaltyPoints >= 100 && (
            <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-3">
              <input
                type="number"
                min={50}
                max={loyaltyPoints}
                step={50}
                value={redeemAmount}
                onChange={e => setRedeemAmount(Math.max(50, Math.min(loyaltyPoints, Number(e.target.value))))}
                className="w-28 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 text-xs text-center font-mono focus:outline-none focus:border-amber-500"
              />
              <button
                id="redeem-points-btn"
                onClick={() => redeemLoyaltyPoints(redeemAmount)}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition"
              >
                Redeem {redeemAmount} Pts
              </button>
            </div>
          )}
        </div>

        {/* Primary Delivery Address Snapshot */}
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">Primary Delivery Address</h3>
                  <p className="text-xs text-zinc-400">Used for single-click atelier checkout</p>
                </div>
              </div>
              <button
                id="manage-addresses-btn"
                onClick={() => onNavigateTab('addresses')}
                className="text-xs text-amber-400 hover:text-amber-300 transition"
              >
                Manage ({currentUser.addresses?.length || 0})
              </button>
            </div>

            {defaultAddress ? (
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1.5 text-xs text-zinc-300">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-100 text-sm">{defaultAddress.fullName}</span>
                  {defaultAddress.isDefault && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-zinc-400">{defaultAddress.street}{defaultAddress.apartment ? `, ${defaultAddress.apartment}` : ''}</p>
                <p className="text-zinc-400">{defaultAddress.city}, {defaultAddress.state} {defaultAddress.zip}</p>
                <p className="text-zinc-500">{defaultAddress.country} • {defaultAddress.phone || currentUser.phone || 'No phone'}</p>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-zinc-950/50 border border-dashed border-zinc-800 text-center text-zinc-500 text-xs">
                <p>No addresses saved yet.</p>
                <button
                  onClick={() => onNavigateTab('addresses')}
                  className="mt-2 text-xs text-amber-400 hover:underline"
                >
                  + Add New Address
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Supabase RLS Protected
            </span>
            <button
              onClick={() => onNavigateTab('settings')}
              className="text-zinc-400 hover:text-zinc-200 transition"
            >
              Account Security & Password &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
