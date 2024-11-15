import React from 'react';
import { Settings } from 'lucide-react';

interface SettingsButtonProps {
  onClick: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
      title="Settings"
    >
      <Settings className="w-6 h-6 text-gray-600" />
    </button>
  );
};

export default SettingsButton;