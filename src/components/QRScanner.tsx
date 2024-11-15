import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode } from 'lucide-react';
import SettingsPanel from './SettingsPanel';
import ScanHistory from './ScanHistory';
import type { ScanResult, Device } from '../types';
import SettingsButton from './SettingsButton';

const QRScanner = () => {
  const [qrResults, setQrResults] = useState<ScanResult[]>([]);
  const [error, setError] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isMirrored, setIsMirrored] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const lastScanned = useRef<string>('');

  const sendWebhook = async (text: string, timestamp: number) => {
    if (!webhookUrl) return;
    
    try {
      console.log('Sending webhook to:', webhookUrl);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          qrCode: text,
          timestamp: new Date(timestamp).toISOString()
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      console.log('Webhook sent successfully');
      setQrResults(prev => prev.map(result => 
        result.timestamp === timestamp 
          ? { ...result, webhookStatus: 'success' }
          : result
      ));
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? (err.name === 'AbortError' ? 'Request timed out after 10 seconds' : err.message)
        : 'Unknown error';
      console.error('Webhook error:', errorMessage);
      setQrResults(prev => prev.map(result => 
        result.timestamp === timestamp 
          ? { ...result, webhookStatus: 'error', webhookError: errorMessage }
          : result
      ));
    }
  };

  const initializeScanner = (deviceId?: string) => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1,
      formatsToSupport: [ 'QR_CODE' ],
      rememberLastUsedCamera: true,
      showTorchButtonIfSupported: true,
    };

    if (deviceId) {
      Object.assign(config, {
        videoConstraints: {
          deviceId: deviceId,
        }
      });
    }

    scannerRef.current = new Html5QrcodeScanner('reader', config, false);

    scannerRef.current.render(
      async (decodedText) => {
        if (decodedText !== lastScanned.current) {
          lastScanned.current = decodedText;
          console.log('QR Code detected:', decodedText);
          
          const timestamp = Date.now();
          const newResult: ScanResult = {
            text: decodedText,
            timestamp,
            webhookEnabled: Boolean(webhookUrl),
            webhookStatus: webhookUrl ? 'pending' : 'disabled'
          };

          setQrResults(prev => [newResult, ...prev].slice(0, 10));
          
          if (webhookUrl) {
            console.log('Webhook URL is set, sending webhook...');
            await sendWebhook(decodedText, timestamp);
          } else {
            console.log('No webhook URL set, skipping webhook');
          }

          setTimeout(() => {
            lastScanned.current = '';
          }, 3000);
        }
      },
      (error) => {
        // Ignore scanning errors
      }
    );
  };

  useEffect(() => {
    console.log('Webhook URL changed:', webhookUrl);
    // Update webhook status for all results when URL changes
    setQrResults(prev => prev.map(result => ({
      ...result,
      webhookEnabled: Boolean(webhookUrl),
      webhookStatus: webhookUrl ? 'disabled' : 'disabled'
    })));
  }, [webhookUrl]);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices
          .filter(device => device.kind === 'videoinput')
          .map(device => ({
            deviceId: device.deviceId,
            label: device.label || `Camera ${devices.indexOf(device) + 1}`
          }));
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDevice(videoDevices[0].deviceId);
          initializeScanner(videoDevices[0].deviceId);
        } else {
          initializeScanner();
        }
      } catch (err) {
        console.error('Error getting devices:', err);
        initializeScanner();
      }
    };

    getDevices();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDevice(deviceId);
    initializeScanner(deviceId);
  };

  const handleReset = () => {
    setQrResults([]);
    initializeScanner(selectedDevice);
  };

  const handleWebhookUrlChange = (url: string) => {
    console.log('Setting webhook URL to:', url);
    setWebhookUrl(url);
  };

  return (
    <div className="flex">
      <SettingsButton onClick={() => setShowSettings(true)} />

      {showSettings && (
        <SettingsPanel
          devices={devices}
          selectedDevice={selectedDevice}
          onDeviceChange={handleDeviceChange}
          webhookUrl={webhookUrl}
          onWebhookUrlChange={handleWebhookUrlChange}
          isMirrored={isMirrored}
          onMirrorChange={setIsMirrored}
          onClose={() => setShowSettings(false)}
        />
      )}

      <div className={`flex-1 flex flex-col items-center space-y-6 w-full max-w-md mx-auto p-6 ${isMirrored ? 'scale-x-[-1]' : ''}`}>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <QrCode className="w-8 h-8" />
            QR Scanner
          </h1>
          <p className="text-gray-600 mt-2">Point your camera at a QR code to scan</p>
          {webhookUrl && (
            <p className="text-xs text-gray-500 mt-1">
              Webhook enabled: {webhookUrl}
            </p>
          )}
        </div>

        <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg bg-black">
          <div id="reader" className="h-full"></div>
        </div>

        <ScanHistory results={qrResults} onClear={handleReset} />
      </div>
    </div>
  );
};

export default QRScanner;