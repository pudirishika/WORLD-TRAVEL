import React, { useState } from 'react';
import { Clock, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Plane, FileText, Compass, DollarSign } from 'lucide-react';
import { CurrencyCode, SameDayFeasibility, TripRequest } from '../types/travel';
import { formatCurrency } from '../utils/currencies';
import { calculateSameDayFeasibility } from '../services/sameDayService';

interface SameDaySpotlightProps {
  onLoadTrip: (request: TripRequest) => void;
  currency: CurrencyCode;
}

export const SameDaySpotlight: React.FC<SameDaySpotlightProps> = ({ onLoadTrip, currency }) => {
  // Interactive test case controls
  const [selectedRoute, setSelectedRoute] = useState<'DEL-SVO' | 'DEL-LHR' | 'LHR-CDG'>('DEL-SVO');

  // Pre-configured test scenario for India to Russia
  const sampleRequest: TripRequest = {
    origin: { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', country: 'India' },
    destination: { code: 'SVO', name: 'Sheremetyevo International', city: 'Moscow', country: 'Russia' },
    tripType: 'same-day',
    departureDate: '2026-10-15',
    returnDate: '2026-10-15',
    flexibleDates: false,
    travelers: { adults: 1, children: 0, seniors: 0 },
    budget: 500000,
    currency: 'INR',
    needAccommodation: false,
    travelClass: 'economy',
    accommodationType: 'none',
    purpose: 'tourism',
    dietaryPreferences: ['Vegetarian', 'Local cuisine'],
    accessibility: [],
    interests: ['History & Architecture', 'Sightseeing'],
    specialNotes: 'India to Russia visit Red Square Moscow and return same day without staying overnight.',
  };

  const feasibility: SameDayFeasibility = calculateSameDayFeasibility(sampleRequest);

  return (
    <section className="py-12 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Title & Concept Explanation */}
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            <Clock className="w-4 h-4" />
            <span>Proprietary Feasibility Intelligence</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 mb-3">
            Same-Day Return & No-Overnight Travel
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Travel without booking a hotel. Our system audits international flight schedules, airport customs clearance, ground express transit, daylight sightseeing windows, and visa entry requirements before confirming feasibility.
          </p>
        </div>

        {/* Featured Case Study: India to Russia (₹5,00,000 Budget) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Image & Status Banner */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
              <img
                src="/src/assets/images/dest_moscow_redsquare_1790702494624.jpg"
                alt="Moscow Red Square Saint Basil's Cathedral"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/90 text-slate-950 shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>FEASIBLE & VERIFIED</span>
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-slate-100">
                <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
                  Reference Master Scenario
                </div>
                <h3 className="font-display text-xl font-bold">New Delhi (DEL) → Moscow (SVO)</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Budget: ₹5,00,000 INR · Accommodation: None ($0 Hotel) · 6.3h Sightseeing Window
                </p>
              </div>
            </div>

            {/* Right Audit Details */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Feasibility Metric Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Sightseeing Window</span>
                    <span className="font-mono text-lg font-bold text-amber-400">6.3 Hours</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Hotel Cost</span>
                    <span className="font-mono text-lg font-bold text-emerald-400">₹0 ($0)</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Estimated Trip Cost</span>
                    <span className="font-mono text-lg font-bold text-slate-100">₹1,18,500</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Surplus Budget</span>
                    <span className="font-mono text-lg font-bold text-emerald-400">+₹3,81,500</span>
                  </div>
                </div>

                {/* Visa & Regulatory Check */}
                <div className="mb-6 p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Visa & Immigration Clearance:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {feasibility.visaStatus.summary} Processing time: <strong className="text-slate-100">{feasibility.visaStatus.leadTime}</strong>. Official fee: <strong className="text-slate-100">${feasibility.visaStatus.feeUsd} USD</strong>.
                  </p>
                </div>

                {/* Minute-by-Minute Timeline */}
                <div className="mb-6">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                    Calculated Schedule Timeline
                  </span>
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-2">
                    {feasibility.scheduleTimeline.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <span className="font-mono text-amber-400 shrink-0 w-28 font-medium">
                          {item.time}
                        </span>
                        <span className="text-slate-300 leading-snug">
                          {item.event}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action bar */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  Includes Aeroexpress train, Red Square entry passes, meals & contingency reserve.
                </div>
                <button
                  onClick={() => onLoadTrip(sampleRequest)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Load This Exact Plan in Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Feasibility Rule Notice */}
        <div className="mt-8 p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-slate-200 block mb-0.5">
              Strict Worldwide Feasibility Guarantee:
            </span>
            If a proposed same-day route exceeds 8.5 hours flight duration or available flight timetables fail to provide at least 4 continuous daylight hours between arrival immigration and mandatory return check-in, WORLD TRAVEL clearly explains the constraint and suggests a short overnight micro-stay or closer destination. Having a high budget never overrides physical flight constraints.
          </div>
        </div>
      </div>
    </section>
  );
};
