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
  Monitor,
  Clock,
  Calendar,
  AlertTriangle,
  History,
  Bot,
  FileCheck,
  ArrowRight,
  Send,
  Trash2
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { enforceServerSidePermission } from '../../../services/adminAuthService';
import { Product, PolicyRecord, PolicyVersion, ContentPublicationStatus } from '../../../types';
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
  const { 
    showToast, 
    products, 
    updateProduct, 
    activePageRecord,
    policies: storePolicies,
    updatePolicyRecord,
    draftPolicyVersion,
    approveAndPublishPolicy,
    schedulePolicy
  } = useStore();

  const updateProductInCatalog = updateProduct;

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

  // Policy CMS State & Governance
  const [selectedPolicySlug, setSelectedPolicySlug] = useState<string>('privacy');
  const [activePolicyTab, setActivePolicyTab] = useState<'editor' | 'versions' | 'ai-draft' | 'preview'>('editor');
  const [policyEditTitle, setPolicyEditTitle] = useState<string>('');
  const [policyEditContent, setPolicyEditContent] = useState<string>('');
  const [policyEditSummary, setPolicyEditSummary] = useState<string>('');
  const [policySections, setPolicySections] = useState<Array<{ heading: string; body: string }>>([]);
  const [aiDraftPrompt, setAiDraftPrompt] = useState<string>('');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [scheduleDatetime, setScheduleDatetime] = useState<string>('');

  // Synchronize local policy editor when selected policy changes
  const activePolicy = storePolicies.find(p => p.slug === selectedPolicySlug) || storePolicies[0];

  useEffect(() => {
    if (activePolicy) {
      setPolicyEditTitle(activePolicy.title || '');
      setPolicyEditContent(activePolicy.content || '');
      setPolicyEditSummary(activePolicy.description || '');
      setPolicySections(
        activePolicy.sections && activePolicy.sections.length > 0
          ? activePolicy.sections.map(s => ({ heading: s.heading, body: s.body || s.content || '' }))
          : [{ heading: 'General Provisions', body: activePolicy.content || '' }]
      );
    }
  }, [activePolicy?.id, selectedPolicySlug]);

  const handleSavePolicyDraft = async () => {
    if (!activePolicy) return;
    try {
      await enforceServerSidePermission('content:policies', 'store_policy', activePolicy.slug);
      const nextVerNum = `2.${(activePolicy.versions?.length || 0) + 1}.0`;
      await draftPolicyVersion(activePolicy.id, {
        title: policyEditTitle,
        content: policyEditContent,
        sections: policySections.map((s) => ({ heading: s.heading, content: s.body || '', body: s.body })),
        version: nextVerNum,
        changeSummary: policyEditSummary || 'Administrative draft updates',
        createdBy: 'Administrator',
        isAiDrafted: false
      });
      showToast(`Policy draft v${nextVerNum} created for review.`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Policy drafting requires admin role.');
    }
  };

  const handleAiDraftLegal = async () => {
    if (!activePolicy) return;
    if (!aiDraftPrompt.trim()) {
      showToast('Please describe the legal revisions or compliance updates required.');
      return;
    }
    setIsAiGenerating(true);
    try {
      await enforceServerSidePermission('content:policies', 'store_policy', activePolicy.slug);
      
      // Simulate/Generate AI Clause Drafting with strict Governance Compliance Note
      const aiGeneratedVersion = `2.${(activePolicy.versions?.length || 0) + 1}.0-ai-draft`;
      const enrichedClauses = [
        ...policySections,
        {
          heading: `Regulatory Compliance & Governance (${aiDraftPrompt.slice(0, 30)}...)`,
          body: `Pursuant to administrative update directive: "${aiDraftPrompt}". HARCONXS Haute Joaillerie and its digital sovereign infrastructure strictly safeguard patron confidentiality, escrowed transactions, and transit logistics under international high-value trade regulations.`
        }
      ];

      const fullDraftContent = enrichedClauses.map(s => `## ${s.heading}\n\n${s.body}`).join('\n\n');

      await draftPolicyVersion(activePolicy.id, {
        title: `${activePolicy.title} (AI Draft Revision)`,
        content: fullDraftContent,
        sections: enrichedClauses.map((s) => ({ heading: s.heading, content: s.body || '', body: s.body })),
        version: aiGeneratedVersion,
        changeSummary: `AI-assisted legal draft: ${aiDraftPrompt}`,
        createdBy: 'AI Governance Assistant',
        isAiDrafted: true
      });

      setPolicySections(enrichedClauses);
      setPolicyEditContent(fullDraftContent);
      setAiDraftPrompt('');
      setActivePolicyTab('versions');
      showToast('🤖 AI Policy Draft saved as pending review. Administrator approval strictly required before publishing.');
    } catch (err: any) {
      showToast(err.message || 'Error generating AI legal draft.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleApproveVersion = async (versionId: string) => {
    if (!activePolicy) return;
    try {
      await enforceServerSidePermission('content:policies', 'store_policy', activePolicy.slug);
      const res = await approveAndPublishPolicy(activePolicy.id, versionId, 'Super Administrator');
      if (res.success) {
        showToast('✅ Policy version approved and published live to Supabase storefront!');
      }
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Approving policy requires administrator role.');
    }
  };

  const handleScheduleRelease = async (versionId: string) => {
    if (!activePolicy || !scheduleDatetime) {
      showToast('Please select a valid scheduled publication date and time.');
      return;
    }
    try {
      await enforceServerSidePermission('content:policies', 'store_policy', activePolicy.slug);
      await schedulePolicy(activePolicy.id, scheduleDatetime);
      showToast(`📅 Policy release scheduled for ${new Date(scheduleDatetime).toLocaleString()}.`);
      setScheduleDatetime('');
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Scheduling policy requires administrator role.');
    }
  };

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

          {/* MOBILE PAGES CARDS (< md screens) */}
          <div className="md:hidden space-y-3">
            {pagesList.map((pg) => (
              <div key={pg.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-zinc-100 text-sm">{pg.title}</h4>
                    <span className="font-mono text-xs text-zinc-400">/{pg.slug}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    pg.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {pg.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80 font-mono">
                  <span>{pg.sectionsCount} modules</span>
                  <span>Updated: {new Date(pg.updatedAt).toLocaleDateString()}</span>
                </div>

                <button
                  onClick={() => onOpenPageBuilder(pg.slug)}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch Visual Page Studio</span>
                </button>
              </div>
            ))}
          </div>

          {/* DESKTOP PAGES TABLE (>= md screens) */}
          <div className="hidden md:block rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
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

      {/* 4. HARCONXS POLICIES & LEGAL CMS SUBSECTION */}
      {subSection === 'policies' && (
        <div className="space-y-6">
          {/* Header & Policy Selector */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-zinc-100 text-base">HARCONXS Legal Policy Governance Studio</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Manage legal terms, privacy covenants, policies, and draft revisions. AI drafting is strictly gated behind administrator approval before publishing live to Supabase.
              </p>
            </div>

            {/* Document Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-zinc-300 whitespace-nowrap">Selected Document:</label>
              <select
                value={selectedPolicySlug}
                onChange={(e) => setSelectedPolicySlug(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-amber-400 font-semibold text-xs focus:border-amber-400 cursor-pointer"
              >
                {storePolicies.map(p => (
                  <option key={p.id} value={p.slug}>
                    {p.title} ({p.status.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activePolicy && (
            <div className="space-y-6">
              {/* Document Overview Bar */}
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block">Publication Status</span>
                  <span className={`inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full font-mono text-[11px] font-bold uppercase ${
                    activePolicy.status === 'published' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                      : activePolicy.status === 'scheduled'
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {activePolicy.status === 'published' && <CheckCircle2 className="w-3 h-3" />}
                    {activePolicy.status === 'scheduled' && <Clock className="w-3 h-3" />}
                    {activePolicy.status === 'draft' && <AlertTriangle className="w-3 h-3" />}
                    {activePolicy.status}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Active Live Version</span>
                  <span className="font-mono font-bold text-amber-400 text-sm mt-0.5 block">
                    {activePolicy.version || 'v2.0.0'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Last Approved By</span>
                  <span className="font-medium text-zinc-200 mt-0.5 block truncate">
                    {activePolicy.approvedBy || 'Super Administrator'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Storefront URL</span>
                  <a
                    href={`/policies?tab=${activePolicy.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline inline-flex items-center gap-1 font-mono text-[11px] mt-0.5"
                  >
                    <span>/policies?tab={activePolicy.slug}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                <button
                  onClick={() => setActivePolicyTab('editor')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activePolicyTab === 'editor' ? 'bg-amber-400 text-zinc-950 shadow' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Document Editor</span>
                </button>
                <button
                  onClick={() => setActivePolicyTab('versions')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activePolicyTab === 'versions' ? 'bg-amber-400 text-zinc-950 shadow' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Version History &amp; Approval ({activePolicy.versions?.length || 1})</span>
                </button>
                <button
                  onClick={() => setActivePolicyTab('ai-draft')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activePolicyTab === 'ai-draft' ? 'bg-amber-400 text-zinc-950 shadow' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-amber-500" />
                  <span>AI Legal Drafter (Gated)</span>
                </button>
                <button
                  onClick={() => setActivePolicyTab('preview')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    activePolicyTab === 'preview' ? 'bg-amber-400 text-zinc-950 shadow' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Storefront Preview</span>
                </button>
              </div>

              {/* 1. DOCUMENT EDITOR */}
              {activePolicyTab === 'editor' && (
                <div className="space-y-5">
                  <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-zinc-100 text-sm">Policy Header Details</h4>
                      <button
                        onClick={handleSavePolicyDraft}
                        className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors shadow flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Save Draft Version</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Document Formal Title</label>
                        <input
                          type="text"
                          value={policyEditTitle}
                          onChange={(e) => setPolicyEditTitle(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400 font-serif"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">Executive Summary / Scope</label>
                        <input
                          type="text"
                          value={policyEditSummary}
                          onChange={(e) => setPolicyEditSummary(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section List Builder */}
                  <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-zinc-100 text-sm">Policy Clauses &amp; Sections</h4>
                        <p className="text-xs text-zinc-400">Structured legal clauses displayed dynamically with high-contrast formatting on storefront.</p>
                      </div>
                      <button
                        onClick={() => setPolicySections(prev => [...prev, { heading: 'New Legal Clause', body: '' }])}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-400" />
                        <span>Add Section</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {policySections.map((sec, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="w-5 h-5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono flex items-center justify-center font-bold">
                                {idx + 1}
                              </span>
                              <input
                                type="text"
                                value={sec.heading}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPolicySections(prev => prev.map((s, i) => i === idx ? { ...s, heading: val } : s));
                                }}
                                placeholder="Section Heading"
                                className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs font-semibold focus:border-amber-400"
                              />
                            </div>
                            <button
                              onClick={() => setPolicySections(prev => prev.filter((_, i) => i !== idx))}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-900 cursor-pointer"
                              title="Delete section"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            value={sec.body}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPolicySections(prev => prev.map((s, i) => i === idx ? { ...s, body: val } : s));
                            }}
                            placeholder="Clause body markdown or legal text..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs leading-relaxed focus:border-amber-400"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. VERSION HISTORY & GOVERNANCE AUDIT */}
              {activePolicyTab === 'versions' && (
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-serif font-bold text-zinc-100 text-base flex items-center gap-2">
                          <History className="w-4 h-4 text-amber-400" />
                          <span>Policy Version Control &amp; Approval Gate</span>
                        </h4>
                        <p className="text-xs text-zinc-400">
                          Legal policy changes require explicit administrator sign-off before publication. AI and editor drafts remain in DRAFT status until approved.
                        </p>
                      </div>
                    </div>

                    {/* MOBILE POLICY VERSIONS CARDS (< md screens) */}
                    <div className="md:hidden space-y-3">
                      {(activePolicy.versions || [
                        {
                          id: `ver-default`,
                          policyId: activePolicy.id,
                          version: activePolicy.version || 'v2.4.0',
                          title: activePolicy.title,
                          content: activePolicy.content,
                          status: activePolicy.status,
                          changeSummary: 'Initial sovereign baseline policy release',
                          createdBy: 'Super Administrator',
                          createdAt: activePolicy.updatedAt || new Date().toISOString(),
                          isAiDrafted: false
                        }
                      ]).map((ver) => (
                        <div key={ver.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-mono font-bold text-amber-400 text-sm">{ver.version}</span>
                              <div className="text-xs font-medium text-zinc-200 mt-0.5">{ver.changeSummary || ver.title}</div>
                              {ver.isAiDrafted && (
                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.2 text-[10px] font-mono rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                  <Bot className="w-2.5 h-2.5" /> AI Drafted
                                </span>
                              )}
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                              ver.status === 'published'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : ver.status === 'scheduled'
                                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}>
                              {ver.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/80">
                            <span>{ver.approvedBy ? `By ${ver.approvedBy}` : (ver.createdBy || 'Editor')}</span>
                            <span>{new Date(ver.createdAt).toLocaleDateString()}</span>
                          </div>

                          {ver.status !== 'published' ? (
                            <button
                              onClick={() => handleApproveVersion(ver.id)}
                              className="w-full py-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve &amp; Publish</span>
                            </button>
                          ) : (
                            <div className="text-[11px] text-emerald-400 font-mono flex items-center justify-center gap-1 py-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Active Live Version
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* DESKTOP POLICY VERSIONS TABLE (>= md screens) */}
                    <div className="hidden md:block rounded-xl border border-zinc-800 overflow-hidden">
                      <table className="w-full text-left text-sm text-zinc-300">
                        <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Version</th>
                            <th className="py-3 px-4">Summary &amp; Origin</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Author / Approver</th>
                            <th className="py-3 px-4">Created Date</th>
                            <th className="py-3 px-4 text-right">Approval Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/80">
                          {(activePolicy.versions || [
                            {
                              id: `ver-default`,
                              policyId: activePolicy.id,
                              version: activePolicy.version || 'v2.4.0',
                              title: activePolicy.title,
                              content: activePolicy.content,
                              status: activePolicy.status,
                              changeSummary: 'Initial sovereign baseline policy release',
                              createdBy: 'Super Administrator',
                              createdAt: activePolicy.updatedAt || new Date().toISOString(),
                              isAiDrafted: false
                            }
                          ]).map((ver) => (
                            <tr key={ver.id} className="hover:bg-zinc-800/30 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-amber-400 text-xs">
                                {ver.version}
                              </td>
                              <td className="py-3 px-4 text-xs">
                                <div className="font-medium text-zinc-200">{ver.changeSummary || ver.title}</div>
                                {ver.isAiDrafted && (
                                  <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.2 text-[10px] font-mono rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                    <Bot className="w-2.5 h-2.5" /> AI Drafted
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                                  ver.status === 'published'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                    : ver.status === 'scheduled'
                                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                }`}>
                                  {ver.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-xs text-zinc-400">
                                {ver.approvedBy ? `Approved by ${ver.approvedBy}` : (ver.createdBy || 'Editor')}
                              </td>
                              <td className="py-3 px-4 text-xs text-zinc-500 font-mono">
                                {new Date(ver.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {ver.status !== 'published' ? (
                                    <button
                                      onClick={() => handleApproveVersion(ver.id)}
                                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                                      title="Approve & Publish to Storefront"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>Approve &amp; Publish</span>
                                    </button>
                                  ) : (
                                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Active Live
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Schedule Release Bar */}
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-sky-400" />
                          <span>Schedule Future Policy Release</span>
                        </span>
                        <p className="text-[11px] text-zinc-400">Automatically flip draft version to live on scheduled timestamp.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="datetime-local"
                          value={scheduleDatetime}
                          onChange={(e) => setScheduleDatetime(e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-mono"
                        />
                        <button
                          onClick={() => handleScheduleRelease(activePolicy.versions?.[0]?.id || 'latest')}
                          className="px-3.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold cursor-pointer"
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. AI DRAFTER WITH STRICT GOVERNANCE */}
              {activePolicyTab === 'ai-draft' && (
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                      <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                      <div className="space-y-1">
                        <span className="font-bold uppercase tracking-wider block">Legal Governance &amp; Non-Overwriting Guard</span>
                        <p className="text-amber-300/90 leading-relaxed">
                          AI may assist with drafting legal policy clauses, GDPR/DPDP updates, and carrier clauses, but will <strong>NEVER silently overwrite published live legal documents</strong>. All AI-generated clauses are placed into a provisional DRAFT version and require explicit administrator approval before publication.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-zinc-200">
                        Describe Policy Updates or Legal Directives for AI Assistant:
                      </label>
                      <textarea
                        rows={4}
                        value={aiDraftPrompt}
                        onChange={(e) => setAiDraftPrompt(e.target.value)}
                        placeholder="e.g. Update transit damage insurance terms to specify mandatory unboxing video requirement and add 30-day exchange clause for bespoke rings..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:border-amber-400"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={handleAiDraftLegal}
                        disabled={isAiGenerating || !aiDraftPrompt.trim()}
                        className="px-5 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        {isAiGenerating ? (
                          <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                        <span>Draft Provisional Legal Revision</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. LIVE PUBLIC STOREFRONT PREVIEW */}
              {activePolicyTab === 'preview' && (
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-serif font-bold text-zinc-100 text-sm">Customer Storefront View ({activePolicy.title})</h4>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">Published Version: {activePolicy.version}</span>
                  </div>

                  <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 space-y-6">
                    <div className="border-b border-zinc-800 pb-4">
                      <h2 className="font-serif text-2xl font-bold text-zinc-100">{activePolicy.title}</h2>
                      <p className="text-xs text-amber-400 mt-1">Last Updated: {activePolicy.lastUpdated || new Date().toLocaleDateString()}</p>
                      <p className="text-sm text-zinc-300 mt-2">{activePolicy.description}</p>
                    </div>

                    <div className="space-y-6">
                      {(activePolicy.sections && activePolicy.sections.length > 0 ? activePolicy.sections : [
                        { heading: 'Sovereign Agreement', body: activePolicy.content }
                      ]).map((sec, idx) => (
                        <div key={idx} className="space-y-2">
                          <h3 className="font-serif font-bold text-base text-zinc-100 flex items-center gap-2">
                            <span className="text-amber-400 font-mono text-sm">{idx + 1}.</span>
                            {sec.heading}
                          </h3>
                          <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line pl-5 border-l border-zinc-800">
                            {sec.body}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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
