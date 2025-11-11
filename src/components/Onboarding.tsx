import { useState } from 'react';
import { Zap, ChevronRight } from 'lucide-react';
import { AppData } from '../types';

interface OnboardingProps {
  onComplete: (data: Partial<AppData>) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [currentOdometer, setCurrentOdometer] = useState('');
  const [chargeStatus, setChargeStatus] = useState<'full' | 'partial'>('full');
  const [currentRange, setCurrentRange] = useState(40);
  const [fullChargeDuration, setFullChargeDuration] = useState(4);
  const [lowRangeThreshold, setLowRangeThreshold] = useState(15);
  const [showCriticalAlert, setShowCriticalAlert] = useState(true);

  const handleNext = () => {
    if (step === 2 && !currentOdometer) return;
    if (step < 6) setStep(step + 1);
  };

  const handleComplete = () => {
    onComplete({
      currentOdometer: parseFloat(currentOdometer),
      currentRange: chargeStatus === 'full' ? 40 : currentRange,
      settings: {
        maxRange: 40,
        fullChargeDuration,
        lowRangeThreshold,
        criticalRangeThreshold: showCriticalAlert ? 5 : 0,
        scooterName: 'My Scooter',
        scooterModel: 'Hero Optima',
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {step === 1 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Scooter Range Tracker
            </h1>
            <p className="text-gray-600 mb-8">Your personal range and trip companion</p>
            <button
              onClick={handleNext}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Get Started
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's set up your Daxit</h2>
            <p className="text-gray-600 mb-6">Check your scooter's odometer and enter the current reading</p>
            <label className="block mb-4">
              <span className="text-gray-700 font-medium">Current Odometer Reading (km)</span>
              <input
                type="number"
                value={currentOdometer}
                onChange={(e) => setCurrentOdometer(e.target.value)}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </label>
            <button
              onClick={handleNext}
              disabled={!currentOdometer}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your current battery status?</h2>
            <p className="text-gray-600 mb-6">This helps us track your range accurately from the start</p>
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setChargeStatus('full')}
                className={`w-full p-4 border-2 rounded-lg text-left transition ${
                  chargeStatus === 'full' ? 'border-primary bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🔋</span>
                  <div>
                    <div className="font-semibold">Fully Charged</div>
                    <div className="text-sm text-gray-600">40 km range</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setChargeStatus('partial')}
                className={`w-full p-4 border-2 rounded-lg text-left transition ${
                  chargeStatus === 'partial' ? 'border-primary bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⚡</span>
                  <div>
                    <div className="font-semibold">Partially Charged</div>
                    <div className="text-sm text-gray-600">Set custom range</div>
                  </div>
                </div>
              </button>
            </div>
            {chargeStatus === 'partial' && (
              <div className="mb-6">
                <label className="block">
                  <span className="text-gray-700 font-medium">Current Range (km)</span>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={currentRange}
                    onChange={(e) => setCurrentRange(parseInt(e.target.value))}
                    className="w-full mt-2"
                  />
                  <div className="text-center text-2xl font-bold text-primary mt-2">{currentRange} km</div>
                </label>
              </div>
            )}
            <button
              onClick={handleNext}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Next
            </button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Charging Information</h2>
            <p className="text-gray-600 mb-6">This helps calculate partial charge ranges</p>
            <label className="block mb-6">
              <span className="text-gray-700 font-medium">How long does a full charge take?</span>
              <input
                type="number"
                value={fullChargeDuration}
                onChange={(e) => setFullChargeDuration(parseFloat(e.target.value))}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min="1"
                step="0.5"
              />
              <span className="text-sm text-gray-500 mt-1 block">Hours (default: 4 hours)</span>
            </label>
            <button
              onClick={handleNext}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Next
            </button>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Range Alerts</h2>
            <p className="text-gray-600 mb-6">We'll notify you when your range gets low</p>
            <label className="block mb-6">
              <span className="text-gray-700 font-medium">Alert me when range drops below:</span>
              <input
                type="range"
                min="10"
                max="25"
                value={lowRangeThreshold}
                onChange={(e) => setLowRangeThreshold(parseInt(e.target.value))}
                className="w-full mt-2"
              />
              <div className="text-center text-2xl font-bold text-warning mt-2">{lowRangeThreshold} km</div>
            </label>
            <label className="flex items-center mb-6">
              <input
                type="checkbox"
                checked={showCriticalAlert}
                onChange={(e) => setShowCriticalAlert(e.target.checked)}
                className="w-5 h-5 text-primary"
              />
              <span className="ml-3 text-gray-700">Show critical alerts at 5 km</span>
            </label>
            <button
              onClick={handleNext}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Next
            </button>
          </div>
        )}

        {step === 6 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">You're all set!</h2>
            <div className="text-left space-y-3 mb-8">
              <div className="flex items-start">
                <span className="text-xl mr-3">📍</span>
                <p className="text-gray-700">Update your odometer after each trip</p>
              </div>
              <div className="flex items-start">
                <span className="text-xl mr-3">⚡</span>
                <p className="text-gray-700">Log charges to track your range accurately</p>
              </div>
              <div className="flex items-start">
                <span className="text-xl mr-3">📊</span>
                <p className="text-gray-700">View trip history anytime</p>
              </div>
              <div className="flex items-start">
                <span className="text-xl mr-3">⚠️</span>
                <p className="text-gray-700">We'll alert you when range is low</p>
              </div>
            </div>
            <button
              onClick={handleComplete}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center"
            >
              Start Tracking
              <ChevronRight size={20} className="ml-2" />
            </button>
          </div>
        )}

        <div className="flex justify-center mt-6 space-x-2">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full ${s === step ? 'bg-primary' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
