export interface ScanResult {
  text: string;
  timestamp: number;
  webhookEnabled: boolean;
  webhookStatus?: 'disabled' | 'pending' | 'success' | 'error';
  webhookError?: string;
}

export interface Device {
  deviceId: string;
  label: string;
}