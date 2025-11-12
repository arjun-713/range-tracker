import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, database } from '../firebase/config';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { ref, onValue, set } from 'firebase/database';
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

  // Subscribe to scooter data changes
  useEffect(() => {
    if (!scooterCode) {
      console.log('⚠️ No scooter code, skipping listener setup');
      return;
    }

    console.log('🔵 Setting up real-time listener for:', scooterCode);
    console.log('🔵 Database URL:', database.app.options.databaseURL);
    const scooterRef = ref(database, `scooters/${scooterCode}`);

    const unsubscribe = onValue(scooterRef, (snapshot) => {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`🟢 [${timestamp}] Real-time update received:`, snapshot.exists());
      const data = snapshot.val();
      if (data) {
        console.log('🟢 Data received:', {
          currentRange: data.currentRange,
          currentOdometer: data.currentOdometer,
          entriesCount: data.odometerEntries?.length || 0,
          chargesCount: data.chargeSessions?.length || 0,
        });
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
        console.log('✅ App data updated from real-time sync');
      } else {
        console.log('⚠️ No data exists, initializing...');
        // Initialize new scooter data
        set(scooterRef, defaultData).then(() => {
          console.log('✅ Default data written to Firebase');
          setAppData(defaultData);
        }).catch((error) => {
          console.error('❌ Error writing default data:', error);
        });
      }
      setLoading(false);
    }, (error) => {
      console.error('❌ Error in real-time listener:', error);
      setLoading(false);
    });

    // Cleanup listener on unmount or code change
    return () => {
      console.log('🔴 Cleaning up real-time listener for:', scooterCode);
      unsubscribe();
    };
  }, [scooterCode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      // Check for stored scooter code
      const storedCode = localStorage.getItem('scooter_code');
      if (storedCode && user) {
        setScooterCode(storedCode);
      } else {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const loginWithCode = async (code: string) => {
    try {
      setLoading(true);
      console.log('Attempting to login with code:', code);

      // Sign in anonymously first
      let currentUser = user;
      if (!currentUser) {
        console.log('Signing in anonymously...');
        const result = await signInAnonymously(auth);
        currentUser = result.user;
        console.log('Signed in successfully:', currentUser.uid);
      }

      // Store the scooter code - this will trigger the useEffect to subscribe
      localStorage.setItem('scooter_code', code);
      setScooterCode(code);
      console.log('Scooter code stored:', code);
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setLoading(false);
      throw error;
    }
  };

  const updateAppData = async (updates: Partial<AppData>) => {
    if (!scooterCode || !appData) {
      console.log('⚠️ Cannot update: missing scooterCode or appData');
      return;
    }

    const newData = { ...appData, ...updates };
    const timestamp = new Date().toLocaleTimeString();

    // Clean data: remove undefined values (Firebase doesn't allow them)
    const cleanData = JSON.parse(JSON.stringify(newData, (_key, value) => {
      return value === undefined ? null : value;
    }));

    // Update Firebase - the real-time listener will automatically update local state
    const scooterRef = ref(database, `scooters/${scooterCode}`);
    try {
      console.log(`🔵 [${timestamp}] Updating Firebase...`);
      console.log('🔵 New data:', {
        currentRange: cleanData.currentRange,
        currentOdometer: cleanData.currentOdometer,
        entriesCount: cleanData.odometerEntries?.length || 0,
      });
      await set(scooterRef, cleanData);
      console.log(`✅ [${timestamp}] Firebase update successful - waiting for real-time sync...`);
    } catch (error) {
      console.error('❌ Error updating Firebase:', error);
      // Fallback to local update if Firebase fails
      setAppData(newData as AppData);
    }
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
