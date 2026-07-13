import React from 'react';

interface ErrorBannerProps {
  message: string | null;
  onClose: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="bg-red-500 text-white px-4 py-3 rounded shadow-md flex justify-between items-center z-50">
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold">
        &times;
      </button>
    </div>
  );
};

export default ErrorBanner;
