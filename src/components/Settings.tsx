import { useState } from 'react';
import { AppData } from '../types';
// Lucide icons removed - using text only
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
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white dark:bg-background-dark overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-light dark:border-border-dark bg-white dark:bg-background-dark p-4">
        <div className="flex size-12 shrink-0 items-center"></div>
        <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-text-primary-light dark:text-text-primary-dark">
          Settings
        </h2>
        <div className="flex w-12 items-center justify-end"></div>
      </div>

      <div className="flex-grow pb-24">
        {/* Appearance */}
        <h3 className="px-4 pb-2 pt-8 text-sm font-bold uppercase leading-tight tracking-[-0.015em] text-text-secondary-light dark:text-text-secondary-dark">
          Appearance
        </h3>
        <div className="flex flex-col border-y border-border-light dark:border-border-dark">
          <div className="flex items-center gap-4 bg-white dark:bg-background-dark px-4 min-h-14 justify-between">
            <p className="flex-1 truncate text-base font-normal leading-normal text-text-primary-light dark:text-text-primary-dark">
              Dark Mode
            </p>
            <div className="shrink-0">
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  className="peer sr-only"
                  type="checkbox"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
                <div className="peer h-7 w-12 rounded-full bg-gray-200 after:absolute after:start-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Scooter Code */}
        <h3 className="px-4 pb-2 pt-8 text-sm font-bold uppercase leading-tight tracking-[-0.015em] text-text-secondary-light dark:text-text-secondary-dark">
          Scooter Code
        </h3>
        <div className="border-y border-border-light dark:border-border-dark bg-white dark:bg-background-dark">
          <div className="p-4">
            <p className="text-base font-normal leading-normal text-text-primary-light dark:text-text-primary-dark">
              Your Scooter Code
            </p>
            <p className="mt-2 text-2xl font-bold tracking-widest text-text-primary-light dark:text-text-primary-dark">
              {scooterCode}
            </p>
            <p className="mt-2 text-sm font-normal leading-normal text-text-secondary-light dark:text-text-secondary-dark">
              Share this code to sync data across multiple devices
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={copyCode}
                className="flex h-10 flex-1 items-center justify-center border border-border-light dark:border-border-dark"
              >
                <span className="text-base font-medium text-primary">
                  {codeCopied ? 'Copied!' : 'Copy'}
                </span>
              </button>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex h-10 flex-1 items-center justify-center border border-border-light dark:border-border-dark"
              >
                <span className="text-base font-medium text-primary">Switch Scooter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scooter Information */}
        <h3 className="px-4 pb-2 pt-8 text-sm font-bold uppercase leading-tight tracking-[-0.015em] text-text-secondary-light dark:text-text-secondary-dark">
          Scooter Information
        </h3>
        <div className="flex flex-col border-y border-border-light dark:border-border-dark">
          <div className="flex items-center gap-4 bg-white dark:bg-background-dark px-4 min-h-14 justify-between border-b border-border-light dark:border-border-dark">
            <p className="flex-1 truncate text-base font-normal leading-normal text-text-primary-light dark:text-text-primary-dark">
              Scooter Name
            </p>
            <p className="text-base font-normal leading-normal text-text-secondary-light dark:text-text-secondary-dark">
              {settings.scooterName}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-background-dark px-4 min-h-14 justify-between">
            <p className="flex-1 truncate text-base font-normal leading-normal text-text-primary-light dark:text-text-primary-dark">
              Model
            </p>
            <p className="text-base font-normal leading-normal text-text-secondary-light dark:text-text-secondary-dark">
              {settings.scooterModel}
            </p>
          </div>
        </div>

        {/* Range Settings */}
        <h3 className="px-4 pb-2 pt-8 text-sm font-bold uppercase leading-tight tracking-[-0.015em] text-text-secondary-light dark:text-text-secondary-dark">
          Range Settings
        </h3>
        <div className="flex flex-col border-y border-border-light dark:border-border-dark">
          <div className="flex items-center gap-4 bg-white dark:bg-background-dark px-4 min-h-14 justify-between border-b border-border-light dark:border-border-dark">
            <p className="flex-1 truncate text-base font-normal leading-normal text-text-primary-light dark:text-text-primary-dark">
              Maximum Range (km)
            </p>
            <input
              className="border border-border-light dark:border-border-dark bg-white dark:bg-[#1a2732] text-text-primary-light dark:text-text-primary-dark text-right p-2 w-16 focus:outline-2 focus:outline-primary"
              type="number"
              value={settings.maxRange}
              onChange={(e) => handleSettingChange('maxRange', parseFloat(e.target.value))}
            />
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-background-dark px-4 min-h-14 justify-between">
            <p className="flex-1 truncate text-base font-normal leading-normal text-text-primary-light dark:text-text-primary-dark">
              Full Charge Duration (hours)
            </p>
            <input
              className="border border-border-light dark:border-border-dark bg-white dark:bg-[#1a2732] text-text-primary-light dark:text-text-primary-dark text-right p-2 w-16 focus:outline-2 focus:outline-primary"
              type="number"
              value={settings.fullChargeDuration}
              onChange={(e) => handleSettingChange('fullChargeDuration', parseFloat(e.target.value))}
              step="0.5"
            />
          </div>
        </div>

        {/* Notifications */}
        <h3 className="px-4 pb-2 pt-8 text-sm font-bold uppercase leading-tight tracking-[-0.015em] text-text-secondary-light dark:text-text-secondary-dark">
          Notifications
        </h3>
        <div className="flex flex-col border-y border-border-light dark:border-border-dark">
          <div className="flex flex-col bg-white dark:bg-background-dark px-4 py-3 justify-between border-b border-border-light dark:border-border-dark">
            <div className="flex items-center justify-between min-h-10">
              <p className="flex-1 truncate text-base font-normal leading-normal text-text-primary-light dark:text-text-primary-dark">
                Browser Notifications
              </p>
              <div className="shrink-0">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input className="peer sr-only" type="checkbox" />
                  <div className="peer h-7 w-12 rounded-full bg-gray-200 after:absolute after:start-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
                </label>
              </div>
            </div>
            <p className="mt-1 text-sm font-normal leading-normal text-text-secondary-light dark:text-text-secondary-dark">
              Get notified when your scooter range drops below the alert threshold. Enable from the bell icon on the home screen.
            </p>
          </div>
          <div className="flex flex-col bg-white dark:bg-background-dark px-4 py-3 justify-between border-b border-border-light dark:border-border-dark">
            <div className="flex items-center justify-between min-h-10">
              <p className="flex-1 truncate text-base font-normal leading-normal text-text-primary-light dark:text-text-primary-dark">
                Low Range Alert (km)
              </p>
              <input
                className="border border-border-light dark:border-border-dark bg-white dark:bg-[#1a2732] text-text-primary-light dark:text-text-primary-dark text-right p-2 w-16 focus:outline-2 focus:outline-primary"
                type="number"
                value={settings.lowRangeThreshold}
                onChange={(e) => handleSettingChange('lowRangeThreshold', parseFloat(e.target.value))}
              />
            </div>
            <p className="mt-1 text-sm font-normal leading-normal text-text-secondary-light dark:text-text-secondary-dark">
              Yellow warning appears below this range
            </p>
          </div>
          <div className="flex flex-col bg-white dark:bg-background-dark px-4 py-3 justify-between">
            <div className="flex items-center justify-between min-h-10">
              <p className="flex-1 truncate text-base font-normal leading-normal text-text-primary-light dark:text-text-primary-dark">
                Critical Range Alert (km)
              </p>
              <input
                className="border border-border-light dark:border-border-dark bg-white dark:bg-[#1a2732] text-text-primary-light dark:text-text-primary-dark text-right p-2 w-16 focus:outline-2 focus:outline-primary"
                type="number"
                value={settings.criticalRangeThreshold}
                onChange={(e) => handleSettingChange('criticalRangeThreshold', parseFloat(e.target.value))}
              />
            </div>
            <p className="mt-1 text-sm font-normal leading-normal text-text-secondary-light dark:text-text-secondary-dark">
              Red critical alert appears below this range
            </p>
          </div>
        </div>

        {/* Data Management */}
        <h3 className="px-4 pb-2 pt-8 text-sm font-bold uppercase leading-tight tracking-[-0.015em] text-text-secondary-light dark:text-text-secondary-dark">
          Data Management
        </h3>
        <div className="flex flex-col border-y border-border-light dark:border-border-dark">
          <div className="bg-white dark:bg-background-dark px-4">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex h-14 w-full items-center justify-center"
            >
              <span className="text-base font-medium text-red-500">Reset All Data</span>
            </button>
          </div>
        </div>

        {/* About */}
        <h3 className="px-4 pb-2 pt-8 text-sm font-bold uppercase leading-tight tracking-[-0.015em] text-text-secondary-light dark:text-text-secondary-dark">
          About
        </h3>
        <div className="flex flex-col border-y border-border-light dark:border-border-dark">
          <div className="flex items-center gap-4 bg-white dark:bg-background-dark px-4 min-h-14 justify-between border-b border-border-light dark:border-border-dark">
            <p className="flex-1 truncate text-base font-normal leading-normal text-text-primary-light dark:text-text-primary-dark">
              App
            </p>
            <p className="text-base font-normal leading-normal text-text-secondary-light dark:text-text-secondary-dark">
              Scooter Range Tracker
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-background-dark px-4 min-h-14 justify-between border-b border-border-light dark:border-border-dark">
            <p className="flex-1 truncate text-base font-normal leading-normal text-text-primary-light dark:text-text-primary-dark">
              Version
            </p>
            <p className="text-base font-normal leading-normal text-text-secondary-light dark:text-text-secondary-dark">
              2.0.0
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-background-dark px-4 min-h-14 justify-between border-b border-border-light dark:border-border-dark">
            <p className="flex-1 truncate text-base font-normal leading-normal text-text-primary-light dark:text-text-primary-dark">
              Model
            </p>
            <p className="text-base font-normal leading-normal text-text-secondary-light dark:text-text-secondary-dark">
              {settings.scooterModel}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-background-dark px-4 min-h-14 justify-between">
            <p className="flex-1 truncate text-base font-normal leading-normal text-text-primary-light dark:text-text-primary-dark">
              Scooter Code
            </p>
            <p className="text-base font-normal leading-normal text-text-secondary-light dark:text-text-secondary-dark">
              {scooterCode}
            </p>
          </div>
        </div>
        <div className="px-4 pt-2">
          <p className="text-sm font-normal leading-normal text-text-secondary-light dark:text-text-secondary-dark">
            Track your electric scooter range and trips with ease. Data syncs across all devices.
          </p>
        </div>
      </div>

      {/* Modals */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-background-dark rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              Switch Scooter?
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
              You'll be logged out and can enter a different scooter code. Your data will remain saved in the cloud.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark py-3 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-primary text-white py-3 font-semibold"
              >
                Switch
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-background-dark rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
              Reset All Data?
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
              This will delete all your trips, charging sessions, and settings. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark py-3 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-red-500 text-white py-3 font-semibold"
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
