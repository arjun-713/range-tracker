import { useState, useEffect } from 'react';
import { AppData, ChargeSession } from '../types';
import { format } from 'date-fns';
import { Battery, ArrowRight, Play, Square } from 'lucide-react';

interface ChargingHistoryProps {
  appData: AppData;
  updateData: (updates: Partial<AppData>) => void;
}

export default function ChargingHistory({ appData, updateData }: ChargingHistoryProps) {
  const [isCharging, setIsCharging] = useState(false);
  const [chargeStartTime, setChargeStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const sessions = [...appData.chargeSessions].reverse();
  const currentBatteryPercent = ((appData.currentRange / appData.settings.maxRange) * 100).toFixed(0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCharging && chargeStartTime) {
      interval = setInterval(() => {
        const elapsed = (Date.now() - chargeStartTime.getTime()) / 1000 / 60 / 60; // hours
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCharging, chargeStartTime]);

  const startCharging = () => {
    setIsCharging(true);
    setChargeStartTime(new Date());
    setElapsedTime(0);
  };

  const stopCharging = () => {
    if (!chargeStartTime) return;

    const duration = (Date.now() - chargeStartTime.getTime()) / 1000 / 60 / 60; // hours
    const rangeAdded = (duration / appData.settings.fullChargeDuration) * appData.settings.maxRange;
    const newRange = Math.min(appData.settings.maxRange, appData.currentRange + rangeAdded);

    const session: ChargeSession = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: 'partial',
      duration: duration,
      rangeBeforeCharge: appData.currentRange,
      rangeAfterCharge: newRange,
    };

    updateData({
      currentRange: newRange,
      chargeSessions: [...appData.chargeSessions, session],
    });

    setIsCharging(false);
    setChargeStartTime(null);
    setElapsedTime(0);
  };

  const formatElapsedTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours % 1) * 60);
    const s = Math.floor(((hours % 1) * 60 % 1) * 60);
    return `${h}h ${m}m ${s}s`;
  };

  const formatDuration = (hours: number) => {
    const totalMinutes = Math.floor(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    
    if (h > 0) {
      return `${h}h ${m}m`;
    } else if (m > 0) {
      return `${m}m`;
    } else {
      const s = Math.floor(hours * 3600);
      return `${s}s`;
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <div className="flex-1 pb-24">
        {/* Header */}
        <div className="flex items-center p-4">
          <div className="flex size-12 shrink-0 items-center justify-start text-text-primary-light dark:text-text-primary-dark">
            {/* Back button placeholder */}
          </div>
          <h2 className="flex-1 text-center text-lg font-bold tracking-[-0.015em] text-text-primary-light dark:text-text-primary-dark pr-12">
            Charging
          </h2>
        </div>

        {/* Battery Percentage Display */}
        <div className="flex flex-col items-center justify-center pt-8 pb-4">
          <div className="flex items-baseline gap-2">
            <h1 className="text-[96px] font-bold leading-none tracking-tighter text-text-primary-light dark:text-text-primary-dark">
              {currentBatteryPercent}%
            </h1>
          </div>
        </div>

        {/* Quick Charge Timer */}
        <div className="px-4 pb-6">
          {isCharging ? (
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Charging in progress</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                    {formatElapsedTime(elapsedTime)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    +{((elapsedTime / appData.settings.fullChargeDuration) * appData.settings.maxRange).toFixed(1)} km
                  </p>
                </div>
                <button
                  onClick={stopCharging}
                  className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                >
                  <Square className="text-white" size={28} fill="white" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={startCharging}
              className="w-full bg-[#007AFF] hover:bg-[#0051D5] text-white rounded-2xl p-6 flex items-center justify-between transition-colors"
            >
              <div className="text-left">
                <p className="text-lg font-bold">Quick Charge</p>
                <p className="text-sm opacity-90">Start charging timer</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <Play className="text-white ml-1" size={28} fill="white" />
              </div>
            </button>
          )}
        </div>

        {/* Charging History Section */}
        <div className="px-4 pb-2 pt-16">
          <h3 className="text-sm font-bold leading-tight tracking-widest text-text-secondary-light dark:text-text-secondary-dark">
            CHARGING HISTORY
          </h3>
        </div>

        {/* Charging Sessions List */}
        <div className="flex flex-col px-4">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Battery size={48} className="text-text-secondary-light dark:text-text-secondary-dark mb-4" />
              <p className="text-text-primary-light dark:text-text-primary-dark">No charging sessions yet</p>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">
                Log your first charge from the home screen
              </p>
            </div>
          ) : (
            sessions.map(session => {
              const beforePercent = ((session.rangeBeforeCharge / appData.settings.maxRange) * 100).toFixed(0);
              const afterPercent = ((session.rangeAfterCharge / appData.settings.maxRange) * 100).toFixed(0);
              
              return (
                <div 
                  key={session.id} 
                  className="flex items-center justify-between border-b border-border-light dark:border-border-dark py-4"
                >
                  <div className="flex flex-col">
                    <p className="text-base font-medium text-text-primary-light dark:text-text-primary-dark">
                      {format(session.timestamp, 'MMMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {session.type === 'full' 
                        ? 'Full charge' 
                        : formatDuration(session.duration!)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-base font-medium text-text-primary-light dark:text-text-primary-dark">
                    <span>{beforePercent}%</span>
                    <ArrowRight size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                    <span>{afterPercent}%</span>
                  </div>
                </div>
              );
            })
          )
          )}
        </div>
      </div>
    </div>
  );
}
