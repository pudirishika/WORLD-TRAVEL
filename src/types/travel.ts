export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'CAD' | 'AUD' | 'AED';

export type TripType = 'round-trip' | 'one-way' | 'same-day' | 'multi-city';

export type CabinClass = 'economy' | 'premium-economy' | 'business' | 'first';

export type AccommodationType = 'none' | 'budget' | 'hostel' | 'boutique' | '4-star' | '5-star' | 'apartment';

export type TravelPurpose = 'tourism' | 'business' | 'education' | 'family' | 'shopping' | 'adventure' | 'culture';

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface TripRequest {
  id?: string;
  origin: Airport;
  destination: Airport;
  multiDestinations?: Airport[];
  tripType: TripType;
  departureDate: string;
  returnDate?: string;
  flexibleDates: boolean;
  travelers: {
    adults: number;
    children: number;
    seniors: number;
  };
  budget: number;
  currency: CurrencyCode;
  needAccommodation: boolean;
  travelClass: CabinClass;
  accommodationType: AccommodationType;
  purpose: TravelPurpose;
  dietaryPreferences: string[];
  accessibility: string[];
  interests: string[];
  specialNotes?: string;
}

export interface BudgetBreakdown {
  flightsTotal: number;
  hotelsTotal: number;
  localTransit: number;
  foodAndDining: number;
  sightseeingAndTickets: number;
  visaAndDocs: number;
  travelInsurance: number;
  baggageAndTaxes: number;
  contingencyBuffer: number;
  totalEstimatedCost: number;
  costPerPerson: number;
  remainingBudget: number;
  isOverBudget: boolean;
  overBudgetAmount: number;
  currency: CurrencyCode;
}

export interface FlightOption {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  aircraft: string;
  origin: {
    code: string;
    name: string;
    city: string;
    terminal?: string;
  };
  destination: {
    code: string;
    name: string;
    city: string;
    terminal?: string;
  };
  departureTime: string;
  arrivalTime: string;
  duration: string;
  durationMinutes: number;
  stops: number;
  layoverDetails?: string;
  cabinClass: CabinClass;
  baggage: string;
  refundable: boolean;
  changeFee: string;
  price: number;
  currency: CurrencyCode;
  isLiveQuote: boolean;
  bookingUrl: string;
}

export interface HotelOption {
  id: string;
  name: string;
  starRating: number;
  guestRating: number;
  reviewCount: number;
  city: string;
  address: string;
  distanceToCenter: string;
  distanceToMainAttraction: string;
  pricePerNight: number;
  totalPrice: number;
  taxesAndFees: number;
  currency: CurrencyCode;
  roomType: string;
  amenities: string[];
  cancellationPolicy: string;
  photoUrl: string;
  bookingUrl: string;
  accessibilityFeatures: string[];
}

export interface ActivityItem {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  durationMinutes: number;
  costEstimated: number;
  category: 'flight' | 'transport' | 'attraction' | 'meal' | 'leisure' | 'hotel' | 'visa' | 'customs';
  indoorBackup?: string;
  accessibilityNote?: string;
  ticketLink?: string;
  verifiedHours?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  theme: string;
  activities: ActivityItem[];
  weatherForecast?: {
    tempC: number;
    condition: string;
    icon: string;
  };
}

export interface SameDayFeasibility {
  isFeasible: boolean;
  outboundFlight: FlightOption;
  returnFlight: FlightOption;
  transitTimeMinutes: number;
  customsAndBufferMinutes: number;
  sightseeingWindowHours: number;
  visaStatus: {
    required: boolean;
    type: string;
    leadTime: string;
    feeUsd: number;
    summary: string;
    officialPortalUrl?: string;
  };
  scheduleTimeline: Array<{
    time: string;
    event: string;
    type: 'flight' | 'transit' | 'customs' | 'sightseeing' | 'buffer';
  }>;
  verdictNotes: string;
  warningAlerts?: string[];
  suggestedAlternative?: string;
}

export interface TravelPlanOption {
  tier: 'budget' | 'balanced' | 'comfort' | 'luxury';
  title: string;
  tagline: string;
  budgetBreakdown: BudgetBreakdown;
  flight: FlightOption;
  returnFlight?: FlightOption;
  hotel?: HotelOption;
  itinerary: ItineraryDay[];
  highlights: string[];
  tradeoffs: string[];
  sameDayFeasibility?: SameDayFeasibility;
}

export interface DestinationGuide {
  id: string;
  name: string;
  city: string;
  country: string;
  airportCode: string;
  heroImage: string;
  summary: string;
  bestTimeToVisit: string;
  localCurrency: string;
  dailyCostEstimateUsd: {
    budget: number;
    balanced: number;
    luxury: number;
  };
  safetyRating: string;
  emergencyPhone: string;
  visaRequirements: {
    usPassports: string;
    euPassports: string;
    indianPassports: string;
    generalNote: string;
  };
  topAttractions: Array<{
    name: string;
    description: string;
    typicalDuration: string;
    approxCostUsd: number;
  }>;
  transportTips: string;
  culturalEtiquette: string[];
  weatherOverview: {
    currentTempC: number;
    condition: string;
    season: string;
  };
}

export interface SavedTrip {
  id: string;
  createdAt: string;
  request: TripRequest;
  selectedPlan: TravelPlanOption;
  bookingStatus?: 'planning' | 'booked' | 'completed';
  bookingReference?: string;
  passengerNames?: string[];
}
