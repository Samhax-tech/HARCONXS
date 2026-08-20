import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package, 
  Globe, 
  Filter, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  CreditCard,
  Eye,
  PieChart
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';

interface AnalyticsAdminSectionProps {
  subSection: 'analytics-sales' | 'analytics-customers' | 'analytics-products' | 'analytics-traffic' | 'analytics-conversions';
  onNavigateSubSection: (sec: 'analytics-sales' | 'analytics-customers' | 'analytics-products' | 'analytics-traffic' | 'analytics-conversions') => void;
}

export const AnalyticsAdminSection: React.FC<AnalyticsAdminSectionProps> = ({
  subSection,
  onNavigateSubSection
}) => {
  const { orders, products } = useStore();

  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 148500;
  const avgOrderValue = Math.round(totalSales / (orders.length || 1));

  return (
    <div id="analytics-admin-section" className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            id="tab-analytics-sales"
            onClick={() => onNavigateSubSection('analytics-sales')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'analytics-sales' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Sales & Revenue
          </button>
          <button
            id="tab-analytics-customers"
            onClick={() => onNavigateSubSection('analytics-customers')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'analytics-customers' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Customers & LTV
          </button>
          <button
            id="tab-analytics-products"
            onClick={() => onNavigateSubSection('analytics-products')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'analytics-products' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Package className="w-4 h-4" />
            Product Velocity
          </button>
          <button
            id="tab-analytics-traffic"
            onClick={() => onNavigateSubSection('analytics-traffic')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'analytics-traffic' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            Traffic & Sources
          </button>
          <button
            id="tab-analytics-conversions"
            onClick={() => onNavigateSubSection('analytics-conversions')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'analytics-conversions' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Checkout Funnels
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Server RBAC Protected
          </span>
        </div>
      </div>

      {/* 1. SALES ANALYTICS */}
      {subSection === 'analytics-sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400 font-medium">Gross Revenue</div>
              <div className="text-2xl font-serif font-bold text-amber-400 mt-1">₹{totalSales.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2 font-mono">
                <ArrowUpRight className="w-3.5 h-3.5" /> +24.8% vs last month
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400 font-medium">Average Order Value (AOV)</div>
              <div className="text-2xl font-serif font-bold text-zinc-100 mt-1">₹{avgOrderValue.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2 font-mono">
                <ArrowUpRight className="w-3.5 h-3.5" /> +12.4%
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400 font-medium">Net Profit Margin</div>
              <div className="text-2xl font-serif font-bold text-emerald-400 mt-1">68.4%</div>
              <div className="text-xs text-zinc-500 mt-2 font-mono">Direct Atelier Margin</div>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400 font-medium">Refund / Return Rate</div>
              <div className="text-2xl font-serif font-bold text-zinc-100 mt-1">1.2%</div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2 font-mono">
                <ArrowDownRight className="w-3.5 h-3.5" /> -0.4% (Elite Craftsmanship)
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h4 className="font-serif font-bold text-zinc-100">Revenue by Channel</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-400">Direct Storefront:</span>
                <div className="text-lg font-bold text-amber-400 mt-1">64% (₹95,040)</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-400">Custom Bespoke Atelier:</span>
                <div className="text-lg font-bold text-emerald-400 mt-1">26% (₹38,610)</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-400">Couple Websites & Bots:</span>
                <div className="text-lg font-bold text-purple-400 mt-1">10% (₹14,850)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CUSTOMER ANALYTICS */}
      {subSection === 'analytics-customers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400">Customer Repeat Rate</div>
              <div className="text-2xl font-serif font-bold text-amber-400 mt-1">42.8%</div>
              <div className="text-xs text-zinc-500 mt-2">Patrons ordering 2+ times</div>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400">Customer Acquisition Cost (CAC)</div>
              <div className="text-2xl font-serif font-bold text-zinc-100 mt-1">₹420</div>
              <div className="text-xs text-emerald-400 mt-2 font-mono">LTV:CAC Ratio 18.2x</div>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400">Sovereign Tier Share</div>
              <div className="text-2xl font-serif font-bold text-purple-400 mt-1">31.4%</div>
              <div className="text-xs text-zinc-500 mt-2">Revenue from VIPs</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRODUCT VELOCITY */}
      {subSection === 'analytics-products' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Units Sold (30d)</th>
                  <th className="py-3 px-4">Gross Revenue</th>
                  <th className="py-3 px-4">Turnover Velocity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {products.slice(0, 5).map((p, idx) => (
                  <tr key={p.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-medium text-zinc-100">{p.name}</td>
                    <td className="py-3 px-4 text-xs font-mono text-zinc-400 uppercase">{p.category}</td>
                    <td className="py-3 px-4 font-mono font-bold text-zinc-200">{42 - idx * 7} units</td>
                    <td className="py-3 px-4 font-mono text-amber-400 font-bold">₹{((42 - idx * 7) * p.price).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 font-mono">
                        High Velocity
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TRAFFIC & SOURCES */}
      {subSection === 'analytics-traffic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400">Total Unique Sessions</div>
              <div className="text-xl font-serif font-bold text-zinc-100 mt-1">28,450</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400">Direct Brand Traffic</div>
              <div className="text-xl font-serif font-bold text-amber-400 mt-1">54.2%</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400">Organic Luxury Search</div>
              <div className="text-xl font-serif font-bold text-emerald-400 mt-1">28.6%</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400">Social & Influencers</div>
              <div className="text-xl font-serif font-bold text-purple-400 mt-1">17.2%</div>
            </div>
          </div>
        </div>
      )}

      {/* 5. CONVERSIONS FUNNEL */}
      {subSection === 'analytics-conversions' && (
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <h4 className="font-serif font-bold text-zinc-100">Checkout Conversion Pipeline</h4>
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <span>1. Total Store Visitors</span>
              <strong className="text-zinc-200">28,450 (100%)</strong>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <span>2. Product Detail Views</span>
              <strong className="text-zinc-200">14,220 (50.0%)</strong>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <span>3. Added to Cart</span>
              <strong className="text-zinc-200">3,414 (12.0%)</strong>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <span>4. Checkout Initiated</span>
              <strong className="text-amber-400">2,130 (7.5%)</strong>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-emerald-500/30 bg-emerald-500/5">
              <span className="text-emerald-400 font-bold">5. Completed Sovereign Orders</span>
              <strong className="text-emerald-400 font-bold">1,024 (3.6% Store Conversion)</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
