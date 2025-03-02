import React, { useEffect, useState } from "react";
import TypingEffect from "../components/TypingEffect";
import { Helmet } from "react-helmet";
import { signOutUser } from "../firebase";
import { useNavigate } from "react-router-dom"; 
import ConstellationBackground from "../components/Constellation";
import SEO from "../components/SEO";

const HomePage = ({ user }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true); 
    }, 500);

    return () => clearTimeout(timer); 
  }, []);

  const handleLoginRedirect = async () => {
      navigate("/login"); 
  };

  const handleLogout = async () => {
    await signOutUser(); 
  };

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-r from-purple-200 to-blue-200 overflow-hidden">
      <SEO />
      <Helmet>
        <title>College Ready - Home</title>
        <meta
          name="description"
          content="Are you College Ready? Discover colleges, track deadlines, explore majors, get inspired by essay examples, and compare stats to find your perfect fit."
        />
        <meta property="og:title" content="College Ready - Home" />
        <meta
          property="og:description"
          content="Discover colleges, track deadlines, explore majors, and compare stats with College Ready."
        />
        <meta property="og:url" content="https://www.collegeready.me/" />
        <meta property="og:image" content="https://www.collegeready.me/icon.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="College Ready - Home" />
        <meta
          name="twitter:description"
          content="Discover colleges, track deadlines, explore majors, and compare stats with College Ready."
        />
      </Helmet>
      <div className="relative z-10">
        <div className="min-h-screen flex flex-col items-center justify-center bg-opacity-80 text-center text-white drop-shadow-xl">
          <div className="fixed inset-0 w-full h-full">
          </div>
      
          <div
            className={`p-12 rounded-lg max-w-xl mx-auto transition-opacity duration-1000 ease-in-out ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >

            <div className="flex items-center justify-center mb-4">
              <img src="/icon.png" alt="CollegeReady Logo" className="h-32 w-auto mr-2" />
            </div>

            <h1
              className={`text-5xl font-bold mb-6 transition-all duration-1000 transform ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              Are you College Ready?
            </h1>

          

            <TypingEffect
              messages={[
                "Find your College",
                "Find your future",
                "Stay on top of your Deadlines",
                "Stay on top of your dreams",
                "Discover your Major",
                "Discover you passion",
                "Find Extra Curricular ideas",
                "Find your next big thing",
                "Find Essay Topic Ideas",
                "Get Inspired with Essay Examples from top Universities",
              ]}
              speed={75}
              delay={1000}
              fontSize={"text-2xl"}
            />
          </div>

          <div className="mt-6">
            {!user ? (
              <button
                onClick={handleLoginRedirect}
                className="bg-gradient-to-br from-indigo-600 to-blue-500 text-white text-lg px-8 py-4 rounded-full shadow-lg transition-all transform hover:scale-110"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-4 rounded-full shadow-lg transition-all transform hover:scale-110"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feature 1: Search for Colleges */}
      <div className={`flex flex-col md:flex-row items-center justify-between p-8 md:p-16 mt-10 bg-opacity-20 bg-white rounded-lg shadow-lg transform transition-all ${isLoaded ? "scale-100 rotate-0" : "scale-90 rotate-5"}`}>
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-800">Search for Colleges</h2>
          <p className="text-lg md:text-xl mb-4 text-gray-700">
            Find the perfect college that suits your interests, location, and goals.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <img
            src="/assets/search.png"
            alt="College Search"
            className="rounded-lg transform transition-all hover:scale-110 hover:rotate-3 duration-500 ease-in-out hover:shadow-xl w-full h-auto"
          />
        </div>
      </div>

      {/* Feature 2: Track Your Deadlines */}
      <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-16 mt-10 bg-opacity-20 bg-white rounded-lg shadow-lg transform transition-all">
        <div className="w-full md:w-1/2 order-2 md:order-1 p-5">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-800">Track Your Deadlines</h2>
          <p className="text-lg md:text-xl mb-4 text-gray-700">
            Stay organized and keep track of all your application deadlines with our checklist tool.
          </p>
        </div>
        <div className="w-full md:w-1/2 order-1 md:order-2">
          <img
            src="/assets/checklist.png" 
            alt="Track Deadlines"
            className="rounded-lg transform transition-all hover:scale-110 hover:-rotate-3 duration-500 ease-in-out hover:shadow-xl w-full h-auto"
          />
        </div>
      </div>

      {/* Feature 3: Discover Your Major */}
      <div className={`flex flex-col md:flex-row items-center justify-between p-8 md:p-16 mt-10 bg-opacity-20 bg-white rounded-lg shadow-lg transform transition-all ${isLoaded ? "scale-100 rotate-0" : "scale-90 rotate-5"}`}>
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-800">Discover Your Major</h2>
          <p className="text-lg md:text-xl mb-4 text-gray-700">
            Explore your interests and find extracurriculars and essay topics tailored to your major.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <img
            src="/assets/major.png"
            alt="Discover Major"
            className="rounded-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:rotate-3 w-full h-auto"
          />
        </div>
      </div>

      {/* Feature 4: Essay Examples */}
      <div className={`flex flex-col md:flex-row items-center justify-between p-8 md:p-16 mt-10 bg-opacity-20 bg-white rounded-lg shadow-lg transform transition-all ${isLoaded ? "scale-100 rotate-0" : "scale-90 rotate-5"}`}>
        <div className="w-full md:w-1/2 order-2 md:order-1 p-5">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-800">Essay Examples</h2>
          <p className="text-lg md:text-xl mb-4 text-gray-700">
            Get inspired by successful essays from students who got into top universities.
          </p>
        </div>
        <div className="w-full md:w-1/2 order-1 md:order-2">
          <img
            src="/assets/essays.png"
            alt="Essay Examples"
            className="rounded-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:-rotate-3 w-full h-auto"
          />
        </div>
      </div>

      {/* Feature 5: Stay on Top */}
      <div className={`flex flex-col md:flex-row items-center justify-between p-8 md:p-16 mt-10 bg-opacity-20 bg-white rounded-lg shadow-lg transform transition-all ${isLoaded ? "scale-100 rotate-0" : "scale-90 rotate-5"}`}>
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-800">Stay on Top</h2>
          <p className="text-lg md:text-xl mb-4 text-gray-700">
            Keep track of your deadlines with our calendar and deadline email notifications.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <img
            src="/assets/calendar.png"
            alt="Track Deadlines"
            className="rounded-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:rotate-3 w-full h-auto"
          />
        </div>
      </div>

      {/* Feature 6: Compare Stats */}
      <div className={`flex flex-col md:flex-row items-center justify-between p-8 md:p-16 mt-10 bg-opacity-20 bg-white rounded-lg shadow-lg transform transition-all ${isLoaded ? "scale-100 rotate-0" : "scale-90 rotate-5"}`}>
        <div className="w-full md:w-1/2 order-2 md:order-1 p-5">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-800">Compare Stats</h2>
          <p className="text-lg md:text-xl mb-4 text-gray-700">
            Compare metrics on colleges to determine your best fit.
          </p>
        </div>
        <div className="w-full md:w-1/2 order-1 md:order-2">
          <img
            src="/assets/compare.png"
            alt="Compare Colleges"
            className="rounded-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:-rotate-3 w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
