import React, { useState } from 'react';
import { History, CheckCircle2, XCircle, MinusCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { ScanResult } from '../types';

interface ScanHistoryProps {
  results: ScanResult[];
  onClear: () => void;
}

const WebhookStatus: React.FC<{ result: ScanResult }> = ({ result }) => {
  const [showError, setShowError] = useState(false);

  if (result.webhookStatus === 'disabled') {
    return <MinusCircle className="w-4 h-4 text-gray-400" title="Webhook not configured" />;
  }

  if (result.webhookStatus === 'pending') {
    return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" title="Sending webhook..." />;
  }

  if (result.webhookStatus === 'success') {
    return <CheckCircle2 className="w-4 h-4 text-green-500" title="Webhook sent successfully" />;
  }

  if (result.webhookStatus === 'error') {
    return (
      <div className="relative">
        <XCircle 
          className="w-4 h-4 text-red-500 cursor-pointer" 
          onClick={() => setShowError(true)}
          title="Webhook failed - Click for details"
        />
        {showError && (
          <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-white rounded-lg shadow-lg border border-red-100 z-10">
            <h4 className="text-sm font-semibold text-red-600 mb-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Webhook Error
            </h4>
            <p className="text-xs text-gray-600">{result.webhookError || 'Failed to send webhook'}</p>
            <button 
              onClick={() => setShowError(false)}
              className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
};

const ScanHistory: React.FC<ScanHistoryProps> = ({ results, onClear }) => {
  if (results.length === 0) return null;

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
              <div className="flex justify-between items-start gap-2">
                <p className="text-gray-600 break-all flex-1">{result.text}</p>
                <WebhookStatus result={result} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(result.timestamp).toLocaleTimeString()}
              </p>
              {index < results.length - 1 && <hr className="my-2" />}
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={onClear}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Clear History
      </button>
    </div>
  );
};

export default ScanHistory;