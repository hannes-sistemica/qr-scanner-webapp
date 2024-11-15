import React, { useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Upload } from 'lucide-react';

interface UploadViewProps {
  onResult: (result: string) => void;
}

const UploadView: React.FC<UploadViewProps> = ({ onResult }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode('reader');
      const result = await html5QrCode.scanFile(file, true);
      onResult(result);
    } catch (err) {
      console.error('Error scanning file:', err);
      alert('Could not read QR code from this image. Please try another image.');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-md mx-auto p-6">
      <div className="text-center">
        <div className="flex items-center justify-center text-blue-500 mb-4">
          <Upload className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload QR Code</h2>
        <p className="text-gray-600 mb-4">Select an image containing a QR code to scan</p>
        
        <div id="reader" className="hidden"></div>
        
        <label className="block">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};

export default UploadView;