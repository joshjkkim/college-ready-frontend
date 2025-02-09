import React, { useState, useRef } from "react";
import { handleCollegeSearchOrAdd, getCollegeSuggestions } from "../api/api.js";

const CollegeForm = ({ setMessage, setCollegeInfo, setLoading }) => {
  const [collegeName, setCollegeName] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [collegeSuggestions, setCollegeSuggestions] = useState([]);
  const [query, setQuery] = useState("");

  const throttleTimeoutRef = useRef(null);

  const throttle = (callback, delay) => {
    if (throttleTimeoutRef.current) {
      clearTimeout(throttleTimeoutRef.current); 
    }
    throttleTimeoutRef.current = setTimeout(() => {
      callback();
    }, delay);
  };

  const fetchCollegeSuggestions = async (query) => {
    if (query.length < 3) {
      setCollegeSuggestions([]); // Clear suggestions if query is too short
      return;
    }

    try {
      const response = await getCollegeSuggestions(query); // Call the backend API to fetch major suggestions
      if (response.success) {
        setCollegeSuggestions(response.data); // Update suggestions state with data from backend
      } else {
        setCollegeSuggestions([]); // Clear suggestions if no data is found
      }
    } catch (error) {
      console.error("Error fetching college suggestions:", error);
    }
  };

  // Handle input changes and update query with throttling
  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    throttle(() => fetchCollegeSuggestions(value), 1000); // Throttle API call to once every 1 second
  };


  const handleInputChange = (e) => {
    setCollegeName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setDisabled(true);

    try {
      const result = await handleCollegeSearchOrAdd(collegeName);

      if (result.success) {
        setMessage(result.message);
        setCollegeInfo(result.data);
      } else {
        setMessage(result.message);
      }

      setCollegeName("");
    } catch (error) {
      console.error("Error details:", error);
      setMessage("An error occurred: " + error.message);
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-6 p-8 bg-gradient-to-r from-indigo-100 via-purple-200 to-pink-100 rounded-xl shadow-xl max-w-lg mx-auto"
      value={query}
      onChange={handleQueryChange}
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Find Your College</h2>
      
      <div className="relative">
        <input
          type="text"
          placeholder="If the college you are looking for does not appear in the search bar, Please type it "
          value={collegeName}
          onChange={handleInputChange}
          className="w-full p-4 pr-12 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out"
          disabled={disabled}
        />
        <svg 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor">
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M17 17l4 4m0 0l-4 4m4-4H3m14 0a9 9 0 10-9-9 9 9 0 009 9z" />
        </svg>
      </div>

      {query && collegeSuggestions.length > 0 && (
        <ul className="mt-4 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {collegeSuggestions.map((college, index) => (
            <li
              key={index}
              className="p-3 cursor-pointer hover:bg-gray-200 hover:text-indigo-600 transition-all"
              onClick={() => setQuery(college)} // Set query to the selected major
            >
              {college}
            </li>
          ))}
        </ul>
      )}

      <button
        type="submit"
        className="w-full p-4 text-white font-semibold rounded-lg shadow-md bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-105 flex items-center justify-center"
        disabled={disabled}
      >
        {disabled ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
            </svg>
            Loading...
          </>
        ) : (
          "Search/Add College"
        )}
      </button>
    </form>
  );
};

export default CollegeForm;
