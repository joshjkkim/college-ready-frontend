import React, { useState, useEffect } from "react";
import { getCollegesForUser, removeUserCollege } from "../api/api";
import { FiChevronLeft, FiTrash, FiChevronRight } from "react-icons/fi";

const Sidebar = ({ userId, onSelectCollege, onCollegeRemoved, isCollapsed, setIsCollapsed }) => {
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        if (userId) {
          const { success, data, message } = await getCollegesForUser(userId);
          if (success) {
            setColleges(data);
          } else {
            console.log(message);
          }
        }
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    };

    fetchColleges();
  }, [userId]);

  const handleRemoveCollege = async (collegeToRemove) => {
    const { success, message } = await removeUserCollege(collegeToRemove.collegeName);

    if (success) {
      setColleges((prevColleges) =>
        prevColleges.filter((college) => college.collegeId !== collegeToRemove.collegeId)
      );

      if (onCollegeRemoved) {
        onCollegeRemoved(collegeToRemove);
      }
    } else {
      console.error("Failed to remove college:", message);
    }
  };

  return (
    <div
      className={`sticky top-0 h-screen bg-gray-900 text-white p-4 transition-all duration-300 shadow-lg ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-xl font-semibold transition-all ${
            isCollapsed ? "opacity-0 scale-90 w-0 overflow-hidden" : "opacity-100"
          }`}
        >
          Your Colleges
        </h3>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-yellow-500 focus:outline-none"
        >
          {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div>
      <ul className="overflow-y-auto h-[calc(100vh-4rem)]">
        {colleges.length > 0 ? (
          colleges.map((college) => (
            <li
              key={college.collegeId}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer mb-2"
              onClick={() => onSelectCollege(college)}
            >
              <span className={`font-medium ${isCollapsed ? "text-sm truncate" : "text-base"}`}>
                {college.collegeName}
              </span>
              {!isCollapsed && (
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCollege(college);
                  }}
                >
                  <FiTrash size={16} />
                </button>
              )}
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-sm text-center">
            No colleges added yet.
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
