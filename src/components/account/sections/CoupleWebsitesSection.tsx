import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { CoupleWebsiteProject } from '../../../types';
import {
  Globe,
  Heart,
  Eye,
  Edit2,
  Trash2,
  ExternalLink,
  Plus,
  Lock,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CoupleWebsitesSection: React.FC = () => {
  const {
    coupleWebsites,
    publishCoupleWebsite,
    deleteCoupleWebsite,
    setSelectedEditingProject,
    showToast
  } = useStore();
  const navigate = useNavigate();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleTogglePublish = async (projectId: string, currentStatus: boolean) => {
    await publishCoupleWebsite(projectId, !currentStatus);
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this Couple Sanctuary website?')) {
      await deleteCoupleWebsite(projectId);
    }
  };

  const handleOpenStudio = (project: CoupleWebsiteProject) => {
    setSelectedEditingProject(project);
    navigate('/couple-websites');
  };

  return (
    <div className="space-y-6">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-zinc-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-rose-400" />
            Couple Websites & Love Sanctuaries ({coupleWebsites.length})
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Dedicated digital sanctuaries celebrating your milestones, love letters, and anniversaries.
          </p>
        </div>

        <button
          id="create-couple-website-btn"
          onClick={() => navigate('/couple-websites')}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Love Sanctuary
        </button>
      </div>

      {/* Projects Grid */}
      {coupleWebsites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {coupleWebsites.map(project => (
            <div
              key={project.id}
              id={`couple-website-card-${project.id}`}
              className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between"
            >
              <div>
                {/* Meta Top Bar */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-serif font-bold text-zinc-100">
                      {project.partner1Name || project.partner1 || 'Partner 1'} & {project.partner2Name || project.partner2 || 'Partner 2'}
                    </h3>
                    <span className="text-xs text-zinc-400 font-mono flex items-center gap-1 mt-0.5">
                      <Globe className="w-3.5 h-3.5 text-zinc-500" />
                      {project.subdomain}.harconxsshop.com
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      project.isPublished
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    {project.isPublished ? 'Live on Web' : 'Draft / Private'}
                  </span>
                </div>

                {/* Anniversary & Story */}
                <div className="text-xs text-zinc-300 space-y-2 my-4">
                  {project.anniversaryDate && (
                    <p className="flex items-center gap-1.5 text-zinc-400">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      Anniversary: <strong className="text-zinc-200">{project.anniversaryDate}</strong>
                    </p>
                  )}
                  <p className="text-zinc-400 line-clamp-2 italic">
                    "{project.ourStoryText || project.story || project.welcomeMessage || 'Together forever in love.'}"
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-center text-xs">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Visits</span>
                    <span className="font-mono font-bold text-zinc-200">{project.views || 1}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Hearts</span>
                    <span className="font-mono font-bold text-rose-400">{project.heartsGiven || 0}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Guestbook</span>
                    <span className="font-mono font-bold text-amber-300">{project.guestbook?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-zinc-800/80 mt-4 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => handleTogglePublish(project.id, Boolean(project.isPublished))}
                  className="text-xs text-zinc-400 hover:text-zinc-200 transition"
                >
                  {project.isPublished ? 'Unpublish to Draft' : 'Publish Live'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenStudio(project)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-400" /> Studio
                  </button>

                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition"
                    title="Delete sanctuary"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800">
          <Globe className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
          <h3 className="text-sm font-semibold text-zinc-200">No couple websites created yet</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto mb-4">
            Build your private, custom interactive sanctuary with your love timeline, music playlist, and guestbook.
          </p>
          <button
            onClick={() => navigate('/couple-websites')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Launch Your Sanctuary
          </button>
        </div>
      )}
    </div>
  );
};
