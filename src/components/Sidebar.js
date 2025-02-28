import React, { useState, useEffect } from "react";
import { getCollegesForUser, removeUserCollege } from "../api/api";
import { FiChevronLeft, FiChevronRight, FiTrash, FiMenu, FiX } from "react-icons/fi";

const Sidebar = ({
  userId,
  onSelectCollege,
  onCollegeRemoved,
  isCollapsed,
  setIsCollapsed,
  setLoading,
}) => {
  const [colleges, setColleges] = useState([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
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
      setLoading(false);
    };

    fetchColleges();
  }, [userId, setLoading]);

  const handleRemoveCollege = async (collegeToRemove) => {
    const { success, message } = await removeUserCollege(collegeToRemove.collegeName);
    if (success) {
      setColleges((prevColleges) =>
        prevColleges.filter(
          (college) => college.collegeId !== collegeToRemove.collegeId
        )
      );
      if (onCollegeRemoved) {
        onCollegeRemoved(collegeToRemove);
      }
    } else {
      console.error("Failed to remove college:", message);
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-8 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 bg-indigo-900 text-white rounded focus:outline-none"
          aria-label="Open Sidebar"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed md:sticky top-0 left-0 z-50 transition-transform duration-300 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 ${isCollapsed ? "w-16" : "w-64"}
          bg-gradient-to-r from-indigo-900 to-blue-800 text-white p-4 shadow-lg
          ${/* On mobile, we want full height; on desktop, let it grow with content */ ""}
          h-full md:h-auto
        `}
      >
        <div className="flex items-center justify-between mb-4">
          {/* Title displayed on desktop */}
          <h3 className="text-xl font-semibold hidden md:block">
            Your Colleges
          </h3>
          <div className="flex items-center space-x-2">
            {/* Desktop: Collapse toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:block text-gray-400 hover:text-yellow-500 focus:outline-none"
              aria-label="Toggle Collapse"
            >
              {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
            </button>
            {/* Mobile: Close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden text-gray-400 hover:text-yellow-500 focus:outline-none"
              aria-label="Close Sidebar"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
        <ul className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 4rem)" }}>
          {colleges.length > 0 ? (
            colleges.map((college) => (
              <li
                key={college.collegeId}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer mb-2"
                onClick={() => {
                  onSelectCollege(college);
                  if (isMobileOpen) setIsMobileOpen(false);
                }}
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
    </>
  );
};

export default Sidebar;
