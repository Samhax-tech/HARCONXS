import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCoupleSiteBundle } from '../couple-engine/services/coupleEngineService';
import { CoupleSiteBundle } from '../couple-engine/types';
import { CoupleSiteRenderer } from '../couple-engine/CoupleSiteRenderer';
import { Heart, Sparkles, AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CoupleSiteRuntimePage: React.FC = () => {
  const { slug, pageSlug } = useParams<{ slug: string; pageSlug?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [bundle, setBundle] = useState<CoupleSiteBundle | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setNotFound(false);

    // Determine identifier from slug or custom domain
    const hostname = window.location.hostname;
    const isCustomDomain = 
      !hostname.includes('localhost') && 
      !hostname.includes('127.0.0.1') && 
      !hostname.includes('run.app') && 
      !hostname.includes('harconxs.com');

    const identifier = isCustomDomain ? hostname : (slug || 'sarah-and-james');

    fetchCoupleSiteBundle(identifier, pageSlug || 'home', user?.id)
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setBundle(data);
          setNotFound(false);
          // Set dynamic page title
          document.title = `${data.site.partner1_name} & ${data.site.partner2_name} | ${data.site.title}`;
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setNotFound(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug, pageSlug, user?.id]);

  const handleNavigatePage = (newPageSlug: string) => {
    if (newPageSlug === 'home') {
      navigate(`/couple/${slug}`);
    } else {
      navigate(`/couple/${slug}/${newPageSlug}`);
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-200 p-4 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500 absolute inset-0 m-auto animate-pulse" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-rose-400">
            Unlocking Sanctuary
          </h2>
          <p className="text-xs text-zinc-500">Preparing timeless memories and chronicles...</p>
        </div>
      </div>
    );
  }

  // Not Found / Private Sanctuary Screen
  if (notFound || !bundle) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 text-zinc-200">
        <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-serif">
              Sanctuary Unavailable
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              This couple website either does not exist, is currently in unpublished draft status, or requires authentication from its owner.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={() => navigate('/couple/sarah-and-james')}
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Demo Sanctuary (Sarah & James)</span>
            </button>

            <button
              onClick={() => navigate('/couple-websites')}
              className="w-full py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Couple Website Templates</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CoupleSiteRenderer
      bundle={bundle}
      onNavigatePage={handleNavigatePage}
    />
  );
};

export default CoupleSiteRuntimePage;
