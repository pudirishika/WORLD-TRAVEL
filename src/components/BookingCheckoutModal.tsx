import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Plane, Building2, CreditCard, ArrowRight, User } from 'lucide-react';
import { TravelPlanOption, TripRequest } from '../types/travel';
import { formatCurrency } from '../utils/currencies';

interface BookingCheckoutModalProps {
  plan: TravelPlanOption;
  request: TripRequest;
  onClose: () => void;
  onBookingSuccess: (bookingRef: string, passengerName: string) => void;
}

export const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({
  plan,
  request,
  onClose,
  onBookingSuccess,
}) => {
  const [passengerName, setPassengerName] = useState('Alex Traveler');
  const [passportNumber, setPassportNumber] = useState('P987654321');
  const [email, setEmail] = useState('alex.traveler@example.com');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) return;

    setIsProcessing(true);
    setTimeout(() => {
      const ref = 'WT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setIsProcessing(false);
      setBookingConfirmed(ref);
      onBookingSuccess(ref, passengerName);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative text-xs">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {!bookingConfirmed ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h3 className="font-display text-xl font-bold text-slate-100">
                Review & Confirm Booking
              </h3>
            </div>
            <p className="text-slate-400 mb-6">
              Official checkout for your {plan.tier} journey to {request.destination.city}. Recheck prices, baggage, and cancellation rules.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Trip Summary Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 text-sm">{plan.title}</span>
                  <span className="font-mono text-base font-bold text-amber-400">
                    {formatCurrency(plan.budgetBreakdown.totalEstimatedCost, request.currency)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex flex-wrap gap-x-4">
                  <span>{request.origin.code} → {request.destination.code}</span>
                  <span>{request.tripType === 'same-day' ? 'Same-Day Return (No Hotel)' : `${request.departureDate} to ${request.returnDate}`}</span>
                  <span>{request.travelers.adults} Passenger(s)</span>
                </div>
              </div>

              {/* Passenger Info Inputs */}
              <div className="space-y-3">
                <span className="font-bold text-slate-200 uppercase tracking-wider block">
                  Lead Passenger Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Full Legal Name (as in Passport)</label>
                    <input
                      type="text"
                      required
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Passport Number</label>
                    <input
                      type="text"
                      required
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Email Address (for e-ticket)</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Price Transparency Disclaimer */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-slate-200 block mb-0.5">Price & Availability Guarantee:</strong>
                Fares include all applicable aviation taxes, airport departure levies, and itemized surcharges. Cancellation is protected under the 24-hour worldwide booking grace period.
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  required
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="rounded text-amber-500 bg-slate-950 border-slate-700"
                />
                <span>I confirm that all passenger names match their passport credentials and agree to booking conditions.</span>
              </label>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Confirming Booking...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Confirm Provisional Reservation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Success State */
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-slate-100">
              Trip Successfully Booked & Stored!
            </h3>
            <p className="text-slate-300 max-w-md mx-auto">
              Your provisional booking has been registered with reference{' '}
              <strong className="font-mono text-amber-400">{bookingConfirmed}</strong>.
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-sm mx-auto text-left space-y-1 text-[11px]">
              <div><strong className="text-slate-200">Lead Passenger:</strong> {passengerName}</div>
              <div><strong className="text-slate-200">Destination:</strong> {request.destination.city} ({request.destination.code})</div>
              <div><strong className="text-slate-200">Confirmation Sent To:</strong> {email}</div>
            </div>
            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 font-bold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300 transition-colors"
              >
                Return to Planner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
