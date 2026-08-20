import React from 'react';
import { Award, Truck, Gift, ShieldCheck, Sparkles } from 'lucide-react';

interface TrustBenefitsSectionProps {
  content?: {
    pillars?: {
      icon?: string;
      title: string;
      desc: string;
    }[];
  };
}

export const TrustBenefitsSection: React.FC<TrustBenefitsSectionProps> = ({ content }) => {
  const defaultPillars = [
    {
      icon: 'Award',
      title: 'Master Craftsmanship',
      desc: 'Laser-calibrated micron precision with surgical titanium, 18K solid gold & archival acrylic.'
    },
    {
      icon: 'Truck',
      title: 'Pan-India Insured Transit',
      desc: 'Express dispatch with BlueDart & Delhivery under 100% loss & damage insurance protection.'
    },
    {
      icon: 'Gift',
      title: 'Signature Gift Packaging',
      desc: 'Every piece arrives in an archival velvet keepsake box, embossed wax seal & satin ribbon.'
    },
    {
      icon: 'ShieldCheck',
      title: 'Encrypted & Guaranteed',
      desc: '256-bit SSL encrypted checkout with 100% money-back satisfaction and warranty guarantee.'
    }
  ];

  const pillars = content?.pillars && content.pillars.length > 0 ? content.pillars : defaultPillars;

  const renderIcon = (name?: string) => {
    switch (name) {
      case 'Award':
        return <Award className="w-5 h-5 text-amber-400" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-amber-400" />;
      case 'Gift':
        return <Gift className="w-5 h-5 text-amber-400" />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section id="sec-trust-benefits" className="py-14 sm:py-20 bg-zinc-950 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-6 flex flex-col items-start gap-4 hover:border-zinc-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                {renderIcon(pillar.icon)}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-bold text-zinc-100">{pillar.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
