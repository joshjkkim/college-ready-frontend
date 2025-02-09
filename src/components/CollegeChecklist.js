import React, { useState, useEffect } from "react";
import { getCollegeChecklist, updateChecklist } from "../api/api";
import ProgressBar from "./ProgressBar";

const Checklist = ({ userId, selectedCollege }) => {
  const [checklist, setChecklist] = useState(null); // Holds the checklist data
  const [checklistState, setChecklistState] = useState({}); // Tracks checkbox states
  const [isEditMode, setIsEditMode] = useState(false); 
  const [tempChecklist, setTempChecklist] = useState(null); 

  // Fetch the checklist data when the selected college changes
  useEffect(() => {
    const fetchChecklist = async () => {
      if (selectedCollege) {
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
      setTempChecklist(JSON.parse(JSON.stringify(checklist))); // Deep copy of the checklist for editing
    } else {
      setTempChecklist(null); // Clear the temporary checklist if exiting edit mode
    }
    setIsEditMode(!isEditMode);
  };

  // Handle text edit for checklist items
  const handleEditItem = (section, itemIndex, newText) => {
    const newTempChecklist = { ...tempChecklist };
    if (Array.isArray(newTempChecklist[section])) {
      newTempChecklist[section][itemIndex].text = newText;
    }
    setTempChecklist(newTempChecklist); // Update state immediately to reflect the text change
  };
  

  // Handle adding a new item
  const handleAddItem = (section) => {
    const newTempChecklist = { ...tempChecklist };
    if (Array.isArray(newTempChecklist[section])) {
      newTempChecklist[section].push({ text: "", completed: false });
    }
    setTempChecklist(newTempChecklist); // Update state to reflect the new item immediately
  };
  

  // Handle deleting an item
  const handleDeleteItem = (section, itemIndex) => {
    const newTempChecklist = { ...tempChecklist };
    if (Array.isArray(newTempChecklist[section])) {
      newTempChecklist[section].splice(itemIndex, 1); // Remove item
    }
    setTempChecklist(newTempChecklist); // Update state to reflect the change immediately
  };
  

  // Save changes to checklist
  const handleSaveChanges = async () => {
    setChecklist(tempChecklist); // Save changes to the main checklist
    setIsEditMode(false); // Exit edit mode

    try {
      await updateChecklist(userId, selectedCollege.collegeName, null, null, null, tempChecklist); // Save to backend
    } catch (error) {
      console.error("Failed to update checklist:", error);
    }
  };

  if (!selectedCollege) {
    return <p>Select a college to view its checklist.</p>;
  }

  if (!checklist) {
    return <p>Loading checklist...</p>;
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">


      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
        {selectedCollege.collegeName} Checklist
      </h2>
  
      {/* Button to toggle between view and edit mode */}
      <div className="flex items-center space-x-4 mb-4">
        <button
            onClick={toggleEditMode}
            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
        >
            {isEditMode ? "Cancel Changes" : "Edit Checklist"}
        </button>

        {isEditMode && (
            <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSaveChanges}
            >
            Save
            </button>
        )}
        </div>

  
      <ProgressBar checklistState={checklistState} /> <br></br>

    {/* Render checklist items */}
      {Object.entries(tempChecklist || checklist).map(([section, items]) => (
        
        <div key={section} className="mb-6">
            
          <h3 className="text-xl font-semibold mb-2 text-blue-600 capitalize">
            {section.replace(/([A-Z])/g, " $1")}
          </h3>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex items-center space-x-4 bg-gray-100 p-3 rounded-lg hover:shadow-md"
              >
                {!isEditMode ? (
                  <>
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-blue-500"
                      checked={checklistState[`${section}_${index}`] || false}
                      onChange={() =>
                        handleCheckboxChange(section, index, !checklistState[`${section}_${index}`])
                      }
                    />
                    <span className="text-gray-700">
                      {item.text || `${item.type} - ${item.date}`}
                    </span>
                  </>
                ) : (
                  <>
                    {/* Editable fields */}
                    {item.type ? (
                      <>
                        <span className="text-gray-700">{item.type} - {item.date}</span>
                      </>
                    ) : (
                      <input
                        type="text"
                        className="border rounded p-1 flex-1"
                        value={item.text} // This should still be linked to tempChecklist's state
                        onChange={(e) => handleEditItem(section, index, e.target.value)} // This triggers the update immediately
                      />
                    )}
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDeleteItem(section, index)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
          {/* Button to add new item */}
          {isEditMode && (
            <button
              onClick={() => handleAddItem(section)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Add Item
            </button>
          )}
        </div>
      ))}
  
      {/* Display save and cancel buttons in edit mode */}
      
    </div>
  );  
};

export default Checklist;
