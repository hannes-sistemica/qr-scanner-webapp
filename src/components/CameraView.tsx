import React from 'react';
import Webcam from 'react-webcam';

interface CameraViewProps {
  onError: (error: string) => void;
  videoConstraints: MediaTrackConstraints;
}

const CameraView: React.FC<CameraViewProps> = ({ onError, videoConstraints }) => {
  return (
    <div className="relative w-full h-full">
      <Webcam
        className="w-full h-full object-cover"
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMediaError={(err) => {
          console.error('Webcam error:', err);
          onError('Failed to access camera. Please check permissions and try again.');
        }}
        mirrored={videoConstraints.facingMode === 'user'}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 border-2 border-white rounded-lg">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraView;