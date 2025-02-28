import React, { useState, useEffect } from "react";
import { getCollegeChecklist, updateChecklist } from "../api/api";
import ProgressBar from "./ProgressBar";

const Checklist = ({ userId, selectedCollege, isEditMode, setIsEditMode }) => {
  const [checklist, setChecklist] = useState(null); // Holds the checklist data
  const [checklistState, setChecklistState] = useState({}); // Tracks checkbox states
  const [tempChecklist, setTempChecklist] = useState(null); 

  // Fetch the checklist data when the selected college changes
  useEffect(() => {
    const fetchChecklist = async () => {
      if (selectedCollege && selectedCollege.collegeName) {
        console.log("Fetching checklist for user:", userId, "college:", selectedCollege.collegeName);
        try {
          const { success, data } = await getCollegeChecklist(userId, selectedCollege.collegeName);
          if (success) {
            setChecklist(data);

            // Initialize state for checkboxes
            const initialState = {};
            Object.entries(data).forEach(([section, items]) => {
              items.forEach((item, index) => {
                initialState[`${section}_${index}`] = item.completed;
              });
            });
            setChecklistState(initialState);
          } else {
            console.error("Failed to fetch checklist.");
          }
        } catch (error) {
          console.error("Error fetching checklist:", error);
        }
      }
    };

    fetchChecklist();
  }, [selectedCollege, userId]);

  // Handle checkbox changes with optimistic updates
  const handleCheckboxChange = async (section, itemIndex, completed) => {
    const key = `${section}_${itemIndex}`;
    const previousState = checklistState[key]; // Save the current state for potential rollback

    // Optimistically update the UI
    setChecklistState((prevState) => ({
      ...prevState,
      [key]: completed,
    }));

    try {
      const { success } = await updateChecklist(userId, selectedCollege.collegeName, section, itemIndex, completed);
      if (!success) {
        console.error("Failed to update checklist on the server.");
        // Revert the change on failure
        setChecklistState((prevState) => ({
          ...prevState,
          [key]: previousState,
        }));
      }
    } catch (error) {
      console.error("Error updating checklist:", error);
      // Revert the change on error
      setChecklistState((prevState) => ({
        ...prevState,
        [key]: previousState,
      }));
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (!isEditMode) {
      setTempChecklist(JSON.parse(JSON.stringify(checklist))); // Deep copy for editing
    } else {
      setTempChecklist(null); // Clear temporary checklist when exiting edit mode
    }
    setIsEditMode(!isEditMode);
  };

  // Handle text edit for checklist items
  const handleEditItem = (section, itemIndex, newText) => {
    const newTempChecklist = { ...tempChecklist };
    if (Array.isArray(newTempChecklist[section])) {
      newTempChecklist[section][itemIndex].text = newText;
    }
    setTempChecklist(newTempChecklist);
  };

  // Handle adding a new item
  const handleAddItem = (section) => {
    const newTempChecklist = { ...tempChecklist };
    if (Array.isArray(newTempChecklist[section])) {
      newTempChecklist[section].push({ text: "", completed: false });
    }
    setTempChecklist(newTempChecklist);
  };

  // Handle deleting an item
  const handleDeleteItem = (section, itemIndex) => {
    const newTempChecklist = { ...tempChecklist };
    if (Array.isArray(newTempChecklist[section])) {
      newTempChecklist[section].splice(itemIndex, 1);
    }
    setTempChecklist(newTempChecklist);
  };

  // Save changes to checklist
  const handleSaveChanges = async () => {
    setChecklist(tempChecklist);
    setIsEditMode(false);

    try {
      await updateChecklist(userId, selectedCollege.collegeName, null, null, null, tempChecklist);
    } catch (error) {
      console.error("Failed to update checklist:", error);
    }
  };

  if (!checklist) {
    return null;
  }

  return (
    <div className="p-4 md:p-6 bg-white shadow-lg rounded-lg overflow-x-hidden">
      <h2 className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
        {selectedCollege.collegeName} Checklist
      </h2>
      
      {/* Toggle and Save Buttons */}
      <div className="flex flex-wrap items-center space-x-4 mb-4">
        <button
          onClick={toggleEditMode}
          className="bg-gray-200 text-sm md:text-base p-2 rounded-full hover:bg-gray-300"
        >
          {isEditMode ? "Cancel Changes" : "Edit Checklist"}
        </button>
        {isEditMode && (
          <button
            onClick={handleSaveChanges}
            className="bg-blue-500 text-white text-sm md:text-base px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        )}
      </div>
      
      <ProgressBar checklistState={checklistState} />
      <br />

      {Object.entries(tempChecklist || checklist).map(([section, items]) => (
        <div key={section} className="mb-6">
          <h3 className="text-lg md:text-xl font-semibold mb-2 text-blue-600 capitalize">
            {section.replace(/([A-Z])/g, " $1")}
          </h3>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 bg-gray-100 p-3 rounded-lg hover:shadow-md"
              >
                {!isEditMode ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-blue-500"
                        checked={checklistState[`${section}_${index}`] || false}
                        onChange={() =>
                          handleCheckboxChange(section, index, !checklistState[`${section}_${index}`])
                        }
                      />
                      <span className="text-gray-700 text-sm md:text-base">
                        {item.text || `${item.type} - ${item.date}`}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {item.type ? (
                      <span className="text-gray-700 text-sm md:text-base">
                        {item.type} - {item.date}
                      </span>
                    ) : (
                      <input
                        type="text"
                        className="border border-gray-300 rounded p-1 flex-1 text-sm md:text-base"
                        value={item.text}
                        onChange={(e) => handleEditItem(section, index, e.target.value)}
                      />
                    )}
                    <button
                      onClick={() => handleDeleteItem(section, index)}
                      className="bg-red-500 text-white text-xs md:text-sm px-2 py-1 rounded mt-1 sm:mt-0"
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
          {isEditMode && (
            <button
              onClick={() => handleAddItem(section)}
              className="bg-blue-500 text-white text-xs md:text-sm px-4 py-2 rounded mt-4"
            >
              Add Item
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Checklist;
