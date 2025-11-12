import { AppData } from '../types';
import { format } from 'date-fns';
import { MapPin } from 'lucide-react';

interface TripHistoryProps {
  appData: AppData;
}

export default function TripHistory({ appData }: TripHistoryProps) {
  const filteredEntries = [...appData.odometerEntries].reverse();

  return (
    <div className="relative mx-auto flex h-screen w-full max-w-md flex-col bg-white dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full shrink-0 border-b border-border-light dark:border-border-dark bg-white dark:bg-background-dark px-6 py-4">
        <h1 className="text-center text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
          Past Trips
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <MapPin size={48} className="text-text-secondary-light dark:text-text-secondary-dark mb-4" />
            <p className="text-text-primary-light dark:text-text-primary-dark">No trips recorded yet</p>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">
              Start tracking by updating your odometer
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredEntries.map((entry, index) => {
              const showDateHeader = index === 0 || 
                format(entry.timestamp, 'yyyy-MM-dd') !== format(filteredEntries[index - 1].timestamp, 'yyyy-MM-dd');
              
              return (
                <div key={entry.id}>
                  {showDateHeader && (
                    <div className="w-full px-6 pt-5 pb-4">
                      <p className="text-xs font-medium tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        {format(entry.timestamp, 'MMM dd, yyyy').toUpperCase()}
                      </p>
                    </div>
                  )}
                  <div className="w-full px-6 pb-5">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-start">
                        <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
                          {entry.distanceTraveled.toFixed(1)}
                        </p>
                        <p className="text-xs font-medium tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                          KM
                        </p>
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
                          {entry.rangeBeforeTrip.toFixed(0)}
                        </p>
                        <p className="text-xs font-medium tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                          PREV RANGE
                        </p>
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
                          {entry.rangeAfterTrip.toFixed(0)}
                        </p>
                        <p className="text-xs font-medium tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                          CURR RANGE
                        </p>
                      </div>
                    </div>
                    {entry.notes && (
                      <p className="mt-3 text-sm text-text-secondary-light dark:text-text-secondary-dark italic">
                        {entry.notes}
                      </p>
                    )}
                  </div>
                  <div className="h-px w-full bg-border-light dark:bg-border-dark"></div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
