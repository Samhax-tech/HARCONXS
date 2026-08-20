import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Heart, Calendar } from 'lucide-react';
import { CoupleSite, CoupleSiteSection, CoupleSiteThemeConfig } from '../types';

interface CoupleGallerySectionProps {
  site: CoupleSite;
  section: CoupleSiteSection;
  theme: CoupleSiteThemeConfig;
}

export const CoupleGallerySection: React.FC<CoupleGallerySectionProps> = ({
  site,
  section,
  theme
}) => {
  const content = section.content || {};
  const items = content.items || [];
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedPhotoIdx(index);
  };

  const closeLightbox = () => {
    setSelectedPhotoIdx(null);
  };

  const nextPhoto = () => {
    if (selectedPhotoIdx === null) return;
    setSelectedPhotoIdx((selectedPhotoIdx + 1) % items.length);
  };

  const prevPhoto = () => {
    if (selectedPhotoIdx === null) return;
    setSelectedPhotoIdx((selectedPhotoIdx - 1 + items.length) % items.length);
  };

  return (
    <section
      id="gallery"
      className="py-20 px-4 relative overflow-hidden"
      style={{
        backgroundColor: theme.palette.background,
        color: theme.palette.textPrimary
      }}
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: theme.palette.primary }}>
            <Camera className="w-3.5 h-3.5" />
            <span>Memories</span>
          </div>
          <h2
            className="text-3xl sm:text-5xl font-bold tracking-tight"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.palette.textPrimary
            }}
          >
            {section.title || 'Moments Frozen In Time'}
          </h2>
          {section.subtitle && (
            <p className="text-xs sm:text-sm max-w-md mx-auto opacity-80" style={{ color: theme.palette.textSecondary }}>
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any, idx: number) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx)}
              className="group relative rounded-2xl overflow-hidden border cursor-pointer aspect-[4/3] shadow-lg transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
              style={{
                backgroundColor: theme.palette.surface,
                borderColor: theme.palette.border
              }}
            >
              <img
                src={item.url}
                alt={item.caption || 'Couple photo'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-95 group-hover:brightness-100"
                loading="lazy"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                {item.caption && (
                  <p className="text-xs font-semibold drop-shadow line-clamp-2">
                    {item.caption}
                  </p>
                )}
                {item.date && (
                  <div className="flex items-center gap-1 text-[10px] text-zinc-300 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIdx !== null && items[selectedPhotoIdx] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
            title="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
            title="Previous Photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
            title="Next Photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={items[selectedPhotoIdx].url}
              alt={items[selectedPhotoIdx].caption || 'Couple photo preview'}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            {items[selectedPhotoIdx].caption && (
              <div className="text-center text-zinc-200 text-xs sm:text-sm max-w-lg px-4">
                <p>{items[selectedPhotoIdx].caption}</p>
                {items[selectedPhotoIdx].date && (
                  <span className="text-[11px] text-zinc-400 font-mono mt-1 block">
                    {items[selectedPhotoIdx].date}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
