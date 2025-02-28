import React, { useState, useEffect, useRef } from "react";
import { getMajorStats, getMajorSuggestions } from "../api/api.js"; // Import the correct API functions

const MajorStats = ({ selectedCollege }) => {
  const [query, setQuery] = useState(""); // Store the user's query for the major
  const [loading, setLoading] = useState(false); // Track if AI is processing
  const [result, setResult] = useState(null); // Store the API result
  const [error, setError] = useState(null); // Store error message
  const [disabled, setDisabled] = useState(false); // Disable input & button while loading
  const [majorSuggestions, setMajorSuggestions] = useState([]); // Store major suggestions

  const throttleTimeoutRef = useRef(null); // Reference for storing timeout ID

  useEffect(() => {

    setQuery("");
    setResult(null);
    setError(null);
    setLoading(false);
    setDisabled(false);
    setMajorSuggestions([]); 
  }, [selectedCollege]);

  const throttle = (callback, delay) => {
    if (throttleTimeoutRef.current) {
      clearTimeout(throttleTimeoutRef.current); 
    }
    throttleTimeoutRef.current = setTimeout(() => {
      callback();
    }, delay);
  };

  // Fetch major suggestions based on the user's query
  const fetchMajorSuggestions = async (query) => {
    if (query.length < 3) {
      setMajorSuggestions([]); // Clear suggestions if query is too short
      return;
    }

    try {
      const response = await getMajorSuggestions(query); // Call the backend API to fetch major suggestions
      if (response.success) {
        setMajorSuggestions(response.data); // Update suggestions state with data from backend
        setError(null)
      } else {
        setMajorSuggestions([]); // Clear suggestions if no data is found
      }
    } catch (error) {
      console.error("Error fetching major suggestions:", error);
      setError(`Cannot fetch any suggestions for ${query}`);
    }
  };

  // Handle input changes and update query with throttling
  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    throttle(() => fetchMajorSuggestions(value), 1000); // Throttle API call to once every 1 second
  };

  // Handle form submission to get major stats
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDisabled(true);
    setResult(null);
    setError(null);

    try {
      const response = await getMajorStats(selectedCollege.collegeName, query);

      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error("Error details:", error);
      setError("An error occurred: " + error.message);
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };

  if(!selectedCollege) {
    return;
  }

  return (
    <div className="major-stats p-6 bg-gradient-to-r from-indigo-100 via-purple-200 to-pink-100 rounded-lg shadow-md mt-6 max-w-8xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Major Stats</h2>
      <p className="text-sm text-center bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent mb-6"><u>Now with autocomplete!</u></p>

      {loading && <div className="text-center mt-4 text-lg font-semibold text-gray-500">Loading...</div>}
      {error && <div className="text-center mt-4 text-lg font-semibold text-red-500">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange} 
            placeholder="Enter major (e.g., Computer Science)"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            disabled={disabled}
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-600 hover:to-blue-500 transform hover:scale-105 transition-all"
            disabled={disabled}
          >
            {disabled ? "Loading..." : "Get Major Stats"}
          </button>
        </div>
      </form>
      
      {query && majorSuggestions.length > 0 && (
        <ul className="mt-4 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
          {majorSuggestions.map((major, index) => (
            <li
              key={index}
              className="p-3 cursor-pointer hover:bg-gray-200 hover:text-indigo-600 transition-all"
              onClick={() => setQuery(major)} // Set query to the selected major
            >
              {major}
            </li>
          ))}
        </ul>
      )}

      {/* Major Stats Result */}
      {result && !loading && (
        <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">{query} Major Stats</h3>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:space-x-8">
              <div className="flex-1">
                <h4 className="text-xl font-medium text-gray-800 mb-2">Average GPA</h4>
                <p className="text-lg text-gray-600">{result.average_weighted_gpa}</p>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-medium text-gray-800 mb-2">Average SAT Score</h4>
                <p className="text-lg text-gray-600">{result.average_sat_score}</p>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-medium text-gray-800 mb-2">Extracurriculars</h4>
              {result.extracurriculars?.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2 text-lg text-gray-600">
                  {result.extracurriculars.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              ) : (
                <p className="text-gray-500">No extracurriculars listed for this major.</p>
              )}
            </div>
            <div>
              <h4 className="text-xl font-medium text-gray-800 mb-2">Essay Topics</h4>
              {result.essaytopics?.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2 text-lg text-gray-600">
                  {result.essaytopics.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              ) : (
                <p className="text-gray-500">No essay topics available for this major.</p>
              )}
            </div>
            <div>
              <p className="mt-4 text-lg text-gray-700">{result.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MajorStats;
