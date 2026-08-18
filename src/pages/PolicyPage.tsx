import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { FileText, ShieldCheck, Printer, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PolicyPageProps {
  policy?: 'privacy' | 'terms' | 'refund' | 'shipping';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ policy: propPolicy }) => {
  const { pathname } = useLocation();
  const { policies } = useStore();

  const activeSlug = propPolicy || (
    pathname.includes('privacy') ? 'privacy' :
    pathname.includes('terms') ? 'terms' :
    pathname.includes('refund') ? 'refund' :
    pathname.includes('shipping') ? 'shipping' : 'privacy'
  );

  const matchedPolicy = policies.find(p => p.slug === activeSlug || p.id === activeSlug) || policies[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-10 text-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Breadcrumbs
          items={[
            { label: 'Legal & Trust' },
            { label: matchedPolicy.title }
          ]}
        />

        {/* Policy Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { slug: 'privacy', path: '/privacy-policy', label: 'Privacy Policy' },
            { slug: 'terms', path: '/terms', label: 'Terms of Service' },
            { slug: 'refund', path: '/refund-policy', label: 'Refund & Returns' },
            { slug: 'shipping', path: '/shipping-policy', label: 'Shipping Policy' },
          ].map(p => (
            <Link
              key={p.slug}
              to={p.path}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeSlug === p.slug
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-lg shadow-amber-500/10'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>

        {/* Policy Document Surface */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl">
          <div className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">Official HARCONXS Policy</span>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                {matchedPolicy.title}
              </h1>
              <p className="text-xs text-zinc-500 font-mono">
                Version {matchedPolicy.version} • Last Updated: {new Date(matchedPolicy.lastUpdated).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Policy</span>
            </button>
          </div>

          {/* Render Sections */}
          <div className="space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
            {matchedPolicy.sections && matchedPolicy.sections.length > 0 ? (
              matchedPolicy.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h2 className="text-base sm:text-lg font-serif font-bold text-zinc-100 flex items-center gap-2">
                    <span className="text-amber-400 font-mono text-xs">{idx + 1}.</span>
                    <span>{sec.heading}</span>
                  </h2>
                  <p className="text-zinc-400 leading-relaxed whitespace-pre-line pl-4 border-l border-zinc-800">
                    {sec.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="whitespace-pre-line text-zinc-400 leading-relaxed">
                {matchedPolicy.content}
              </p>
            )}
          </div>

          <div className="p-5 bg-zinc-950/80 rounded-2xl border border-zinc-800 text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Questions regarding compliance, data privacy, or custom order rights?</span>
            </div>
            <Link
              to="/contact"
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 shrink-0"
            >
              <span>Contact Grievance Officer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
