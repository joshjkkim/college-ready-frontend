import React, { useState, useEffect } from "react";

// Helper function to calculate progress
const calculateProgress = (checklistState) => {
  const totalItems = Object.values(checklistState).length;
  const completedItems = Object.values(checklistState).filter((completed) => completed).length;
  return Math.round((completedItems / totalItems) * 100);
};

const ProgressBar = ({ checklistState }) => {
  const [progress, setProgress] = useState(0);

  // Calculate progress on every change in checklistState
  useEffect(() => {
    setProgress(calculateProgress(checklistState));
  }, [checklistState]);

  // Determine the color based on the progress percentage
  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-gradient-to-r from-green-500 via-green-200 to-green-500"; // Green when 100%
    if (progress >= 50) return "bg-gradient-to-r from-yellow-400 to-green-500";
    return "bg-gradient-to-r from-red-400 to-yellow-500";
  };

  // The container color changes based on progress
  const containerColor = progress === 100 ? "bg-green-500" : "bg-gradient-to-r from-red-500 via-yellow-300 to-green-500";

  return (
    <div className={`progress-bar-container p-6 rounded-lg shadow-xl ${containerColor}`}>
      <h2 className="text-3xl font-bold text-white text-center mb-4">Your Progress!</h2>
      
      <div className="relative">
        <div className="bg-gray-200 rounded-full h-4">
          <div
            className={`progress-bar h-4 rounded-full ${getProgressColor(progress)}`}
            style={{ width: `${progress}%`, transition: "width 0.5s ease-in-out" }}
          />
        </div>

        <div className="absolute inset-0 flex justify-center items-center">
          <span className="text-2xl font-semibold text-white">{progress}%</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className="text-lg text-white">
        {progress === 100 ? "Congratulations!" : progress === 0 ? "Let's get started!" : `Keep going, you're making progress!`}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
