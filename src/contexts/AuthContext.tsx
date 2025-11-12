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
    console.log('Subscribing to scooter data:', code);
    const scooterRef = ref(database, `scooters/${code}`);
    
    onValue(scooterRef, (snapshot) => {
      console.log('Received data from Firebase:', snapshot.exists());
      const data = snapshot.val();
      if (data) {
        console.log('Data exists, parsing...');
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
        console.log('App data set successfully');
      } else {
        console.log('No data exists, initializing...');
        // Initialize new scooter data
        set(scooterRef, defaultData).then(() => {
          console.log('Default data written to Firebase');
          setAppData(defaultData);
        }).catch((error) => {
          console.error('Error writing default data:', error);
        });
      }
      setLoading(false);
    }, (error) => {
      console.error('Error reading from Firebase:', error);
      setLoading(false);
    });

    return () => off(scooterRef);
  };

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

      // Store the scooter code
      localStorage.setItem('scooter_code', code);
      setScooterCode(code);
      console.log('Scooter code stored:', code);

      // Subscribe to scooter data
      subscribeToScooterData(code);
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
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
