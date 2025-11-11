import { useState } from 'react';
import { AppData } from '../types';
import { format, startOfDay, startOfWeek, startOfMonth } from 'date-fns';
import { Calendar, MapPin, Download } from 'lucide-react';
import { exportToCSV } from '../utils/calculations';

interface TripHistoryProps {
  appData: AppData;
}

type FilterType = 'all' | 'today' | 'week' | 'month';

export default function TripHistory({ appData }: TripHistoryProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const filterEntries = () => {
    const now = new Date();
    const today = startOfDay(now);
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);

    return appData.odometerEntries.filter(entry => {
      const entryDate = startOfDay(entry.timestamp);
      switch (filter) {
        case 'today': return entryDate.getTime() === today.getTime();
        case 'week': return entryDate >= weekStart;
        case 'month': return entryDate >= monthStart;
        default: return true;
      }
    }).reverse();
  };

  const filteredEntries = filterEntries();
  const totalDistance = filteredEntries.reduce((sum, e) => sum + e.distanceTraveled, 0);
  const avgDistance = filteredEntries.length > 0 ? totalDistance / filteredEntries.length : 0;

  const handleExport = () => {
    const data = appData.odometerEntries.map(e => ({
      date: format(e.timestamp, 'yyyy-MM-dd HH:mm'),
      reading: e.reading,
      distance: e.distanceTraveled,
      rangeBeforeTrip: e.rangeBeforeTrip,
      rangeAfterTrip: e.rangeAfterTrip,
      notes: e.notes || '',
    }));
    exportToCSV(data, 'daxit-trips.csv');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-gray-900">Trip History</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Filter and Export */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {(['all', 'today', 'week', 'month'] as FilterType[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {f === 'all' ? 'All Time' : f === 'today' ? 'Today' : f === 'week' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>
          {appData.odometerEntries.length > 0 && (
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center whitespace-nowrap"
            >
              <Download size={16} className="mr-2" />
              Export CSV
            </button>
          )}
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-gray-200">
            <div className="p-4 text-center">
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Total</div>
              <div className="text-2xl font-semibold text-gray-900">{totalDistance.toFixed(1)} km</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Avg Trip</div>
              <div className="text-2xl font-semibold text-gray-900">{avgDistance.toFixed(1)} km</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Total Charges</div>
              <div className="text-2xl font-semibold text-gray-900">{appData.chargeSessions.length}</div>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          All Trips ({filteredEntries.length})
        </h2>
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No trips recorded yet</p>
            <p className="text-sm text-gray-500 mt-2">Start tracking by updating your odometer</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
            {filteredEntries.map((entry, index) => {
              const showDateHeader = index === 0 || 
                format(entry.timestamp, 'yyyy-MM-dd') !== format(filteredEntries[index - 1].timestamp, 'yyyy-MM-dd');
              
              return (
                <div key={entry.id}>
                  {showDateHeader && (
                    <div className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
                      {format(entry.timestamp, 'MMMM d, yyyy')}
                    </div>
                  )}
                  <div className="p-4 hover:bg-gray-50 cursor-pointer transition">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-gray-600">{format(entry.timestamp, 'h:mm a')}</span>
                      <span className="text-xl font-semibold text-gray-900">{entry.distanceTraveled.toFixed(1)} km</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-1">
                      {(entry.reading - entry.distanceTraveled).toFixed(1)} → {entry.reading.toFixed(1)} km
                    </div>
                    <div className="text-sm text-gray-500">
                      {entry.rangeBeforeTrip.toFixed(1)} → {entry.rangeAfterTrip.toFixed(1)} km range
                    </div>
                    {entry.notes && (
                      <div className="mt-2 text-sm text-gray-600 italic">{entry.notes}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
