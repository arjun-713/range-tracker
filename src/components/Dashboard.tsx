import { useState, useEffect } from 'react';
import { AppData } from '../types';
import { getRangeStatus, getRangeColor } from '../utils/calculations';
import { AlertTriangle, Gauge, Calendar, TrendingUp } from 'lucide-react';
import { format, startOfDay, differenceInDays } from 'date-fns';
import UpdateOdometerModal from './UpdateOdometerModal';
import AddChargeModal from './AddChargeModal';
import RangePredictorModal from './RangePredictorModal';

interface DashboardProps {
  appData: AppData;
  updateData: (updates: Partial<AppData>) => void;
}

export default function Dashboard({ appData, updateData }: DashboardProps) {
  const [showOdometerModal, setShowOdometerModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [showPredictorModal, setShowPredictorModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const { currentRange, currentOdometer, settings, odometerEntries, chargeSessions } = appData;
  const rangeStatus = getRangeStatus(currentRange, settings.lowRangeThreshold, settings.criticalRangeThreshold);
  const rangeColor = getRangeColor(rangeStatus);
  const rangePercentage = (currentRange / settings.maxRange) * 100;

  const today = startOfDay(new Date());
  const todayEntries = odometerEntries.filter(e => startOfDay(e.timestamp).getTime() === today.getTime());
  const todayDistance = todayEntries.reduce((sum, e) => sum + e.distanceTraveled, 0);
  const tripsToday = todayEntries.length;

  const lastCharge = chargeSessions.length > 0 ? chargeSessions[chargeSessions.length - 1] : null;
  const daysSinceCharge = lastCharge ? differenceInDays(new Date(), lastCharge.timestamp) : null;

  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('daxit_tooltip_seen');
    if (!hasSeenTooltip && odometerEntries.length === 0) {
      setShowTooltip(true);
    }
  }, [odometerEntries.length]);

  const dismissTooltip = () => {
    setShowTooltip(false);
    localStorage.setItem('daxit_tooltip_seen', 'true');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-gray-900">{settings.scooterName}</h1>
      </div>

      <div className="container-responsive px-4 py-6 lg:grid lg:grid-cols-[1.5fr_1fr] lg:gap-8 lg:max-w-7xl lg:mx-auto">
        {/* Hero Section - Left Column on Desktop */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 mb-6">
            {/* Scooter Visual */}
            <div className="flex justify-center items-center h-64 md:h-80 mb-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg">
              <img 
                src="/scooter.png" 
                alt="Hero Optima Electric Scooter" 
                className="w-full h-full object-contain p-4"
              />
            </div>

            {/* Range Display */}
            <div className="text-center mb-6">
              <div className="text-5xl md:text-6xl font-bold mb-2" style={{ color: rangeColor }}>
                {currentRange.toFixed(1)} <span className="text-2xl md:text-3xl text-gray-500">km</span>
              </div>
              <div className="text-sm text-gray-600">remaining</div>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${rangePercentage}%`, backgroundColor: rangeColor }}
                />
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 mb-4">
              of {settings.maxRange} km total
            </div>

            {/* Alert Banner */}
            {rangeStatus !== 'good' && (
              <div className={`p-3 rounded-lg flex items-start ${rangeStatus === 'critical' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                <AlertTriangle className={rangeStatus === 'critical' ? 'text-red-600' : 'text-yellow-600'} size={20} />
                <div className="ml-2 text-sm">
                  <span className={`font-semibold ${rangeStatus === 'critical' ? 'text-red-900' : 'text-yellow-900'}`}>
                    {rangeStatus === 'critical' ? '⚠ Low Range Alert' : '⚠ Low Range Alert'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons - Side by Side */}
          <div className="grid grid-cols-2 gap-3 mb-6 relative">
            <button
              onClick={() => setShowOdometerModal(true)}
              className="h-12 bg-blue-600 text-white rounded-lg font-medium text-[15px] hover:bg-blue-700 transition"
            >
              Update Odometer
            </button>
            <button
              onClick={() => setShowChargeModal(true)}
              className="h-12 bg-white text-gray-900 rounded-lg font-medium text-[15px] border-[1.5px] border-gray-300 hover:bg-gray-50 transition"
            >
              Add Charge
            </button>

            {showTooltip && (
              <div className="absolute -top-16 left-0 right-0 bg-gray-900 text-white p-3 rounded-lg shadow-xl z-10">
                <p className="text-sm mb-2">👆 Tap here after your next trip to log distance</p>
                <button onClick={dismissTooltip} className="text-xs text-green-400 font-semibold">
                  Got it
                </button>
              </div>
            )}
          </div>

          {/* Recent Trips - Mobile */}
          <div className="lg:hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Trips</h2>
              <button onClick={() => window.location.href = '/trips'} className="text-sm text-blue-600 hover:text-blue-700">
                View All →
              </button>
            </div>
            {odometerEntries.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No trips yet</p>
                <p className="text-sm text-gray-400 mt-1">Update your odometer to start tracking</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                {[...odometerEntries].reverse().slice(0, 3).map(entry => (
                  <div key={entry.id} className="p-4 hover:bg-gray-50 cursor-pointer transition">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm text-gray-600">{format(entry.timestamp, 'MMM d, h:mm a')}</span>
                      <span className="text-lg font-semibold text-gray-900">{entry.distanceTraveled.toFixed(1)} km</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {(entry.reading - entry.distanceTraveled).toFixed(1)} → {entry.reading.toFixed(1)} km
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.rangeBeforeTrip.toFixed(1)} → {entry.rangeAfterTrip.toFixed(1)} km range
                    </div>
                    {entry.notes && <div className="text-xs text-gray-600 italic mt-1">{entry.notes}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Right Column on Desktop */}
        <div className="lg:col-span-1">
          {/* Stats Grid */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
            <div className="grid grid-cols-3 lg:grid-cols-1 divide-x lg:divide-x-0 lg:divide-y divide-gray-200">
              <div className="p-4 text-center lg:text-left lg:flex lg:justify-between lg:items-center">
                <span className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1 lg:mb-0">Odometer</span>
                <div>
                  <span className="text-xl font-semibold text-gray-900">{currentOdometer.toFixed(1)}</span>
                  <span className="text-sm text-gray-500 ml-1">km</span>
                </div>
              </div>
              <div className="p-4 text-center lg:text-left lg:flex lg:justify-between lg:items-center">
                <span className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1 lg:mb-0">Today</span>
                <div>
                  <span className="text-xl font-semibold text-gray-900">{todayDistance.toFixed(1)}</span>
                  <span className="text-sm text-gray-500 ml-1">{tripsToday} trips</span>
                </div>
              </div>
              <div className="p-4 text-center lg:text-left lg:flex lg:justify-between lg:items-center">
                <span className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1 lg:mb-0">Last Charge</span>
                <div>
                  <span className="text-xl font-semibold text-gray-900">
                    {lastCharge ? (daysSinceCharge === 0 ? 'Today' : `${daysSinceCharge}d ago`) : 'Never'}
                  </span>
                </div>
              </div>
              <div className="p-4 text-center lg:text-left lg:flex lg:justify-between lg:items-center col-span-3 lg:col-span-1">
                <span className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1 lg:mb-0">Total Trips</span>
                <div>
                  <span className="text-xl font-semibold text-gray-900">{odometerEntries.length}</span>
                  <span className="text-sm text-gray-500 ml-1">all time</span>
                </div>
              </div>
              <div className="p-4 text-center lg:text-left lg:flex lg:justify-between lg:items-center col-span-3 lg:col-span-1">
                <span className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1 lg:mb-0">Avg Trip</span>
                <div>
                  <span className="text-xl font-semibold text-gray-900">
                    {odometerEntries.length > 0 
                      ? (odometerEntries.reduce((sum, e) => sum + e.distanceTraveled, 0) / odometerEntries.length).toFixed(1)
                      : '0.0'}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Can I Make It Card */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Can I Make It?</h3>
            <button
              onClick={() => setShowPredictorModal(true)}
              className="w-full bg-white border border-gray-300 rounded-lg p-4 text-left hover:bg-gray-50 transition"
            >
              <div className="text-sm text-gray-600 mb-1">Distance to destination</div>
              <div className="text-2xl font-semibold text-gray-400">Enter distance...</div>
            </button>
          </div>

          {/* Desktop Recent Trips */}
          <div className="hidden lg:block mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Trips</h2>
              <button onClick={() => window.location.href = '/trips'} className="text-sm text-blue-600 hover:text-blue-700">
                View All →
              </button>
            </div>
            {odometerEntries.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No trips yet</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                {[...odometerEntries].reverse().slice(0, 3).map(entry => (
                  <div key={entry.id} className="p-4 hover:bg-gray-50 cursor-pointer transition">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm text-gray-600">{format(entry.timestamp, 'MMM d, h:mm a')}</span>
                      <span className="text-lg font-semibold text-gray-900">{entry.distanceTraveled.toFixed(1)} km</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {(entry.reading - entry.distanceTraveled).toFixed(1)} → {entry.reading.toFixed(1)} km
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.rangeBeforeTrip.toFixed(1)} → {entry.rangeAfterTrip.toFixed(1)} km range
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showOdometerModal && (
        <UpdateOdometerModal
          appData={appData}
          updateData={updateData}
          onClose={() => setShowOdometerModal(false)}
        />
      )}

      {showChargeModal && (
        <AddChargeModal
          appData={appData}
          updateData={updateData}
          onClose={() => setShowChargeModal(false)}
        />
      )}

      {showPredictorModal && (
        <RangePredictorModal
          currentRange={currentRange}
          onClose={() => setShowPredictorModal(false)}
        />
      )}
    </div>
  );
}
