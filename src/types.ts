export interface AppSettings {
  maxRange: number;
  fullChargeDuration: number;
  lowRangeThreshold: number;
  criticalRangeThreshold: number;
  scooterName: string;
  scooterModel: string;
  notificationsEnabled?: boolean;
  darkMode?: boolean;
}

export interface OdometerEntry {
  id: string;
  reading: number;
  timestamp: Date;
  distanceTraveled: number;
  rangeBeforeTrip: number;
  rangeAfterTrip: number;
  notes?: string;
}

export interface ChargeSession {
  id: string;
  timestamp: Date;
  type: 'full' | 'partial';
  duration?: number;
  rangeBeforeCharge: number;
  rangeAdded: number;
  rangeAfterCharge: number;
}

export interface AppData {
  currentOdometer: number;
  currentRange: number;
  odometerEntries: OdometerEntry[];
  chargeSessions: ChargeSession[];
  settings: AppSettings;
  onboardingCompleted: boolean;
}
