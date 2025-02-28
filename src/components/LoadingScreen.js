import React from "react";

const LoadingScreen = ({ message = "Taking our time :D" }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        <div className="spinner-border animate-spin w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
        <p className="text-white text-lg">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
