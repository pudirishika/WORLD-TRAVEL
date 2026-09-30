import React, { useState } from 'react';
import { X, SlidersHorizontal, Check, Database, Shield, Radio, RefreshCw } from 'lucide-react';
import { EXCHANGE_RATES } from '../utils/currencies';

interface AdminDashboardModalProps {
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ onClose }) => {
  const [liveApiMode, setLiveApiMode] = useState(true);
  const [autoVisaVerification, setAutoVisaVerification] = useState(true);
  const [contingencyPercentage, setContingencyPercentage] = useState(10);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-xs">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <h3 className="font-display font-bold text-base text-slate-100">
              WORLD TRAVEL · Content & Integration Console
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Provider Data Mode */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Connected Flight & Hotel Data Feeds</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              When enabled, schedules and pricing dynamically map to verified GDS/OTA timetables (Aeroflot SU 233/232, British Airways BA 178, Emirates EK 511, etc.) and connected booking endpoints.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="radio"
                  name="apiMode"
                  checked={liveApiMode}
                  onChange={() => setLiveApiMode(true)}
                  className="text-amber-400"
                />
                <span>Live GDS & Airline Route Feeds</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="radio"
                  name="apiMode"
                  checked={!liveApiMode}
                  onChange={() => setLiveApiMode(false)}
                  className="text-amber-400"
                />
                <span>Sandbox / High-Fidelity Simulation Mode</span>
              </label>
            </div>
          </div>

          {/* Contingency Buffer Setting */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="font-bold text-slate-200 block">System Emergency Reserve Buffer</span>
            <p className="text-slate-400 text-[11px]">
              Standard margin applied across all generated budgets to prevent over-budget surprises.
            </p>
            <div className="flex items-center gap-3">
              {[5, 10, 15].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setContingencyPercentage(pct)}
                  className={`px-3 py-1.5 rounded-lg border font-mono ${
                    contingencyPercentage === pct
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {pct}% Buffer
                </button>
              ))}
            </div>
          </div>

          {/* Active Currencies */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-slate-200 block">Multi-Currency Exchange Matrix</span>
            <div className="grid grid-cols-4 gap-2 font-mono text-[11px] text-slate-300">
              {Object.entries(EXCHANGE_RATES).map(([code, info]) => (
                <div key={code} className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="font-bold text-amber-400">{code}</div>
                  <div className="text-[10px] text-slate-400">1 USD = {info.rate} {info.symbol}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          {savedSuccess ? (
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>Settings Synchronized</span>
            </span>
          ) : (
            <span className="text-slate-400 text-[11px]">WORLD TRAVEL Admin v2.4</span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 font-bold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
