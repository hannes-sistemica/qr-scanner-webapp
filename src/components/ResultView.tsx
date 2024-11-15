import React from 'react';
import { Camera, History } from 'lucide-react';

interface ScanResult {
  text: string;
  timestamp: number;
}

interface ResultViewProps {
  results: ScanResult[];
  onScanAgain: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ results, onScanAgain }) => {
  return (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Scan History</h2>
        </div>
        <div className="space-y-2">
          {results.map((result, index) => (
            <div key={result.timestamp} className="text-sm">
              <p className="text-gray-600 break-all">{result.text}</p>
              <p className="text-xs text-gray-400">
                {new Date(result.timestamp).toLocaleTimeString()}
              </p>
              {index < results.length - 1 && <hr className="my-2" />}
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={onScanAgain}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Camera className="w-5 h-5" />
        Clear History
      </button>
    </div>
  );
};

export default ResultView;