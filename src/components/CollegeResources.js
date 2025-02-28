import React, { useState } from "react";

const Resources = ({ resources, selectedCollege }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // State to control collapse/expand

  if (!selectedCollege) {
    return <p className="text-center text-gray-500 mt-8">Select a college to view its resources.</p>;
  }

  if (!resources) {
    return <p className="text-center text-gray-500 mt-8">Loading resources...</p>;
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent mb-6">
            Resources for {selectedCollege.collegeName}
          </h2>
          
      <button
        onClick={() => setIsCollapsed((prev) => !prev)}
        className="w-3/12 p-2 text-white bg-gradient-to-r from-blue-500 to-indigo-600 font-semibold rounded-lg mb-4 hover:bg-gray-400 transition-all duration-300"
      >
        {isCollapsed ? "Show College Resources" : "Hide College Resources"}
      </button>

        <div className={`overflow-hidden transition-all duration-1000 ${isCollapsed ? "max-h-0" : "max-h-[100vh] overflow-y-auto"}`}>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Helpful Links</h3>
            <ul className="list-disc pl-6 space-y-2">
              {resources.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Tips for Applicants</h3>
            <ul className="list-disc pl-6 space-y-2">
              {resources.tips.map((tip, index) => (
                <li key={index} className="text-gray-700">
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Admission Statistics */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Admission Statistics</h3>
            <ul className="space-y-2">
              <li className="text-gray-700">
                <strong className="font-semibold">Acceptance Rate: </strong>
                {resources.admissionStatistics?.overallAcceptanceRate}
              </li>
              <li className="text-gray-700">
                <strong className="font-semibold">Year: </strong>
                {resources.admissionStatistics?.year}
              </li>
            </ul>
          </div>
        </div>
    </div>
  );
};

export default Resources;
