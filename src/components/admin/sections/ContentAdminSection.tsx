import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  ExternalLink, 
  HelpCircle, 
  ShieldCheck, 
  Globe, 
  Code, 
  Layers, 
  Sparkles, 
  Eye, 
  Edit3, 
  CheckCircle2,
  Share2,
  Download,
  Copy,
  ShoppingBag,
  Check,
  RefreshCw,
  Tag,
  AlertCircle,
  FileCode,
  Smartphone,
  Monitor
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { enforceServerSidePermission } from '../../../services/adminAuthService';
import { Product } from '../../../types';
import {
  generateGoogleMerchantCenterFeedXml,
  generateGoogleMerchantCenterFeedTsv,
  generateSitemapXml,
  generateRobotsTxt,
  generateProductJsonLd,
  generateOrganizationJsonLd,
  DEFAULT_SITE_URL
} from '../../../services/seoService';

interface ContentAdminSectionProps {
  subSection: 'pages' | 'page-builder' | 'faq' | 'policies' | 'seo';
  onNavigateSubSection: (sec: 'pages' | 'page-builder' | 'faq' | 'policies' | 'seo') => void;
  onOpenPageBuilder: (pageSlug: string) => void;
}

export const ContentAdminSection: React.FC<ContentAdminSectionProps> = ({
  subSection,
  onNavigateSubSection,
  onOpenPageBuilder
}) => {
  const { showToast, products, updateProductInCatalog, activePageRecord } = useStore();

  // Pages list
  const [pagesList, setPagesList] = useState([
    {
      id: 'page-home',
      title: 'Storefront Homepage',
      slug: 'home',
      status: 'published',
      sectionsCount: 16,
      updatedAt: '2026-02-19T14:30:00Z'
    },
    {
      id: 'page-shop',
      title: 'Haute Catalog & Collections',
      slug: 'shop',
      status: 'published',
      sectionsCount: 10,
      updatedAt: '2026-02-18T10:15:00Z'
    },
    {
      id: 'page-story',
      title: 'Heritage & Sovereign Atelier',
      slug: 'heritage',
      status: 'published',
      sectionsCount: 8,
      updatedAt: '2026-02-15T11:20:00Z'
    },
    {
      id: 'page-custom-landing',
      title: 'Bespoke Custom Orders Experience',
      slug: 'custom-atelier',
      status: 'draft',
      sectionsCount: 6,
      updatedAt: '2026-02-18T09:00:00Z'
    }
  ]);

  // FAQs
  const [faqs, setFaqs] = useState([
    {
      id: 'faq-1',
      category: 'Bespoke Crafting',
      question: 'How long does a custom CAD commission take to cast and polish?',
      answer: 'From 3D CAD design approval to casting in solid 18K gold/platinum and high-mirror polishing, our master artisans typically require 10 to 14 business days.'
    },
    {
      id: 'faq-2',
      category: 'Shipping & Insurance',
      question: 'Are high-value vault shipments fully insured during transit?',
      answer: 'Yes. Every HARCONXS dispatch travels via priority armored courier (BlueDart Air Express / FedEx) with 100% comprehensive sovereign cargo transit insurance.'
    },
    {
      id: 'faq-3',
      category: 'Warranty & Sizing',
      question: 'Do you offer complimentary ring resizing for wedding sets?',
      answer: 'All Sovereign and VIP patron ring sets include one complimentary sizing adjustment within 60 days of delivery.'
    }
  ]);

  // Policies
  const [policies, setPolicies] = useState({
    tos: `HARCONXS TERMS OF SOVEREIGN SERVICE\n\n1. Atelier Commissions: All bespoke custom jewelry is crafted specifically to client specifications upon deposit confirmation.\n2. Intellectual Property: All CAD models, website themes, and bot panel architectures remain protected by HARCONXS Atelier.`,
    privacy: `HARCONXS PRIVACY & DATA POLICY\n\nWe respect the sovereignty and confidentiality of our patrons. Personal identifiable information, addresses, and custom engravings are cryptographically protected and never sold to third parties.`,
    shipping: `SOVEREIGN INSURED SHIPPING POLICY\n\nComplimentary insured air shipping applies to all qualifying orders across India and international destinations. Dispatches feature tamper-proof velvet security packaging.`
  });

  // SEO Config
  const [seoConfig, setSeoConfig] = useState({
    metaTitle: 'HARCONXS — Royal Couples Sanctuary & Sovereign Atelier',
    metaDescription: 'Discover handcrafted bespoke luxury jewellery, titanium keepsakes, digital couple websites, and automated e-commerce bot services.',
    ogImageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200&auto=format&fit=crop&q=80',
    canonicalUrl: 'https://harconxs.com',
    schemaType: 'JewelryStore'
  });

  // SEO & Merchant Center specific state
  const [seoSubTab, setSeoSubTab] = useState<'merchant' | 'sitemap' | 'robots' | 'product_seo' | 'jsonld'>('merchant');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Selected Product for editing
  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleCopy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      showToast(`Copied ${key} to clipboard!`);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enforceServerSidePermission('content:seo', 'seo_config');
      showToast('SEO & Merchant schema configuration synchronized.');
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: SEO configuration requires content lead role.');
    }
  };

  const handleSaveProductSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      await enforceServerSidePermission('content:seo', 'product_seo', selectedProduct.id);
      showToast(`Saved SEO & Merchant Center attributes for "${selectedProduct.name}".`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Product SEO update requires content role.');
    }
  };

  const handleSavePolicy = async (policyKey: string) => {
    try {
      await enforceServerSidePermission('content:policies', 'store_policy', policyKey);
      showToast(`Policy "${policyKey.toUpperCase()}" updated successfully.`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Store policy updates require admin role.');
    }
  };

  const handleDownloadTsv = () => {
    const tsv = generateGoogleMerchantCenterFeedTsv(products, window.location.origin || DEFAULT_SITE_URL);
    const blob = new Blob([tsv], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'harconxs_google_merchant_feed.tsv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded Google Merchant Center TSV feed.');
  };

  const handleDownloadSitemap = () => {
    const xml = generateSitemapXml(products, window.location.origin || DEFAULT_SITE_URL);
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sitemap.xml');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded sitemap.xml.');
  };

  return (
    <div id="content-admin-section" className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            id="tab-content-pages"
            onClick={() => onNavigateSubSection('pages')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'pages' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            CMS Pages ({pagesList.length})
          </button>
          <button
            id="tab-content-pagebuilder"
            onClick={() => onNavigateSubSection('page-builder')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'page-builder' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Visual Page Studio (/edit-page)
          </button>
          <button
            id="tab-content-faq"
            onClick={() => onNavigateSubSection('faq')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'faq' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            FAQ &amp; Knowledge Base ({faqs.length})
          </button>
          <button
            id="tab-content-policies"
            onClick={() => onNavigateSubSection('policies')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'policies' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Store Policies
          </button>
          <button
            id="tab-content-seo"
            onClick={() => onNavigateSubSection('seo')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'seo' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            SEO &amp; Merchant Center
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Server RBAC Protected
          </span>
        </div>
      </div>

      {/* 1. PAGES SUBSECTION */}
      {subSection === 'pages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Manage website page records, publication status, and open direct visual editing sessions.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Page Title</th>
                  <th className="py-3 px-4">Route Path</th>
                  <th className="py-3 px-4">Sections</th>
                  <th className="py-3 px-4">Last Modified</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {pagesList.map((pg) => (
                  <tr key={pg.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-zinc-100">{pg.title}</td>
                    <td className="py-3 px-4 font-mono text-xs text-zinc-400">/{pg.slug}</td>
                    <td className="py-3 px-4 text-xs text-zinc-400">{pg.sectionsCount} modules</td>
                    <td className="py-3 px-4 text-xs text-zinc-500">{new Date(pg.updatedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        pg.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {pg.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onOpenPageBuilder(pg.slug)}
                        className="px-3 py-1.5 rounded-lg bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Edit Page</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. PAGE BUILDER REDIRECT */}
      {subSection === 'page-builder' && (
        <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-zinc-100">Live Atelier Visual Studio</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Launch the dedicated visual editor at <code className="text-amber-400 font-mono">/edit-page</code> to modify sections, live preview across desktop/tablet/mobile, and push revisions to Supabase.
            </p>
          </div>
          <button
            onClick={() => onOpenPageBuilder('home')}
            className="px-6 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-sm hover:bg-amber-300 shadow-lg shadow-amber-400/20 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Visual Studio</span>
          </button>
        </div>
      )}

      {/* 3. FAQ SUBSECTION */}
      {subSection === 'faq' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">Client-facing knowledge articles, laser customization guides, and courier policies.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-amber-400">{faq.category}</span>
                </div>
                <h4 className="font-semibold text-sm text-zinc-100">{faq.question}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. POLICIES SUBSECTION */}
      {subSection === 'policies' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-zinc-100">Terms of Sovereign Service</h4>
              <button
                onClick={() => handleSavePolicy('tos')}
                className="px-3 py-1.5 rounded-lg bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
              >
                Save Policy
              </button>
            </div>
            <textarea
              rows={4}
              value={policies.tos}
              onChange={(e) => setPolicies(prev => ({ ...prev, tos: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono focus:border-amber-400"
            />
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-zinc-100">Privacy &amp; Data Confidentiality</h4>
              <button
                onClick={() => handleSavePolicy('privacy')}
                className="px-3 py-1.5 rounded-lg bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
              >
                Save Policy
              </button>
            </div>
            <textarea
              rows={4}
              value={policies.privacy}
              onChange={(e) => setPolicies(prev => ({ ...prev, privacy: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono focus:border-amber-400"
            />
          </div>
        </div>
      )}

      {/* 5. PRODUCTION SEO & GOOGLE MERCHANT CENTER COMMAND CENTER */}
      {subSection === 'seo' && (
        <div className="space-y-6">
          {/* SEO Inner Navigation */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-x-auto">
            <button
              onClick={() => setSeoSubTab('merchant')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                seoSubTab === 'merchant' ? 'bg-amber-400 text-zinc-950 font-bold shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Google Merchant Center Feed
            </button>
            <button
              onClick={() => setSeoSubTab('product_seo')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                seoSubTab === 'product_seo' ? 'bg-amber-400 text-zinc-950 font-bold shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              Product SEO &amp; SERP Simulator
            </button>
            <button
              onClick={() => setSeoSubTab('sitemap')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                seoSubTab === 'sitemap' ? 'bg-amber-400 text-zinc-950 font-bold shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Sitemap.xml
            </button>
            <button
              onClick={() => setSeoSubTab('robots')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                seoSubTab === 'robots' ? 'bg-amber-400 text-zinc-950 font-bold shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Robots.txt
            </button>
            <button
              onClick={() => setSeoSubTab('jsonld')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                seoSubTab === 'jsonld' ? 'bg-amber-400 text-zinc-950 font-bold shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              Schema.org JSON-LD
            </button>
          </div>

          {/* 5.1 GOOGLE MERCHANT CENTER MODULE */}
          {seoSubTab === 'merchant' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-zinc-100 text-base flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-amber-400" />
                      Live Google Merchant Center Shopping Feed
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Real-time Google Shopping XML &amp; TSV feeds generated from Supabase products. Includes required attributes: id, title, description, link, image_link, availability, price, condition, brand, gtin, google_product_category.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadTsv}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download TSV
                    </button>
                  </div>
                </div>

                {/* Feed URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-300">Live RSS 2.0 XML Feed URL</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={`${window.location.origin}/feeds/google-merchant.xml`}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-300 font-mono text-xs select-all"
                      />
                      <button
                        onClick={() => handleCopy(`${window.location.origin}/feeds/google-merchant.xml`, 'XML Feed URL')}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                      >
                        {copiedKey === 'XML Feed URL' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-500">Provide this direct URL in Google Merchant Center &gt; Products &gt; Feeds &gt; Primary feeds.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-300">Spreadsheet TSV Export URL</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">TSV / Tab-Delimited</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={`${window.location.origin}/feeds/google-merchant.tsv`}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-300 font-mono text-xs select-all"
                      />
                      <button
                        onClick={() => handleCopy(`${window.location.origin}/feeds/google-merchant.tsv`, 'TSV Feed URL')}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                      >
                        {copiedKey === 'TSV Feed URL' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-500">Compatible with Google Sheets, Facebook Catalog Manager, and Microsoft Advertising.</p>
                  </div>
                </div>

                {/* Feed Diagnostics */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Feed Audit &amp; Compliance Status</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                      <span className="text-xs text-zinc-500 block">Total Catalog Items</span>
                      <span className="text-lg font-bold font-mono text-zinc-100">{products.length}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                      <span className="text-xs text-zinc-500 block">In-Stock Active</span>
                      <span className="text-lg font-bold font-mono text-emerald-400">
                        {products.filter(p => p.inventory > 0).length}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                      <span className="text-xs text-zinc-500 block">Valid GTIN / Barcode</span>
                      <span className="text-lg font-bold font-mono text-amber-400">
                        {products.filter(p => p.gtin || p.barcode).length}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                      <span className="text-xs text-zinc-500 block">Google Category Mapped</span>
                      <span className="text-lg font-bold font-mono text-sky-400">
                        {products.filter(p => p.googleProductCategory).length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Raw Feed XML Code Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300">Generated XML Output (First 5 Items)</span>
                    <button
                      onClick={() => handleCopy(generateGoogleMerchantCenterFeedXml(products.slice(0, 5), window.location.origin || DEFAULT_SITE_URL), 'Merchant XML')}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> Copy XML
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs overflow-x-auto max-h-64 scrollbar-thin">
                    {generateGoogleMerchantCenterFeedXml(products.slice(0, 5), window.location.origin || DEFAULT_SITE_URL)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* 5.2 PRODUCT SEO & SERP SIMULATOR */}
          {seoSubTab === 'product_seo' && (
            <div className="space-y-6">
              {/* Product Selector */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="font-semibold text-sm text-zinc-100">Select Product to Audit &amp; Optimize</h4>
                    <p className="text-xs text-zinc-400">Edit metadata, OpenGraph tags, and Google Shopping attributes.</p>
                  </div>
                </div>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs font-medium focus:border-amber-400 cursor-pointer"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>

              {selectedProduct && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Product SEO Edit Form */}
                  <form onSubmit={handleSaveProductSeo} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <h4 className="font-serif font-bold text-zinc-100 text-sm">Product Metadata Form</h4>
                      <span className="text-xs text-amber-400 font-mono">SKU: {selectedProduct.sku}</span>
                    </div>

                    {/* SEO Title */}
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">
                        SEO Title <span className="text-zinc-500">({(selectedProduct.seoTitle || selectedProduct.name).length}/60 chars)</span>
                      </label>
                      <input
                        type="text"
                        value={selectedProduct.seoTitle || selectedProduct.name}
                        onChange={(e) => {
                          updateProductInCatalog({ ...selectedProduct, seoTitle: e.target.value });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400"
                      />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Product URL Slug</label>
                      <input
                        type="text"
                        value={selectedProduct.slug || selectedProduct.id}
                        onChange={(e) => {
                          updateProductInCatalog({ ...selectedProduct, slug: e.target.value });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-300 font-mono text-xs focus:border-amber-400"
                      />
                    </div>

                    {/* SEO Description */}
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">
                        SEO Meta Description <span className="text-zinc-500">({(selectedProduct.seoDescription || selectedProduct.description).length}/160 chars)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={selectedProduct.seoDescription || selectedProduct.description}
                        onChange={(e) => {
                          updateProductInCatalog({ ...selectedProduct, seoDescription: e.target.value });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400"
                      />
                    </div>

                    {/* Google Merchant Center Attributes */}
                    <div className="pt-2 border-t border-zinc-800 space-y-3">
                      <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Merchant Center Attributes</span>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">Brand Name</label>
                          <input
                            type="text"
                            value={selectedProduct.brand || 'HARCONXS'}
                            onChange={(e) => {
                              updateProductInCatalog({ ...selectedProduct, brand: e.target.value });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">GTIN / UPC / Barcode</label>
                          <input
                            type="text"
                            value={selectedProduct.gtin || selectedProduct.barcode || ''}
                            onChange={(e) => {
                              updateProductInCatalog({ ...selectedProduct, gtin: e.target.value, barcode: e.target.value });
                            }}
                            placeholder="8901234567890"
                            className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">Google Product Category</label>
                          <input
                            type="text"
                            value={selectedProduct.googleProductCategory || 'Apparel & Accessories > Jewelry'}
                            onChange={(e) => {
                              updateProductInCatalog({ ...selectedProduct, googleProductCategory: e.target.value });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">Condition</label>
                          <select
                            value={selectedProduct.condition || 'new'}
                            onChange={(e) => {
                              updateProductInCatalog({ ...selectedProduct, condition: e.target.value as any });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs cursor-pointer"
                          >
                            <option value="new">New Condition</option>
                            <option value="refurbished">Refurbished</option>
                            <option value="used">Used</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* OpenGraph Tags */}
                    <div className="pt-2 border-t border-zinc-800 space-y-3">
                      <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Social OpenGraph (OG) Meta</span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">OG Title</label>
                          <input
                            type="text"
                            value={selectedProduct.ogTitle || selectedProduct.name}
                            onChange={(e) => {
                              updateProductInCatalog({ ...selectedProduct, ogTitle: e.target.value });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">OG Share Image URL</label>
                          <input
                            type="url"
                            value={selectedProduct.ogImage || selectedProduct.images[0]}
                            onChange={(e) => {
                              updateProductInCatalog({ ...selectedProduct, ogImage: e.target.value });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-800 flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20 cursor-pointer"
                      >
                        Save Product SEO Attributes
                      </button>
                    </div>
                  </form>

                  {/* Right: Live SERP & Social Preview Simulator */}
                  <div className="space-y-6">
                    {/* Google SERP Snippet Simulator */}
                    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-zinc-100 text-sm flex items-center gap-2">
                          <Globe className="w-4 h-4 text-amber-400" />
                          Google SERP Snippet Simulator
                        </h4>
                        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                          <button
                            onClick={() => setPreviewDevice('desktop')}
                            className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500'}`}
                          >
                            <Monitor className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setPreviewDevice('mobile')}
                            className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500'}`}
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Google Result Card */}
                      <div className="p-4 rounded-xl bg-white text-zinc-900 space-y-1 font-sans shadow-md">
                        <div className="flex items-center gap-2 text-xs text-zinc-600">
                          <div className="w-4 h-4 rounded-full bg-zinc-900 text-amber-400 flex items-center justify-center font-serif text-[10px] font-bold">
                            H
                          </div>
                          <span className="font-medium text-zinc-800">HARCONXS</span>
                          <span>&rsaquo;</span>
                          <span className="text-zinc-500 truncate">https://harconxs.com/product/{selectedProduct.slug || selectedProduct.id}</span>
                        </div>
                        <h3 className="text-base text-[#1a0dab] hover:underline font-medium cursor-pointer line-clamp-1">
                          {selectedProduct.seoTitle || `${selectedProduct.name} | HARCONXS Haute Joaillerie`}
                        </h3>
                        <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                          {selectedProduct.seoDescription || selectedProduct.description}
                        </p>
                        <div className="text-[11px] text-zinc-600 pt-1 flex items-center gap-2">
                          <span className="text-amber-600 font-semibold">★ {selectedProduct.rating.toFixed(1)}</span>
                          <span>&bull;</span>
                          <span className="font-semibold text-zinc-900">&#8377;{selectedProduct.price.toLocaleString('en-IN')}</span>
                          <span>&bull;</span>
                          <span className="text-emerald-700 font-medium">In stock</span>
                        </div>
                      </div>
                    </div>

                    {/* Social OpenGraph Preview Card */}
                    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                      <h4 className="font-serif font-bold text-zinc-100 text-sm flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-sky-400" />
                        Social Media OpenGraph Card
                      </h4>

                      <div className="rounded-2xl border border-zinc-700 overflow-hidden bg-zinc-950 max-w-sm">
                        <img
                          src={selectedProduct.ogImage || selectedProduct.images[0]}
                          alt="OpenGraph preview"
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-3 space-y-1">
                          <span className="text-[10px] text-zinc-500 uppercase font-mono">harconxs.com</span>
                          <h5 className="font-bold text-xs text-zinc-100 line-clamp-1">{selectedProduct.ogTitle || selectedProduct.name}</h5>
                          <p className="text-[11px] text-zinc-400 line-clamp-2">{selectedProduct.ogDescription || selectedProduct.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5.3 SITEMAP.XML INSPECTOR */}
          {seoSubTab === 'sitemap' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-zinc-100 text-base flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-amber-400" />
                      Dynamic Sitemap XML Engine
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Standard sitemap.xml indexing all published products, static pages, and high-res image sitemaps.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadSitemap}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download XML
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300">Live Crawl Endpoint</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">HTTP 200 OK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={`${window.location.origin}/sitemap.xml`}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-300 font-mono text-xs"
                    />
                    <button
                      onClick={() => handleCopy(`${window.location.origin}/sitemap.xml`, 'Sitemap URL')}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                    >
                      {copiedKey === 'Sitemap URL' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs overflow-x-auto max-h-72 scrollbar-thin">
                  {generateSitemapXml(products, window.location.origin || DEFAULT_SITE_URL)}
                </pre>
              </div>
            </div>
          )}

          {/* 5.4 ROBOTS.TXT INSPECTOR */}
          {seoSubTab === 'robots' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-zinc-100 text-base flex items-center gap-2">
                      <Code className="w-5 h-5 text-amber-400" />
                      Robots.txt Crawler Directives
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Standard robots.txt allowing search engines (Googlebot, Bingbot) to crawl shop pages while disallowing private admin consoles and cart APIs.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300">Live Robots Endpoint</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">HTTP 200 OK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={`${window.location.origin}/robots.txt`}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-300 font-mono text-xs"
                    />
                    <button
                      onClick={() => handleCopy(`${window.location.origin}/robots.txt`, 'Robots.txt URL')}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                    >
                      {copiedKey === 'Robots.txt URL' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs overflow-x-auto">
                  {generateRobotsTxt(window.location.origin || DEFAULT_SITE_URL)}
                </pre>
              </div>
            </div>
          )}

          {/* 5.5 JSON-LD STRUCTURED DATA SCHEMA INSPECTOR */}
          {seoSubTab === 'jsonld' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-zinc-100 text-base flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-amber-400" />
                    Schema.org Structured Data Validator
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Live JSON-LD schemas injected dynamically for Google Rich Snippets: Organization, WebSite, Product, Offer, AggregateRating, Review, and BreadcrumbList.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-300 mb-1">1. Organization &amp; WebSite JSON-LD</h4>
                    <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-300 font-mono text-xs overflow-x-auto max-h-48 scrollbar-thin">
                      {JSON.stringify(generateOrganizationJsonLd(window.location.origin || DEFAULT_SITE_URL), null, 2)}
                    </pre>
                  </div>

                  {selectedProduct && (
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-300 mb-1">2. Product, Offer &amp; AggregateRating JSON-LD ({selectedProduct.name})</h4>
                      <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-300 font-mono text-xs overflow-x-auto max-h-56 scrollbar-thin">
                        {JSON.stringify(generateProductJsonLd(selectedProduct, [], window.location.origin || DEFAULT_SITE_URL), null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
