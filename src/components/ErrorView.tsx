import React from 'react';
import { AlertCircle, Upload } from 'lucide-react';

interface ErrorViewProps {
  error: string;
  onRetry: () => void;
  onUpload: () => void;
}

const ErrorView: React.FC<ErrorViewProps> = ({ error, onRetry, onUpload }) => {
  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md mx-auto p-6">
      <div className="text-center">
        <div className="flex items-center justify-center text-red-500 mb-4">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={onRetry}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onUpload}
            className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <Upload className="w-4 h-4" />
            Try File Upload Instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorView;