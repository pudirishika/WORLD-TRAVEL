import React from 'react';
import { Globe, ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenFAQ: () => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenFAQ,
  onOpenPrivacy,
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <span className="font-display font-bold text-sm tracking-wider text-slate-100 uppercase">
                WORLD TRAVEL
              </span>
            </div>
            <p className="font-medium text-amber-400/90 text-xs">
              “Your World. Your Budget. Your Journey.”
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Global travel planning platform providing transparent budget breakdowns, verified flight schedules, and zero-overnight feasibility analysis.
            </p>
          </div>

          {/* Nav Mirror */}
          <div>
            <span className="font-bold text-slate-200 uppercase tracking-wider block mb-3">
              Explore & Plan
            </span>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => onSelectTab('planner')}
                  className="hover:text-amber-400 transition-colors"
                >
                  AI Trip Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('same-day')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Same-Day Return Trips
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('flights')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Flight Comparison Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('hotels')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Hotel & Nearby Stays
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('destinations')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Worldwide Destination Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('budget')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Budget Simulator
                </button>
              </li>
            </ul>
          </div>

          {/* Official Disclaimers */}
          <div>
            <span className="font-bold text-slate-200 uppercase tracking-wider block mb-3">
              Consular & Visa Notice
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Visa requirements, e-Visa processing periods, and customs regulations are provided for informational planning purposes based on official government immigration portals. Travelers must confirm final entry authorizations with the relevant official consular authorities before departure.
            </p>
          </div>

          {/* Support & Contact */}
          <div>
            <span className="font-bold text-slate-200 uppercase tracking-wider block mb-3">
              24/7 Client Support
            </span>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>concierge@worldtravel.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+1 (800) 555-WORLD</span>
              </div>
              <div className="pt-2 flex items-center gap-3">
                <button onClick={onOpenFAQ} className="hover:text-amber-400 underline">
                  FAQ
                </button>
                <button onClick={onOpenPrivacy} className="hover:text-amber-400 underline">
                  Privacy Policy & Terms
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} WORLD TRAVEL INC. All rights reserved. Worldwide travel intelligence.
          </div>
          <div className="flex items-center gap-4">
            <span>Verified GDS & Airline Partners</span>
            <span>·</span>
            <span>PCI DSS Transparent Pricing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
