import { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { canMakeTrip } from '../utils/calculations';

interface RangePredictorModalProps {
  currentRange: number;
  onClose: () => void;
}

export default function RangePredictorModal({ currentRange, onClose }: RangePredictorModalProps) {
  const [distance, setDistance] = useState('');

  const canMake = distance && parseFloat(distance) > 0 ? canMakeTrip(currentRange, parseFloat(distance)) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Can I Make It?</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
          <div className="text-sm text-gray-600">Current Range</div>
          <div className="text-2xl font-bold text-gray-900">{currentRange.toFixed(1)} km</div>
        </div>

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Destination Distance (km)</span>
          <div className="relative mt-2">
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="block w-full px-4 py-3 pr-12 text-right text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="0"
              step="0.1"
              min="0"
              autoFocus
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-500">km</span>
          </div>
        </label>

        {canMake !== null && (
          <div className={`p-4 rounded-lg ${canMake ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="flex items-center mb-2">
              {canMake ? (
                <CheckCircle className="text-green-600 mr-2" size={24} />
              ) : (
                <XCircle className="text-red-600 mr-2" size={24} />
              )}
              <span className={`font-bold text-lg ${canMake ? 'text-green-900' : 'text-red-900'}`}>
                {canMake ? '✓ Yes!' : '✗ Not enough range'}
              </span>
            </div>
            <p className={`text-base ${canMake ? 'text-green-800' : 'text-red-800'}`}>
              {canMake 
                ? `${(currentRange - parseFloat(distance)).toFixed(1)} km to spare`
                : `Need ${(parseFloat(distance) - currentRange).toFixed(1)} km more`}
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
