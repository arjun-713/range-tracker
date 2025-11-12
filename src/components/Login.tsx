import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Lock } from 'lucide-react';

export default function Login() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithCode } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Please enter a scooter code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await loginWithCode(code.trim().toUpperCase());
    } catch (err) {
      setError('Failed to connect. Please try again.');
      setLoading(false);
    }
  };

  const generateCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCode(randomCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-lightest to-ocean-light dark:from-ocean-darkest dark:to-ocean-dark flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary dark:bg-ocean rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Scooter Range Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Track your electric scooter across all devices</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Lock size={16} className="inline mr-2" />
              Scooter Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-ocean focus:border-transparent text-center text-2xl font-mono tracking-wider uppercase"
              placeholder="ABCD12"
              maxLength={6}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Enter your 6-character scooter code to sync across devices
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary dark:bg-ocean text-white py-3 rounded-lg font-semibold hover:bg-primary-dark dark:hover:bg-ocean-dark transition disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {loading ? 'Connecting...' : 'Connect to Scooter'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3">
            Don't have a code? Create a new scooter
          </p>
          <button
            onClick={generateCode}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            Generate New Code
          </button>
        </div>

        <div className="mt-6 p-4 bg-ocean-lightest dark:bg-ocean-darkest/50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">How it works:</h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Share the same code across multiple devices</li>
            <li>• All data syncs in real-time</li>
            <li>• Track from any phone or tablet</li>
            <li>• Your data is securely stored in the cloud</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
