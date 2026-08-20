import React, { useState } from 'react';
import { MessageCircleHeart, Send, Heart, Sparkles, Check } from 'lucide-react';
import { CoupleSite, CoupleSiteSection, CoupleSiteThemeConfig, CoupleGuestbookEntryData } from '../types';
import { submitCoupleGuestbookWish } from '../services/coupleEngineService';

interface CoupleWishesGuestbookSectionProps {
  site: CoupleSite;
  section: CoupleSiteSection;
  theme: CoupleSiteThemeConfig;
  initialEntries?: CoupleGuestbookEntryData[];
}

export const CoupleWishesGuestbookSection: React.FC<CoupleWishesGuestbookSectionProps> = ({
  site,
  section,
  theme,
  initialEntries = []
}) => {
  const content = section.content || {};
  const [entries, setEntries] = useState<CoupleGuestbookEntryData[]>(initialEntries);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [heartsCount, setHeartsCount] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      const newEntry = await submitCoupleGuestbookWish(
        site.id,
        author.trim() || 'Anonymous Well-Wisher',
        message.trim(),
        heartsCount
      );

      setEntries([newEntry, ...entries]);
      setMessage('');
      setAuthor('');
      setSubmittedSuccess(true);
      setTimeout(() => setSubmittedSuccess(false), 4000);
    } catch {
      // Handled gracefully
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="wishes_guestbook"
      className="py-20 px-4 relative overflow-hidden"
      style={{
        backgroundColor: theme.palette.surface,
        color: theme.palette.textPrimary,
        borderTop: `1px solid ${theme.palette.border}`
      }}
    >
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: theme.palette.primary }}>
            <MessageCircleHeart className="w-3.5 h-3.5" />
            <span>Blessings</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.palette.textPrimary
            }}
          >
            {section.title || 'Wishes & Blessings'}
          </h2>
          {section.subtitle && (
            <p className="text-xs sm:text-sm max-w-md mx-auto opacity-80" style={{ color: theme.palette.textSecondary }}>
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Guestbook Form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl border shadow-xl space-y-4"
          style={{
            backgroundColor: theme.palette.background,
            borderColor: theme.palette.border
          }}
        >
          <h3 className="text-base font-bold flex items-center gap-2" style={{ color: theme.palette.textPrimary }}>
            <Sparkles className="w-4 h-4" style={{ color: theme.palette.primary }} />
            <span>Leave a Blessing for the Couple</span>
          </h3>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your Name (e.g. Aunt Clara or College Friends)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-xs outline-none border transition-all"
              style={{
                backgroundColor: theme.palette.surface,
                borderColor: theme.palette.border,
                color: theme.palette.textPrimary
              }}
            />

            <textarea
              placeholder={content.placeholderText || 'Write your heartfelt message, memories, or toast...'}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-xs outline-none border transition-all resize-none"
              style={{
                backgroundColor: theme.palette.surface,
                borderColor: theme.palette.border,
                color: theme.palette.textPrimary
              }}
            />

            {/* Heart Rating Selector */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium" style={{ color: theme.palette.textSecondary }}>
                  Love Sent:
                </span>
                {[1, 2, 3, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setHeartsCount(num)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      heartsCount === num ? 'scale-110 shadow-sm' : 'opacity-60'
                    }`}
                    style={{
                      backgroundColor: heartsCount === num ? `${theme.palette.primary}30` : 'transparent',
                      borderColor: heartsCount === num ? theme.palette.primary : theme.palette.border,
                      color: heartsCount === num ? theme.palette.primary : theme.palette.textSecondary
                    }}
                  >
                    ❤️ x{num}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 cursor-pointer"
                style={{
                  backgroundColor: theme.palette.primary,
                  color: theme.palette.background
                }}
              >
                {submittedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Inscribed!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Inscribing...' : 'Send Wish'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Wishes Feed */}
        {entries.length > 0 && (
          <div className="max-w-2xl mx-auto space-y-4 pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-center" style={{ color: theme.palette.textSecondary }}>
              Recent Inscriptions ({entries.length})
            </h4>

            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl border space-y-1.5"
                  style={{
                    backgroundColor: theme.palette.background,
                    borderColor: theme.palette.border
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: theme.palette.textPrimary }}>
                      {entry.author}
                    </span>
                    <div className="flex items-center gap-1 text-[11px]" style={{ color: theme.palette.primary }}>
                      <Heart className="w-3 h-3 fill-current text-rose-400" />
                      <span>x{entry.hearts}</span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90" style={{ color: theme.palette.textSecondary }}>
                    {entry.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
