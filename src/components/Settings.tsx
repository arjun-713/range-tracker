import { useState } from 'react';
import { AppData } from '../types';
import { Trash2, Info, LogOut, Copy, Check, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsProps {
  appData: AppData;
  updateData: (updates: Partial<AppData>) => void;
}

export default function Settings({ appData, updateData }: SettingsProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const { settings } = appData;
  const { scooterCode, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateData({
      settings: { ...settings, [key]: value },
    });
  };

  const handleReset = () => {
    const defaultData = {
      currentOdometer: 0,
      currentRange: 40,
      odometerEntries: [],
      chargeSessions: [],
      settings: {
        maxRange: 40,
        fullChargeDuration: 4,
        lowRangeThreshold: 15,
        criticalRangeThreshold: 5,
        scooterName: 'My Scooter',
        scooterModel: 'Hero Optima',
      },
      onboardingCompleted: true,
    };
    updateData(defaultData);
    setShowResetConfirm(false);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const copyCode = () => {
    if (scooterCode) {
      navigator.clipboard.writeText(scooterCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-4">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h1>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {/* Theme Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Appearance</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {darkMode ? <Moon size={20} className="mr-3 text-ocean" /> : <Sun size={20} className="mr-3 text-primary" />}
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Dark Mode</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {darkMode ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                darkMode ? 'bg-ocean' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Scooter Code */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Scooter Code</h2>
          
          <div className="bg-ocean-lightest dark:bg-ocean-darkest/50 border border-ocean-light dark:border-ocean-dark rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Your Scooter Code</span>
              <button
                onClick={copyCode}
                className="flex items-center text-sm text-primary dark:text-ocean-light hover:text-primary-dark dark:hover:text-ocean"
              >
                {codeCopied ? (
                  <>
                    <Check size={16} className="mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">
              {scooterCode}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Share this code to sync data across multiple devices
            </p>
          </div>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center"
          >
            <LogOut size={20} className="mr-2" />
            Switch Scooter
          </button>
        </div>

        {/* Scooter Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Scooter Information</h2>
          
          <label className="block mb-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Scooter Name</span>
            <input
              type="text"
              value={settings.scooterName}
              onChange={(e) => handleSettingChange('scooterName', e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-ocean focus:border-transparent"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Model</span>
            <input
              type="text"
              value={settings.scooterModel}
              onChange={(e) => handleSettingChange('scooterModel', e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-ocean focus:border-transparent"
            />
          </label>
        </div>

        {/* Range Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Range Settings</h2>
          
          <label className="block mb-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Maximum Range (km)</span>
            <input
              type="number"
              value={settings.maxRange}
              onChange={(e) => handleSettingChange('maxRange', parseFloat(e.target.value))}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-ocean focus:border-transparent"
              min="1"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Full Charge Duration (hours)</span>
            <input
              type="number"
        
        value={settings.fullChargeDuration}
              onChange={(e) => handleSettingChange('fullChargeDuration', parseFloat(e.target.value))}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-ocean focus:border-transparent"
              min="1"
              step="0.5"
            />
          </label>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Notifications</h2>
          
          <div className="mb-4 p-4 bg-ocean-lightest dark:bg-ocean-darkest/50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Browser Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified when your scooter range drops below the alert threshold, even when the app is in the background.
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              💡 Tip: Enable notifications from the bell icon on the home screen
            </p>
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Alert Thresholds</h2>
          
          <label className="block mb-4">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Low Range Alert (km)</span>
            <input
              type="number"
              value={settings.lowRangeThreshold}
              onChange={(e) => handleSettingChange('lowRangeThreshold', parseFloat(e.target.value))}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-ocean focus:border-transparent"
              min="5"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">Yellow warning appears below this range</span>
          </label>

          <label className="block">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Critical Range Alert (km)</span>
            <input
              type="number"
              value={settings.criticalRangeThreshold}
              onChange={(e) => handleSettingChange('criticalRangeThreshold', parseFloat(e.target.value))}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-ocean focus:border-transparent"
              min="0"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 block">Red critical alert appears below this range</span>
          </label>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Data Management</h2>
          
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center"
          >
            <Trash2 size={20} className="mr-2" />
            Reset All Data
          </button>
        </div>

        {/* About */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <Info size={20} className="mr-2" />
            About
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>App:</strong> Scooter Range Tracker</p>
            <p><strong>Version:</strong> 2.0.0</p>
            <p><strong>Model:</strong> {settings.scooterModel}</p>
            <p><strong>Scooter Code:</strong> {scooterCode}</p>
            <p className="pt-2 text-xs">Track your electric scooter range and trips with ease. Data syncs across all devices.</p>
          </div>
        </div>
      </div>

      {/* Switch Scooter Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Switch Scooter?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You'll be logged out and can enter a different scooter code. Your data will remain saved in the cloud.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-primary dark:bg-ocean text-white py-3 rounded-lg font-semibold hover:bg-primary-dark dark:hover:bg-ocean-dark transition"
              >
                Switch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Data Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reset All Data?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will delete all your trips, charging sessions, and settings. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
