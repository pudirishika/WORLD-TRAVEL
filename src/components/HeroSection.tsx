import React from 'react';
import { ArrowRight, Clock, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onStartPlanning: () => void;
  onTrySameDayDemo: () => void;
  onExploreDestinations: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartPlanning,
  onTrySameDayDemo,
  onExploreDestinations,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
      {/* Background visual asset with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_world_travel_1790702479797.jpg"
          alt="International travel airliner above global horizon at sunrise"
          className="w-full h-full object-cover object-center opacity-35 filter brightness-75 contrast-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="max-w-3xl">
          {/* Subtle brand tag */}
          <div className="flex items-center gap-2 text-xs font-medium text-amber-400/90 uppercase tracking-widest mb-4">
            <span>Intelligent Global Travel Agency</span>
            <span aria-hidden="true">·</span>
            <span>Worldwide Coverage</span>
            <span aria-hidden="true">·</span>
            <span>Every Budget</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-50 tracking-tight leading-[1.1] mb-6 text-balance">
            Your World. Your Budget. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
              Your Journey.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl font-normal">
            WORLD TRAVEL crafts feasible, transparent itineraries for travelers worldwide. From full-scale luxury vacations to rapid same-day international returns without hotel stays, we calculate real flight timetables, complete budget breakdowns, and verified entry requirements.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3.5 mb-12">
            <button
              onClick={onStartPlanning}
              className="px-6 py-3.5 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-lg shadow-amber-950/40 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Build Custom Trip</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onTrySameDayDemo}
              className="px-5 py-3.5 text-sm font-medium text-slate-100 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Same-Day Return Demo (India to Moscow)</span>
            </button>

            <button
              onClick={onExploreDestinations}
              className="px-5 py-3.5 text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Browse Destinations</span>
            </button>
          </div>

          {/* Trust proof and capabilities row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-100 block">Strict Budget Adherence</span>
                <span className="text-slate-400">Zero hidden fees; contingency buffers included</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-100 block">No-Overnight Feasibility</span>
                <span className="text-slate-400">Audits customs, transit & sightseeing windows</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 col-span-2 sm:col-span-1">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-100 block">4 Feasible Tiers</span>
                <span className="text-slate-400">Budget, Balanced, Comfort & VIP options</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
