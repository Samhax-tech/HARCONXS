import React, { useState } from 'react';
import { 
  Settings, 
  CreditCard, 
  Truck, 
  FileText, 
  Bell, 
  Mail, 
  Users, 
  ShieldCheck, 
  Key, 
  Activity, 
  Plus, 
  Lock, 
  Check, 
  X, 
  AlertCircle,
  Clock,
  Sparkles,
  Save
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { StaffMember, AdminRoleDefinition, AuditLogRecord } from '../../../types';
import { 
  ADMIN_PERMISSIONS_LIST, 
  INITIAL_STAFF_MEMBERS, 
  INITIAL_ROLE_DEFINITIONS, 
  DEFAULT_ROLE_PERMISSIONS,
  AdminRole,
  AdminPermission,
  enforceServerSidePermission 
} from '../../../services/adminAuthService';

interface SettingsAdminSectionProps {
  subSection: 
    | 'settings-general' 
    | 'settings-payments' 
    | 'settings-shipping' 
    | 'settings-tax' 
    | 'settings-notifications' 
    | 'settings-email' 
    | 'settings-staff' 
    | 'settings-roles' 
    | 'settings-permissions' 
    | 'settings-audit-logs';
  onNavigateSubSection: (sec: any) => void;
}

export const SettingsAdminSection: React.FC<SettingsAdminSectionProps> = ({
  subSection,
  onNavigateSubSection
}) => {
  const { showToast } = useStore();

  // General Store Settings
  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'HARCONXS Sovereign Atelier',
    supportEmail: 'concierge@harconxs.com',
    supportPhone: '+91 98200 00000',
    currency: 'INR (₹)',
    timezone: 'Asia/Kolkata (IST - UTC+5:30)',
    orderPrefix: 'HX-'
  });

  // Payment Gateways
  const [paymentsConfig, setPaymentsConfig] = useState({
    razorpayEnabled: true,
    razorpayKeyId: 'rzp_live_sovereign_018249',
    stripeEnabled: true,
    stripePublishableKey: 'pk_live_51MkJ829018491',
    codEnabled: true,
    codMaxThreshold: 10000
  });

  // Tax & GST Slabs
  const [taxSlabs, setTaxSlabs] = useState([
    { code: 'HSN-7113', category: 'Fine Gold & Platinum Jewellery', rate: 3, appliesTo: 'All Precious Metals' },
    { code: 'HSN-7117', category: 'Fashion Jewellery & Titanium Keepsakes', rate: 3, appliesTo: 'Titanium & Silver' },
    { code: 'HSN-4820', category: 'Luxury Velvet Boxes & Stationery', rate: 18, appliesTo: 'Packaging & Notes' },
    { code: 'HSN-9983', category: 'Software & Couple Web Domains', rate: 18, appliesTo: 'Digital Domains' }
  ]);

  // Staff members
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(INITIAL_STAFF_MEMBERS);
  const [rolesList, setRolesList] = useState<AdminRoleDefinition[]>(INITIAL_ROLE_DEFINITIONS);
  const [rolePermissionsMatrix, setRolePermissionsMatrix] = useState<Record<AdminRole, AdminPermission[]>>(DEFAULT_ROLE_PERMISSIONS);

  // Audit logs
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([
    {
      id: 'log-101',
      adminId: 'staff-01',
      adminEmail: 'admin@hamza.harconxs.com',
      action: 'catalog:edit',
      resourceType: 'product',
      resourceId: 'p1',
      status: 'ALLOWED',
      ipAddress: '103.21.144.12',
      createdAt: '2026-02-19T14:35:10Z'
    },
    {
      id: 'log-102',
      adminId: 'staff-02',
      adminEmail: 'victoria@harconxs.com',
      action: 'orders:edit',
      resourceType: 'order',
      resourceId: 'ord-8812',
      status: 'ALLOWED',
      ipAddress: '103.21.144.18',
      createdAt: '2026-02-19T13:20:00Z'
    },
    {
      id: 'log-103',
      adminId: 'staff-04',
      adminEmail: 'elena@harconxs.com',
      action: 'refunds:manage',
      resourceType: 'refund',
      resourceId: 'ref-01',
      status: 'DENIED',
      ipAddress: '49.36.120.4',
      createdAt: '2026-02-19T11:15:22Z'
    },
    {
      id: 'log-104',
      adminId: 'staff-01',
      adminEmail: 'admin@hamza.harconxs.com',
      action: 'api:generate_keys',
      resourceType: 'api_client',
      resourceId: 'client-901',
      status: 'ALLOWED',
      ipAddress: '103.21.144.12',
      createdAt: '2026-02-19T09:00:00Z'
    }
  ]);

  // Selected role for permission matrix inspection
  const [selectedMatrixRole, setSelectedMatrixRole] = useState<AdminRole>('admin');

  // Toggle permission on role matrix
  const handleTogglePermission = async (role: AdminRole, perm: AdminPermission) => {
    try {
      await enforceServerSidePermission('settings:roles', 'role_matrix', role);
      setRolePermissionsMatrix(prev => {
        const currentList = prev[role] || [];
        const isPresent = currentList.includes(perm);
        const updatedList = isPresent ? currentList.filter(p => p !== perm) : [...currentList, perm];
        return {
          ...prev,
          [role]: updatedList
        };
      });
      showToast(`Permission "${perm}" toggled for role "${role}".`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Only Super Admin can modify the RBAC role matrix.');
    }
  };

  const handleSaveGeneralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enforceServerSidePermission('settings:general', 'store_settings');
      showToast('General store settings synchronized.');
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: General settings require admin role.');
    }
  };

  return (
    <div id="settings-admin-section" className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            id="tab-settings-general"
            onClick={() => onNavigateSubSection('settings-general')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              subSection === 'settings-general' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            General
          </button>
          <button
            id="tab-settings-payments"
            onClick={() => onNavigateSubSection('settings-payments')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              subSection === 'settings-payments' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Payments
          </button>
          <button
            id="tab-settings-shipping"
            onClick={() => onNavigateSubSection('settings-shipping')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              subSection === 'settings-shipping' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Shipping
          </button>
          <button
            id="tab-settings-tax"
            onClick={() => onNavigateSubSection('settings-tax')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              subSection === 'settings-tax' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Tax & GST
          </button>
          <button
            id="tab-settings-notifications"
            onClick={() => onNavigateSubSection('settings-notifications')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              subSection === 'settings-notifications' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Notifications
          </button>
          <button
            id="tab-settings-staff"
            onClick={() => onNavigateSubSection('settings-staff')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              subSection === 'settings-staff' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Staff ({staffMembers.length})
          </button>
          <button
            id="tab-settings-roles"
            onClick={() => onNavigateSubSection('settings-roles')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              subSection === 'settings-roles' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Roles ({rolesList.length})
          </button>
          <button
            id="tab-settings-permissions"
            onClick={() => onNavigateSubSection('settings-permissions')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              subSection === 'settings-permissions' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            RBAC Matrix
          </button>
          <button
            id="tab-settings-audit-logs"
            onClick={() => onNavigateSubSection('settings-audit-logs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              subSection === 'settings-audit-logs' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Audit Logs
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Server RBAC Protected
          </span>
        </div>
      </div>

      {/* 1. GENERAL STORE SETTINGS */}
      {subSection === 'settings-general' && (
        <form onSubmit={handleSaveGeneralSettings} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <h4 className="font-serif font-bold text-zinc-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            Atelier Identity & Store Configuration
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Store Brand Name</label>
              <input
                type="text"
                value={generalSettings.storeName}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, storeName: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Support Email</label>
              <input
                type="email"
                value={generalSettings.supportEmail}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Currency & Symbol</label>
              <input
                type="text"
                value={generalSettings.currency}
                disabled
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Timezone</label>
              <input
                type="text"
                value={generalSettings.timezone}
                disabled
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 text-sm font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-sm cursor-pointer shadow-lg shadow-amber-400/20"
            >
              Save General Settings
            </button>
          </div>
        </form>
      )}

      {/* 2. PAYMENTS GATEWAYS */}
      {subSection === 'settings-payments' && (
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <h4 className="font-serif font-bold text-zinc-100 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            Payment Gateways & Settlement
          </h4>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-zinc-100 text-sm">Razorpay Payment Gateway (UPI, Netbanking, Cards)</div>
                <div className="text-xs text-zinc-400 font-mono">Key ID: {paymentsConfig.razorpayKeyId}</div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-zinc-100 text-sm">Stripe Sovereign Elements (International Cards)</div>
                <div className="text-xs text-zinc-400 font-mono">Public: {paymentsConfig.stripePublishableKey}</div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAX & GST */}
      {subSection === 'settings-tax' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              GST / VAT taxation rules, precious metals HSN codes, and compliance categories.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">HSN Code</th>
                  <th className="py-3 px-4">Tax Classification</th>
                  <th className="py-3 px-4">GST Rate</th>
                  <th className="py-3 px-4">Applies To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 font-mono text-xs">
                {taxSlabs.map(slab => (
                  <tr key={slab.code} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 text-amber-400 font-bold">{slab.code}</td>
                    <td className="py-3 px-4 font-sans text-zinc-100">{slab.category}</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">{slab.rate}% GST</td>
                    <td className="py-3 px-4 text-zinc-400">{slab.appliesTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. STAFF MANAGEMENT */}
      {subSection === 'settings-staff' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Administrative team members with granular RBAC enforcement and 2FA authentication state.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">2FA Security</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {staffMembers.map(staff => (
                  <tr key={staff.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={staff.avatarUrl} alt={staff.name} className="w-8 h-8 rounded-full object-cover border border-zinc-700" />
                        <div>
                          <div className="font-medium text-zinc-100 text-sm">{staff.name}</div>
                          <div className="text-xs text-zinc-500 font-mono">{staff.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20">
                        {staff.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-400">{staff.department}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                        staff.twoFactorEnabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-500 bg-zinc-800'
                      }`}>
                        {staff.twoFactorEnabled ? '2FA Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-400 font-mono">
                      {staff.lastLoginAt ? new Date(staff.lastLoginAt).toLocaleTimeString() : 'Never'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 font-mono uppercase">
                        {staff.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. ROLES DEFINITION */}
      {subSection === 'settings-roles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Role definitions and system authorization tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rolesList.map(role => (
              <div key={role.id} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-zinc-100 text-base">{role.name}</h4>
                  <span className="text-xs font-mono text-amber-400 font-bold">{role.permissions.length} Permissions</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{role.description}</p>
                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span>Role Key: {role.roleKey}</span>
                  <span>{role.memberCount} Staff Assigned</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. RBAC PERMISSIONS MATRIX */}
      {subSection === 'settings-permissions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div>
              <h4 className="font-serif font-bold text-zinc-100">Granular Server Permissions Matrix</h4>
              <p className="text-xs text-zinc-400">
                Server-enforced RBAC gates. Operations fail on Supabase/backend if unauthorized.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-zinc-400">Select Role:</label>
              <select
                value={selectedMatrixRole}
                onChange={(e) => setSelectedMatrixRole(e.target.value as AdminRole)}
                className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-400 text-xs font-mono font-bold focus:outline-none"
              >
                <option value="super_admin">Super Administrator</option>
                <option value="admin">Store Administrator</option>
                <option value="manager">Operations Manager</option>
                <option value="support_agent">Support Concierge</option>
                <option value="fulfillment_specialist">Fulfillment Specialist</option>
                <option value="marketing_lead">Marketing Lead</option>
                <option value="financial_controller">Financial Controller</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Permission Key</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Access State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {ADMIN_PERMISSIONS_LIST.map(permDef => {
                  const isGranted = (rolePermissionsMatrix[selectedMatrixRole] || []).includes(permDef.key);
                  return (
                    <tr key={permDef.key} className="hover:bg-zinc-800/40">
                      <td className="py-3 px-4">
                        <div className="font-mono text-xs font-bold text-amber-400">{permDef.key}</div>
                        <div className="text-xs text-zinc-300 font-medium">{permDef.label}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800 text-zinc-400">
                          {permDef.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-zinc-400">{permDef.description}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          disabled={selectedMatrixRole === 'super_admin'}
                          onClick={() => handleTogglePermission(selectedMatrixRole, permDef.key)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                            isGranted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                          }`}
                        >
                          {isGranted ? 'GRANTED' : 'DENIED'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. AUDIT LOGS */}
      {subSection === 'settings-audit-logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Immutable audit trail of administrative modifications, security checks, and permission denials.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Admin Email</th>
                  <th className="py-3 px-4">Action Key</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Authorization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 font-mono text-xs">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 text-zinc-400">{new Date(log.createdAt).toLocaleTimeString()}</td>
                    <td className="py-3 px-4 font-bold text-zinc-200">{log.adminEmail}</td>
                    <td className="py-3 px-4 text-amber-400">{log.action}</td>
                    <td className="py-3 px-4 text-zinc-300">{log.resourceType}:{log.resourceId}</td>
                    <td className="py-3 px-4 text-zinc-500">{log.ipAddress}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'ALLOWED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
