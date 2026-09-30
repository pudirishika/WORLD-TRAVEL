import React, { useState } from 'react';
import { X, Bookmark, Trash2, Printer, CheckCircle2, Plane, Building2, Calendar, FileText, ArrowRight } from 'lucide-react';
import { SavedTrip, CurrencyCode } from '../types/travel';
import { formatCurrency } from '../utils/currencies';

interface SavedTripsModalProps {
  savedTrips: SavedTrip[];
  onRemoveTrip: (id: string) => void;
  onClose: () => void;
  currency: CurrencyCode;
}

export const SavedTripsModal: React.FC<SavedTripsModalProps> = ({
  savedTrips,
  onRemoveTrip,
  onClose,
  currency,
}) => {
  const [activeVoucher, setActiveVoucher] = useState<SavedTrip | null>(null);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-100">
                My Saved Trips & Bookings
              </h3>
              <p className="text-xs text-slate-400">
                Manage your planned trips and access official booking vouchers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {savedTrips.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 space-y-2">
              <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="font-semibold text-slate-200">No Saved Trips Yet</p>
              <p className="max-w-xs mx-auto">
                Use the Smart AI Planner to generate an itinerary and click "Save Plan" to store your journey here.
              </p>
            </div>
          ) : (
            savedTrips.map((trip) => (
              <div
                key={trip.id}
                className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                      {trip.selectedPlan.tier} Tier
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400 font-mono">
                      Saved {new Date(trip.createdAt).toLocaleDateString()}
                    </span>
                    {trip.bookingReference && (
                      <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Ref: {trip.bookingReference}
                      </span>
                    )}
                  </div>

                  <h4 className="font-display text-base font-bold text-slate-100">
                    {trip.request.origin.city} ({trip.request.origin.code}) → {trip.request.destination.city} ({trip.request.destination.code})
                  </h4>

                  <p className="text-slate-300">
                    {trip.request.tripType === 'same-day' ? 'Same-Day Return (Zero Hotel)' : `${trip.request.departureDate} to ${trip.request.returnDate}`} · {trip.request.travelers.adults} Travelers
                  </p>

                  <div className="font-mono text-sm font-bold text-amber-400 pt-1">
                    {formatCurrency(trip.selectedPlan.budgetBreakdown.totalEstimatedCost, trip.request.currency)}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setActiveVoucher(trip)}
                    className="px-3.5 py-1.5 font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Voucher</span>
                  </button>

                  <button
                    onClick={() => onRemoveTrip(trip.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded transition-colors cursor-pointer"
                    title="Delete Saved Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Voucher Modal Drawer */}
        {activeVoucher && (
          <div className="fixed inset-0 z-60 bg-slate-950/90 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-6 text-xs text-slate-300 shadow-2xl relative">
              <button
                onClick={() => setActiveVoucher(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-slate-800 pb-4">
                <div className="text-[11px] text-amber-400 font-bold uppercase tracking-widest mb-1">
                  WORLD TRAVEL · CONFIRMED ITINERARY VOUCHER
                </div>
                <h3 className="font-display text-xl font-bold text-slate-100">
                  {activeVoucher.request.origin.city} to {activeVoucher.request.destination.city}
                </h3>
                <div className="font-mono text-xs text-slate-400 mt-1">
                  Booking Reference: <strong className="text-amber-400">{activeVoucher.bookingReference || 'WT-SAMPLE-CONFIRMED'}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Outbound Flight</span>
                  <span className="font-bold text-slate-100 block">{activeVoucher.selectedPlan.flight.airline} ({activeVoucher.selectedPlan.flight.flightNumber})</span>
                  <span className="font-mono text-[11px] text-slate-300">{activeVoucher.selectedPlan.flight.departureTime} departure</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Accommodation</span>
                  <span className="font-bold text-slate-100 block">
                    {!activeVoucher.request.needAccommodation || activeVoucher.request.tripType === 'same-day' ? 'No Hotel Needed ($0)' : activeVoucher.selectedPlan.hotel?.name}
                  </span>
                  <span className="text-[11px] text-emerald-400">
                    {!activeVoucher.request.needAccommodation || activeVoucher.request.tripType === 'same-day' ? 'Same-day schedule' : 'Confirmed Booking Link'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                <span className="font-bold text-slate-200 block">Check-in Instructions:</span>
                <p>Present your passport, government e-Visa authorization, and this digital confirmation voucher at the airport departure gate.</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-slate-700 text-slate-200 rounded-lg hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Voucher</span>
                </button>

                <button
                  onClick={() => setActiveVoucher(null)}
                  className="px-5 py-2 font-bold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
