import React, { useState } from 'react';
import { DESTINATION_GUIDES } from '../data/destinations';
import { DestinationGuide, CurrencyCode, TripRequest } from '../types/travel';
import { MapPin, Sun, Shield, DollarSign, FileText, ArrowRight, Compass, Clock, Check } from 'lucide-react';
import { formatCurrency, convertCurrency } from '../utils/currencies';

interface DestinationsSectionProps {
  currency: CurrencyCode;
  onSelectDestinationForTrip: (guide: DestinationGuide) => void;
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  currency,
  onSelectDestinationForTrip,
}) => {
  const [selectedGuide, setSelectedGuide] = useState<DestinationGuide>(DESTINATION_GUIDES[0]);

  return (
    <section className="py-12 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mb-8">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            Global Intelligence Catalog
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
            Worldwide Destination Guides
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Verified travel advisory, official e-Visa requirements, local transport tips, daily budget indices, and cultural etiquette.
          </p>
        </div>

        {/* Destination Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {DESTINATION_GUIDES.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedGuide(d)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border whitespace-nowrap transition-colors cursor-pointer ${
                selectedGuide.id === d.id
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {d.name}, {d.country} ({d.airportCode})
            </button>
          ))}
        </div>

        {/* Detailed Spotlight of Selected Guide */}
        {selectedGuide && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Visual Hero Header */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
              <img
                src={selectedGuide.heroImage}
                alt={`${selectedGuide.name} landmark`}
                className="w-full h-full object-cover object-center brightness-75"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedGuide.country} · {selectedGuide.airportCode}</span>
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-50">
                    {selectedGuide.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1.5 line-clamp-2">
                    {selectedGuide.summary}
                  </p>
                </div>

                <button
                  onClick={() => onSelectDestinationForTrip(selectedGuide)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <span>Plan Trip to {selectedGuide.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Best Season to Visit</span>
                <span className="font-medium text-slate-200">{selectedGuide.bestTimeToVisit}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Current Climate</span>
                <span className="font-mono text-slate-200">
                  {selectedGuide.weatherOverview.currentTempC}°C ({selectedGuide.weatherOverview.condition})
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Local Currency</span>
                <span className="font-medium text-slate-200">{selectedGuide.localCurrency}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-0.5">Daily Budget Index</span>
                <span className="font-mono font-bold text-amber-400">
                  {formatCurrency(convertCurrency(selectedGuide.dailyCostEstimateUsd.balanced, 'USD', currency), currency)} / day
                </span>
              </div>
            </div>

            {/* Content Tabs: Visa, Attractions, Transit, Etiquette */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Visa & Regulatory (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                    <FileText className="w-4 h-4" />
                    <span>Visa & Entry Information</span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-semibold text-slate-200 block">Indian Passports:</span>
                      <p className="text-slate-300 mt-0.5">{selectedGuide.visaRequirements.indianPassports}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 block">EU Passports:</span>
                      <p className="text-slate-300 mt-0.5">{selectedGuide.visaRequirements.euPassports}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-200 block">US Passports:</span>
                      <p className="text-slate-300 mt-0.5">{selectedGuide.visaRequirements.usPassports}</p>
                    </div>
                    <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 italic">
                      * {selectedGuide.visaRequirements.generalNote}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-200 uppercase tracking-wider mb-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Safety & Emergency</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-2">
                    {selectedGuide.safetyRating}
                  </p>
                  <div className="font-mono text-[11px] text-slate-400">
                    Emergency Dial: <strong className="text-slate-200">{selectedGuide.emergencyPhone}</strong>
                  </div>
                </div>
              </div>

              {/* Attractions & Transit (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
                    Top Verified Attractions
                  </h4>
                  <div className="space-y-2.5">
                    {selectedGuide.topAttractions.map((att, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-4 text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-100 block mb-0.5">
                            {att.name}
                          </span>
                          <span className="text-slate-400 block">{att.description}</span>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Duration: {att.typicalDuration}
                          </span>
                        </div>
                        <span className="font-mono text-amber-400 font-bold shrink-0">
                          {att.approxCostUsd === 0 ? 'Free' : formatCurrency(convertCurrency(att.approxCostUsd, 'USD', currency), currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Local Transportation Tips */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="font-bold text-slate-200 uppercase tracking-wider block mb-1.5">
                    Local Transportation Guidance
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedGuide.transportTips}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
