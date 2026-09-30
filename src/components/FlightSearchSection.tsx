import React, { useState } from 'react';
import { Plane, Filter, ArrowUpDown, Clock, Luggage, ShieldCheck, ExternalLink, Calendar, Check } from 'lucide-react';
import { CabinClass, CurrencyCode, FlightOption } from '../types/travel';
import { POPULAR_AIRPORTS } from '../data/airports';
import { formatCurrency } from '../utils/currencies';
import { searchFlights } from '../services/flightService';

interface FlightSearchSectionProps {
  currency: CurrencyCode;
}

export const FlightSearchSection: React.FC<FlightSearchSectionProps> = ({ currency }) => {
  const [origin, setOrigin] = useState('DEL');
  const [destination, setDestination] = useState('SVO');
  const [departureDate, setDepartureDate] = useState('2026-10-15');
  const [returnDate, setReturnDate] = useState('2026-10-15');
  const [cabinClass, setCabinClass] = useState<CabinClass>('economy');
  const [isSameDay, setIsSameDay] = useState(true);

  // Sorting and Filters
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [filterNonstop, setFilterNonstop] = useState(false);
  const [filterRefundable, setFilterRefundable] = useState(false);

  const { outbound } = searchFlights({
    originCode: origin,
    destinationCode: destination,
    departureDate,
    returnDate: isSameDay ? departureDate : returnDate,
    cabinClass,
    currency,
    isSameDay,
  });

  // Apply filters
  let filtered = [...outbound];
  if (filterNonstop) {
    filtered = filtered.filter((f) => f.stops === 0);
  }
  if (filterRefundable) {
    filtered = filtered.filter((f) => f.refundable);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
    if (sortBy === 'departure') return a.departureTime.localeCompare(b.departureTime);
    return 0;
  });

  return (
    <section className="py-12 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-8">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            Real Route & Schedules Engine
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
            Flight Search & Direct Comparison
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Transparent quotes with airline, aircraft, duration, layovers, baggage allowances, and refund conditions.
          </p>
        </div>

        {/* Search Controls */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 mb-8 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                From
              </label>
              <select
                aria-label="Origin Airport"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              >
                {POPULAR_AIRPORTS.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.city} ({a.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                To
              </label>
              <select
                aria-label="Destination Airport"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              >
                {POPULAR_AIRPORTS.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.city} ({a.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Departure Date
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Cabin Class
              </label>
              <select
                aria-label="Cabin Class"
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value as CabinClass)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              >
                <option value="economy">Economy</option>
                <option value="premium-economy">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pb-2.5">
                <input
                  type="checkbox"
                  checked={isSameDay}
                  onChange={(e) => setIsSameDay(e.target.checked)}
                  className="rounded text-amber-500 bg-slate-950 border-slate-700"
                />
                <span>Same-day flight schedule</span>
              </label>
            </div>
          </div>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-300">Filters:</span>
            <button
              onClick={() => setFilterNonstop(!filterNonstop)}
              className={`px-3 py-1 rounded-md border transition-colors cursor-pointer ${
                filterNonstop
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-medium'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Nonstop Only
            </button>
            <button
              onClick={() => setFilterRefundable(!filterRefundable)}
              className={`px-3 py-1 rounded-md border transition-colors cursor-pointer ${
                filterRefundable
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-medium'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Refundable Fares
            </button>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort by:</span>
            <select
              aria-label="Sort flights by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded py-1 px-2.5 focus:outline-none focus:border-amber-400"
            >
              <option value="price">Lowest Total Price</option>
              <option value="duration">Shortest Travel Time</option>
              <option value="departure">Earliest Departure Time</option>
            </select>
          </div>
        </div>

        {/* Flight Results Cards */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 bg-slate-900 rounded-xl border border-slate-800">
              No flights matching the selected filter criteria. Try toggling nonstop or refundable options.
            </div>
          ) : (
            filtered.map((flight) => (
              <div
                key={flight.id}
                className="p-5 sm:p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Airline & Aircraft */}
                <div className="md:w-56 shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-bold text-slate-100 text-sm">
                      {flight.airline}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                      {flight.flightNumber}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {flight.aircraft} · {flight.cabinClass.replace('-', ' ')}
                  </div>
                </div>

                {/* Times & Route Diagram */}
                <div className="flex-1 flex items-center justify-between sm:justify-center gap-4 sm:gap-8">
                  <div className="text-left">
                    <div className="font-mono text-base font-bold text-slate-100">
                      {flight.departureTime}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {flight.origin.code} ({flight.origin.terminal || 'Main'})
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-400 mb-1">
                      {flight.duration}
                    </span>
                    <div className="relative w-24 sm:w-36 flex items-center">
                      <div className="h-[1px] w-full bg-slate-700" />
                      <Plane className="w-3.5 h-3.5 text-amber-400 absolute left-1/2 -translate-x-1/2" />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">
                      {flight.stops === 0 ? 'Nonstop Direct' : `${flight.stops} Stop (${flight.layoverDetails || ''})`}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-base font-bold text-slate-100">
                      {flight.arrivalTime}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {flight.destination.code} ({flight.destination.terminal || 'Main'})
                    </div>
                  </div>
                </div>

                {/* Baggage & Ticket Conditions */}
                <div className="text-xs text-slate-400 space-y-1 md:w-56 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Luggage className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{flight.baggage}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className={flight.refundable ? 'text-emerald-400' : 'text-slate-400'}>
                      {flight.refundable ? 'Refundable Fare' : 'Non-Refundable'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">{flight.changeFee}</div>
                </div>

                {/* Price & Direct Booking Link */}
                <div className="text-right md:w-40 shrink-0 border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                  <span className="text-[10px] text-slate-400 block">Total Fare</span>
                  <div className="font-mono text-xl font-bold text-amber-400">
                    {formatCurrency(flight.price, currency)}
                  </div>
                  <a
                    href={flight.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 w-full px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors inline-flex items-center justify-center gap-1"
                  >
                    <span>View Flight</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
