import React, { useState } from "react";
import CollegeForm from "../components/CollegeForm";
import CollegeInfo from "../components/CollegeInfo";
import LoadingScreen from "../components/LoadingScreen"; // Import the LoadingScreen component

const SearchPage = () => {
  const [message, setMessage] = useState("");
  const [collegeInfo, setCollegeInfo] = useState(null);
  const [loading, setLoading] = useState(false); // Track loading state

  // Function to handle form updates and stop loading when done
  const handleUpdate = (info, msg) => {
    setCollegeInfo(info);
    setMessage(msg);
    setLoading(false); // Stop loading after update
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-11/12 md:w-10/12 lg:w-8/12 xl:w-7/12 mx-auto mt-16 relative">
      {loading && <LoadingScreen message="Fetching college data..." />}

      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">Search for Colleges</h1>

      {/* Warning text */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-lg">
        <p className="text-lg font-medium">
          ⚠️ Warning: Information might not be accurate due to the data provided. You are allowed to edit any and all deadlines, essays, etc., on your own checklist. You are strongly advised to check out the links provided to find accurate information.
        </p>
      </div>

      <CollegeForm setMessage={(msg) => handleUpdate(collegeInfo, msg)} setCollegeInfo={(info) => handleUpdate(info, message)} setLoading={setLoading} />

      {message && (
        <div className="mt-6 text-center transition-all duration-300 opacity-90">
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      )}

      {collegeInfo && <CollegeInfo collegeInfo={collegeInfo} />}
    </div>
  );
};

export default SearchPage;
