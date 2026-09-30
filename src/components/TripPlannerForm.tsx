import React, { useState } from 'react';
import { Plane, Calendar, Users, DollarSign, Bed, Compass, CheckCircle2, AlertCircle, HelpCircle, Sparkles, Clock } from 'lucide-react';
import { AccommodationType, CabinClass, CurrencyCode, TravelPurpose, TripRequest, TripType } from '../types/travel';
import { POPULAR_AIRPORTS, findAirport } from '../data/airports';
import { EXCHANGE_RATES } from '../utils/currencies';

interface TripPlannerFormProps {
  initialRequest?: Partial<TripRequest>;
  currency: CurrencyCode;
  onPlanTrip: (request: TripRequest) => void;
  isLoading: boolean;
}

export const TripPlannerForm: React.FC<TripPlannerFormProps> = ({
  initialRequest,
  currency,
  onPlanTrip,
  isLoading,
}) => {
  // Form State
  const [originCode, setOriginCode] = useState(initialRequest?.origin?.code || 'DEL');
  const [destinationCode, setDestinationCode] = useState(initialRequest?.destination?.code || 'SVO');
  const [tripType, setTripType] = useState<TripType>(initialRequest?.tripType || 'same-day');
  const [departureDate, setDepartureDate] = useState(initialRequest?.departureDate || '2026-10-15');
  const [returnDate, setReturnDate] = useState(initialRequest?.returnDate || '2026-10-15');
  const [flexibleDates, setFlexibleDates] = useState(initialRequest?.flexibleDates ?? true);

  const [adults, setAdults] = useState(initialRequest?.travelers?.adults || 1);
  const [children, setChildren] = useState(initialRequest?.travelers?.children || 0);
  const [seniors, setSeniors] = useState(initialRequest?.travelers?.seniors || 0);

  const [budget, setBudget] = useState(initialRequest?.budget || (currency === 'INR' ? 500000 : 3500));
  const [needAccommodation, setNeedAccommodation] = useState(
    tripType === 'same-day' ? false : (initialRequest?.needAccommodation ?? true)
  );

  const [travelClass, setTravelClass] = useState<CabinClass>(initialRequest?.travelClass || 'economy');
  const [accommodationType, setAccommodationType] = useState<AccommodationType>(initialRequest?.accommodationType || 'boutique');
  const [purpose, setPurpose] = useState<TravelPurpose>(initialRequest?.purpose || 'tourism');

  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(initialRequest?.dietaryPreferences || ['Local cuisine']);
  const [accessibility, setAccessibility] = useState<string[]>(initialRequest?.accessibility || []);
  const [interests, setInterests] = useState<string[]>(initialRequest?.interests || ['History & Architecture', 'Sightseeing']);
  const [specialNotes, setSpecialNotes] = useState(initialRequest?.specialNotes || '');

  // Missing info check state
  const [clarificationQuestion, setClarificationQuestion] = useState<string | null>(null);

  // Synchronize tripType with needAccommodation
  const handleTripTypeChange = (type: TripType) => {
    setTripType(type);
    if (type === 'same-day') {
      setNeedAccommodation(false);
      setReturnDate(departureDate);
    } else {
      if (type === 'round-trip' && returnDate === departureDate) {
        // default 4 days later
        const dep = new Date(departureDate);
        dep.setDate(dep.getDate() + 4);
        setReturnDate(dep.toISOString().split('T')[0]);
      }
      setNeedAccommodation(true);
    }
  };

  const toggleArrayItem = (list: string[], item: string, setter: (arr: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((x) => x !== item));
    } else {
      setter([...list, item]);
    }
  };

  // Quick preset: India to Moscow Same-Day (prompt scenario)
  const applyPromptScenario = () => {
    setOriginCode('DEL');
    setDestinationCode('SVO');
    setTripType('same-day');
    setDepartureDate('2026-10-15');
    setReturnDate('2026-10-15');
    setAdults(1);
    setChildren(0);
    setSeniors(0);
    setBudget(500000);
    setNeedAccommodation(false);
    setTravelClass('economy');
    setPurpose('tourism');
    setDietaryPreferences(['Vegetarian', 'Local cuisine']);
    setInterests(['History & Architecture', 'Museums', 'Sightseeing']);
    setSpecialNotes('India to Russia visit Red Square Moscow and return same day without staying overnight. Budget ₹5,00,000.');
    setClarificationQuestion(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const originAirport = findAirport(originCode) || {
      code: originCode.toUpperCase(),
      name: `${originCode} Airport`,
      city: originCode,
      country: 'Global',
    };

    const destAirport = findAirport(destinationCode) || {
      code: destinationCode.toUpperCase(),
      name: `${destinationCode} Airport`,
      city: destinationCode,
      country: 'Global',
    };

    // Clarification check: if same-day is selected but budget is extremely low or user hasn't specified return date
    if (tripType === 'same-day' && budget < (currency === 'INR' ? 30000 : 400)) {
      setClarificationQuestion(
        `Notice: For international same-day flights between ${originAirport.city} and ${destAirport.city}, flight tickets and visa fees usually exceed ${EXCHANGE_RATES[currency].symbol}${budget.toLocaleString()}. Would you like to increase your budget or consider domestic alternatives?`
      );
      return;
    }

    setClarificationQuestion(null);

    const tripReq: TripRequest = {
      origin: originAirport,
      destination: destAirport,
      tripType,
      departureDate,
      returnDate: tripType === 'same-day' ? departureDate : tripType === 'one-way' ? undefined : returnDate,
      flexibleDates,
      travelers: { adults, children, seniors },
      budget: Number(budget),
      currency,
      needAccommodation: tripType === 'same-day' ? false : needAccommodation,
      travelClass,
      accommodationType: needAccommodation ? accommodationType : 'none',
      purpose,
      dietaryPreferences,
      accessibility,
      interests,
      specialNotes,
    };

    onPlanTrip(tripReq);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 shadow-xl">
      {/* Header & Preset Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <span>Smart AI Trip Planner</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Specify your origin, destinations, trip mode, travelers, budget, and accessibility requirements.
          </p>
        </div>

        {/* Quick Demo Scenario Button */}
        <button
          type="button"
          onClick={applyPromptScenario}
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/40 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load India–Moscow Same-Day Test (₹5,00,000)</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Trip Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Trip Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'same-day', label: 'Same-Day Return (No Hotel)', desc: 'Zero overnight stay' },
              { id: 'round-trip', label: 'Round-Trip', desc: 'Outbound & return stay' },
              { id: 'one-way', label: 'One-Way', desc: 'Single journey' },
              { id: 'multi-city', label: 'Multi-City', desc: 'Multiple stops' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTripTypeChange(t.id as TripType)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  tripType === t.id
                    ? 'bg-amber-400/10 border-amber-400 text-slate-100 ring-1 ring-amber-400/30'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span>{t.label}</span>
                  {tripType === t.id && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Origin & Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Starting Airport / City
            </label>
            <div className="relative">
              <select
                aria-label="Starting Airport or City"
                value={originCode}
                onChange={(e) => setOriginCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-3.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {POPULAR_AIRPORTS.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.city} ({a.code}) — {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Destination City / Airport
            </label>
            <div className="relative">
              <select
                aria-label="Destination City or Airport"
                value={destinationCode}
                onChange={(e) => setDestinationCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-3.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {POPULAR_AIRPORTS.map((a) => (
                  <option key={a.code} value={a.code}>
                    {a.city} ({a.code}) — {a.country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Row 3: Dates & Flexibility */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Departure Date
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => {
                setDepartureDate(e.target.value);
                if (tripType === 'same-day') {
                  setReturnDate(e.target.value);
                }
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-3.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {tripType === 'same-day' ? 'Return Date (Same Day)' : 'Return Date'}
            </label>
            <input
              type="date"
              disabled={tripType === 'same-day' || tripType === 'one-way'}
              value={tripType === 'same-day' ? departureDate : returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className={`w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-3.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400 ${
                tripType === 'same-day' || tripType === 'one-way' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={flexibleDates}
                onChange={(e) => setFlexibleDates(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700 focus:ring-0"
              />
              <span>Flexible dates (+/- 3 days)</span>
            </label>
          </div>
        </div>

        {/* Row 4: Budget & Currency & Accommodation requirement */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Total Budget ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-amber-400 font-mono text-sm">
                {EXCHANGE_RATES[currency].symbol}
              </span>
              <input
                type="number"
                min="100"
                step="50"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-8 pr-3 text-sm text-slate-100 font-mono font-medium focus:outline-none focus:border-amber-400"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports low, medium, and high budgets.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Travelers
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">Adults</span>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={adults}
                  onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1.5 px-2 text-center text-xs font-mono text-slate-100"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">Children</span>
                <input
                  type="number"
                  min="0"
                  max="8"
                  value={children}
                  onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1.5 px-2 text-center text-xs font-mono text-slate-100"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-0.5">Seniors</span>
                <input
                  type="number"
                  min="0"
                  max="8"
                  value={seniors}
                  onChange={(e) => setSeniors(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1.5 px-2 text-center text-xs font-mono text-slate-100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Accommodation Needed?
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNeedAccommodation(true)}
                disabled={tripType === 'same-day'}
                className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                  needAccommodation && tripType !== 'same-day'
                    ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                } ${tripType === 'same-day' ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Yes (Hotel Needed)
              </button>
              <button
                type="button"
                onClick={() => setNeedAccommodation(false)}
                className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                  !needAccommodation || tripType === 'same-day'
                    ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                No Hotel Needed ($0)
              </button>
            </div>
            {tripType === 'same-day' && (
              <p className="text-[11px] text-amber-400/90 mt-1">
                Same-day return: No hotel stay required.
              </p>
            )}
          </div>
        </div>

        {/* Row 5: Flight Class & Accommodation Type & Purpose */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Flight Cabin Class
            </label>
            <select
              aria-label="Flight Cabin Class"
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value as CabinClass)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-3 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            >
              <option value="economy">Economy Class</option>
              <option value="premium-economy">Premium Economy</option>
              <option value="business">Business Class</option>
              <option value="first">First Class</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Accommodation Style
            </label>
            <select
              aria-label="Accommodation Style"
              disabled={!needAccommodation || tripType === 'same-day'}
              value={accommodationType}
              onChange={(e) => setAccommodationType(e.target.value as AccommodationType)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-3 text-sm text-slate-100 focus:outline-none focus:border-amber-400 disabled:opacity-40"
            >
              <option value="budget">Budget Hotel / Inn</option>
              <option value="hostel">Hostel / Social</option>
              <option value="boutique">Boutique City Hotel</option>
              <option value="4-star">4-Star Comfort</option>
              <option value="5-star">5-Star Luxury & Spa</option>
              <option value="apartment">Serviced Apartment</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Travel Purpose
            </label>
            <select
              aria-label="Travel Purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as TravelPurpose)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 px-3 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            >
              <option value="tourism">Tourism & Sightseeing</option>
              <option value="business">Business & Meetings</option>
              <option value="education">Education & Study</option>
              <option value="family">Family & Relative Visit</option>
              <option value="shopping">Shopping & Luxury</option>
              <option value="adventure">Adventure & Outdoors</option>
              <option value="culture">Art, History & Culture</option>
            </select>
          </div>
        </div>

        {/* Row 6: Preferences (Dietary, Accessibility, Interests) */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Dietary Preferences
            </label>
            <div className="flex flex-wrap gap-2">
              {['Halal', 'Vegetarian', 'Vegan', 'Kosher', 'Gluten-free', 'Local cuisine'].map((diet) => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => toggleArrayItem(dietaryPreferences, diet, setDietaryPreferences)}
                  className={`px-3 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                    dietaryPreferences.includes(diet)
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-medium'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Accessibility & Special Requirements
            </label>
            <div className="flex flex-wrap gap-2">
              {['Wheelchair accessible', 'Low-walking', 'Senior-friendly', 'Child / Stroller friendly', 'Pet friendly'].map((acc) => (
                <button
                  key={acc}
                  type="button"
                  onClick={() => toggleArrayItem(accessibility, acc, setAccessibility)}
                  className={`px-3 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                    accessibility.includes(acc)
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-medium'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {acc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Missing Info / Clarification Warning */}
        {clarificationQuestion && (
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200 leading-relaxed">
              <span className="font-bold block mb-1">Travel Planning Clarification:</span>
              {clarificationQuestion}
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBudget(currency === 'INR' ? 120000 : 1200);
                    setClarificationQuestion(null);
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-amber-400 text-slate-950 rounded hover:bg-amber-300"
                >
                  Adjust to Minimum Realistic Budget
                </button>
                <button
                  type="button"
                  onClick={() => setClarificationQuestion(null)}
                  className="px-2.5 py-1 text-[11px] text-slate-300 border border-slate-700 rounded hover:bg-slate-800"
                >
                  Proceed with Current Budget
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI will generate 4 feasible plans with exact budget breakdowns & timetables.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Evaluating Schedules & Calculating Costs...</span>
              </>
            ) : (
              <>
                <Plane className="w-4 h-4" />
                <span>Generate Verified Travel Plans</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
