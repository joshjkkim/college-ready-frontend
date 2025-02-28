import React, { useState } from "react";
import CollegeForm from "../components/CollegeForm";
import CollegeInfo from "../components/CollegeInfo";
import LoadingScreen from "../components/LoadingScreen"; // Import the LoadingScreen component

const SearchPage = () => {
  const [message, setMessage] = useState("");
  const [collegeInfo, setCollegeInfo] = useState(null);
  const [loading, setLoading] = useState(false); // Track loading state
  const [displayNote, setDisplayNote] = useState(true);

  // Function to handle form updates and stop loading when done
  const handleUpdate = (info, msg) => {
    setCollegeInfo(info);
    setMessage(msg);
    setLoading(false); // Stop loading after update
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-xl w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-7/12 mx-auto mt-12 relative">
      {loading && <LoadingScreen message="Fetching college data..." />}

      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-4 sm:mb-6">
        Search for Colleges
      </h1>

      {/* Warning text */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg">
        <p className="text-sm sm:text-base font-medium">
          ⚠️ Warning: Information might not be accurate due to the data provided. You are allowed to edit any and all deadlines, essays, etc., on your own checklist. You are strongly advised to check out the links provided to find accurate information.
        </p>
      </div>

      <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-3 sm:p-4 mb-4 sm:mb-6 rounded-lg">
        <p className="text-sm sm:text-base font-medium">
          ❗ Note: Autocorrect only displays colleges that have been cached so far.
          If you want to search for a college that has not been yet searched for, type in the full Correct College name.
        </p>
        <button
          onClick={() => setDisplayNote((prev) => !prev)}
          className="w-full sm:w-auto mt-2 p-2 text-sm sm:text-base text-white bg-gradient-to-br from-green-400 to-green-700 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-300"
        >
          {displayNote ? "Show Examples" : "Hide Examples"}
        </button>
        <ul
          className={`mt-3 overflow-hidden list-inside text-xs sm:text-sm space-y-2 transition-all duration-500 ${
            displayNote ? "max-h-0" : "max-h-[100vh] overflow-y-auto"
          }`}
        >
          <li>
            <span role="img" aria-label="wrong">❌</span> UCLA
            <br />
            <span role="img" aria-label="correct">✅</span> University of California, Los Angeles
          </li>
          <li>
            <span role="img" aria-label="wrong">❌</span> Berkeley
            <br />
            <span role="img" aria-label="correct">✅</span> University of California, Berkeley
          </li>
          <li>
            <span role="img" aria-label="wrong">❌</span> Caltech
            <br />
            <span role="img" aria-label="correct">✅</span> California Institute of Technology
          </li>
        </ul>
      </div>

      <CollegeForm 
        setMessage={(msg) => handleUpdate(collegeInfo, msg)}
        setCollegeInfo={(info) => handleUpdate(info, message)}
        setLoading={setLoading} 
      />

      {message && (
        <div className="mt-4 text-center transition-all duration-300 opacity-90">
          <p className="text-xs sm:text-sm text-gray-600">{message}</p>
        </div>
      )}

      {collegeInfo && <CollegeInfo collegeInfo={collegeInfo} />}
    </div>
  );
};

export default SearchPage;
