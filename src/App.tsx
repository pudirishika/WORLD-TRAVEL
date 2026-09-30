import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TripPlannerForm } from './components/TripPlannerForm';
import { SameDaySpotlight } from './components/SameDaySpotlight';
import { TravelPlansList } from './components/TravelPlansList';
import { FlightSearchSection } from './components/FlightSearchSection';
import { HotelSearchSection } from './components/HotelSearchSection';
import { DestinationsSection } from './components/DestinationsSection';
import { BudgetCalculatorSection } from './components/BudgetCalculatorSection';
import { PersonalizedItineraryModal } from './components/PersonalizedItineraryModal';
import { SavedTripsModal } from './components/SavedTripsModal';
import { AIConsultantChat } from './components/AIConsultantChat';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { FAQModal, PrivacyModal } from './components/InfoModals';
import { BookingCheckoutModal } from './components/BookingCheckoutModal';
import { Footer } from './components/Footer';
import { CurrencyCode, DestinationGuide, SavedTrip, TravelPlanOption, TripRequest } from './types/travel';
import { generateTravelPlans } from './services/plannerService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('planner');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  // Active Trip Request & Plans
  const [currentRequest, setCurrentRequest] = useState<TripRequest>({
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
  });

  const [generatedPlans, setGeneratedPlans] = useState<TravelPlanOption[]>([]);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isPlanningLoading, setIsPlanningLoading] = useState<boolean>(false);

  // Modals
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [showSavedModal, setShowSavedModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showChatModal, setShowChatModal] = useState<boolean>(false);
  const [showFAQModal, setShowFAQModal] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);

  // Selected Plan for Itinerary View or Booking
  const [activePlanForItinerary, setActivePlanForItinerary] = useState<TravelPlanOption | null>(null);
  const [activePlanForBooking, setActivePlanForBooking] = useState<TravelPlanOption | null>(null);

  // Initial plan generation on mount
  useEffect(() => {
    // Generate initial plans for India to Moscow same-day demonstration
    const initialPlans = generateTravelPlans(currentRequest);
    setGeneratedPlans(initialPlans);
  }, []);

  // Update budget when currency switches
  useEffect(() => {
    if (currency === 'INR' && currentRequest.budget < 10000) {
      setCurrentRequest((prev) => ({ ...prev, currency, budget: 500000 }));
    } else if (currency !== 'INR' && currentRequest.budget > 10000) {
      setCurrentRequest((prev) => ({ ...prev, currency, budget: 3500 }));
    }
  }, [currency]);

  // Handle Trip Planning Request
  const handlePlanTrip = async (req: TripRequest) => {
    setIsPlanningLoading(true);
    setCurrentRequest(req);
    setCurrentTab('planner');

    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedPlans(data.plans || []);
        setAiAdvice(data.aiAdvice || null);
      } else {
        // Fallback local generator if server route has issue
        const plans = generateTravelPlans(req);
        setGeneratedPlans(plans);
      }
    } catch (err) {
      console.warn('Backend plan request error, utilizing client engine:', err);
      const plans = generateTravelPlans(req);
      setGeneratedPlans(plans);
    } finally {
      setIsPlanningLoading(false);
      // Smooth scroll to generated plans
      setTimeout(() => {
        const el = document.getElementById('plans-results-anchor');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Quick preset loading from SameDaySpotlight or Hero
  const handleLoadSameDayDemo = () => {
    const demoReq: TripRequest = {
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
      specialNotes: 'India to Russia visit Red Square Moscow and return same day without staying overnight. Budget ₹5,00,000.',
    };
    handlePlanTrip(demoReq);
  };

  const handleSelectDestinationForTrip = (guide: DestinationGuide) => {
    const req: TripRequest = {
      ...currentRequest,
      destination: {
        code: guide.airportCode,
        name: `${guide.name} International`,
        city: guide.city,
        country: guide.country,
      },
      needAccommodation: currentRequest.tripType !== 'same-day',
    };
    handlePlanTrip(req);
  };

  const handleSaveTrip = (plan: TravelPlanOption) => {
    const newSaved: SavedTrip = {
      id: `saved-${Date.now()}`,
      createdAt: new Date().toISOString(),
      request: currentRequest,
      selectedPlan: plan,
      bookingStatus: 'planning',
    };
    setSavedTrips((prev) => [newSaved, ...prev]);
    setShowSavedModal(true);
  };

  const handleBookingSuccess = (bookingRef: string, passengerName: string) => {
    if (activePlanForBooking) {
      const bookedTrip: SavedTrip = {
        id: `booked-${Date.now()}`,
        createdAt: new Date().toISOString(),
        request: currentRequest,
        selectedPlan: activePlanForBooking,
        bookingStatus: 'booked',
        bookingReference: bookingRef,
        passengerNames: [passengerName],
      };
      setSavedTrips((prev) => [bookedTrip, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currency={currency}
        setCurrency={setCurrency}
        savedTripsCount={savedTrips.length}
        onOpenSaved={() => setShowSavedModal(true)}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenChat={() => setShowChatModal(true)}
      />

      {/* Main Tab Routing */}
      <main className="flex-1">
        {currentTab === 'planner' && (
          <>
            <HeroSection
              onStartPlanning={() => {
                const el = document.getElementById('planner-form-anchor');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onTrySameDayDemo={handleLoadSameDayDemo}
              onExploreDestinations={() => setCurrentTab('destinations')}
            />

            <div id="planner-form-anchor" className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
              <TripPlannerForm
                initialRequest={currentRequest}
                currency={currency}
                onPlanTrip={handlePlanTrip}
                isLoading={isPlanningLoading}
              />
            </div>

            <div id="plans-results-anchor">
              {generatedPlans.length > 0 && (
                <TravelPlansList
                  plans={generatedPlans}
                  tripRequest={currentRequest}
                  onSelectPlanForBooking={(plan) => setActivePlanForBooking(plan)}
                  onSaveTrip={handleSaveTrip}
                  onOpenItineraryModal={(plan) => setActivePlanForItinerary(plan)}
                  aiAdvice={aiAdvice}
                />
              )}
            </div>

            <SameDaySpotlight
              onLoadTrip={handlePlanTrip}
              currency={currency}
            />
          </>
        )}

        {currentTab === 'same-day' && (
          <div className="py-8">
            <SameDaySpotlight
              onLoadTrip={handlePlanTrip}
              currency={currency}
            />
          </div>
        )}

        {currentTab === 'flights' && (
          <FlightSearchSection currency={currency} />
        )}

        {currentTab === 'hotels' && (
          <HotelSearchSection currency={currency} />
        )}

        {currentTab === 'destinations' && (
          <DestinationsSection
            currency={currency}
            onSelectDestinationForTrip={handleSelectDestinationForTrip}
          />
        )}

        {currentTab === 'budget' && (
          <BudgetCalculatorSection currency={currency} />
        )}
      </main>

      {/* Modals & Overlays */}
      {activePlanForItinerary && (
        <PersonalizedItineraryModal
          plan={activePlanForItinerary}
          tripRequest={currentRequest}
          onClose={() => setActivePlanForItinerary(null)}
        />
      )}

      {activePlanForBooking && (
        <BookingCheckoutModal
          plan={activePlanForBooking}
          request={currentRequest}
          onClose={() => setActivePlanForBooking(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {showSavedModal && (
        <SavedTripsModal
          savedTrips={savedTrips}
          onRemoveTrip={(id) => setSavedTrips((prev) => prev.filter((t) => t.id !== id))}
          onClose={() => setShowSavedModal(false)}
          currency={currency}
        />
      )}

      {showAdminModal && (
        <AdminDashboardModal onClose={() => setShowAdminModal(false)} />
      )}

      <AIConsultantChat
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        activeContext={currentRequest}
      />

      {/* Floating n8n AI Chatbot Trigger in bottom-right */}
      {!showChatModal && (
        <aside aria-label="Live Travel Assistance" className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowChatModal(true)}
            className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs rounded-full shadow-2xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-amber-300/60"
            title="Chat with AI Agent (n8n Webhook)"
          >
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-slate-950 opacity-40" />
              <span className="relative flex h-2.5 w-2.5 rounded-full bg-slate-950" />
            </div>
            <span className="hidden sm:inline font-display tracking-wide uppercase text-[11px]">Chat with AI Agent</span>
            <span className="sm:hidden font-display tracking-wide uppercase text-[11px]">AI Chat</span>
          </button>
        </aside>
      )}

      {showFAQModal && (
        <FAQModal onClose={() => setShowFAQModal(false)} />
      )}

      {showPrivacyModal && (
        <PrivacyModal onClose={() => setShowPrivacyModal(false)} />
      )}

      {/* Footer */}
      <Footer
        onSelectTab={setCurrentTab}
        onOpenFAQ={() => setShowFAQModal(true)}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
      />
    </div>
  );
}
