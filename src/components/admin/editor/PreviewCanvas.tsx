import React, { useState, useRef, useEffect } from 'react';
import { PageRecord, PageSection } from '../../../types';
import { SiteRenderer } from '../../common/SiteRenderer';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCcw, 
  ExternalLink, 
  Lock, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  ArrowUp,
  Sparkles,
  Check,
  Copy
} from 'lucide-react';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

interface PreviewCanvasProps {
  pageRecord: PageRecord;
  selectedSectionId: string | null;
  onSelectSection: (section: PageSection) => void;
  isPreviewOnly: boolean;
  deviceMode: DeviceMode;
  onChangeDeviceMode: (mode: DeviceMode) => void;
  onAddFirstSection?: () => void;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  pageRecord,
  selectedSectionId,
  onSelectSection,
  isPreviewOnly,
  deviceMode,
  onChangeDeviceMode,
  onAddFirstSection
}) => {
  const [zoomLevel, setZoomLevel] = useState<number | 'fit'>('fit');
  const [calculatedFitScale, setCalculatedFitScale] = useState<number>(1);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollableScreenRef = useRef<HTMLDivElement>(null);

  // Exact reference widths per user specification:
  // Desktop: 1440px
  // Tablet: 768px
  // Mobile: 375px
  const viewportWidths: Record<DeviceMode, number> = {
    desktop: 1440,
    tablet: 768,
    mobile: 375
  };

  const currentWidth = viewportWidths[deviceMode];

  // Calculate auto-fit scale based on the available canvas container width
  useEffect(() => {
    const updateFitScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth - 48; // padding margin
      if (containerWidth <= 0) return;

      if (deviceMode === 'desktop') {
        // Desktop is 1440px reference width
        const scale = Math.min(1, Math.max(0.4, (containerWidth) / 1440));
        setCalculatedFitScale(Math.round(scale * 100) / 100);
      } else if (deviceMode === 'tablet') {
        const scale = Math.min(1, Math.max(0.6, (containerWidth) / 768));
        setCalculatedFitScale(Math.round(scale * 100) / 100);
      } else {
        setCalculatedFitScale(1);
      }
    };

    updateFitScale();
    const observer = new ResizeObserver(updateFitScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [deviceMode]);

  // Determine active scale multiplier
  const effectiveScale = zoomLevel === 'fit' ? calculatedFitScale : zoomLevel;

  const scrollToTop = () => {
    if (scrollableScreenRef.current) {
      scrollableScreenRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCopyUrl = () => {
    const pageUrl = `https://harconxs.com/${pageRecord.slug === 'home' ? '' : pageRecord.slug}`;
    navigator.clipboard.writeText(pageUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleReload = () => {
    setReloadKey(prev => prev + 1);
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950/95 overflow-hidden relative select-none">
      {/* ---------------------------------------------------------------- */}
      {/* CANVAS SUB-HEADER TOOLBAR */}
      {/* ---------------------------------------------------------------- */}
      <div className="h-10 border-b border-zinc-800/80 px-4 bg-zinc-950 flex items-center justify-between gap-4 shrink-0 z-10 text-xs">
        {/* Left: Device Mode Switcher with Exact Dimensions */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-zinc-900 rounded-lg p-0.5 border border-zinc-800">
            <button
              onClick={() => onChangeDeviceMode('desktop')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                deviceMode === 'desktop'
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Desktop 1440px Viewport"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop (1440px)</span>
            </button>
            <button
              onClick={() => onChangeDeviceMode('tablet')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                deviceMode === 'tablet'
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Tablet 768px Viewport"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet (768px)</span>
            </button>
            <button
              onClick={() => onChangeDeviceMode('mobile')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                deviceMode === 'mobile'
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Mobile 375px Viewport"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (375px)</span>
            </button>
          </div>
        </div>

        {/* Center: Live URL & Route Badge */}
        <div className="hidden lg:flex items-center gap-2 text-zinc-400 font-mono text-[11px] bg-zinc-900/80 px-3 py-1 rounded-full border border-zinc-800">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span className="text-zinc-500">https://harconxs.com/</span>
          <span className="text-amber-400 font-bold">{pageRecord.slug}</span>
        </div>

        {/* Right: Zoom Scale, Reload, Scroll to Top */}
        <div className="flex items-center gap-2">
          {/* Zoom Options */}
          <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-0.5 border border-zinc-800 text-[11px]">
            <button
              onClick={() => setZoomLevel('fit')}
              className={`px-2 py-0.5 rounded transition-colors ${
                zoomLevel === 'fit'
                  ? 'bg-zinc-800 text-amber-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Fit ({Math.round(calculatedFitScale * 100)}%)
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className={`px-2 py-0.5 rounded transition-colors ${
                zoomLevel === 1
                  ? 'bg-zinc-800 text-amber-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              100%
            </button>
            <button
              onClick={() => setZoomLevel(0.75)}
              className={`px-2 py-0.5 rounded transition-colors ${
                zoomLevel === 0.75
                  ? 'bg-zinc-800 text-amber-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              75%
            </button>
            <button
              onClick={() => setZoomLevel(0.5)}
              className={`px-2 py-0.5 rounded transition-colors ${
                zoomLevel === 0.5
                  ? 'bg-zinc-800 text-amber-400 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              50%
            </button>
          </div>

          {/* Reload Canvas */}
          <button
            onClick={handleReload}
            title="Reload Preview Canvas"
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            title="Scroll to Top of Preview"
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* WORKSPACE CANVAS SCROLLABLE AREA */}
      {/* ---------------------------------------------------------------- */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center relative bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]"
      >
        {/* Device Wrapper with scale transform for clean responsive fitting */}
        <div
          style={{
            width: `${currentWidth}px`,
            transform: effectiveScale !== 1 ? `scale(${effectiveScale})` : undefined,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease, width 0.25s ease'
          }}
          className="shrink-0 mb-16"
        >
          {/* ============================================================ */}
          {/* A. DESKTOP BROWSER FRAME (1440px) */}
          {/* ============================================================ */}
          {deviceMode === 'desktop' && (
            <div className="w-[1440px] rounded-2xl bg-zinc-900 border border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col">
              {/* Browser Chrome Header */}
              <div className="h-11 bg-zinc-900/95 border-b border-zinc-800/80 px-4 flex items-center justify-between gap-4 select-none shrink-0">
                {/* Window Traffic Lights */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/50" />
                </div>

                {/* Back / Forward / Reload Controls */}
                <div className="flex items-center gap-1 text-zinc-500">
                  <ChevronLeft className="w-4 h-4 opacity-50" />
                  <ChevronRight className="w-4 h-4 opacity-50" />
                  <button onClick={handleReload} className="hover:text-zinc-300 ml-1">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Browser URL Search Bar */}
                <div className="flex-1 max-w-xl mx-auto flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300">
                  <div className="flex items-center gap-2 min-w-0">
                    <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="text-zinc-500">https://</span>
                    <span className="text-zinc-200 truncate">harconxs.com/{pageRecord.slug === 'home' ? '' : pageRecord.slug}</span>
                  </div>
                  <button 
                    onClick={handleCopyUrl}
                    title="Copy URL"
                    className="text-zinc-500 hover:text-amber-400 transition-colors ml-2 shrink-0 cursor-pointer"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Right Viewport Resolution Badge */}
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 font-mono text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                    1440 × Reference
                  </span>
                </div>
              </div>

              {/* Isolated Independent Scroll Screen */}
              <div 
                key={`screen-desktop-${reloadKey}`}
                ref={scrollableScreenRef}
                className="w-full h-[900px] bg-zinc-950 overflow-y-auto overflow-x-hidden relative"
              >
                <SiteRenderer
                  pageRecord={pageRecord}
                  isLiveStorefront={false}
                  previewMode={isPreviewOnly}
                  selectedSectionId={selectedSectionId}
                  onSelectSection={onSelectSection}
                  showInspectorOutline={!isPreviewOnly}
                  onAddFirstSection={onAddFirstSection}
                />
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* B. TABLET FRAME (768px) */}
          {/* ============================================================ */}
          {deviceMode === 'tablet' && (
            <div className="w-[768px] mx-auto rounded-[36px] p-3.5 bg-zinc-900 border-4 border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col">
              {/* Tablet Bezel Top Camera */}
              <div className="h-6 flex items-center justify-center relative select-none">
                <div className="w-3 h-3 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-cyan-900/60" />
                </div>
                <span className="absolute right-2 text-[10px] font-mono text-zinc-500 font-semibold">
                  768 × 1024
                </span>
              </div>

              {/* Isolated Screen */}
              <div 
                key={`screen-tablet-${reloadKey}`}
                ref={scrollableScreenRef}
                className="w-full h-[960px] rounded-[24px] bg-zinc-950 overflow-y-auto overflow-x-hidden relative border border-zinc-800/80"
              >
                <SiteRenderer
                  pageRecord={pageRecord}
                  isLiveStorefront={false}
                  previewMode={isPreviewOnly}
                  selectedSectionId={selectedSectionId}
                  onSelectSection={onSelectSection}
                  showInspectorOutline={!isPreviewOnly}
                  onAddFirstSection={onAddFirstSection}
                />
              </div>

              {/* Bottom Bezel Home Bar */}
              <div className="h-4 flex items-center justify-center">
                <div className="w-28 h-1 rounded-full bg-zinc-700/60" />
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* C. MOBILE SMARTPHONE FRAME (375px) */}
          {/* ============================================================ */}
          {deviceMode === 'mobile' && (
            <div className="w-[375px] mx-auto rounded-[48px] p-3 bg-zinc-900 border-4 border-zinc-800 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] flex flex-col relative">
              {/* Top Dynamic Island / Speaker Pill */}
              <div className="h-7 px-4 flex items-center justify-between text-[11px] font-semibold text-zinc-300 select-none">
                <span>9:41</span>
                {/* Dynamic Island pill */}
                <div className="w-24 h-4 bg-zinc-950 rounded-full border border-zinc-800/80 flex items-center justify-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-cyan-950 border border-cyan-800/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                </div>
                <span className="text-[10px] font-mono text-zinc-400">5G • 100%</span>
              </div>

              {/* Isolated Independent Mobile Screen */}
              <div 
                key={`screen-mobile-${reloadKey}`}
                ref={scrollableScreenRef}
                className="w-full h-[760px] rounded-[36px] bg-zinc-950 overflow-y-auto overflow-x-hidden relative border border-zinc-800/80"
              >
                <SiteRenderer
                  pageRecord={pageRecord}
                  isLiveStorefront={false}
                  previewMode={isPreviewOnly}
                  selectedSectionId={selectedSectionId}
                  onSelectSection={onSelectSection}
                  showInspectorOutline={!isPreviewOnly}
                  onAddFirstSection={onAddFirstSection}
                />
              </div>

              {/* Bottom Home Indicator */}
              <div className="h-5 flex items-center justify-center">
                <div className="w-32 h-1 rounded-full bg-zinc-700/70" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
