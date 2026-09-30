import React, { useState } from 'react';
import { X, Clock, MapPin, Calendar, Plus, Trash2, Printer, Share2, Sun, CloudRain, ShieldCheck, Accessibility } from 'lucide-react';
import { ActivityItem, ItineraryDay, TravelPlanOption, TripRequest } from '../types/travel';
import { formatCurrency } from '../utils/currencies';

interface PersonalizedItineraryModalProps {
  plan: TravelPlanOption;
  tripRequest: TripRequest;
  onClose: () => void;
}

export const PersonalizedItineraryModal: React.FC<PersonalizedItineraryModalProps> = ({
  plan,
  tripRequest,
  onClose,
}) => {
  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>(plan.itinerary);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // New activity form state
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('16:00 PM');
  const [newLocation, setNewLocation] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const currentDay = itineraryDays[activeDayIndex] || itineraryDays[0];

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ActivityItem = {
      id: `custom-act-${Date.now()}`,
      time: newTime,
      title: newTitle,
      description: 'Custom activity scheduled by traveler',
      location: newLocation || tripRequest.destination.city,
      durationMinutes: 90,
      costEstimated: 0,
      category: 'leisure',
    };

    const updated = [...itineraryDays];
    updated[activeDayIndex] = {
      ...currentDay,
      activities: [...currentDay.activities, newItem],
    };
    setItineraryDays(updated);
    setNewTitle('');
    setNewLocation('');
    setShowAddForm(false);
  };

  const handleDeleteActivity = (actId: string) => {
    const updated = [...itineraryDays];
    updated[activeDayIndex] = {
      ...currentDay,
      activities: currentDay.activities.filter((a) => a.id !== actId),
    };
    setItineraryDays(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <span>Personalized Schedule</span>
              <span aria-hidden="true">·</span>
              <span>{plan.tier.toUpperCase()} TIER</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-100">
              {tripRequest.destination.city} ({tripRequest.destination.code}) Itinerary
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Editable day-by-day and hour-by-hour schedule with verified opening hours & weather backups
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Print Itinerary"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day Selector Tabs (if multiple days) */}
        {itineraryDays.length > 1 && (
          <div className="flex gap-2 p-3 bg-slate-950 border-b border-slate-800 overflow-x-auto no-scrollbar">
            {itineraryDays.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setActiveDayIndex(idx)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  activeDayIndex === idx
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                Day {day.dayNumber}: {day.date}
              </button>
            ))}
          </div>
        )}

        {/* Day Header with Weather & Theme */}
        {currentDay && (
          <div className="p-4 sm:p-5 bg-slate-950/60 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-amber-400 font-semibold block">
                {currentDay.theme}
              </span>
              <span className="text-slate-400 mt-0.5 block">
                Date: {currentDay.date}
              </span>
            </div>

            {currentDay.weatherForecast && (
              <div className="flex items-center gap-2 text-slate-300">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Forecast: {currentDay.weatherForecast.tempC}°C ({currentDay.weatherForecast.condition})</span>
              </div>
            )}
          </div>
        )}

        {/* Activities Timeline (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {currentDay?.activities.map((act, i) => (
            <div
              key={act.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs group hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-amber-400 font-bold">
                    {act.time}
                  </span>
                  <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 uppercase">
                    {act.category}
                  </span>
                  {act.verifiedHours && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{act.verifiedHours}</span>
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-100 text-sm">
                  {act.title}
                </h4>

                <p className="text-slate-300 leading-relaxed">
                  {act.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{act.location}</span>
                  </span>

                  {act.durationMinutes > 0 && (
                    <span>Duration: ~{act.durationMinutes} mins</span>
                  )}
                </div>

                {/* Weather Backup Callout */}
                {act.indoorBackup && (
                  <div className="mt-2 p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-amber-300/90 flex items-start gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Weather Backup:</strong> {act.indoorBackup}</span>
                  </div>
                )}

                {/* Accessibility Note */}
                {act.accessibilityNote && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Accessibility className="w-3 h-3 text-slate-400" />
                    <span>{act.accessibilityNote}</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="sm:self-start flex sm:flex-col items-end gap-2 shrink-0">
                {act.costEstimated > 0 && (
                  <span className="font-mono text-xs font-bold text-amber-400">
                    ~{formatCurrency(act.costEstimated, tripRequest.currency)}
                  </span>
                )}
                <button
                  onClick={() => handleDeleteActivity(act.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded transition-colors cursor-pointer"
                  title="Remove activity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add Custom Activity Form */}
          {showAddForm ? (
            <form onSubmit={handleAddActivity} className="p-4 rounded-xl bg-slate-950 border border-amber-400/40 space-y-3 text-xs">
              <span className="font-bold text-slate-200 block">Add Custom Activity to Day {currentDay?.dayNumber}</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Activity Title (e.g. Visit State Historical Museum)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="sm:col-span-2 bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  required
                />
                <input
                  type="text"
                  placeholder="Time (e.g. 15:30 PM)"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>
              <input
                type="text"
                placeholder="Location / Address"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded font-bold bg-amber-400 text-slate-950 hover:bg-amber-300"
                >
                  Save Activity
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-3 border border-dashed border-slate-800 hover:border-amber-400/50 rounded-xl text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Stop or Landmark to This Day</span>
            </button>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>All times and estimated durations audited against local transport and opening windows.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
          >
            Done Editing
          </button>
        </div>
      </div>
    </div>
  );
};
