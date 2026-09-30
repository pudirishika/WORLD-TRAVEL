import React from 'react';
import { Globe, Bookmark, SlidersHorizontal, Compass, Plane, Building2, Calculator, Clock } from 'lucide-react';
import { CurrencyCode } from '../types/travel';
import { EXCHANGE_RATES } from '../utils/currencies';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  savedTripsCount: number;
  onOpenSaved: () => void;
  onOpenAdmin: () => void;
  onOpenChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currency,
  setCurrency,
  savedTripsCount,
  onOpenSaved,
  onOpenAdmin,
  onOpenChat,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark with elegant emblem */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setCurrentTab('planner')}
            className="flex items-center gap-2 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500/20 to-amber-300/10 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-sm group-hover:border-amber-400 transition-colors">
              <Globe className="w-4 h-4" />
            </div>
            <span className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase group-hover:text-amber-400 transition-colors">
              WORLD TRAVEL
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, clean text with hover underline) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => setCurrentTab('planner')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              currentTab === 'planner'
                ? 'text-amber-400 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400'
                : 'hover:text-slate-100'
            }`}
          >
            Trip Planner
          </button>
          <button
            onClick={() => setCurrentTab('same-day')}
            className={`whitespace-nowrap transition-colors py-1 relative flex items-center gap-1.5 ${
              currentTab === 'same-day'
                ? 'text-amber-400 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400'
                : 'hover:text-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Same-Day Return</span>
          </button>
          <button
            onClick={() => setCurrentTab('destinations')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              currentTab === 'destinations'
                ? 'text-amber-400 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400'
                : 'hover:text-slate-100'
            }`}
          >
            Destinations
          </button>
          <button
            onClick={() => setCurrentTab('flights')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              currentTab === 'flights'
                ? 'text-amber-400 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400'
                : 'hover:text-slate-100'
            }`}
          >
            Flight Search
          </button>
          <button
            onClick={() => setCurrentTab('hotels')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              currentTab === 'hotels'
                ? 'text-amber-400 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400'
                : 'hover:text-slate-100'
            }`}
          >
            Hotels
          </button>
          <button
            onClick={() => setCurrentTab('budget')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              currentTab === 'budget'
                ? 'text-amber-400 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400'
                : 'hover:text-slate-100'
            }`}
          >
            Budget Calculator
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Currency selector + Saved Trips + AI Consultant) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Currency dropdown */}
          <div className="relative">
            <select
              aria-label="Select Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-slate-900 border border-slate-700/80 text-xs font-mono font-medium text-slate-200 rounded-md py-1.5 pl-2.5 pr-6 appearance-none focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {(Object.keys(EXCHANGE_RATES) as CurrencyCode[]).map((c) => (
                <option key={c} value={c}>
                  {c} ({EXCHANGE_RATES[c].symbol})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-400">
              <span className="text-[10px]">▼</span>
            </div>
          </div>

          {/* AI Consultant */}
          <button
            onClick={onOpenChat}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-100 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/40 rounded-md transition-colors whitespace-nowrap cursor-pointer shadow-sm"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Chatbot</span>
          </button>

          {/* Saved Trips */}
          <button
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-100 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 rounded-md transition-colors whitespace-nowrap"
            title="Saved Trips & Bookings"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">My Trips</span>
            {savedTripsCount > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {savedTripsCount}
              </span>
            )}
          </button>

          {/* Admin console button */}
          <button
            onClick={onOpenAdmin}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors"
            title="Settings & Admin"
            aria-label="Admin Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
