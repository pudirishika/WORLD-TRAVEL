import React, { useState } from 'react';
import { Building2, Star, MapPin, Check, Wifi, Coffee, ExternalLink, ShieldCheck, Accessibility, HelpCircle } from 'lucide-react';
import { AccommodationType, CurrencyCode, HotelOption } from '../types/travel';
import { formatCurrency } from '../utils/currencies';
import { searchHotels } from '../services/hotelService';

interface HotelSearchSectionProps {
  currency: CurrencyCode;
}

export const HotelSearchSection: React.FC<HotelSearchSectionProps> = ({ currency }) => {
  const [city, setCity] = useState('Moscow');
  const [nights, setNights] = useState(3);
  const [hotelType, setHotelType] = useState<AccommodationType>('boutique');
  const [requireAccessibility, setRequireAccessibility] = useState(false);
  const [needHotel, setNeedHotel] = useState(true);

  const hotels = searchHotels({
    city,
    nights,
    type: hotelType,
    currency,
    accessibilityRequired: requireAccessibility,
  });

  return (
    <section className="py-12 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-8">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            Verified Stays & Nearby Accommodations
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100">
            Hotel Search & Proximity Locator
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse verified luxury palaces, boutique city hotels, budget hostels, and serviced apartments near city centers and transit hubs.
          </p>
        </div>

        {/* Accommodation Requirement Choice Banner */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-300">
            <span className="font-bold text-slate-100 block mb-0.5">Do you require accommodation for this journey?</span>
            WORLD TRAVEL strictly respects your choice. If you are doing a same-day return or have arranged private lodging, select "No Hotel Needed".
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setNeedHotel(true)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                needHotel
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Need a Hotel
            </button>
            <button
              onClick={() => setNeedHotel(false)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                !needHotel
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              No Hotel Needed ($0)
            </button>
          </div>
        </div>

        {!needHotel ? (
          <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-100">
              No Accommodation Required ($0)
            </h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
              You have selected no accommodation. Your itinerary and budget will calculate zero hotel costs. Ideal for same-day returns, overnight transit sleepers, or staying with friends and family.
            </p>
          </div>
        ) : (
          <>
            {/* Search & Filter Bar */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 mb-8 shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Destination City
                  </label>
                  <select
                    aria-label="Hotel City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Moscow">Moscow, Russia (Near Red Square)</option>
                    <option value="Tokyo">Tokyo, Japan (Shibuya & Shinjuku)</option>
                    <option value="Paris">Paris, France (Eiffel Tower & Center)</option>
                    <option value="Dubai">Dubai, UAE (Downtown & Marina)</option>
                    <option value="London">London, UK (Westminster)</option>
                    <option value="New York">New York, USA (Manhattan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Stay Duration (Nights)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={nights}
                    onChange={(e) => setNights(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Property Type
                  </label>
                  <select
                    aria-label="Property Type"
                    value={hotelType}
                    onChange={(e) => setHotelType(e.target.value as AccommodationType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="boutique">Boutique City Hotel</option>
                    <option value="4-star">4-Star Comfort</option>
                    <option value="5-star">5-Star Luxury & Spa</option>
                    <option value="budget">Budget Hotel / Inn</option>
                    <option value="hostel">Hostel</option>
                    <option value="apartment">Serviced Apartment</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pb-2.5">
                    <input
                      type="checkbox"
                      checked={requireAccessibility}
                      onChange={(e) => setRequireAccessibility(e.target.checked)}
                      className="rounded text-amber-500 bg-slate-950 border-slate-700"
                    />
                    <Accessibility className="w-3.5 h-3.5 text-amber-400" />
                    <span>Wheelchair accessible rooms</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Hotel Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors shadow-lg flex flex-col justify-between"
                >
                  <div>
                    {/* Hotel Image with rating overlay */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                      <img
                        src={hotel.photoUrl}
                        alt={hotel.name}
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-sm border border-slate-800 px-2.5 py-1 rounded-md text-[11px] font-bold text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{hotel.guestRating}</span>
                        <span className="text-slate-400 text-[10px]">({hotel.reviewCount})</span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-slate-100">
                        <div className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">
                          {'★'.repeat(hotel.starRating)} {hotel.city}
                        </div>
                        <h4 className="font-display font-bold text-base text-slate-50 truncate">
                          {hotel.name}
                        </h4>
                      </div>
                    </div>

                    {/* Hotel Specs */}
                    <div className="p-4 sm:p-5 space-y-3 text-xs">
                      <div className="flex items-start gap-1.5 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{hotel.distanceToCenter}</span>
                      </div>

                      <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300">
                        <span className="font-semibold block text-slate-200 mb-0.5">Room Type:</span>
                        {hotel.roomType}
                      </div>

                      {/* Amenities Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {hotel.amenities.slice(0, 3).map((a, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-slate-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                          >
                            {a}
                          </span>
                        ))}
                      </div>

                      <div className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1">
                        <ShieldCheck className="w-3 h-3 shrink-0" />
                        <span>{hotel.cancellationPolicy}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action Footer */}
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-800 mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">
                        {nights} Nights Total (inc. taxes)
                      </span>
                      <span className="font-mono text-base font-bold text-amber-400">
                        {formatCurrency(hotel.totalPrice, currency)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {formatCurrency(hotel.pricePerNight, currency)} / night
                      </span>
                    </div>

                    <a
                      href={hotel.bookingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors inline-flex items-center gap-1"
                    >
                      <span>Direct Book</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
