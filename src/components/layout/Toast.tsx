import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
      <div className="bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 max-w-md">
        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-medium text-zinc-200">{toastMessage}</span>
      </div>
    </div>
  );
};
