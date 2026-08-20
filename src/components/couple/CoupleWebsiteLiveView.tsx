import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { CoupleWebsiteProject } from '../../types';
import {
  Heart,
  Music,
  Calendar,
  Sparkles,
  Share2,
  Copy,
  Check,
  Send,
  Volume2,
  VolumeX,
  Clock,
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  QrCode,
  Eye,
  X,
  Lock,
  Unlock,
  Key,
  Play
} from 'lucide-react';

interface CoupleWebsiteLiveViewProps {
  project?: CoupleWebsiteProject;
  subdomain?: string;
  onBack?: () => void;
}

export const CoupleWebsiteLiveView: React.FC<CoupleWebsiteLiveViewProps> = ({
  project: propProject,
  subdomain: propSubdomain,
  onBack
}) => {
  const {
    coupleWebsites,
    coupleTemplates,
    addGuestbookEntry,
    likeCoupleWebsite,
    currentUser,
    setCurrentView,
    setSelectedEditingProject,
    showToast
  } = useStore();

  // Find project by prop or subdomain
  const project = propProject || coupleWebsites.find(
    p => p.subdomain === propSubdomain || p.id === propSubdomain
  ) || coupleWebsites[0];

  const template = coupleTemplates.find(t => t.id === project?.templateId) || coupleTemplates[0];

  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnteredSanctuary, setHasEnteredSanctuary] = useState(false);
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [guestAuthor, setGuestAuthor] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [isSubmittingGuestbook, setIsSubmittingGuestbook] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [heartsCount, setHeartsCount] = useState(project?.heartsGiven || 12);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleEnterSanctuary = () => {
    // If project has passcode protection, verify it
    if (project?.passcode && project.passcode.trim() !== '') {
      if (enteredPasscode.trim() !== project.passcode.trim()) {
        setPasscodeError(true);
        showToast('Incorrect Sanctuary Passcode. Please check with the couple.');
        return;
      }
    }
    setHasEnteredSanctuary(true);
    if (audioRef.current && project.musicTrack) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
      });
    }
    showToast(`✨ Welcome to the Sanctuary of ${project.partner1Name} & ${project.partner2Name}`);
  };

  // Live Timer
  const [elapsed, setElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!project?.anniversaryDate) return;

    const updateTimer = () => {
      const start = new Date(project.anniversaryDate).getTime();
      const now = new Date().getTime();
      const diffMs = Math.max(0, now - start);

      const totalSeconds = Math.floor(diffMs / 1000);
      const totalDays = Math.floor(totalSeconds / 86400);

      const years = Math.floor(totalDays / 365.25);
      const months = Math.floor((totalDays % 365.25) / 30.4375);
      const days = Math.floor(totalDays % 30.4375);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setElapsed({ years, months, days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [project?.anniversaryDate]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleCopyLink = () => {
    const url = `https://${project.subdomain}.harconxsshop.com`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('Unique Sanctuary URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGiveHeart = () => {
    if (!liked) {
      setLiked(true);
      setHeartsCount(prev => prev + 1);
      likeCoupleWebsite(project.id);
      showToast('💖 Sent love to this couple!');
    }
  };

  const handlePostGuestbook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestMessage.trim()) return;

    setIsSubmittingGuestbook(true);
    const authorName = guestAuthor.trim() || currentUser?.name || 'Loving Guest';
    await addGuestbookEntry(project.id, authorName, guestMessage.trim());
    setGuestAuthor('');
    setGuestMessage('');
    setIsSubmittingGuestbook(false);
  };

  const fontClass = project.fontStyle === 'Cinzel'
    ? 'font-serif tracking-widest'
    : project.fontStyle === 'Dancing Script'
    ? 'font-serif italic'
    : project.fontStyle === 'Cormorant Garamond'
    ? 'font-serif'
    : 'font-serif';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-rose-500 selection:text-white relative">
      {/* Background Audio */}
      {project.musicTrack && (
        <audio
          ref={audioRef}
          src={project.musicTrack}
          loop
          preload="auto"
        />
      )}

      {/* SANCTUARY ENTRANCE PORTAL & CEREMONY OVERLAY */}
      {!hasEnteredSanctuary && (
        <div id="sanctuary-entrance-portal" className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-900/90 border border-rose-500/30 text-center space-y-6 shadow-2xl shadow-rose-950/50 relative overflow-hidden">
            {/* Ambient Background Aura */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Heart className="w-8 h-8 fill-rose-500 text-rose-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-rose-500/10 text-rose-300 text-[11px] font-mono font-bold uppercase tracking-widest border border-rose-500/20">
                Eternal Couple Sanctuary
              </span>
              <h2 className={`text-3xl sm:text-4xl font-bold text-white tracking-tight ${fontClass}`}>
                {project.partner1Name} <span className="text-rose-400 font-light">&</span> {project.partner2Name}
              </h2>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                "{project.heroTagline || 'Where love and precious memories are preserved for eternity.'}"
              </p>
            </div>

            {/* If passcode protected, show password input */}
            {project.passcode && (
              <div className="space-y-2 text-left pt-2">
                <label className="block text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Sanctuary Key / Passcode
                </label>
                <input
                  type="password"
                  value={enteredPasscode}
                  onChange={(e) => {
                    setEnteredPasscode(e.target.value);
                    setPasscodeError(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEnterSanctuary();
                  }}
                  placeholder="Enter secret love key..."
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border text-zinc-100 text-xs focus:outline-none ${passcodeError ? 'border-rose-500' : 'border-zinc-700 focus:border-rose-400'}`}
                />
                {passcodeError && (
                  <p className="text-[11px] text-rose-400 font-medium">
                    Incorrect key. Please request access from the couple.
                  </p>
                )}
              </div>
            )}

            <div className="pt-2 space-y-3">
              <button
                id="enter-sanctuary-btn"
                onClick={handleEnterSanctuary}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Enter Sanctuary</span>
              </button>

              {onBack && (
                <button
                  onClick={onBack}
                  className="w-full py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs transition-colors cursor-pointer"
                >
                  Return to Studio
                </button>
              )}
            </div>

            <p className="text-[10px] text-zinc-500">
              🎵 Entering will initiate soundtrack &amp; relationship memory timeline
            </p>
          </div>
        </div>
      )}

      {/* Floating Top Control Bar */}
      <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Studio</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-mono text-zinc-300 truncate font-semibold">
                {project.customDomain || `${project.subdomain}.harconxsshop.com`}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20 hidden md:inline-flex">
                {template.name} ({template.version || 'v2.0'})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Music Player Button */}
            {project.musicTrack && (
              <button
                onClick={toggleMusic}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30 animate-pulse'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                }`}
                title="Toggle soundtrack"
              >
                {isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isPlaying ? 'Soundtrack Playing' : 'Play Music'}</span>
              </button>
            )}

            {/* Like / Hearts button */}
            <button
              onClick={handleGiveHeart}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                liked
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-rose-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="font-mono text-xs">{heartsCount}</span>
            </button>

            {/* QR Code button */}
            <button
              onClick={() => setShowQrModal(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="View QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sanctuary QR</span>
            </button>

            {/* Share / Copy button */}
            <button
              onClick={handleCopyLink}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>

            {/* If user owns this project, allow quick edit */}
            {currentUser && currentUser.id === project.customerId && (
              <button
                onClick={() => {
                  setSelectedEditingProject(project);
                  setCurrentView('couple-builder');
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer hidden lg:inline-flex"
              >
                Edit Sanctuary
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative min-h-[85vh] flex items-center justify-center text-center overflow-hidden px-4">
        {/* Parallax Background Photo */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              project.photos[0] ||
              template.previewImage ||
              'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1600&auto=format&fit=crop&q=80'
            }
            alt={`${project.partner1Name} and ${project.partner2Name}`}
            className="w-full h-full object-cover opacity-30 filter blur-[0.5px] scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/80 to-zinc-950" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6 pt-12 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold backdrop-blur-md">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40 animate-pulse" />
            <span>Dedicated Love Sanctuary</span>
          </div>

          {/* Couple Names */}
          <h1 className={`text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white ${fontClass}`}>
            <span style={{ color: project.primaryColor || '#fb7185' }}>{project.partner1Name}</span>
            <span className="text-zinc-500 mx-3 font-light">&</span>
            <span style={{ color: project.primaryColor || '#fb7185' }}>{project.partner2Name}</span>
          </h1>

          {/* Hero Tagline */}
          <p className="text-base sm:text-xl text-zinc-300 font-light max-w-2xl mx-auto leading-relaxed">
            "{project.heroTagline}"
          </p>

          {/* Anniversary Date Badge */}
          {project.anniversaryDate && (
            <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-xl">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Anniversary: {new Date(project.anniversaryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          )}

          {/* LIVE RELATIONSHIP COUNTDOWN / TIMER */}
          <div className="pt-6">
            <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/90 rounded-3xl p-6 max-w-2xl mx-auto shadow-2xl">
              <div className="flex items-center justify-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                <span>In Love For Every Second</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3 text-center">
                <div className="bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800/80">
                  <span className="font-mono text-xl sm:text-3xl font-bold text-white block">{elapsed.years}</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Years</span>
                </div>
                <div className="bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800/80">
                  <span className="font-mono text-xl sm:text-3xl font-bold text-white block">{elapsed.months}</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Months</span>
                </div>
                <div className="bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800/80">
                  <span className="font-mono text-xl sm:text-3xl font-bold text-white block">{elapsed.days}</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Days</span>
                </div>
                <div className="bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800/80">
                  <span className="font-mono text-xl sm:text-3xl font-bold text-white block">{elapsed.hours}</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Hours</span>
                </div>
                <div className="bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800/80">
                  <span className="font-mono text-xl sm:text-3xl font-bold text-white block">{elapsed.minutes}</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Mins</span>
                </div>
                <div className="bg-zinc-950/80 p-3 rounded-2xl border border-rose-900/40 bg-rose-950/20">
                  <span className="font-mono text-xl sm:text-3xl font-bold text-rose-400 block">{elapsed.seconds}</span>
                  <span className="text-[10px] text-rose-300 uppercase tracking-wider font-semibold">Secs</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* OUR STORY SECTION */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
              {project.ourStoryTitle || 'Where Our Love Story Began'}
            </h2>
          </div>
          
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans whitespace-pre-line">
            {project.ourStoryText}
          </p>

          {project.secretMessage && (
            <div className="bg-rose-950/30 border border-rose-800/40 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                <span>Our Secret Vow</span>
              </span>
              <p className="text-xs sm:text-sm text-rose-100 italic">"{project.secretMessage}"</p>
            </div>
          )}
        </section>

        {/* MEMORY TIMELINE MILESTONES */}
        {project.memories && project.memories.length > 0 && (
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400">Chapters of Us</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">Our Journey & Milestones</h2>
            </div>

            <div className="relative border-l-2 border-zinc-800 ml-4 sm:ml-32 space-y-8 py-4">
              {project.memories.map((mem, idx) => (
                <div key={mem.id || idx} className="relative pl-6 sm:pl-8 group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-zinc-950 border-2 border-rose-500 group-hover:scale-125 transition-transform" />

                  {/* Left date on desktop */}
                  <span className="hidden sm:block absolute -left-36 top-1 text-xs font-mono text-zinc-400 font-semibold text-right w-28">
                    {mem.date}
                  </span>

                  <div className="bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 space-y-3 transition-all">
                    <span className="sm:hidden text-xs font-mono text-rose-400 font-semibold block">{mem.date}</span>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-zinc-100">{mem.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">{mem.description}</p>
                    
                    {mem.image && (
                      <div
                        onClick={() => setSelectedPhoto(mem.image!)}
                        className="rounded-xl overflow-hidden aspect-video max-w-md border border-zinc-800 cursor-pointer group/img relative"
                      >
                        <img
                          src={mem.image}
                          alt={mem.title}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PHOTO GALLERY */}
        {project.photos && project.photos.length > 0 && (
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Captured Moments</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">Visual Memory Gallery</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {project.photos.map((photoUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(photoUrl)}
                  className="rounded-2xl overflow-hidden border border-zinc-800 aspect-square bg-zinc-900 relative group cursor-pointer"
                >
                  <img
                    src={photoUrl}
                    alt={`Moment ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-xs font-semibold text-white">Moment #{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GUESTBOOK & LOVE NOTES WALL */}
        <section className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-rose-400" />
                <h2 className="text-2xl font-serif font-bold text-white">Guestbook & Warm Wishes</h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">Leave a loving memory, blessings, or wedding congratulations for {project.partner1Name} & {project.partner2Name}.</p>
            </div>
            <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300">
              {project.guestbook?.length || 0} notes written
            </span>
          </div>

          {/* Form to add note */}
          <form onSubmit={handlePostGuestbook} className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Sign the Love Wall</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={guestAuthor}
                onChange={(e) => setGuestAuthor(e.target.value)}
                placeholder="Your Name (e.g. Elena & Marcus)"
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-rose-500"
              />
              <div className="sm:col-span-2 flex gap-2">
                <input
                  type="text"
                  value={guestMessage}
                  onChange={(e) => setGuestMessage(e.target.value)}
                  placeholder="Your heartfelt wishes, funny memory or blessing..."
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  disabled={isSubmittingGuestbook || !guestMessage.trim()}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Sign</span>
                </button>
              </div>
            </div>
          </form>

          {/* List of guestbook notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.guestbook && project.guestbook.length > 0 ? (
              project.guestbook.map((note) => (
                <div
                  key={note.id}
                  className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 space-y-2 relative"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-rose-300 truncate">{note.author}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{note.date}</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">"{note.message}"</p>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-xs text-zinc-500">
                Be the first to sign the love sanctuary guestbook!
              </div>
            )}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-10 text-center text-xs text-zinc-500 space-y-2">
        <p className="font-serif">
          Crafted with eternal love for <span className="text-zinc-300 font-bold">{project.partner1Name} & {project.partner2Name}</span>
        </p>
        <p className="text-[11px] text-zinc-600 font-mono">
          Powered by HARCONXS Couple Sanctuaries Engine • Lifetime Hosted
        </p>
      </footer>

      {/* PHOTO LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border border-zinc-800">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPhoto}
              alt=""
              className="w-full h-full object-contain max-h-[85vh]"
            />
          </div>
        </div>
      )}

      {/* QR CODE MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-sm w-full space-y-5 text-center shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Sanctuary QR Code</h3>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 bg-white rounded-2xl inline-block mx-auto shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://${project.subdomain}.harconxsshop.com`}
                alt="Sanctuary QR"
                className="w-44 h-44"
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-mono text-amber-300 truncate">https://{project.subdomain}.harconxsshop.com</p>
              <p className="text-[11px] text-zinc-400">Scan to visit on smartphone or print for your wedding / anniversary invitations.</p>
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Direct Link</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
