import React, { useState, useEffect } from 'react';
import { getPrompts, getEssays, getCollegesForEssays } from '../api/api.js';
import LoadingScreen from '../components/LoadingScreen.js'; 
import { Helmet } from 'react-helmet';
import SEO from '../components/SEO.js';

const CollegeEssays = () => {
  const [collegeName, setCollegeName] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [essays, setEssays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visibleEssays, setVisibleEssays] = useState(null);
  const [collegesList, setCollegesList] = useState([]); 

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const response = await getCollegesForEssays(); 
        if (response.success) {
          setCollegesList(response.data || []);
        } else {
          setError('Failed to load college names.');
        }
      } catch (error) {
        setError('Failed to load college names.');
      }
      setLoading(false);
    };

    fetchColleges();
  }, []); 

  const handleGetPrompts = async (college) => {
    setCollegeName(college);
    setLoading(true);
    setError('');
    setPrompts([]); 
    setEssays([]); 
    setVisibleEssays(null); 

    try {
      const response = await getPrompts(college);
      if (response.success) {
        setPrompts(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('An error occurred while fetching prompts.');
    }
    setLoading(false);
  };

  const handleGetEssays = async (prompt) => {
    // Toggle visibility of essays
    if (visibleEssays === prompt) {
      setEssays([]); // Clear essays if the prompt is clicked again
      setVisibleEssays(null); // Hide essays
    } else {
      setLoading(true);
      setError('');
      try {
        const response = await getEssays(collegeName, prompt);
        if (response.success) {
          setEssays(response.data);
          setVisibleEssays(prompt); // Show essays for the clicked prompt
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError('An error occurred while fetching essays.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="">
      <SEO />
      <Helmet>
        <title>College Ready - College Essay Prompts</title>
        <meta
          name="description"
          content="Discover college essay prompts on College Ready. Explore prompts for your favorite colleges and get inspired for your next big essay."
        />
        <meta property="og:title" content="College Ready - College Essay Prompts" />
        <meta
          property="og:description"
          content="Discover college essay prompts on College Ready. Explore prompts for your favorite colleges and get inspired for your next big essay."
        />
        <meta property="og:url" content="https://www.collegeready.me/essay-prompts" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="College Ready - College Essay Prompts" />
        <meta
          name="twitter:description"
          content="Discover college essay prompts on College Ready. Explore prompts for your favorite colleges and get inspired for your next big essay."
        />
      </Helmet>
      {loading && <LoadingScreen />} 
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-8 transform transition-all duration-300">
        <h1 className="text-5xl font-bold text-center text-indigo-700 mb-8">College Essay Prompts</h1>

        <div className="mb-8">
          {/* College List */}
          <div className="grid grid-cols-3 gap-6">
            {loading ? (
              <p>Loading colleges...</p>
            ) : (
              collegesList.length > 0 ? (
                collegesList.map((college, index) => (
                  <button
                    key={index}
                    onClick={() => handleGetPrompts(college)}
                    className="w-full p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200"
                  >
                    {college}
                  </button>
                ))
              ) : (
                <p>No colleges available</p> 
              )
            )}
          </div>
        </div>

        

        {error && <p className="text-red-600 text-center">{error}</p>}

        {/* Display prompts */}
        {prompts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-indigo-700 mb-6">Essay Prompts for <span class="text-indigo-500"><strong>{collegeName}</strong></span></h2>
            <ul className="space-y-4">
              {prompts.map((prompt, index) => (
                <li key={index} className="bg-white p-6 rounded-xl shadow-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200">
                  <button
                    onClick={() => handleGetEssays(prompt)}
                    className="w-full text-left p-4 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-lg font-semibold shadow-lg hover:from-orange-400 hover:to-yellow-500 transform hover:scale-105 transition-all duration-200"
                  >
                    {`Essays for "${prompt}"`}
                  </button>
                  {visibleEssays === prompt && essays.length > 0 && (
                    <ul className="mt-4 space-y-3">
                      {essays.map((essay, index) => (
                        <li key={index} className="bg-gray-50 p-6 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-200">
                          {essay}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeEssays;
