import React from 'react';
import { X, HelpCircle, Shield, FileText } from 'lucide-react';

interface FAQModalProps {
  onClose: () => void;
}

export const FAQModal: React.FC<FAQModalProps> = ({ onClose }) => {
  const faqs = [
    {
      q: 'How does Same-Day Return travel work?',
      a: 'If you want to travel to an international destination (like Moscow or Paris) and return without staying overnight in a hotel, our engine calculates outbound flight arrival times, immigration buffers (typically 1–1.5 hours), ground express rail to city landmarks, daytime sightseeing hours, and the mandatory return check-in window. If there is less than 4 daylight sightseeing hours available, we advise against same-day travel and suggest a micro-overnight stay.',
    },
    {
      q: 'Does WORLD TRAVEL charge hidden fees?',
      a: 'No. Every plan itemizes exact flight fares, accommodation, local transfers, meals, entry tickets, visa charges, baggage/airline taxes, and a dedicated 10% contingency buffer to ensure you never face unexpected expenses.',
    },
    {
      q: 'Can I travel on a very low or very high budget?',
      a: 'Yes. Our platform generates 4 feasible tiers for any route: Value & Budget Conscious, Balanced, Comfort & Direct, and Luxury VIP. We never artificially restrict your budget.',
    },
    {
      q: 'How do I obtain the Russian e-Visa for Moscow?',
      a: 'Citizens of 55 countries, including India and European nations, can apply for the Russian Unified Electronic Visa online via the official portal (evisa.kdmid.ru). Processing takes approximately 4 calendar days, costs ~$52 USD, and allows a stay of up to 16 days within a 60-day validity period.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative text-xs">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <h3 className="font-display text-xl font-bold text-slate-100">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {faqs.map((faq, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="font-bold text-amber-400 text-sm block">{faq.q}</span>
              <p className="text-slate-300 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PrivacyModal: React.FC<FAQModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative text-xs text-slate-300 space-y-4">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-amber-400" />
          <h3 className="font-display text-xl font-bold text-slate-100">
            Privacy Policy & Terms of Service
          </h3>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
          <p>
            <strong>WORLD TRAVEL</strong> is committed to data transparency and passenger privacy. We do not sell personal travel itineraries or passport information to third-party data brokers.
          </p>
          <p>
            <strong>Booking Transparency:</strong> Flight schedules and fare quotes reflect scheduled airline inventory. Final reservations are executed directly with the respective airlines or verified ticketing partners.
          </p>
          <p>
            <strong>Consular Guidance:</strong> Entry permissions, passport validity requirements (minimum 6 months recommended for international travel), and visa approvals remain the exclusive jurisdiction of the sovereign immigration authorities of each respective destination country.
          </p>
        </div>
      </div>
    </div>
  );
};
