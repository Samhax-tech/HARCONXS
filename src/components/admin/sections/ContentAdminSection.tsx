import React, { useState } from 'react';
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
  Share2
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { enforceServerSidePermission } from '../../../services/adminAuthService';

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
  const { showToast } = useStore();

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

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await enforceServerSidePermission('content:seo', 'seo_config');
      showToast('SEO & Merchant schema configuration synchronized.');
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: SEO configuration requires content lead role.');
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
            FAQ & Knowledge Base ({faqs.length})
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
            SEO & Schema
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
                  <th className="py-3 px-4 text-right">Visual Editor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {pagesList.map(page => (
                  <tr key={page.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-medium text-zinc-100">{page.title}</td>
                    <td className="py-3 px-4 font-mono text-xs text-amber-400">/{page.slug === 'home' ? '' : page.slug}</td>
                    <td className="py-3 px-4 font-mono text-zinc-400">{page.sectionsCount} sections</td>
                    <td className="py-3 px-4 text-xs text-zinc-500">{new Date(page.updatedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-mono uppercase ${
                        page.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onOpenPageBuilder(page.slug)}
                        className="px-3 py-1.5 rounded-lg bg-amber-400 text-zinc-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-amber-400/20 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Launch Studio
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. PAGE BUILDER PROMO / LAUNCHER */}
      {subSection === 'page-builder' && (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-amber-400/30 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 mx-auto flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="font-serif font-bold text-zinc-100 text-2xl">
              HARCONXS Private Website Visual Studio
            </h3>
            <p className="text-sm text-zinc-400">
              Drag-and-drop live preview, responsive desktop/tablet/mobile viewports, draft and live Supabase persistence, and instant revision history rollback.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => onOpenPageBuilder('home')}
              className="px-6 py-3 rounded-2xl bg-amber-400 text-zinc-950 font-bold text-sm flex items-center gap-2 shadow-xl shadow-amber-400/20 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              Open Visual Studio (/edit-page)
            </button>
          </div>
        </div>
      )}

      {/* 3. FAQ SUBSECTION */}
      {subSection === 'faq' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Customer support knowledge base articles, sizing guides, and atelier guarantees.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map(faq => (
              <div key={faq.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-400 uppercase font-bold">{faq.category}</span>
                  <span className="text-xs text-zinc-500 font-mono">ID: {faq.id}</span>
                </div>
                <h4 className="font-serif font-bold text-zinc-100 text-sm">{faq.question}</h4>
                <p className="text-xs text-zinc-300 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 leading-relaxed">
                  {faq.answer}
                </p>
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
                onClick={() => handleSavePolicy('terms')}
                className="px-3 py-1.5 rounded-lg bg-amber-400 text-zinc-950 font-bold text-xs"
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
              <h4 className="font-serif font-bold text-zinc-100">Privacy & Data Confidentiality</h4>
              <button
                onClick={() => handleSavePolicy('privacy')}
                className="px-3 py-1.5 rounded-lg bg-amber-400 text-zinc-950 font-bold text-xs"
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

      {/* 5. SEO SUBSECTION */}
      {subSection === 'seo' && (
        <form onSubmit={handleSaveSeo} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <h4 className="font-serif font-bold text-zinc-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            Search Engine & Social OpenGraph Metadata
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Global Meta Title (SEO)</label>
              <input
                type="text"
                value={seoConfig.metaTitle}
                onChange={(e) => setSeoConfig(prev => ({ ...prev, metaTitle: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">Global Meta Description</label>
              <textarea
                rows={3}
                value={seoConfig.metaDescription}
                onChange={(e) => setSeoConfig(prev => ({ ...prev, metaDescription: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">OpenGraph Share Image URL</label>
                <input
                  type="url"
                  value={seoConfig.ogImageUrl}
                  onChange={(e) => setSeoConfig(prev => ({ ...prev, ogImageUrl: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">JSON-LD Schema Type</label>
                <input
                  type="text"
                  value={seoConfig.schemaType}
                  onChange={(e) => setSeoConfig(prev => ({ ...prev, schemaType: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:border-amber-400 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-sm cursor-pointer shadow-lg shadow-amber-400/20"
            >
              Save SEO Configuration
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
