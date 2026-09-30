import React, { useState } from 'react';
import { Calculator, DollarSign, Users, Calendar, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { CabinClass, CurrencyCode } from '../types/travel';
import { formatCurrency, convertCurrency } from '../utils/currencies';

interface BudgetCalculatorProps {
  currency: CurrencyCode;
}

export const BudgetCalculatorSection: React.FC<BudgetCalculatorProps> = ({ currency }) => {
  const [targetBudget, setTargetBudget] = useState(currency === 'INR' ? 500000 : 4000);
  const [travelersCount, setTravelersCount] = useState(1);
  const [stayNights, setStayNights] = useState(0); // 0 = same-day return!
  const [travelClass, setTravelClass] = useState<CabinClass>('economy');
  const [destinationRegion, setDestinationRegion] = useState<'europe' | 'asia' | 'middle-east' | 'americas' | 'russia'>('russia');
  const [includeVisa, setIncludeVisa] = useState(true);
  const [includeInsurance, setIncludeInsurance] = useState(true);

  // Dynamic cost estimation formula based on parameters
  const isSameDay = stayNights === 0;

  // Flight baseline per person
  const baseFlightUsd = {
    russia: 500,
    europe: 650,
    asia: 400,
    'middle-east': 380,
    americas: 850,
  }[destinationRegion];

  const classMultiplier = {
    economy: 1.0,
    'premium-economy': 1.6,
    business: 3.2,
    first: 5.5,
  }[travelClass];

  const flightCostTotalUsd = Math.round(baseFlightUsd * classMultiplier * travelersCount);

  // Hotel cost total
  const hotelPerNightUsd = 120;
  const hotelCostTotalUsd = isSameDay ? 0 : Math.round(hotelPerNightUsd * stayNights * Math.ceil(travelersCount / 2));

  // Local transit
  const transitDailyUsd = isSameDay ? 45 : 25;
  const transitTotalUsd = Math.round(transitDailyUsd * (isSameDay ? 1 : stayNights) * travelersCount);

  // Food & dining
  const foodDailyUsd = travelClass === 'business' || travelClass === 'first' ? 90 : 40;
  const foodTotalUsd = Math.round(foodDailyUsd * (isSameDay ? 1 : stayNights) * travelersCount);

  // Sightseeing
  const sightseeingTotalUsd = Math.round((isSameDay ? 55 : 35 * Math.max(1, stayNights)) * travelersCount);

  // Visa & entry fees
  const visaPerPersonUsd = destinationRegion === 'russia' ? 52 : destinationRegion === 'europe' ? 90 : 30;
  const visaTotalUsd = includeVisa ? visaPerPersonUsd * travelersCount : 0;

  // Travel insurance
  const insuranceTotalUsd = includeInsurance ? (isSameDay ? 18 : 30 * Math.ceil(stayNights / 5)) * travelersCount : 0;

  // Taxes & baggage surcharges
  const taxesTotalUsd = Math.round(flightCostTotalUsd * 0.12);

  // Subtotal before contingency
  const subtotalUsd =
    flightCostTotalUsd +
    hotelCostTotalUsd +
    transitTotalUsd +
    foodTotalUsd +
    sightseeingTotalUsd +
    visaTotalUsd +
    insuranceTotalUsd +
    taxesTotalUsd;

  // Contingency Buffer (10%)
  const contingencyUsd = Math.round(subtotalUsd * 0.1);
  const grandTotalUsd = subtotalUsd + contingencyUsd;

  // Convert to user currency
  const grandTotal = convertCurrency(grandTotalUsd, 'USD', currency);
  const costPerPerson = Math.round(grandTotal / travelersCount);
  const remainingBudget = targetBudget - grandTotal;
  const isOver = remainingBudget < 0;

  return (
    <section className="py-12 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mb-8">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            Dynamic Budget Engine
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
            Smart Budget Calculator & Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Experiment with stay duration (including 0 nights for same-day returns), flight classes, and traveler counts to see exact itemized cost distributions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Form (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-display text-base font-bold text-slate-100 flex items-center gap-2 pb-3 border-b border-slate-800">
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Trip Configuration Parameters</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Declared Total Budget ({currency})
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={targetBudget}
                onChange={(e) => setTargetBudget(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Travelers
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={travelersCount}
                  onChange={(e) => setTravelersCount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Stay Duration
                </label>
                <select
                  aria-label="Stay Duration in Nights"
                  value={stayNights}
                  onChange={(e) => setStayNights(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value={0}>0 Nights (Same-Day Return)</option>
                  <option value={1}>1 Night</option>
                  <option value={2}>2 Nights</option>
                  <option value={3}>3 Nights</option>
                  <option value={5}>5 Nights</option>
                  <option value={7}>7 Nights</option>
                  <option value={10}>10 Nights</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Destination Region
              </label>
              <select
                aria-label="Destination Region"
                value={destinationRegion}
                onChange={(e) => setDestinationRegion(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              >
                <option value="russia">Russia (Moscow / Saint Petersburg)</option>
                <option value="europe">Western Europe (Paris / London / Rome)</option>
                <option value="middle-east">Middle East (Dubai / Abu Dhabi)</option>
                <option value="asia">East / Southeast Asia (Tokyo / Singapore)</option>
                <option value="americas">North America (New York / West Coast)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Travel Class
              </label>
              <select
                aria-label="Travel Cabin Class"
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value as CabinClass)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              >
                <option value="economy">Economy Class</option>
                <option value="premium-economy">Premium Economy</option>
                <option value="business">Business Class</option>
                <option value="first">First Class</option>
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeVisa}
                  onChange={(e) => setIncludeVisa(e.target.checked)}
                  className="rounded text-amber-500 bg-slate-950 border-slate-700"
                />
                <span>Include Visa & Document Fees</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeInsurance}
                  onChange={(e) => setIncludeInsurance(e.target.checked)}
                  className="rounded text-amber-500 bg-slate-950 border-slate-700"
                />
                <span>Include Comprehensive Travel Insurance</span>
              </label>
            </div>
          </div>

          {/* Result Display & Breakdown (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Score Banner */}
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  Estimated Total Trip Cost
                </span>
                <div className="font-mono text-3xl font-extrabold text-amber-400">
                  {formatCurrency(grandTotal, currency)}
                </div>
                <span className="text-xs text-slate-400 mt-1 block">
                  Per Traveler: <strong className="font-mono text-slate-200">{formatCurrency(costPerPerson, currency)}</strong>
                </span>
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  Budget Standing
                </span>
                {isOver ? (
                  <div className="font-mono text-base font-bold text-rose-400">
                    Exceeds by {formatCurrency(Math.abs(remainingBudget), currency)}
                  </div>
                ) : (
                  <div className="font-mono text-base font-bold text-emerald-400">
                    Surplus: +{formatCurrency(remainingBudget, currency)}
                  </div>
                )}
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  {isSameDay ? 'Same-day return: zero hotel expense' : `${stayNights} nights accommodation calculated`}
                </span>
              </div>
            </div>

            {/* Itemized Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Flight Tickets</span>
                <span className="font-mono text-sm font-bold text-slate-100">
                  {formatCurrency(convertCurrency(flightCostTotalUsd, 'USD', currency), currency)}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Hotel Stays</span>
                <span className="font-mono text-sm font-bold text-slate-100">
                  {formatCurrency(convertCurrency(hotelCostTotalUsd, 'USD', currency), currency)}
                </span>
                {isSameDay && <span className="text-[10px] text-emerald-400 block">No Hotel ($0)</span>}
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Ground & Airport Transit</span>
                <span className="font-mono text-sm font-bold text-slate-100">
                  {formatCurrency(convertCurrency(transitTotalUsd, 'USD', currency), currency)}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Food & Drinks</span>
                <span className="font-mono text-sm font-bold text-slate-100">
                  {formatCurrency(convertCurrency(foodTotalUsd, 'USD', currency), currency)}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Sightseeing Tickets</span>
                <span className="font-mono text-sm font-bold text-slate-100">
                  {formatCurrency(convertCurrency(sightseeingTotalUsd, 'USD', currency), currency)}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Visa & Documents</span>
                <span className="font-mono text-sm font-bold text-slate-100">
                  {formatCurrency(convertCurrency(visaTotalUsd, 'USD', currency), currency)}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Travel Insurance</span>
                <span className="font-mono text-sm font-bold text-slate-100">
                  {formatCurrency(convertCurrency(insuranceTotalUsd, 'USD', currency), currency)}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Taxes & Baggage Fees</span>
                <span className="font-mono text-sm font-bold text-slate-100">
                  {formatCurrency(convertCurrency(taxesTotalUsd, 'USD', currency), currency)}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs">
                <span className="text-amber-300 font-semibold block mb-1">Emergency Buffer (10%)</span>
                <span className="font-mono text-sm font-bold text-amber-400">
                  {formatCurrency(convertCurrency(contingencyUsd, 'USD', currency), currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
