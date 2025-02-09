import React, { useState, useEffect } from "react";
import { getCollegeResources } from "../api/api";

const Resources = ({ userId, selectedCollege }) => {
  const [resources, setResources] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false); // State to control collapse/expand

  useEffect(() => {
    const fetchResources = async () => {
      if (selectedCollege) {
        console.log("Fetching resources for user:", userId, "college:", selectedCollege.collegeName);
        try {
          const { success, data } = await getCollegeResources(userId, selectedCollege.collegeName);
          if (success) {
            setResources(data);
          } else {
            console.error("Failed to fetch resources.");
          }
        } catch (error) {
          console.error("Error fetching resources:", error);
        }
      }
    };

    fetchResources();
  }, [selectedCollege, userId]);

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
        className="w-full p-2 text-white bg-gradient-to-r from-blue-500 to-indigo-600 font-semibold rounded-lg mb-4 hover:bg-gray-400 transition-all duration-300"
      >
        {isCollapsed ? "Hide College Resources" : "Show College Resources"}
      </button>

      {isCollapsed && (
        <div>
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
      )}
    </div>
  );
};

export default Resources;
