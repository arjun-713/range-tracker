import { useState } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { database } from '../firebase/config';

export default function FirebaseTest() {
  const [testValue, setTestValue] = useState('');
  const [readValue, setReadValue] = useState('');
  const [status, setStatus] = useState('');

  const testWrite = async () => {
    try {
      setStatus('Writing to Firebase...');
      const testRef = ref(database, 'test/value');
      await set(testRef, testValue);
      setStatus('✅ Write successful!');
    } catch (error: any) {
      setStatus(`❌ Write failed: ${error.message}`);
      console.error('Write error:', error);
    }
  };

  const testRead = () => {
    try {
      setStatus('Reading from Firebase...');
      const testRef = ref(database, 'test/value');
      onValue(testRef, (snapshot) => {
        const data = snapshot.val();
        setReadValue(data || 'No data');
        setStatus('✅ Read successful!');
      }, (error) => {
        setStatus(`❌ Read failed: ${error.message}`);
        console.error('Read error:', error);
      });
    } catch (error: any) {
      setStatus(`❌ Read failed: ${error.message}`);
      console.error('Read error:', error);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
      
      <div className="mb-4">
        <input
          type="text"
          value={testValue}
          onChange={(e) => setTestValue(e.target.value)}
          placeholder="Enter test value"
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={testWrite} className="px-4 py-2 bg-blue-500 text-white rounded">
          Write to Firebase
        </button>
        <button onClick={testRead} className="px-4 py-2 bg-green-500 text-white rounded">
          Read from Firebase
        </button>
      </div>

      {status && (
        <div className="p-3 bg-gray-100 rounded mb-4">
          <p className="font-mono text-sm">{status}</p>
        </div>
      )}

      {readValue && (
        <div className="p-3 bg-blue-50 rounded">
          <p className="text-sm font-semibold">Read Value:</p>
          <p className="font-mono">{readValue}</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm">
          <strong>Instructions:</strong>
          <br />
          1. Enter a test value
          <br />
          2. Click "Write to Firebase"
          <br />
          3. Click "Read from Firebase"
          <br />
          4. Check if the value matches
        </p>
      </div>
    </div>
  );
}
