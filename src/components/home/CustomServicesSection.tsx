import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ArrowRight, Check, Compass, Layers, CheckCircle2 } from 'lucide-react';

interface CustomServicesSectionProps {
  content?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    steps?: {
      step: string;
      title: string;
      desc: string;
    }[];
  };
}

export const CustomServicesSection: React.FC<CustomServicesSectionProps> = ({ content }) => {
  const { setCurrentView } = useStore();

  const defaultSteps = [
    {
      step: '01',
      title: 'Submit Design Brief',
      desc: 'Specify coordinates, anniversary dates, sound wave audio clips, custom vector sketches, or precious metal choice.'
    },
    {
      step: '02',
      title: 'Approve 3D Digital Proof',
      desc: 'Our artisans render a photorealistic 3D CAD visualization in under 6 hours for your direct review.'
    },
    {
      step: '03',
      title: 'Artisan Laser Fabrication',
      desc: 'Precision laser-etched and hand-polished in our master studio, delivered in our signature velvet packaging.'
    }
  ];

  const steps = content?.steps && content.steps.length > 0 ? content.steps : defaultSteps;

  return (
    <section id="sec-custom-services" className="py-16 sm:py-24 bg-zinc-950 border-b border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{content?.badge || 'Bespoke Studio'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-zinc-100 leading-tight">
            {content?.title || 'Turn Your Intimate Memories Into Tangible Art'}
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
            {content?.subtitle || 'Have a distinct creative vision? Work 1-on-1 with our master craftspeople to create one-of-a-kind heirloom pieces, engraved coordinates, and custom commemorative plaques.'}
          </p>
        </div>

        {/* 3 Step Roadmap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-3xl sm:text-4xl font-bold text-zinc-700 group-hover:text-amber-400 transition-colors">
                    {item.step}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-amber-400">
                    <Check className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-zinc-100 mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Hub */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setCurrentView('custom-builder')}
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{content?.ctaText || 'Start Custom Commission'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentView('custom-portal')}
            className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 font-medium px-6 py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Check Commission Status (#CO)</span>
          </button>
        </div>

      </div>
    </section>
  );
};
