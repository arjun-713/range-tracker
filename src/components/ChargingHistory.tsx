import { AppData } from '../types';
import { format } from 'date-fns';
import { Battery, ArrowRight } from 'lucide-react';

interface ChargingHistoryProps {
  appData: AppData;
}

export default function ChargingHistory({ appData }: ChargingHistoryProps) {
  const sessions = [...appData.chargeSessions].reverse();
  const currentBatteryPercent = ((appData.currentRange / appData.settings.maxRange) * 100).toFixed(0);

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
            sessions.map(session => (
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
                      : `${session.duration}h ${((session.duration! % 1) * 60).toFixed(0)}m`}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-base font-medium text-text-primary-light dark:text-text-primary-dark">
                  <span>{session.rangeBeforeCharge.toFixed(0)}%</span>
                  <ArrowRight size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
                  <span>{((session.rangeAfterCharge / appData.settings.maxRange) * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
