import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Mail,
  LogOut,
  Download,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  User,
  Trash2
} from 'lucide-react';
import {
  supabaseUpdatePassword,
  supabaseResetPasswordForEmail,
  supabaseResendVerification
} from '../../../lib/supabase';

export const SettingsSection: React.FC = () => {
  const { currentUser, userLogout, showToast, orders, customOrders } = useStore();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetMsg, setResetMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!currentUser) return null;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setIsUpdatingPassword(true);
    setPasswordMsg(null);
    const { success, error } = await supabaseUpdatePassword(newPassword);
    setIsUpdatingPassword(false);
    if (success) {
      setPasswordMsg({ type: 'success', text: 'Password updated successfully in Supabase Auth.' });
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated in Supabase Auth.');
    } else {
      setPasswordMsg({ type: 'error', text: error?.message || 'Failed to update password.' });
    }
  };

  const handleSendResetEmail = async () => {
    setIsSendingReset(true);
    setResetMsg(null);
    const { success, error } = await supabaseResetPasswordForEmail(currentUser.email);
    setIsSendingReset(false);
    if (success) {
      setResetMsg({ type: 'success', text: `Password recovery link dispatched to ${currentUser.email}` });
      showToast('Password reset link sent to your email.');
    } else {
      setResetMsg({ type: 'error', text: error?.message || 'Failed to send recovery email.' });
    }
  };

  const handleExportData = () => {
    const dataObj = {
      profile: currentUser,
      orders: orders.filter(o => o.customerId === currentUser.id || o.customerEmail === currentUser.email),
      customOrders: customOrders.filter(co => co.customerId === currentUser.id || co.customerEmail === currentUser.email),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(dataObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `harconxs-account-data-${currentUser.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Your account data archive has been downloaded.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-zinc-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            Account Security & Preferences
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your credentials, Supabase authentication security, and privacy data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Update Card */}
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Update Password</h3>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">New Password</label>
              <input
                id="settings-new-password"
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Confirm New Password</label>
              <input
                id="settings-confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {passwordMsg && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                }`}
              >
                {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                id="update-password-btn"
                type="submit"
                disabled={isUpdatingPassword}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 disabled:opacity-50 transition shadow-sm"
              >
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Email Recovery & Supabase Verification */}
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800">
              <Mail className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-zinc-100">Recovery & Verification</h3>
            </div>

            <div className="space-y-3 pt-1 text-xs text-zinc-400">
              <p>
                Primary Account Email: <strong className="text-zinc-200">{currentUser.email}</strong>
              </p>
              <p className="leading-relaxed">
                Need to reset your password via secure email link? We will send an encrypted Supabase password recovery token.
              </p>

              {resetMsg && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    resetMsg.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}
                >
                  {resetMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{resetMsg.text}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Supabase Auth Engine
            </span>
            <button
              onClick={handleSendResetEmail}
              disabled={isSendingReset}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition"
            >
              {isSendingReset ? 'Sending...' : 'Send Recovery Email'}
            </button>
          </div>
        </div>

        {/* Currency & Regional Preference */}
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Regional Currency & Pricing</h3>
          </div>
          <div className="text-xs text-zinc-400 space-y-2">
            <p>HARCONXS operates strictly in Indian Rupees (INR ₹) with all statutory tax calculations included.</p>
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-300 font-medium">Standard Currency:</span>
              <span className="font-mono text-amber-300 font-bold">INR (₹)</span>
            </div>
          </div>
        </div>

        {/* Privacy & Account Export */}
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800">
              <Download className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-zinc-100">Privacy & Data Archive</h3>
            </div>
            <p className="text-xs text-zinc-400 pt-1 leading-relaxed">
              Download a complete JSON export of your personal orders, address book, bespoke commissions, and reviews.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition"
            >
              <Download className="w-3.5 h-3.5" /> Export My Data (JSON)
            </button>

            <button
              onClick={() => userLogout()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
