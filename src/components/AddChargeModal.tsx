import { useState } from 'react';
import { X } from 'lucide-react';
import { AppData, ChargeSession } from '../types';
import { calculatePartialCharge } from '../utils/calculations';

interface AddChargeModalProps {
  appData: AppData;
  updateData: (updates: Partial<AppData>) => void;
  onClose: () => void;
}

export default function AddChargeModal({ appData, updateData, onClose }: AddChargeModalProps) {
  const [chargeType, setChargeType] = useState<'full' | 'partial'>('full');
  const [duration, setDuration] = useState('');

  const handleSubmit = () => {
    let newRange: number;
    let rangeAdded: number;

    if (chargeType === 'full') {
      newRange = appData.settings.maxRange;
      rangeAdded = newRange - appData.currentRange;
    } else {
      const hours = parseFloat(duration);
      if (!duration || isNaN(hours) || hours <= 0) return;
      
      newRange = calculatePartialCharge(
        hours,
        appData.settings.fullChargeDuration,
        appData.settings.maxRange,
        appData.currentRange
      );
      rangeAdded = newRange - appData.currentRange;
    }

    const session: ChargeSession = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: chargeType,
      duration: chargeType === 'partial' ? parseFloat(duration) : undefined,
      rangeBeforeCharge: appData.currentRange,
      rangeAdded,
      rangeAfterCharge: newRange,
    };

    updateData({
      currentRange: newRange,
      chargeSessions: [...appData.chargeSessions, session],
    });

    onClose();
  };

  const previewRange = chargeType === 'full' 
    ? appData.settings.maxRange 
    : duration && parseFloat(duration) > 0
      ? calculatePartialCharge(
          parseFloat(duration),
          appData.settings.fullChargeDuration,
          appData.settings.maxRange,
          appData.currentRange
        )
      : appData.currentRange;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Add Charge</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
          <div className="text-sm text-gray-600">Current Range</div>
          <div className="text-2xl font-bold text-gray-900">{appData.currentRange.toFixed(1)} km</div>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => setChargeType('full')}
            className={`w-full p-4 border-2 rounded-lg text-left transition ${
              chargeType === 'full' ? 'border-primary bg-green-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">🔋</span>
              <div>
                <div className="font-semibold">Full Charge</div>
                <div className="text-sm text-gray-600">Reset to {appData.settings.maxRange} km</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setChargeType('partial')}
            className={`w-full p-4 border-2 rounded-lg text-left transition ${
              chargeType === 'partial' ? 'border-primary bg-green-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚡</span>
              <div>
                <div className="font-semibold">Partial Charge</div>
                <div className="text-sm text-gray-600">Enter charging duration</div>
              </div>
            </div>
          </button>
        </div>

        {chargeType === 'partial' && (
          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Charging Duration (hours)</span>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 2"
              step="0.5"
              min="0"
            />
            <span className="text-sm text-gray-500 mt-1 block">
              Full charge takes {appData.settings.fullChargeDuration} hours
            </span>
          </label>
        )}

        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600">Range After Charge</div>
          <div className="text-2xl font-bold text-blue-600">{previewRange.toFixed(1)} km</div>
          <div className="text-sm text-gray-600 mt-1">
            +{(previewRange - appData.currentRange).toFixed(1)} km added
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={chargeType === 'partial' && (!duration || parseFloat(duration) <= 0)}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add Charge
        </button>
      </div>
    </div>
  );
}
