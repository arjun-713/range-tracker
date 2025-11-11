import { useState } from 'react';
import { X } from 'lucide-react';
import { AppData, OdometerEntry } from '../types';

interface UpdateOdometerModalProps {
  appData: AppData;
  updateData: (updates: Partial<AppData>) => void;
  onClose: () => void;
}

export default function UpdateOdometerModal({ appData, updateData, onClose }: UpdateOdometerModalProps) {
  const [reading, setReading] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const newReading = parseFloat(reading);
    
    if (!reading || isNaN(newReading)) {
      setError('Please enter a valid odometer reading');
      return;
    }

    if (newReading < appData.currentOdometer) {
      setError('New reading cannot be less than current odometer');
      return;
    }

    const distanceTraveled = newReading - appData.currentOdometer;
    const newRange = Math.max(0, appData.currentRange - distanceTraveled);

    const entry: OdometerEntry = {
      id: Date.now().toString(),
      reading: newReading,
      timestamp: new Date(),
      distanceTraveled,
      rangeBeforeTrip: appData.currentRange,
      rangeAfterTrip: newRange,
      notes: notes.trim() || undefined,
    };

    updateData({
      currentOdometer: newReading,
      currentRange: newRange,
      odometerEntries: [...appData.odometerEntries, entry],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Update Odometer</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
          <div className="text-sm text-gray-600">Current Odometer</div>
          <div className="text-2xl font-bold text-gray-900">{appData.currentOdometer.toFixed(1)} km</div>
        </div>

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">New Odometer Reading (km)</span>
          <input
            type="number"
            value={reading}
            onChange={(e) => {
              setReading(e.target.value);
              setError('');
            }}
            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter current reading"
            step="0.1"
            min={appData.currentOdometer}
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Trip Notes (Optional)</span>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., Office commute, Weekend ride"
          />
        </label>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {reading && parseFloat(reading) >= appData.currentOdometer && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">Distance Traveled</div>
            <div className="text-xl font-bold text-blue-600">
              {(parseFloat(reading) - appData.currentOdometer).toFixed(1)} km
            </div>
            <div className="text-sm text-gray-600 mt-2">New Range</div>
            <div className="text-xl font-bold text-gray-900">
              {Math.max(0, appData.currentRange - (parseFloat(reading) - appData.currentOdometer)).toFixed(1)} km
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Update
        </button>
      </div>
    </div>
  );
}
