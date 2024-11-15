import React from 'react';
import { X, Camera, Globe, FlipHorizontal } from 'lucide-react';

interface SettingsPanelProps {
  devices: Array<{ deviceId: string; label: string }>;
  selectedDevice: string;
  onDeviceChange: (deviceId: string) => void;
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
  isMirrored: boolean;
  onMirrorChange: (mirrored: boolean) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  devices,
  selectedDevice,
  onDeviceChange,
  webhookUrl,
  onWebhookUrlChange,
  isMirrored,
  onMirrorChange,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-start">
      <div className="bg-white w-80 h-full shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">Settings</h2>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-5 h-5 text-gray-600" />
              <h3 className="font-medium text-gray-800">Camera Selection</h3>
            </div>
            <div className="space-y-2">
              {devices.map((device) => (
                <button
                  key={device.deviceId}
                  onClick={() => onDeviceChange(device.deviceId)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedDevice === device.deviceId
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {device.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <FlipHorizontal className="w-5 h-5 text-gray-600" />
              <h3 className="font-medium text-gray-800">Mirror Camera</h3>
            </div>
            <button
              onClick={() => onMirrorChange(!isMirrored)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                isMirrored
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {isMirrored ? 'Mirrored' : 'Not Mirrored'}
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <h3 className="font-medium text-gray-800">Webhook URL</h3>
            </div>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => onWebhookUrlChange(e.target.value)}
              placeholder="https://your-webhook-url.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-2 text-xs text-gray-500">
              QR code data will be sent to this URL when scanned
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;