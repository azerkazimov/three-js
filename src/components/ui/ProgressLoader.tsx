import React from 'react';

interface ProgressLoaderProps {
  progress: number;
  isVisible: boolean;
}

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({ 
  progress, 
  isVisible 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="text-center space-y-6">
        {/* Loading Text */}
        <div className="text-white text-xl font-semibold tracking-wide">
          Loading 3D Model...
        </div>
        
        {/* Progress Bar */}
        <div className="w-80 bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Progress Percentage */}
        <div className="text-gray-300 text-sm font-medium">
          {progress}%
        </div>
        
        {/* Animated Dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </div>
  );
};
