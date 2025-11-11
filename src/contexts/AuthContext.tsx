import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, database } from '../firebase/config';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { ref, onValue, set, off } from 'firebase/database';
import { AppData } from '../types';

interface AuthContextType {
  user: User | null;
  scooterCode: string | null;
  appData: AppData | null;
  loading: boolean;
  loginWithCode: (code: string) => Promise<void>;
  updateAppData: (data: Partial<AppData>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const defaultSettings = {
  maxRange: 40,
  fullChargeDuration: 4,
  lowRangeThreshold: 15,
  criticalRangeThreshold: 5,
  scooterName: 'My Scooter',
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [scooterCode, setScooterCode] = useState<string | null>(null);
  const [appData, setAppData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      
      // Check for stored scooter code
      const storedCode = localStorage.getItem('scooter_code');
      if (storedCode && user) {
        setScooterCode(storedCode);
        subscribeToScooterData(storedCode);
      } else {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const subscribeToScooterData = (code: string) => {
    const scooterRef = ref(database, `scooters/${code}`);
    
    onValue(scooterRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert timestamps back to Date objects
        const parsedData = {
          ...data,
          odometerEntries: (data.odometerEntries || []).map((e: any) => ({
            ...e,
            timestamp: new Date(e.timestamp),
          })),
          chargeSessions: (data.chargeSessions || []).map((c: any) => ({
            ...c,
            timestamp: new Date(c.timestamp),
          })),
        };
        setAppData(parsedData);
      } else {
        // Initialize new scooter data
        set(scooterRef, defaultData);
        setAppData(defaultData);
      }
      setLoading(false);
    });

    return () => off(scooterRef);
  };

  const loginWithCode = async (code: string) => {
    try {
      setLoading(true);
      
      // Sign in anonymously
      if (!user) {
        await signInAnonymously(auth);
      }

      // Store the scooter code
      localStorage.setItem('scooter_code', code);
      setScooterCode(code);

      // Subscribe to scooter data
      subscribeToScooterData(code);
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      throw error;
    }
  };

  const updateAppData = async (updates: Partial<AppData>) => {
    if (!scooterCode) return;

    const newData = { ...appData, ...updates };
    setAppData(newData as AppData);

    // Update Firebase
    const scooterRef = ref(database, `scooters/${scooterCode}`);
    await set(scooterRef, newData);
  };

  const logout = () => {
    localStorage.removeItem('scooter_code');
    setScooterCode(null);
    setAppData(null);
  };

  return (
    <AuthContext.Provider value={{ user, scooterCode, appData, loading, loginWithCode, updateAppData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
