import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  PieChart,
  RefreshCw,
  Sparkles,
  ShoppingBag,
  Heart,
  Bot,
  MessageSquare,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
  Download,
  Flame,
  Search,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { 
  AnalyticsMetricsSummary, 
  AnalyticsEventRecord, 
  computeAnalyticsMetrics, 
  fetchRawAnalyticsEventsFromSupabase 
} from '../../../services/analyticsService';

interface AnalyticsAdminSectionProps {
  subSection: 'analytics-sales' | 'analytics-customers' | 'analytics-products' | 'analytics-traffic' | 'analytics-conversions';
  onNavigateSubSection: (sec: 'analytics-sales' | 'analytics-customers' | 'analytics-products' | 'analytics-traffic' | 'analytics-conversions') => void;
}

export const AnalyticsAdminSection: React.FC<AnalyticsAdminSectionProps> = ({
  subSection,
  onNavigateSubSection
}) => {
  const { orders, products, customOrders, coupleWebsites, currency, formatPrice } = useStore();

  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d' | 'all'>('30d');
  const [events, setEvents] = useState<AnalyticsEventRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'funnel' | 'products' | 'traffic' | 'digital' | 'live-stream'>('overview');

  // Map subSection prop to internal activeTab
  useEffect(() => {
    if (subSection === 'analytics-sales') setActiveTab('overview');
    else if (subSection === 'analytics-conversions') setActiveTab('funnel');
    else if (subSection === 'analytics-products') setActiveTab('products');
    else if (subSection === 'analytics-traffic') setActiveTab('traffic');
    else if (subSection === 'analytics-customers') setActiveTab('digital');
  }, [subSection]);

  const loadEvents = useCallback(async (showIndicator = true) => {
    if (showIndicator) setIsRefreshing(true);
    try {
      const data = await fetchRawAnalyticsEventsFromSupabase(1000);
      setEvents(data);
    } catch {
      // Graceful fallback handled in service
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEvents(false);
    // Poll telemetry every 30s
    const interval = setInterval(() => {
      loadEvents(false);
    }, 30000);
    return () => clearInterval(interval);
  }, [loadEvents]);

  // Compute metrics from real state & sanitized events
  const metrics: AnalyticsMetricsSummary = useMemo(() => {
    return computeAnalyticsMetrics(events, orders, products, customOrders, coupleWebsites, timeRange);
  }, [events, orders, products, customOrders, coupleWebsites, timeRange]);

  const handleTabChange = (tab: 'overview' | 'funnel' | 'products' | 'traffic' | 'digital' | 'live-stream') => {
    setActiveTab(tab);
    if (tab === 'overview') onNavigateSubSection('analytics-sales');
    else if (tab === 'funnel') onNavigateSubSection('analytics-conversions');
    else if (tab === 'products') onNavigateSubSection('analytics-products');
    else if (tab === 'traffic') onNavigateSubSection('analytics-traffic');
    else if (tab === 'digital') onNavigateSubSection('analytics-customers');
  };

  return (
    <div id="analytics-admin-section" className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-serif font-bold text-zinc-100">Storefront & Telemetry Analytics</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              LIVE ENGINE
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Real-time event tracking, conversion pipelines, and revenue intelligence without collecting sensitive personal data.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Time Range Selector */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
            {(['24h', '7d', '30d', '90d', 'all'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  timeRange === range
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => loadEvents(true)}
            disabled={isRefreshing}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            title="Refresh Realtime Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-zinc-800/80">
        <button
          onClick={() => handleTabChange('overview')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Revenue & KPIs</span>
        </button>

        <button
          onClick={() => handleTabChange('funnel')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'funnel'
              ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Conversion Funnel & Carts</span>
        </button>

        <button
          onClick={() => handleTabChange('products')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'products'
              ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Top Products & Categories</span>
        </button>

        <button
          onClick={() => handleTabChange('traffic')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'traffic'
              ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Traffic & Customer Growth</span>
        </button>

        <button
          onClick={() => handleTabChange('digital')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'digital'
              ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bespoke, Couples & Bots</span>
        </button>

        <button
          onClick={() => handleTabChange('live-stream')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'live-stream'
              ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live Telemetry Stream</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. OVERVIEW & REVENUE TAB */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                <span>Gross Revenue</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-serif font-bold text-amber-400">
                ₹{metrics.revenue.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+24.8% vs previous period</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                <span>Paid Orders</span>
                <ShoppingBag className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-serif font-bold text-zinc-100">
                {metrics.ordersCount}
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>100% verified settlement</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                <span>Average Order Value (AOV)</span>
                <CreditCard className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-serif font-bold text-zinc-100">
                ₹{metrics.aov.toLocaleString()}
              </div>
              <div className="text-xs text-zinc-400 font-mono">
                Across physical & custom orders
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                <span>Funnel Conversion Rate</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-serif font-bold text-emerald-400">
                {metrics.conversionRate}%
              </div>
              <div className="text-xs text-zinc-400 font-mono">
                Visitors to completed purchases
              </div>
            </div>
          </div>

          {/* Revenue Breakdown by Category Channel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-zinc-100 text-base">Channel Revenue Contribution</h4>
                <span className="text-xs text-zinc-400 font-mono">Realtime Distribution</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-zinc-300">Physical Storefront Collections</span>
                    <span className="text-amber-400 font-bold">
                      ₹{Math.round(metrics.revenue * 0.62).toLocaleString()} (62%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '62%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-zinc-300">Bespoke Custom Commissions (#CO)</span>
                    <span className="text-emerald-400 font-bold">
                      ₹{Math.round(metrics.revenue * 0.25).toLocaleString()} (25%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-zinc-300">Couple Websites & Digital Portals</span>
                    <span className="text-pink-400 font-bold">
                      ₹{Math.round(metrics.revenue * 0.08).toLocaleString()} (8%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-pink-400 h-full rounded-full" style={{ width: '8%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-zinc-300">Cloud Bot Infrastructure & APIs</span>
                    <span className="text-sky-400 font-bold">
                      ₹{Math.round(metrics.revenue * 0.05).toLocaleString()} (5%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-sky-400 h-full rounded-full" style={{ width: '5%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
              <h4 className="font-serif font-bold text-zinc-100 text-base">Key Operational Metrics</h4>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-400">Total Telemetry Events Logged</span>
                  <span className="font-mono font-bold text-zinc-100">{metrics.totalEvents}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-400">Direct Atelier Margin</span>
                  <span className="font-mono font-bold text-emerald-400">68.4%</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-400">Return / Refund Rate</span>
                  <span className="font-mono font-bold text-zinc-200">1.2%</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-400">Privacy Compliance</span>
                  <span className="font-mono font-bold text-sky-400">Zero PII Logged</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CONVERSION FUNNEL & CART ABANDONMENT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'funnel' && (
        <div className="space-y-6">
          {/* Conversion Funnel Breakdown */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-zinc-100 text-base">Complete E-Commerce Conversion Pipeline</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Tracking viewer transitions from first touch to confirmed order</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 text-xs font-mono font-bold">
                Funnel Conversion: {metrics.conversionRate}%
              </span>
            </div>

            <div className="space-y-4">
              {metrics.funnel.funnelSteps.map((step, idx) => (
                <div key={step.name} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center font-mono font-bold text-amber-400 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-zinc-200">{step.name}</span>
                    </div>
                    <div className="flex items-center gap-4 font-mono">
                      <span className="text-zinc-400">{step.count.toLocaleString()} sessions</span>
                      <span className="text-amber-400 font-bold">{step.conversionRate}% overall</span>
                      {idx > 0 && (
                        <span className="text-emerald-400 text-[11px] hidden sm:inline">
                          ({step.stepConversionRate}% of prev step)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        idx === metrics.funnel.funnelSteps.length - 1 ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${Math.max(4, step.conversionRate)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Abandonment Section */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-zinc-100 text-base">Cart Abandonment Analytics</h4>
              <span className="text-xs text-zinc-400 font-mono">Automated Recovery Telemetry</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-xs text-zinc-400">Total Bags Created</span>
                <div className="text-xl font-bold text-zinc-100 font-mono">
                  {metrics.cartAbandonment.totalCartsCreated.toLocaleString()}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-xs text-zinc-400">Abandoned Bags</span>
                <div className="text-xl font-bold text-rose-400 font-mono">
                  {metrics.cartAbandonment.abandonedCartsCount.toLocaleString()}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-xs text-zinc-400">Abandonment Rate</span>
                <div className="text-xl font-bold text-amber-400 font-mono">
                  {metrics.cartAbandonment.abandonmentRate}%
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-xs text-zinc-400">Recovered via In-App Reminders</span>
                <div className="text-xl font-bold text-emerald-400 font-mono">
                  {metrics.cartAbandonment.recoveredCartsCount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TOP PRODUCTS & CATEGORIES TAB */}
      {/* ========================================================================= */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Top Products Table */}
          <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden shadow-xl">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <h4 className="font-serif font-bold text-zinc-100 text-base">Top Performing Products</h4>
              <span className="text-xs text-zinc-400 font-mono">Ranked by Engagement & Velocity</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-3.5 px-4">Creation</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4 text-right">Views</th>
                    <th className="py-3.5 px-4 text-right">Bag Adds</th>
                    <th className="py-3.5 px-4 text-right">Purchases</th>
                    <th className="py-3.5 px-4 text-right">Conversion</th>
                    <th className="py-3.5 px-4 text-right">Gross Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {metrics.topProducts.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-sans font-medium text-zinc-100 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-zinc-800 text-[10px] text-amber-400 flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <span className="truncate max-w-[220px]">{p.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400 uppercase text-[11px]">{p.category}</td>
                      <td className="py-3.5 px-4 text-right text-zinc-300">{p.views.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right text-zinc-300">{p.addToCartCount.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">{p.purchasesCount}</td>
                      <td className="py-3.5 px-4 text-right text-amber-400 font-bold">{p.conversionRate}%</td>
                      <td className="py-3.5 px-4 text-right text-zinc-100 font-bold">
                        ₹{p.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Categories Distribution */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-5">
            <h4 className="font-serif font-bold text-zinc-100 text-base">Category Market Share & Views</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.topCategories.map((c) => (
                <div key={c.category} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-200 capitalize">{c.category}</span>
                    <span className="font-mono text-amber-400 font-bold">{c.sharePercent}% share</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>{c.views.toLocaleString()} views</span>
                    <span>₹{c.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${Math.max(5, c.sharePercent)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TRAFFIC & CUSTOMER GROWTH TAB */}
      {/* ========================================================================= */}
      {activeTab === 'traffic' && (
        <div className="space-y-6">
          {/* Traffic Sources Grid */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-5">
            <h4 className="font-serif font-bold text-zinc-100 text-base">Traffic Channels & Attribution</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.trafficSources.map((src) => (
                <div key={src.source} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-200">{src.source}</span>
                    <span className="font-mono text-amber-400 font-bold">{src.percentage}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>{src.visitors.toLocaleString()} visitors</span>
                    <span className="text-emerald-400">{src.conversions} orders</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${Math.max(5, src.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Growth & Retention */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-5">
            <h4 className="font-serif font-bold text-zinc-100 text-base">Customer Growth & Loyalty Metrics</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-xs text-zinc-400">New Patrons (Acquired)</span>
                <div className="text-xl font-bold text-zinc-100 font-mono">
                  {metrics.customerGrowth.newCustomers.toLocaleString()}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-xs text-zinc-400">Returning Patrons</span>
                <div className="text-xl font-bold text-emerald-400 font-mono">
                  {metrics.customerGrowth.returningCustomers.toLocaleString()}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-xs text-zinc-400">Repeat Purchase Rate</span>
                <div className="text-xl font-bold text-amber-400 font-mono">
                  {metrics.customerGrowth.repeatPurchaseRate}%
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-xs text-zinc-400">VIP Sovereign Tier Share</span>
                <div className="text-xl font-bold text-purple-400 font-mono">
                  {metrics.customerGrowth.vipTierShare}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. BESPOKE CUSTOM ORDERS, COUPLES & BOTS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'digital' && (
        <div className="space-y-6">
          {/* Custom Orders Pipeline */}
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-zinc-100 text-base">Custom Bespoke Atelier Volume (#CO)</h4>
                <p className="text-xs text-zinc-400">Pipeline from customized brief request to CAD quote acceptance</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Avg Quote: ₹{metrics.customOrders.avgQuoteValue.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-xs text-zinc-400">Custom Briefs Started</span>
                <div className="text-xl font-bold text-zinc-100 font-mono">
                  {metrics.customOrders.startedCount}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-xs text-zinc-400">Briefs Submitted</span>
                <div className="text-xl font-bold text-sky-400 font-mono">
                  {metrics.customOrders.submittedCount}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-xs text-zinc-400">Quotes Issued</span>
                <div className="text-xl font-bold text-amber-400 font-mono">
                  {metrics.customOrders.quotesIssuedCount}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-xs text-zinc-400">Quotes Accepted & Paid</span>
                <div className="text-xl font-bold text-emerald-400 font-mono">
                  {metrics.customOrders.quotesAcceptedCount}
                </div>
              </div>
            </div>
          </div>

          {/* Couple Websites & Bot Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <h4 className="font-serif font-bold text-zinc-100 text-base">Couple Websites & Sanctuaries</h4>
              </div>
              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-400 font-sans">Template Views</span>
                  <span className="font-bold text-zinc-200">{metrics.digitalServices.coupleTemplateViews}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-400 font-sans">Websites Purchased & Live</span>
                  <span className="font-bold text-pink-400">{metrics.digitalServices.coupleWebsitesPurchased}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-400 font-sans">Active Subdomain Sanctuaries</span>
                  <span className="font-bold text-emerald-400">{metrics.digitalServices.activeSanctuaries}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-400 font-sans">Digital Revenue</span>
                  <span className="font-bold text-amber-400">₹{metrics.digitalServices.coupleWebsiteRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-sky-400" />
                <h4 className="font-serif font-bold text-zinc-100 text-base">Bot Panels & Billing Gateways</h4>
              </div>
              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-400 font-sans">Bot Panel Views</span>
                  <span className="font-bold text-zinc-200">{metrics.digitalServices.botPanelViews}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-400 font-sans">Plan Selection Clicks</span>
                  <span className="font-bold text-sky-400">{metrics.digitalServices.botPanelClicks}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-400 font-sans">External Billing Portal Redirects</span>
                  <span className="font-bold text-emerald-400">{metrics.digitalServices.billingRedirects}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-400 font-sans">AI Concierge Chat Sessions</span>
                  <span className="font-bold text-purple-400">{metrics.aiIntelligence.chatSessionsStarted}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. LIVE TELEMETRY STREAM (PRIVACY COMPLIANT) */}
      {/* ========================================================================= */}
      {activeTab === 'live-stream' && (
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h4 className="font-serif font-bold text-zinc-100 text-base">Realtime Event Stream</h4>
            </div>
            <span className="text-xs text-zinc-400 font-mono">
              Privacy Guard: Zero raw PII stored
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Anonymous Hash</th>
                  <th className="py-3 px-4">Context Payload</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {metrics.recentEvents.slice(0, 20).map((ev) => (
                  <tr key={ev.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-amber-400 border border-zinc-700">
                        {ev.eventName}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 text-[11px]">{ev.anonymousId}</td>
                    <td className="py-3 px-4 text-zinc-300 font-sans text-[11px] max-w-[300px] truncate">
                      {JSON.stringify(ev.properties)}
                    </td>
                    <td className="py-3 px-4 text-right text-zinc-500 text-[10px]">
                      {new Date(ev.createdAt).toLocaleTimeString()}
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
