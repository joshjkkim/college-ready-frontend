import React, { useState } from "react";
import SearchPage from "../pages/SearchPage";
import CompareColleges from "../pages/CompareColleges";
import { Helmet } from "react-helmet";

const CollegeDashboard = () => {
  const [mode, setMode] = useState("search"); // "search" or "compare"

  const toggleMode = () => {
    setMode((prev) => (prev === "search" ? "compare" : "search"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-100 py-8">
      <Helmet>
        <title>College Ready - College Search</title>
        <meta
          name="description"
          content="Search for colleges or compare them side-by-side with College Ready. Find your perfect fit and explore your options."
        />
        <meta property="og:title" content="College Ready - College Search" />
        <meta
          property="og:description"
          content="Use College Ready to search for colleges or compare them side-by-side and discover the best options for your future."
        />
        <meta property="og:url" content="https://www.collegeready.me/search" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            College Search
          </h1>
          <p className="text-lg text-gray-600">
            Search for colleges or compare them side-by-side.
          </p>
        </header>
        <div className="flex justify-center mb-8">
          <button
            onClick={toggleMode}
            className="px-6 py-3 rounded-full bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Switch to {mode === "search" ? "Compare Colleges" : "Search Colleges"}
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          {mode === "search" ? <SearchPage /> : <CompareColleges />}
        </div>
      </div>
    </div>
  );
};

export default CollegeDashboard;
