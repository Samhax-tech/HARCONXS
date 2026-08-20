import React, { useState } from 'react';
import { 
  Heart, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Eye, 
  Users, 
  Calendar,
  X,
  Check,
  Globe
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { CoupleWebsiteTemplate, CoupleWebsiteProject, CoupleThemeCategory } from '../../../types';
import { enforceServerSidePermission } from '../../../services/adminAuthService';

interface CoupleWebsitesAdminSectionProps {
  subSection: 'couple-templates' | 'couple-projects';
  onNavigateSubSection: (sec: 'couple-templates' | 'couple-projects') => void;
}

export const CoupleWebsitesAdminSection: React.FC<CoupleWebsitesAdminSectionProps> = ({
  subSection,
  onNavigateSubSection
}) => {
  const { 
    coupleTemplates, 
    coupleWebsites, 
    addCoupleTemplate, 
    updateCoupleTemplate, 
    deleteCoupleTemplate, 
    toggleCoupleTemplateActive,
    updateCoupleWebsite, 
    publishCoupleWebsite,
    deleteCoupleWebsite,
    showToast 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  
  // Template modal state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CoupleWebsiteTemplate | null>(null);

  const [tplName, setTplName] = useState('');
  const [tplCategory, setTplCategory] = useState<CoupleThemeCategory>('Romantic');
  const [tplDescription, setTplDescription] = useState('');
  const [tplFeatures, setTplFeatures] = useState('');
  const [tplPrice, setTplPrice] = useState(2499);
  const [tplDemoSubdomain, setTplDemoSubdomain] = useState('demo-romance');
  const [tplPreviewImage, setTplPreviewImage] = useState('');

  const openCreateTemplate = () => {
    setEditingTemplate(null);
    setTplName('');
    setTplCategory('Romantic');
    setTplDescription('A timeless interactive digital sanctuary for high-touch wedding anniversaries.');
    setTplFeatures('Interactive Love Story Timeline, Photo Carousel, RSVP & Guest Wishes, Ambient Audio');
    setTplPrice(2499);
    setTplDemoSubdomain('demo-romance');
    setTplPreviewImage('https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80');
    setIsTemplateModalOpen(true);
  };

  const openEditTemplate = (tpl: CoupleWebsiteTemplate) => {
    setEditingTemplate(tpl);
    setTplName(tpl.name);
    setTplCategory(tpl.themeCategory || 'Romantic');
    setTplDescription(tpl.description || '');
    setTplFeatures(Array.isArray(tpl.features) ? tpl.features.join(', ') : '');
    setTplPrice(tpl.price);
    setTplDemoSubdomain(tpl.demoSubdomain || 'demo');
    setTplPreviewImage(tpl.previewImage || '');
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplName.trim()) {
      showToast('Template name is required.');
      return;
    }

    const featureList = tplFeatures.split(',').map(f => f.trim()).filter(Boolean);

    try {
      if (editingTemplate) {
        await updateCoupleTemplate({
          ...editingTemplate,
          name: tplName.trim(),
          themeCategory: tplCategory,
          description: tplDescription.trim(),
          features: featureList,
          price: tplPrice,
          demoSubdomain: tplDemoSubdomain.trim(),
          previewImage: tplPreviewImage.trim()
        });
        showToast('Couple template updated successfully.');
      } else {
        await addCoupleTemplate({
          name: tplName.trim(),
          themeCategory: tplCategory,
          description: tplDescription.trim(),
          features: featureList,
          price: tplPrice,
          demoSubdomain: tplDemoSubdomain.trim(),
          previewImage: tplPreviewImage.trim(),
          isActive: true
        });
        showToast('New couple website template added.');
      }
      setIsTemplateModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Error saving template.');
    }
  };

  const handleDeleteTemplate = async (id: string, name: string) => {
    const confirm = window.confirm(`Delete template "${name}"?`);
    if (!confirm) return;
    try {
      await deleteCoupleTemplate(id);
      showToast(`Template "${name}" deleted.`);
    } catch (err: any) {
      showToast(err.message || 'Error deleting template.');
    }
  };

  const handleToggleProjectStatus = async (projectId: string, currentStatus: string) => {
    try {
      await enforceServerSidePermission('couple_sites:manage', 'couple_website', projectId);
      const isCurrentlyActive = currentStatus === 'active';
      await publishCoupleWebsite(projectId, !isCurrentlyActive);
      showToast(`Website project status updated to ${!isCurrentlyActive ? 'ACTIVE' : 'DRAFT'}.`);
    } catch (err: any) {
      showToast(err.message || 'Permission Denied: Couple website management requires admin role.');
    }
  };

  const handleDeleteProject = async (projectId: string, name: string) => {
    const confirm = window.confirm(`Permanently delete couple website project "${name}"?`);
    if (!confirm) return;
    try {
      await deleteCoupleWebsite(projectId);
      showToast(`Project "${name}" deleted.`);
    } catch (err: any) {
      showToast(err.message || 'Error deleting project.');
    }
  };

  const filteredProjects = coupleWebsites.filter(p => {
    const partnerNames = `${p.partner1Name || ''} & ${p.partner2Name || ''}`.toLowerCase();
    const sub = (p.subdomain || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return !q || partnerNames.includes(q) || sub.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-zinc-100 flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-pink-400 fill-pink-400/20" />
            <span>Couple Sanctuary Websites</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage bespoke couple web sanctuaries, interactive anniversary portals, and premium templates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => onNavigateSubSection('couple-templates')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                subSection === 'couple-templates'
                  ? 'bg-amber-400 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Templates ({coupleTemplates.length})
            </button>
            <button
              onClick={() => onNavigateSubSection('couple-projects')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                subSection === 'couple-projects'
                  ? 'bg-amber-400 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Live Projects ({coupleWebsites.length})
            </button>
          </div>

          {subSection === 'couple-templates' && (
            <button
              onClick={openCreateTemplate}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Template</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. TEMPLATES SUBSECTION */}
      {subSection === 'couple-templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              Interactive themes available to couples for instant deployment upon checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coupleTemplates.map(tpl => (
              <div key={tpl.id} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-44 rounded-xl overflow-hidden border border-zinc-800 relative bg-zinc-950">
                    <img src={tpl.previewImage} alt={tpl.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-sm text-xs font-mono font-bold text-amber-400">
                      ₹{tpl.price.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-zinc-100 text-base">{tpl.name}</h4>
                    <div className="text-xs text-pink-400 font-mono mt-0.5">{tpl.themeCategory}</div>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{tpl.description}</p>
                  </div>
                  <div className="space-y-1 text-xs text-zinc-400">
                    {(Array.isArray(tpl.features) ? tpl.features : []).map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Heart className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                        <span className="line-clamp-1">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditTemplate(tpl)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-400 transition-colors cursor-pointer"
                      title="Edit template"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleCoupleTemplateActive(tpl.id)}
                      className={`p-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                        tpl.isActive !== false ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                      }`}
                      title="Toggle active status"
                    >
                      {tpl.isActive !== false ? 'Active' : 'Disabled'}
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(tpl.id, tpl.name)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete template"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px]">/{tpl.demoSubdomain}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ACTIVE PROJECTS SUBSECTION */}
      {subSection === 'couple-projects' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <p className="text-xs text-zinc-400">
              Provisioned patron love story domains, guest RSVP lists, and visitor analytics.
            </p>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-400"
              />
            </div>
          </div>

          {/* DESKTOP PROJECTS TABLE */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Couple</th>
                  <th className="py-3 px-4">Subdomain / Domain</th>
                  <th className="py-3 px-4">Passcode</th>
                  <th className="py-3 px-4">Traffic & Wishes</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredProjects.map(proj => {
                  const coupleName = `${proj.partner1Name || 'Partner 1'} & ${proj.partner2Name || 'Partner 2'}`;
                  return (
                    <tr key={proj.id} className="hover:bg-zinc-800/40">
                      <td className="py-3 px-4 font-medium text-zinc-100">{coupleName}</td>
                      <td className="py-3 px-4 font-mono text-xs">
                        <div className="text-amber-400">/c/{proj.subdomain}</div>
                        {proj.customDomain && <div className="text-zinc-500">{proj.customDomain}</div>}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {proj.passwordProtected ? (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-mono">
                            <Lock className="w-3 h-3" /> Protected
                          </span>
                        ) : (
                          <span className="text-zinc-500 font-mono">Public</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-zinc-300">
                        <div>{proj.views || 0} views</div>
                        <div className="text-pink-400 font-bold">{proj.guestbook?.length || 0} guestbook entries</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-mono uppercase ${
                          proj.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {proj.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleProjectStatus(proj.id, proj.status)}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-amber-400 cursor-pointer"
                        >
                          {proj.status === 'active' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id, coupleName)}
                          className="p-1 rounded bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* TEMPLATE CREATE / EDIT MODAL */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-zinc-100 text-lg">
                {editingTemplate ? 'Edit Sanctuary Template' : 'Create New Template'}
              </h3>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  value={tplName}
                  onChange={e => setTplName(e.target.value)}
                  placeholder="e.g. Royal Velvet Sanctuary"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-400 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Theme Category</label>
                  <select
                    value={tplCategory}
                    onChange={e => setTplCategory(e.target.value as CoupleThemeCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-400 text-xs"
                  >
                    <option value="Romantic">Romantic</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Cute">Cute</option>
                    <option value="Dark">Dark</option>
                    <option value="Elegant">Elegant</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Wedding">Wedding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={tplPrice}
                    onChange={e => setTplPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={tplDescription}
                  onChange={e => setTplDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Features (comma separated)</label>
                <input
                  type="text"
                  value={tplFeatures}
                  onChange={e => setTplFeatures(e.target.value)}
                  placeholder="Interactive Timeline, Audio Player, Guest Wishes"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-400 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Demo Subdomain</label>
                  <input
                    type="text"
                    value={tplDemoSubdomain}
                    onChange={e => setTplDemoSubdomain(e.target.value)}
                    placeholder="demo-romance"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Preview Image URL</label>
                  <input
                    type="url"
                    value={tplPreviewImage}
                    onChange={e => setTplPreviewImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs shadow-md cursor-pointer"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
