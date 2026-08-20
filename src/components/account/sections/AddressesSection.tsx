import React, { useState } from 'react';
import { useStore, UserAddress } from '../../../context/StoreContext';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Home,
  Building,
  Phone,
  ShieldCheck,
  X
} from 'lucide-react';

export const AddressesSection: React.FC = () => {
  const {
    currentUser,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    setDefaultUserAddress
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [addressType, setAddressType] = useState<'shipping' | 'billing'>('shipping');

  const addresses = currentUser?.addresses || [];

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setFullName(currentUser?.name || '');
    setStreet('');
    setApartment('');
    setCity('');
    setState('');
    setZip('');
    setCountry('India');
    setPhone(currentUser?.phone || '');
    setIsDefault(addresses.length === 0);
    setAddressType('shipping');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: UserAddress, idx: number) => {
    setEditingIndex(idx);
    setFullName(addr.fullName);
    setStreet(addr.street);
    setApartment(addr.apartment || '');
    setCity(addr.city);
    setState(addr.state);
    setZip(addr.zip);
    setCountry(addr.country);
    setPhone(addr.phone || '');
    setIsDefault(addr.isDefault);
    setAddressType(addr.addressType || 'shipping');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addressData: UserAddress = {
      fullName,
      street,
      apartment,
      city,
      state,
      zip,
      country,
      phone,
      isDefault,
      addressType
    };

    if (editingIndex !== null) {
      updateUserAddress(editingIndex, addressData);
    } else {
      addUserAddress(addressData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-zinc-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            Address Book ({addresses.length})
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your saved delivery destinations and billing coordinates.
          </p>
        </div>

        <button
          id="add-address-btn"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      {/* Address Grid */}
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {addresses.map((addr, idx) => (
            <div
              key={idx}
              id={`address-card-${idx}`}
              className={`p-6 rounded-2xl border transition flex flex-col justify-between relative ${
                addr.isDefault
                  ? 'bg-zinc-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 text-amber-400 flex items-center justify-center">
                      {addr.addressType === 'billing' ? <Building className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-100">{addr.fullName}</h3>
                      <span className="text-[11px] text-zinc-500 capitalize">{addr.addressType || 'Shipping'} Address</span>
                    </div>
                  </div>

                  {addr.isDefault && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Default
                    </span>
                  )}
                </div>

                <div className="text-xs text-zinc-300 space-y-1 my-4">
                  <p>{addr.street}{addr.apartment ? `, ${addr.apartment}` : ''}</p>
                  <p>{addr.city}, {addr.state} - {addr.zip}</p>
                  <p className="text-zinc-400">{addr.country}</p>
                  {addr.phone && (
                    <p className="text-zinc-500 flex items-center gap-1 pt-1">
                      <Phone className="w-3 h-3" /> {addr.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                {!addr.isDefault ? (
                  <button
                    onClick={() => setDefaultUserAddress(idx)}
                    className="text-xs text-zinc-400 hover:text-amber-400 font-medium transition"
                  >
                    Set as Default
                  </button>
                ) : (
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Primary Checkout Address
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(addr, idx)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
                    title="Edit Address"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteUserAddress(idx)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition"
                    title="Delete Address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
          <h3 className="text-sm font-semibold text-zinc-200">No addresses saved</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto mb-4">
            Add your primary shipping and billing addresses for fast, one-click checkout.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add First Address
          </button>
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                {editingIndex !== null ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1 font-medium">Full Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1 font-medium">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    placeholder="House / Flat No., Road / Street"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1 font-medium">Apartment, Suite, Landmark (Optional)</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={e => setApartment(e.target.value)}
                    placeholder="Apartment / Building / Landmark"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">State / Province *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Postal / ZIP Code *</label>
                  <input
                    type="text"
                    required
                    value={zip}
                    onChange={e => setZip(e.target.value)}
                    placeholder="400001"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Country *</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDefault}
                      onChange={e => setIsDefault(e.target.checked)}
                      className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-950"
                    />
                    <span>Set as default address</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">Type:</span>
                    <button
                      type="button"
                      onClick={() => setAddressType('shipping')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                        addressType === 'shipping'
                          ? 'bg-amber-500 text-zinc-950 border-amber-400'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      Shipping
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddressType('billing')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                        addressType === 'billing'
                          ? 'bg-amber-500 text-zinc-950 border-amber-400'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      Billing
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition"
                >
                  {editingIndex !== null ? 'Save Changes' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
