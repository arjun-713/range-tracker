import { useState, useEffect, useRef } from 'react';
import { AppData } from '../types';
import { getRangeStatus } from '../utils/calculations';
import { requestNotificationPermission, checkAndNotifyLowRange } from '../utils/notifications';
import { AlertTriangle, Bell, BellOff, Mic, MicOff } from 'lucide-react';
import { startOfDay } from 'date-fns';
import UpdateOdometerModal from './UpdateOdometerModal';
import AddChargeModal from './AddChargeModal';
import RangePredictorModal from './RangePredictorModal';
import VoiceCommandModal from './VoiceCommandModal';

interface DashboardProps {
  appData: AppData;
  updateData: (updates: Partial<AppData>) => void;
}

export default function Dashboard({ appData, updateData }: DashboardProps) {
  const [showOdometerModal, setShowOdometerModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [showPredictorModal, setShowPredictorModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const lastNotificationRangeRef = useRef<number | null>(null);

  const { currentRange, currentOdometer, settings, odometerEntries } = appData;
  const rangeStatus = getRangeStatus(currentRange, settings.lowRangeThreshold, settings.criticalRangeThreshold);
  const rangePercentage = (currentRange / settings.maxRange) * 100;

  const today = startOfDay(new Date());
  const todayEntries = odometerEntries.filter(e => startOfDay(e.timestamp).getTime() === today.getTime());
  const todayDistance = todayEntries.reduce((sum, e) => sum + e.distanceTraveled, 0);
  const tripsToday = todayEntries.length;

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Check for low range and send notifications whenever range changes
  useEffect(() => {
    if (notificationsEnabled && currentRange > 0) {
      lastNotificationRangeRef.current = checkAndNotifyLowRange(
        currentRange,
        settings.lowRangeThreshold,
        settings.criticalRangeThreshold,
        lastNotificationRangeRef.current
      );
    }
  }, [currentRange, notificationsEnabled, settings.lowRangeThreshold, settings.criticalRangeThreshold]);

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

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    if (granted) {
      const { showNotification } = await import('../utils/notifications');
      showNotification('Notifications Enabled! 🔔', {
        body: "You'll receive alerts when your scooter range is low.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between">
        <button
          onClick={() => setShowVoiceModal(true)}
          className="flex items-center justify-center h-12 bg-transparent p-0"
          title="Voice command"
        >
          <Mic className="text-[#007AFF]" size={24} />
        </button>
        <div className="flex-1"></div>
        <button
          onClick={handleEnableNotifications}
          className="flex items-center justify-center h-12 bg-transparent p-0"
        >
          {notificationsEnabled ? (
            <Bell className="text-text-primary-light dark:text-text-primary-dark" size={24} />
          ) : (
            <BellOff className="text-text-secondary-light dark:text-text-secondary-dark" size={24} />
          )}
        </button>
      </div>

      {/* Scooter Icon */}
      <div className="flex w-full grow flex-col items-center justify-center bg-white dark:bg-background-dark py-3">
        <div className="flex justify-center items-center py-8">
          <svg width="96" height="96" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text-primary-light dark:text-text-primary-dark">
            <path d="M40 70 L40 50 L50 40 L70 40 L80 50 L80 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="35" cy="85" r="12" stroke="currentColor" strokeWidth="3" fill="none"/>
            <circle cx="35" cy="85" r="4" fill="currentColor"/>
            <circle cx="85" cy="85" r="12" stroke="currentColor" strokeWidth="3" fill="none"/>
            <circle cx="85" cy="85" r="4" fill="currentColor"/>
            <line x1="47" y1="85" x2="73" y2="85" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            <line x1="60" y1="40" x2="60" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="50" y1="25" x2="70" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <rect x="52" y="50" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>

      {/* Range Display */}
      <h1 className="text-text-primary-light dark:text-text-primary-dark tracking-tight text-5xl font-bold leading-tight px-4 text-center pb-3 pt-2">
        {currentRange.toFixed(1)} km remaining
      </h1>

      {/* Progress Bar */}
      <div className="flex flex-col gap-3 p-4 pt-6">
        <div className="bg-border-light dark:bg-border-dark h-1">
          <div className="h-1 bg-[#007AFF]" style={{ width: `${rangePercentage}%` }}></div>
        </div>
      </div>

      {/* Alert Banner */}
      {rangeStatus !== 'good' && (
        <div className={`mx-4 mb-4 p-4 border ${rangeStatus === 'critical' ? 'border-danger bg-red-50 dark:bg-red-900/20' : 'border-warning bg-yellow-50 dark:bg-yellow-900/20'}`}>
          <div className="flex items-center justify-center">
            <AlertTriangle className={rangeStatus === 'critical' ? 'text-danger' : 'text-warning'} size={20} />
            <span className={`ml-3 font-semibold ${rangeStatus === 'critical' ? 'text-danger' : 'text-warning'}`}>
              {rangeStatus === 'critical' ? 'Critical Range - Charge Now!' : 'Low Range Alert'}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 px-4 py-4 relative">
        <button
          onClick={() => setShowOdometerModal(true)}
          className="flex w-full items-center justify-center h-12 text-white bg-[#007AFF] text-sm font-bold leading-normal tracking-wide"
        >
          UPDATE ODOMETER
        </button>
        <button
          onClick={() => setShowChargeModal(true)}
          className="flex w-full items-center justify-center h-12 bg-white dark:bg-background-dark border-2 border-border-light dark:border-border-dark text-[#007AFF] text-sm font-bold leading-normal tracking-wide"
        >
          ADD CHARGE
        </button>

        {showTooltip && (
          <div className="absolute -top-16 left-0 right-0 bg-text-light dark:bg-text-dark text-background-light dark:text-background-dark p-3 shadow-xl z-10">
            <p className="text-sm mb-2">👆 Tap here after your next trip to log distance</p>
            <button onClick={dismissTooltip} className="text-xs text-[#007AFF] font-semibold">
              Got it
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="p-4 mt-4">
        <div className="grid grid-cols-2 border-t border-l border-border-light dark:border-border-dark">
          <div className="flex flex-col items-center justify-center p-6 border-b border-r border-border-light dark:border-border-dark">
            <p className="text-text-primary-light dark:text-text-primary-dark text-2xl font-bold tracking-tight">
              {todayDistance.toFixed(1)} km
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-normal tracking-widest uppercase mt-1">
              TRIP DISTANCE
            </p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 border-b border-r border-border-light dark:border-border-dark">
            <p className="text-text-primary-light dark:text-text-primary-dark text-2xl font-bold tracking-tight">
              {currentOdometer.toFixed(1)} km
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-normal tracking-widest uppercase mt-1">
              ODOMETER
            </p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 border-b border-r border-border-light dark:border-border-dark">
            <p className="text-text-primary-light dark:text-text-primary-dark text-2xl font-bold tracking-tight">
              {tripsToday}
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-normal tracking-widest uppercase mt-1">
              TRIPS TODAY
            </p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 border-b border-r border-border-light dark:border-border-dark">
            <p className="text-text-primary-light dark:text-text-primary-dark text-2xl font-bold tracking-tight">
              {rangePercentage.toFixed(0)}%
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-normal tracking-widest uppercase mt-1">
              BATTERY
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
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

      {showVoiceModal && (
        <VoiceCommandModal
          appData={appData}
          updateData={updateData}
          onClose={() => setShowVoiceModal(false)}
        />
      )}
    </div>
  );
}
