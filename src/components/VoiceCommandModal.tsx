import { useState, useEffect } from 'react';
import { X, Mic, MicOff } from 'lucide-react';
import { AppData, OdometerEntry } from '../types';

interface VoiceCommandModalProps {
  appData: AppData;
  updateData: (updates: Partial<AppData>) => void;
  onClose: () => void;
}

export default function VoiceCommandModal({ appData, updateData, onClose }: VoiceCommandModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState('Tap the microphone to start');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setStatus('❌ Voice recognition not supported in this browser');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
      setIsListening(true);
      setStatus('🎤 Listening... Say the odometer reading');
    };

    recognitionInstance.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      processVoiceCommand(speechResult);
    };

    recognitionInstance.onerror = (event: any) => {
      setIsListening(false);
      setStatus(`❌ Error: ${event.error}`);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const processVoiceCommand = (text: string) => {
    // Extract numbers from the speech
    const numbers = text.match(/\d+\.?\d*/g);
    
    if (!numbers || numbers.length === 0) {
      setStatus('❌ No number detected. Please say a number like "123.5"');
      return;
    }

    const reading = parseFloat(numbers[0]);
    
    if (isNaN(reading)) {
      setStatus('❌ Invalid number. Please try again');
      return;
    }

    if (reading < appData.currentOdometer) {
      setStatus(`❌ Reading ${reading} is less than current odometer ${appData.currentOdometer.toFixed(1)}`);
      return;
    }

    // Update odometer
    const distanceTraveled = reading - appData.currentOdometer;
    const newRange = Math.max(0, appData.currentRange - distanceTraveled);

    const entry: OdometerEntry = {
      id: Date.now().toString(),
      reading: reading,
      timestamp: new Date(),
      distanceTraveled,
      rangeBeforeTrip: appData.currentRange,
      rangeAfterTrip: newRange,
      notes: 'Voice command',
    };

    updateData({
      currentOdometer: reading,
      currentRange: newRange,
      odometerEntries: [...appData.odometerEntries, entry],
    });

    setStatus(`✅ Odometer updated to ${reading} km!`);
    
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      setTranscript('');
      setStatus('🎤 Listening...');
      recognition.start();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Voice Command</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Odometer</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{appData.currentOdometer.toFixed(1)} km</div>
        </div>

        <div className="flex flex-col items-center mb-6">
          <button
            onClick={toggleListening}
            disabled={!recognition}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-[#007AFF] hover:bg-[#0051D5]'
            } ${!recognition ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? (
              <MicOff className="text-white" size={40} />
            ) : (
              <Mic className="text-white" size={40} />
            )}
          </button>
          <p className="mt-4 text-center text-gray-600 dark:text-gray-400 text-sm">
            {isListening ? 'Tap to stop' : 'Tap to speak'}
          </p>
        </div>

        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg min-h-[80px]">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Status</div>
          <div className="text-gray-900 dark:text-white">{status}</div>
          {transcript && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Heard: "{transcript}"
            </div>
          )}
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>💡 Tip:</strong> Say the odometer reading clearly, like "one hundred twenty three point five" or "123.5"
          </p>
        </div>
      </div>
    </div>
  );
}
