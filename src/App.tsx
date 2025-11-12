import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import TripHistory from './components/TripHistory';
import ChargingHistory from './components/ChargingHistory';
import Settings from './components/Settings';
import Layout from './components/Layout';
import FirebaseTest from './components/FirebaseTest';

function AppContent() {
  const { scooterCode, appData, loading, updateAppData } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!scooterCode) {
    return <Login />;
  }

  if (!appData?.onboardingCompleted) {
    return <Onboarding onComplete={(data) => updateAppData({ ...data, onboardingCompleted: true })} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard appData={appData} updateData={updateAppData} />} />
        <Route path="trips" element={<TripHistory appData={appData} />} />
        <Route path="charging" element={<ChargingHistory appData={appData} updateData={updateAppData} />} />
        <Route path="settings" element={<Settings appData={appData} updateData={updateAppData} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/test-firebase" element={<FirebaseTest />} />
            <Route path="*" element={<AppContent />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
