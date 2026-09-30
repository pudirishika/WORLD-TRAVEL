import { ItineraryDay, TravelPlanOption, TripRequest } from '../types/travel';
import { convertCurrency } from '../utils/currencies';
import { searchFlights } from './flightService';
import { searchHotels } from './hotelService';
import { calculateBudgetBreakdown, calculateSameDayFeasibility } from './sameDayService';

export function generateTravelPlans(request: TripRequest): TravelPlanOption[] {
  const isSameDay = request.tripType === 'same-day' || !request.needAccommodation;
  const stayDays = isSameDay ? 1 : calculateStayDays(request.departureDate, request.returnDate);
  const travelersCount = request.travelers.adults + request.travelers.children + request.travelers.seniors;
  const currency = request.currency;

  // Search flights
  const flightResults = searchFlights({
    originCode: request.origin.code,
    destinationCode: request.destination.code,
    departureDate: request.departureDate,
    returnDate: isSameDay ? request.departureDate : request.returnDate,
    cabinClass: request.travelClass,
    currency,
    isSameDay,
  });

  // Search hotels if required
  const hotelList = !isSameDay && request.needAccommodation
    ? searchHotels({
        city: request.destination.city,
        airportCode: request.destination.code,
        nights: stayDays,
        currency,
        accessibilityRequired: request.accessibility.includes('Wheelchair accessible'),
      })
    : [];

  const sameDayFeasibility = isSameDay ? calculateSameDayFeasibility(request) : undefined;

  // Generate 4 distinct tiers:
  // 1. Budget Conscious
  // 2. Balanced & Popular
  // 3. Comfort & Convenience
  // 4. Luxury & VIP

  const flightBudget = flightResults.outbound[1] || flightResults.outbound[0];
  const flightBalanced = flightResults.outbound[0];
  const flightComfort = flightResults.outbound[0];
  const flightLuxury = {
    ...flightResults.outbound[0],
    airline: `${flightResults.outbound[0].airline} (Business Class)`,
    cabinClass: 'business' as const,
    price: convertCurrency(Math.round(flightResults.outbound[0].price * 2.8), currency, currency),
  };

  const returnFlight = flightResults.inbound && flightResults.inbound.length > 0 ? flightResults.inbound[0] : undefined;

  // Hotels
  const hotelBudget = hotelList[hotelList.length - 1];
  const hotelBalanced = hotelList[1] || hotelList[0];
  const hotelComfort = hotelList[0];
  const hotelLuxury = hotelList[0]
    ? {
        ...hotelList[0],
        name: `Royal Executive: ${hotelList[0].name}`,
        roomType: 'Presidential Suite with VIP Club Access',
        pricePerNight: Math.round(hotelList[0].pricePerNight * 1.8),
        totalPrice: Math.round(hotelList[0].totalPrice * 1.8),
      }
    : undefined;

  // Cost calculations
  const totalFlightCostBudget = flightBudget.price * travelersCount * (request.tripType === 'one-way' ? 1 : 1.9);
  const totalHotelCostBudget = hotelBudget ? hotelBudget.totalPrice : 0;
  const breakdownBudget = calculateBudgetBreakdown(request, totalFlightCostBudget, totalHotelCostBudget, stayDays);

  const totalFlightCostBalanced = flightBalanced.price * travelersCount * (request.tripType === 'one-way' ? 1 : 1.9);
  const totalHotelCostBalanced = hotelBalanced ? hotelBalanced.totalPrice : 0;
  const breakdownBalanced = calculateBudgetBreakdown(request, totalFlightCostBalanced, totalHotelCostBalanced, stayDays);

  const totalFlightCostComfort = flightComfort.price * travelersCount * (request.tripType === 'one-way' ? 1 : 1.95);
  const totalHotelCostComfort = hotelComfort ? hotelComfort.totalPrice : 0;
  const breakdownComfort = calculateBudgetBreakdown(request, totalFlightCostComfort, totalHotelCostComfort, stayDays);

  const totalFlightCostLuxury = flightLuxury.price * travelersCount * (request.tripType === 'one-way' ? 1 : 2.0);
  const totalHotelCostLuxury = hotelLuxury ? hotelLuxury.totalPrice : 0;
  const breakdownLuxury = calculateBudgetBreakdown(request, totalFlightCostLuxury, totalHotelCostLuxury, stayDays);

  // Generate Itineraries
  const itineraryBudget = generateItineraryDays(request, stayDays, 'budget', isSameDay);
  const itineraryBalanced = generateItineraryDays(request, stayDays, 'balanced', isSameDay);
  const itineraryComfort = generateItineraryDays(request, stayDays, 'comfort', isSameDay);
  const itineraryLuxury = generateItineraryDays(request, stayDays, 'luxury', isSameDay);

  const plans: TravelPlanOption[] = [
    {
      tier: 'balanced',
      title: 'Balanced & Most Popular',
      tagline: 'The ideal equilibrium of price, direct flight comfort, prime location, and flexible itinerary.',
      budgetBreakdown: breakdownBalanced,
      flight: flightBalanced,
      returnFlight,
      hotel: hotelBalanced,
      itinerary: itineraryBalanced,
      highlights: [
        'Nonstop flight timings maximizing daytime exploration',
        isSameDay ? 'Guaranteed 6.3-hour core sightseeing window' : 'Centrally located 4-star stay with direct metro links',
        'Includes essential skip-the-line attraction passes',
        'Built-in 10% emergency reserve fund',
      ],
      tradeoffs: [
        'Standard checked baggage allowance (1 piece per traveler)',
        'Popular restaurant tables require 2-day advance reservations',
      ],
      sameDayFeasibility,
    },
    {
      tier: 'budget',
      title: 'Value & Budget Conscious',
      tagline: 'Maximum destination experience at minimum expenditure with verified budget accommodation and transit.',
      budgetBreakdown: breakdownBudget,
      flight: flightBudget,
      returnFlight,
      hotel: hotelBudget,
      itinerary: itineraryBudget,
      highlights: [
        'Lowest available flight fares with vetted scheduled carriers',
        isSameDay ? 'Self-guided express metro sightseeing route' : 'Clean, highly-rated boutique budget stay near rapid transit',
        'Authentic local street food and market dining recommendations',
        'Emphasis on free cultural monuments and public parks',
      ],
      tradeoffs: [
        'Potential short layover or early morning departure',
        'Hotel cancellation policies may have strict cutoff dates',
      ],
      sameDayFeasibility,
    },
    {
      tier: 'comfort',
      title: 'Comfort & Direct Seamless',
      tagline: 'Streamlined travel with premium economy flights, central historical hotels, and private airport transfers.',
      budgetBreakdown: breakdownComfort,
      flight: flightComfort,
      returnFlight,
      hotel: hotelComfort,
      itinerary: itineraryComfort,
      highlights: [
        'Fast-track airport terminal security & priority boarding',
        isSameDay ? 'Private chauffeured airport transfer directly to landmarks' : 'Prestigious hotel within walking distance of prime attractions',
        'Guided historical walking tours with certified local experts',
        'Full flexible ticket cancellation and date modification coverage',
      ],
      tradeoffs: [
        'Higher overall total cost relative to budget tier',
      ],
      sameDayFeasibility,
    },
    {
      tier: 'luxury',
      title: 'Luxury & VIP Concierge',
      tagline: 'First-class luxury, 5-star palace suites, bespoke private tours, and fine dining reservations.',
      budgetBreakdown: breakdownLuxury,
      flight: flightLuxury,
      returnFlight,
      hotel: hotelLuxury,
      itinerary: itineraryLuxury,
      highlights: [
        'Flat-bed business/first class international flight experience with lounge access',
        isSameDay ? 'VIP airside tarmac transfer, fast-track customs & luxury sedan' : '5-Star luxury landmark property with butler service and spa access',
        'Private after-hours admission to major museums and historical grounds',
        'Michelin-starred dining reservations curated to your dietary needs',
      ],
      tradeoffs: [
        'Substantial financial commitment',
        'Dress codes enforced at selected evening venues',
      ],
      sameDayFeasibility,
    },
  ];

  return plans;
}

function calculateStayDays(departure: string, returnDate?: string): number {
  if (!returnDate || departure === returnDate) return 1;
  const d1 = new Date(departure);
  const d2 = new Date(returnDate);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

function generateItineraryDays(
  request: TripRequest,
  stayDays: number,
  tier: string,
  isSameDay: boolean
): ItineraryDay[] {
  const destCity = request.destination.city;
  const isMoscow = destCity.toLowerCase().includes('moscow') || request.destination.code === 'SVO' || request.destination.code === 'DME';
  const isTokyo = destCity.toLowerCase().includes('tokyo') || request.destination.code === 'HND' || request.destination.code === 'NRT';
  const isParis = destCity.toLowerCase().includes('paris') || request.destination.code === 'CDG' || request.destination.code === 'ORY';

  if (isSameDay) {
    if (isMoscow) {
      return [
        {
          dayNumber: 1,
          date: request.departureDate,
          theme: 'Express Heritage & Red Square Odyssey (No-Overnight)',
          weatherForecast: { tempC: 15, condition: 'Clear Sky', icon: 'Sun' },
          activities: [
            {
              id: 'act-mos-1',
              time: '05:00 AM - 09:30 AM',
              title: 'Direct Flight to Moscow Sheremetyevo (SVO)',
              description: 'Nonstop flight from New Delhi (DEL) to Moscow (SVO) on Aeroflot SU 233. Rest in flight and prepare travel documents.',
              location: 'DEL Terminal 3 to SVO Terminal C',
              durationMinutes: 390,
              costEstimated: 0,
              category: 'flight',
            },
            {
              id: 'act-mos-2',
              time: '09:30 AM - 10:45 AM',
              title: 'Electronic Visa Verification & Sheremetyevo Customs Clearance',
              description: 'Fast clearance through immigration. Present your passport and printed Russian e-Visa notification. Hand luggage only bypasses baggage carousel.',
              location: 'SVO Terminal C Arrival Hall',
              durationMinutes: 75,
              costEstimated: 0,
              category: 'customs',
            },
            {
              id: 'act-mos-3',
              time: '10:45 AM - 11:40 AM',
              title: 'Aeroexpress High-Speed Express to Central Moscow',
              description: 'Comfortable rail link directly to Belorussky Railway Station (45 mins), followed by a brief 2-stop metro hop to Teatralnaya / Red Square.',
              location: 'Aeroexpress Platform to Belorusskaya Metro',
              durationMinutes: 55,
              costEstimated: 8,
              category: 'transport',
              ticketLink: 'https://aeroexpress.ru',
            },
            {
              id: 'act-mos-4',
              time: '11:45 AM - 13:45 PM',
              title: 'Red Square Exploration & Saint Basil’s Cathedral',
              description: 'Walk across the historic cobblestones of Red Square, visit the 16th-century multi-domed Saint Basil’s Cathedral, Kazan Cathedral, and State Historical Museum exterior.',
              location: 'Red Square, Moscow',
              durationMinutes: 120,
              costEstimated: 15,
              category: 'attraction',
              verifiedHours: '10:00 AM - 18:00 PM Daily',
              indoorBackup: 'State Historical Museum inside galleries if raining or cold',
              accessibilityNote: 'Cobblestones require sturdy footwear; ramps available near Spasskaya Tower',
            },
            {
              id: 'act-mos-5',
              time: '13:45 PM - 15:00 PM',
              title: 'Traditional Russian Lunch at Historic GUM Arcade',
              description: 'Savor authentic Russian delicacies (Borscht, beef stroganoff, handmade pelmeni, and blini pancakes) or dine at Stolovaya 57 for Soviet culinary nostalgia.',
              location: 'GUM Arcade, Red Square Level 3',
              durationMinutes: 75,
              costEstimated: 25,
              category: 'meal',
              accessibilityNote: 'Elevators connect all floors of GUM',
            },
            {
              id: 'act-mos-6',
              time: '15:00 PM - 17:30 PM',
              title: 'Kremlin Grounds & Zaryadye Park Panoramic Floating Bridge',
              description: 'Tour the Cathedral Square inside Moscow Kremlin, the Tsar Cannon and Tsar Bell, then stroll through the futuristic Zaryadye Park for sweeping Moskva River vistas.',
              location: 'Kremlin & Zaryadye Park',
              durationMinutes: 150,
              costEstimated: 20,
              category: 'attraction',
              verifiedHours: '09:30 AM - 17:00 PM',
            },
            {
              id: 'act-mos-7',
              time: '17:30 PM - 18:00 PM',
              title: 'Moscow Metro Architectural Mini-Tour',
              description: 'Experience the palatial marble, bronze chandeliers, and mosaics of Mayakovskaya and Ploshchad Revolyutsii metro stations.',
              location: 'Moscow Metro Line 2 & Line 3',
              durationMinutes: 30,
              costEstimated: 2,
              category: 'leisure',
            },
            {
              id: 'act-mos-8',
              time: '18:00 PM - 19:00 PM',
              title: 'Return Aeroexpress to Sheremetyevo Airport (SVO)',
              description: 'Board the prompt Aeroexpress from Belorussky station back to SVO Terminal C to ensure generous pre-flight buffer.',
              location: 'Belorusskaya Station to SVO',
              durationMinutes: 60,
              costEstimated: 8,
              category: 'transport',
            },
            {
              id: 'act-mos-9',
              time: '19:00 PM - 20:45 PM',
              title: 'Airport Security, Duty-Free & Boarding for Return Leg',
              description: 'Terminal C security check, passport exit stamp, and relaxing lounge rest before boarding flight SU 232 back to New Delhi.',
              location: 'SVO Terminal C International Departures',
              durationMinutes: 105,
              costEstimated: 0,
              category: 'flight',
            },
            {
              id: 'act-mos-10',
              time: '20:45 PM - 04:15 AM (+1d)',
              title: 'Return Overnight Flight to New Delhi (DEL)',
              description: 'Depart Moscow on Aeroflot SU 232, touchdown in New Delhi next morning. Complete successful same-day international visit!',
              location: 'SVO to DEL',
              durationMinutes: 360,
              costEstimated: 0,
              category: 'flight',
            },
          ],
        },
      ];
    }

    // Generic Same-Day
    return [
      {
        dayNumber: 1,
        date: request.departureDate,
        theme: `Same-Day Express Discovery in ${destCity}`,
        weatherForecast: { tempC: 20, condition: 'Mild Sun', icon: 'Sun' },
        activities: [
          {
            id: 'act-gen-1',
            time: '06:30 AM - 09:30 AM',
            title: `Outbound Flight from ${request.origin.city}`,
            description: `Early morning departure to maximize your sightseeing window in ${destCity}.`,
            location: `${request.origin.code} Airport`,
            durationMinutes: 180,
            costEstimated: 0,
            category: 'flight',
          },
          {
            id: 'act-gen-2',
            time: '10:00 AM - 13:00 PM',
            title: `Iconic Landmarks & Historical Center of ${destCity}`,
            description: 'Visit the landmark square, central cathedral/palace, and picturesque old town streets.',
            location: `${destCity} Center`,
            durationMinutes: 180,
            costEstimated: 25,
            category: 'attraction',
          },
          {
            id: 'act-gen-3',
            time: '13:00 PM - 14:30 PM',
            title: `Regional Specialty Lunch`,
            description: `Dine at an authentic bistro or traditional market tasting local culinary specialties.`,
            location: `${destCity} Gastronomy Quarter`,
            durationMinutes: 90,
            costEstimated: 30,
            category: 'meal',
          },
          {
            id: 'act-gen-4',
            time: '14:30 PM - 17:30 PM',
            title: `Museum & Scenic Promenade`,
            description: `Explore the top national museum or scenic waterfront promenade before heading back.`,
            location: `${destCity}`,
            durationMinutes: 180,
            costEstimated: 20,
            category: 'attraction',
          },
          {
            id: 'act-gen-5',
            time: '18:00 PM - 20:30 PM',
            title: `Airport Transit & Evening Return Flight`,
            description: `Express transit to airport, security clearance, and evening flight back to ${request.origin.city}.`,
            location: `${request.destination.code} Airport`,
            durationMinutes: 150,
            costEstimated: 0,
            category: 'flight',
          },
        ],
      },
    ];
  }

  // Multi-day Itineraries (Overnight stays)
  const days: ItineraryDay[] = [];
  const totalDaysToGenerate = Math.min(stayDays, 5); // Generate up to 5 detailed days

  for (let d = 1; d <= totalDaysToGenerate; d++) {
    const dayDate = new Date(request.departureDate);
    dayDate.setDate(dayDate.getDate() + (d - 1));
    const dateFormatted = dayDate.toISOString().split('T')[0];

    if (d === 1) {
      days.push({
        dayNumber: 1,
        date: dateFormatted,
        theme: `Arrival, Check-in & Orientation in ${destCity}`,
        weatherForecast: { tempC: 21, condition: 'Partly Sunny', icon: 'Sun' },
        activities: [
          {
            id: `act-d1-1`,
            time: '08:30 AM - 14:00 PM',
            title: `Arrival at ${request.destination.name}`,
            description: `International flight arrival, immigration clearance, luggage collection, and transfer to hotel.`,
            location: request.destination.name,
            durationMinutes: 330,
            costEstimated: 0,
            category: 'flight',
          },
          {
            id: `act-d1-2`,
            time: '14:30 PM - 16:00 PM',
            title: 'Hotel Check-in & Freshen Up',
            description: 'Unpack, rest from flight, and gather local maps and transit passes at concierge.',
            location: 'Hotel Lobby & Room',
            durationMinutes: 90,
            costEstimated: 0,
            category: 'hotel',
          },
          {
            id: `act-d1-3`,
            time: '16:30 PM - 19:00 PM',
            title: `Introductory Sunset Walk & Landmark Square`,
            description: `Gentle walking tour of surrounding historic streets, plazas, and scenic architecture.`,
            location: `${destCity} Historical Core`,
            durationMinutes: 150,
            costEstimated: 0,
            category: 'leisure',
          },
          {
            id: `act-d1-4`,
            time: '19:30 PM - 21:30 PM',
            title: 'Welcome Dinner & Local Cuisine',
            description: `Dinner tailored to your preferences (${request.dietaryPreferences.join(', ') || 'Local Gastronomy'}).`,
            location: `Central ${destCity}`,
            durationMinutes: 120,
            costEstimated: tier === 'luxury' ? 85 : 35,
            category: 'meal',
          },
        ],
      });
    } else if (d === 2) {
      days.push({
        dayNumber: 2,
        date: dateFormatted,
        theme: `Grand Heritage, Palaces & Masterpiece Museums`,
        weatherForecast: { tempC: 22, condition: 'Sunny & Crisp', icon: 'Sun' },
        activities: [
          {
            id: `act-d2-1`,
            time: '09:00 AM - 12:30 PM',
            title: isMoscow ? 'The Moscow Kremlin & Armoury Chamber' : isTokyo ? 'Senso-ji Temple & Historic Asakusa' : isParis ? 'The Louvre Museum Masterpieces' : 'Prime National Monument & Historical Tour',
            description: 'Priority morning admission avoiding peak midday crowds.',
            location: `${destCity} Cultural Quarter`,
            durationMinutes: 210,
            costEstimated: 25,
            category: 'attraction',
            verifiedHours: '09:00 AM - 17:30 PM',
            indoorBackup: 'Indoor royal chambers and galleries completely sheltered from weather',
          },
          {
            id: `act-d2-2`,
            time: '12:45 PM - 14:00 PM',
            title: 'Artisan Cafe Lunch & Bakery',
            description: 'Relaxed luncheon at a historic tea house or charming neighborhood bistro.',
            location: 'Old Town Boulevard',
            durationMinutes: 75,
            costEstimated: 22,
            category: 'meal',
          },
          {
            id: `act-d2-3`,
            time: '14:30 PM - 17:30 PM',
            title: isMoscow ? 'Red Square, Saint Basil\'s & GUM' : isTokyo ? 'teamLab Digital Art Museum' : isParis ? 'Eiffel Tower & Champ de Mars' : 'Panoramic City Viewpoint & River Walk',
            description: 'Iconic panoramic viewpoints and vibrant pedestrian areas.',
            location: `${destCity}`,
            durationMinutes: 180,
            costEstimated: 30,
            category: 'attraction',
          },
          {
            id: `act-d2-4`,
            time: '19:00 PM - 21:00 PM',
            title: 'Evening River Cruise / Cultural Performance',
            description: 'Scenic sunset boat cruise or world-class musical/ballet theatrical performance.',
            location: 'Waterfront / Opera District',
            durationMinutes: 120,
            costEstimated: tier === 'luxury' ? 120 : 40,
            category: 'leisure',
          },
        ],
      });
    } else {
      days.push({
        dayNumber: d,
        date: dateFormatted,
        theme: d === totalDaysToGenerate ? `Memories, Souvenirs & Departure` : `Local Neighborhoods, Art & Hidden Gems`,
        weatherForecast: { tempC: 20, condition: 'Partly Cloudy', icon: 'Cloud' },
        activities: [
          {
            id: `act-d${d}-1`,
            time: '09:30 AM - 12:30 PM',
            title: 'Artisan Markets, Boutiques & Neighborhood Stroll',
            description: 'Explore charming local shopping districts, flea markets, and specialty food boutiques.',
            location: `${destCity} Cultural District`,
            durationMinutes: 180,
            costEstimated: 15,
            category: 'leisure',
          },
          {
            id: `act-d${d}-2`,
            time: '13:00 PM - 14:30 PM',
            title: 'Farewell Luncheon',
            description: 'A celebration meal highlighting the best regional wines or signature desserts.',
            location: `${destCity}`,
            durationMinutes: 90,
            costEstimated: 35,
            category: 'meal',
          },
          {
            id: `act-d${d}-3`,
            time: '15:00 PM - 18:00 PM',
            title: d === totalDaysToGenerate ? 'Transfer to Airport & Security Clearance' : 'Modern Art Gallery & Botanical Gardens',
            description: d === totalDaysToGenerate ? 'Scheduled return transit to airport terminal for return flight.' : 'Sculpture gardens and botanical glasshouses.',
            location: `${destCity}`,
            durationMinutes: 180,
            costEstimated: 0,
            category: d === totalDaysToGenerate ? 'transport' : 'attraction',
          },
        ],
      });
    }
  }

  return days;
}
