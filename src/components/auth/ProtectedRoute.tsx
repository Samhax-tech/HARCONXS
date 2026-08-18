import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Shield, LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isUserLoggedIn, openAuthModalWithAction } = useStore();
  const location = useLocation();

  if (!isUserLoggedIn) {
    return (
      <div className="min-h-[70vh] bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-serif text-white">Member Access Required</h2>
            <p className="text-xs text-zinc-400">
              Please sign in to access your HARCONXS account, order history, bespoke projects, and wishlist.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => openAuthModalWithAction()}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Email or Google</span>
            </button>
            <Navigate to="/login" state={{ from: location }} replace />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
