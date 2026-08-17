import React from 'react';
import { X, ShieldCheck, Calendar, FileText } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const PolicyModal: React.FC = () => {
  const { isPolicyModalOpen, setIsPolicyModalOpen, activePolicySlug, policies } = useStore();

  if (!isPolicyModalOpen) return null;

  const policy = policies.find(p => p.slug === activePolicySlug) || policies[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">{policy.title}</h2>
              <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-zinc-400" />
                  Version {policy.version}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-zinc-400" />
                  Last Updated: {policy.lastUpdated}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsPolicyModalOpen(false)}
            className="text-zinc-400 hover:text-zinc-200 p-1.5 rounded-lg hover:bg-zinc-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto text-xs sm:text-sm text-zinc-300 space-y-4 leading-relaxed font-sans">
          <p className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800 text-zinc-300">
            {policy.content}
          </p>
          
          <div className="pt-4 border-t border-zinc-800/80">
            <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-2">Compliance & Data Protection</h4>
            <p className="text-xs text-zinc-400 leading-normal">
              HARCONXS SHOP strictly operates under global consumer protection, GDPR, CCPA, and digital commerce transparency standards. You may request permanent deletion of your private engraving files, couple subdomain assets, and API telemetry logs at any time from your Account Security center.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex justify-end">
          <button
            onClick={() => setIsPolicyModalOpen(false)}
            className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            I Understand & Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
