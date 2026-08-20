import React, { useState } from 'react';
import { PageRecord, PageRevision } from '../../../types';
import { 
  X, 
  History, 
  RotateCcw, 
  Plus, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Check,
  AlertTriangle
} from 'lucide-react';

interface RevisionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageRecord: PageRecord;
  revisions: PageRevision[];
  onCreateSnapshot: (name: string) => Promise<PageRevision | null>;
  onRestoreSnapshot: (revision: PageRevision) => Promise<boolean>;
}

export const RevisionsModal: React.FC<RevisionsModalProps> = ({
  isOpen,
  onClose,
  pageRecord,
  revisions,
  onCreateSnapshot,
  onRestoreSnapshot
}) => {
  const [snapshotName, setSnapshotName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!snapshotName.trim()) return;
    setIsCreating(true);
    try {
      await onCreateSnapshot(snapshotName.trim());
      setSnapshotName('');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestore = async (rev: PageRevision) => {
    if (!window.confirm(`Are you sure you want to restore the page to snapshot "${rev.revisionName}"? Current unsaved edits will be replaced.`)) {
      return;
    }
    setRestoringId(rev.id);
    try {
      const success = await onRestoreSnapshot(rev);
      if (success) {
        onClose();
      }
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-zinc-100">
                Revision Snapshots
              </h2>
              <p className="text-xs text-zinc-400">
                Manage point-in-time state backups for "{pageRecord.title}".
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create Snapshot Form */}
        <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/40 shrink-0">
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Pre-Valentine Drop Layout, Seasonal Refresh..."
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={isCreating || !snapshotName.trim()}
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 disabled:opacity-50 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isCreating ? 'Capturing...' : 'Capture Snapshot'}</span>
            </button>
          </form>
        </div>

        {/* Snapshots List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {revisions.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-zinc-600 opacity-60" />
              <p className="text-xs">No revision snapshots captured yet for this page.</p>
              <p className="text-[11px] text-zinc-600">
                Snapshots are automatically created on each live publish or can be captured manually above.
              </p>
            </div>
          ) : (
            revisions.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-zinc-100 truncate">
                      {rev.revisionName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-mono">
                      v{rev.versionNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                    <span>
                      {new Date(rev.createdAt).toLocaleDateString()} at{' '}
                      {new Date(rev.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>•</span>
                    <span>{rev.snapshotData?.sections?.length || 0} Sections</span>
                  </div>
                </div>

                <button
                  disabled={restoringId === rev.id}
                  onClick={() => handleRestore(rev)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{restoringId === rev.id ? 'Restoring...' : 'Restore'}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
