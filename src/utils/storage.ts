import { AppData, AppSettings } from '../types';

const STORAGE_KEY = 'daxit_tracker_data';

const defaultSettings: AppSettings = {
  maxRange: 40,
  fullChargeDuration: 4,
  lowRangeThreshold: 15,
  criticalRangeThreshold: 5,
  scooterName: 'Legendary Lighting Daxit',
  scooterModel: 'Hero Optima',
};

const defaultData: AppData = {
  currentOdometer: 0,
  currentRange: 40,
  odometerEntries: [],
  chargeSessions: [],
  settings: defaultSettings,
  onboardingCompleted: false,
};

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultData;
    
    const parsed = JSON.parse(stored);
    parsed.odometerEntries = parsed.odometerEntries.map((e: any) => ({
      ...e,
      timestamp: new Date(e.timestamp),
    }));
    parsed.chargeSessions = parsed.chargeSessions.map((c: any) => ({
      ...c,
      timestamp: new Date(c.timestamp),
    }));
    
    return { ...defaultData, ...parsed };
  } catch {
    return defaultData;
  }
};

export const saveData = (data: AppData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const resetData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
