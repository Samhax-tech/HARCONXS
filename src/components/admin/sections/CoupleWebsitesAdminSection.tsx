import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Lock, 
  Users, 
  Music, 
  Eye,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { enforceServerSidePermission } from '../../../services/adminAuthService';
import { useStore } from '../../../context/StoreContext';

interface CoupleWebsitesAdminSectionProps {
  subSection: 'couple-templates' | 'couple-projects';
  onNavigateSubSection: (sec: 'couple-templates' | 'couple-projects') => void;
}

export const CoupleWebsitesAdminSection: React.FC<CoupleWebsitesAdminSectionProps> = ({
  subSection,
  onNavigateSubSection
}) => {
  const { showToast } = useStore();

  const [templates, setTemplates] = useState([
    {
      id: 'tpl-1',
      title: 'Sovereign Royal Velvet',
      theme: 'Burgundy & Champagne Gold',
      features: ['Background Orchestral Player', 'Interactive RSVP', 'Anniversary Milestone Clock', 'Secret Love Letters'],
      price: 4999,
      demoUrl: 'https://harconxs.com/c/demo-royal',
      activeDeployments: 34,
      imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'tpl-2',
      title: 'Midnight Celestial Constellation',
      theme: 'Deep Navy & Platinum Stars',
      features: ['Interactive Star Map', 'Guestbook Audio Messages', 'High-Res Photo Vault', 'Secret Passcode Access'],
      price: 5999,
      demoUrl: 'https://harconxs.com/c/demo-celestial',
      activeDeployments: 28,
      imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'tpl-3',
      title: 'Minimalist Ivory Elegance',
      theme: 'Warm Ivory & Rose Gold',
      features: ['Clean Typography', 'Timeline of Milestones', 'QR Code Share Card', 'Spotify Playlist Embed'],
      price: 3499,
      demoUrl: 'https://harconxs.com/c/demo-ivory',
      activeDeployments: 19,
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80'
    }
  ]);

  const [projects, setProjects] = useState([
    {
      id: 'proj-01',
      coupleNames: 'Aarav & Meera',
      slug: 'aarav-meera-2026',
      templateTitle: 'Sovereign Royal Velvet',
      status: 'published',
      passcodeProtected: true,
      customDomain: 'aaravandmeera.love',
      createdAt: '2026-02-10',
      totalVisitors: 842,
      rsvpsCount: 68
    },
    {
      id: 'proj-02',
      coupleNames: 'Rohan & Devika',
      slug: 'rohan-devika-forever',
      templateTitle: 'Midnight Celestial Constellation',
      status: 'published',
      passcodeProtected: false,
      customDomain: null,
      createdAt: '2026-02-14',
      totalVisitors: 1205,
      rsvpsCount: 112
    },
    {
      id: 'proj-03',
      coupleNames: 'Kabir & Tara',
      slug: 'kabir-tara-union',
      templateTitle: 'Minimalist Ivory Elegance',
      status: 'draft',
      passcodeProtected: true,
      customDomain: null,
      createdAt: '2026-02-18',
      totalVisitors: 14,
      rsvpsCount: 0
    }
  ]);

  const handleToggleProjectStatus = async (projectId: string, currentStatus: string) => {
    try {
      await enforceServerSidePermission('couple_sites:manage', 'couple_website', projectId);
      const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: nextStatus } : p));
      showToast(`Website project status updated to ${nextStatus.toUpperCase()}.`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Couple website management requires admin role.');
    }
  };

  return (
    <div id="couple-websites-admin-section" className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <button
            id="tab-couple-templates"
            onClick={() => onNavigateSubSection('couple-templates')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'couple-templates' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Website Templates ({templates.length})
          </button>
          <button
            id="tab-couple-projects"
            onClick={() => onNavigateSubSection('couple-projects')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
              subSection === 'couple-projects' ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            Active Projects ({projects.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Server RBAC Protected
          </span>
        </div>
      </div>

      {/* 1. TEMPLATES SUBSECTION */}
      {subSection === 'couple-templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Interactive digital relationship vaults, RSVP counters, and celebration templates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map(tpl => (
              <div key={tpl.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="h-44 rounded-xl overflow-hidden border border-zinc-800 relative">
                  <img src={tpl.imageUrl} alt={tpl.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-sm text-xs font-mono font-bold text-amber-400">
                    ₹{tpl.price.toLocaleString()}
                  </div>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-zinc-100 text-base">{tpl.title}</h4>
                  <div className="text-xs text-zinc-400 font-mono mt-0.5">{tpl.theme}</div>
                </div>
                <div className="space-y-1 text-xs text-zinc-400">
                  {tpl.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Heart className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">{tpl.activeDeployments} deployed</span>
                  <a
                    href={tpl.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    Live Demo <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ACTIVE PROJECTS SUBSECTION */}
      {subSection === 'couple-projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Provisioned patron love story domains, guest RSVP lists, and visitor analytics.
            </p>
          </div>

          {/* MOBILE PROJECTS CARDS (< md screens) */}
          <div className="md:hidden space-y-3">
            {projects.map(proj => (
              <div key={proj.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-zinc-100 text-sm">{proj.coupleNames}</h4>
                    <span className="text-xs font-mono text-amber-400">/c/{proj.slug}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                    proj.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {proj.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-zinc-950/60 p-2.5 rounded-xl text-xs border border-zinc-800">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Template</span>
                    <span className="text-zinc-300 font-medium">{proj.templateTitle}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Engagement</span>
                    <span className="font-mono text-zinc-200">{proj.totalVisitors} views • <strong className="text-emerald-400">{proj.rsvpsCount} RSVPs</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs font-mono text-zinc-400">
                    {proj.passcodeProtected ? (
                      <span className="inline-flex items-center gap-1 text-amber-400">
                        <Lock className="w-3 h-3" /> Passcode Active
                      </span>
                    ) : (
                      <span>Public Access</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggleProjectStatus(proj.id, proj.status)}
                    className="px-3.5 py-1.5 min-h-[38px] rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-amber-400 cursor-pointer"
                  >
                    {proj.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP PROJECTS TABLE (>= md screens) */}
          <div className="hidden md:block rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Couple</th>
                  <th className="py-3 px-4">Vanity URL / Domain</th>
                  <th className="py-3 px-4">Template</th>
                  <th className="py-3 px-4">Passcode</th>
                  <th className="py-3 px-4">RSVPs & Traffic</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {projects.map(proj => (
                  <tr key={proj.id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-medium text-zinc-100">{proj.coupleNames}</td>
                    <td className="py-3 px-4 font-mono text-xs">
                      <div className="text-amber-400">/c/{proj.slug}</div>
                      {proj.customDomain && <div className="text-zinc-500">{proj.customDomain}</div>}
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-400">{proj.templateTitle}</td>
                    <td className="py-3 px-4 text-xs">
                      {proj.passcodeProtected ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-mono">
                          <Lock className="w-3 h-3" /> Protected
                        </span>
                      ) : (
                        <span className="text-zinc-500 font-mono">Public</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-zinc-300">
                      <div>{proj.totalVisitors} views</div>
                      <div className="text-emerald-400 font-bold">{proj.rsvpsCount} RSVPs</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-mono uppercase ${
                        proj.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleProjectStatus(proj.id, proj.status)}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-amber-400"
                      >
                        {proj.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
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
