import { AppData } from '../types';
import { format } from 'date-fns';
import { Battery, Download, TrendingUp } from 'lucide-react';
import { exportToCSV } from '../utils/calculations';

interface ChargingHistoryProps {
  appData: AppData;
}

export default function ChargingHistory({ appData }: ChargingHistoryProps) {
  const sessions = [...appData.chargeSessions].reverse();
  const totalCharges = sessions.length;
  const fullCharges = sessions.filter(s => s.type === 'full').length;
  const partialCharges = sessions.filter(s => s.type === 'partial').length;

  const avgRangePerCharge = totalCharges > 0
    ? sessions.reduce((sum, s) => sum + s.rangeAdded, 0) / totalCharges
    : 0;

  const handleExport = () => {
    const data = appData.chargeSessions.map(s => ({
      date: format(s.timestamp, 'yyyy-MM-dd HH:mm'),
      type: s.type,
      duration: s.duration || 'N/A',
      rangeBeforeCharge: s.rangeBeforeCharge,
      rangeAdded: s.rangeAdded,
      rangeAfterCharge: s.rangeAfterCharge,
    }));
    exportToCSV(data, 'daxit-charges.csv');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-4">Charging History</h1>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-xs opacity-90">Total</div>
            <div className="text-xl font-bold">{totalCharges}</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-xs opacity-90">Full</div>
            <div className="text-xl font-bold">{fullCharges}</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-xs opacity-90">Partial</div>
            <div className="text-xl font-bold">{partialCharges}</div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4">
        {totalCharges > 0 && (
          <>
            <div className="bg-white rounded-xl shadow p-4 mb-4">
              <div className="flex items-center text-gray-600 mb-2">
                <TrendingUp size={20} className="mr-2" />
                <span className="font-medium">Average Range Per Charge</span>
              </div>
              <div className="text-3xl font-bold text-primary">
                {avgRangePerCharge.toFixed(1)} km
              </div>
            </div>

            <button
              onClick={handleExport}
              className="w-full mb-4 bg-white text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow flex items-center justify-center"
            >
              <Download size={20} className="mr-2" />
              Export to CSV
            </button>
          </>
        )}

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <Battery size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No charging sessions yet</p>
            <p className="text-sm text-gray-500 mt-2">Log your first charge from the home screen</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(session => (
              <div key={session.id} className="bg-white rounded-xl shadow p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {format(session.timestamp, 'MMM d, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(session.timestamp, 'h:mm a')}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      session.type === 'full' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {session.type === 'full' ? '🔋 Full' : '⚡ Partial'}
                    </span>
                  </div>
                </div>

                {session.duration && (
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">Duration: </span>
                    <span className="text-sm font-semibold">{session.duration} hours</span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-gray-600">Before</div>
                    <div className="font-semibold">{session.rangeBeforeCharge.toFixed(1)} km</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Added</div>
                    <div className="font-semibold text-primary">+{session.rangeAdded.toFixed(1)} km</div>
                  </div>
                  <div>
                    <div className="text-gray-600">After</div>
                    <div className="font-semibold">{session.rangeAfterCharge.toFixed(1)} km</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
