import React, { useEffect, useState } from "react";
import TypingEffect from "../components/TypingEffect";
import { signOutUser } from "../firebase";
import { useNavigate } from "react-router-dom"; 

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
    <div className="bg-gradient-to-r from-purple-200 to-blue-200 bg-cover bg-center bg-no-repeat drop-shadow-xl">
      <div className="min-h-screen flex flex-col items-center justify-center bg-opacity-80 text-center text-white drop-shadow-xl">
        <div
            className={`p-12 rounded-lg max-w-xl mx-auto transition-opacity duration-1000 ease-in-out ${
            isLoaded ? "opacity-100" : "opacity-0"
            }`}
        >
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

        {/* Button Container */}
        <div className="mt-6">
            {!user ? (
            <button
                onClick={handleLoginRedirect}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-full shadow-lg transition-all transform hover:scale-110"
            >
                Sign In with Google
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
      
      <div
        className={`flex items-center justify-between p-16 mt-20 bg-opacity-20 bg-white rounded-lg shadow-lg transform transition-all ${
          isLoaded ? "scale-100 rotate-0" : "scale-90 rotate-5"
        }`}
      >
        <div className="w-1/2">
          <h2 className="text-4xl font-extrabold mb-6 text-gray-800">Search for Colleges</h2>
          <p className="text-xl mb-6 text-gray-700">
            Find the perfect college that suits your interests, location, and goals.
          </p>
        </div>
        <div className="w-1/2">
          <img
            src="/assets/search.png"
            alt="College Search"
            className="rounded-lg transform transition-all hover:scale-110 hover:rotate-3 duration-500 ease-in-out hover:shadow-xl"
          />
        </div>
      </div>

      {/* Feature 2: Track Deadlines */}
      <div className="flex items-center justify-between p-16 mt-20 bg-opacity-20 bg-white rounded-lg shadow-lg transform transition-all">
        <div className="w-1/2 order-2 p-5">
          <h2 className="text-4xl font-extrabold mb-6 text-gray-800">Track Your Deadlines</h2>
          <p className="text-xl mb-6 text-gray-700">
            Stay organized and keep track of all your application deadlines with our checklist tool.
          </p>
        </div>
        <div className="w-1/2 order-1">
          <img
            src="/assets/checklist.png" // Replace with a relevant image
            alt="Track Deadlines"
            className="rounded-lg transform transition-all hover:scale-110 hover:-rotate-3 duration-500 ease-in-out hover:shadow-xl"
          />
        </div>
      </div>

      {/* Feature 3: Discover Major */}
      <div
        className={`flex items-center justify-between p-16 mt-20 bg-opacity-20 bg-white rounded-lg shadow-lg transform transition-all ${
          isLoaded ? "scale-100 rotate-0" : "scale-90 rotate-5"
        }`}
      >
        <div className="w-1/2">
          <h2 className="text-4xl font-extrabold mb-6 text-gray-800">Discover Your Major</h2>
          <p className="text-xl mb-6 text-gray-700">
            Explore your interests and find extracurriculars and essay topics tailored to your major.
          </p>
        </div>
        <div className="w-1/2">
          <img
            src="/assets/major.png"
            alt="Discover Major"
            className="rounded-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:rotate-3"
          />
        </div>
      </div>

      {/* Feature 4: Essay Examples */}
      <div
        className={`flex items-center justify-between p-16 mt-20 bg-opacity-20 bg-white rounded-lg shadow-lg transform transition-all ${
          isLoaded ? "scale-100 rotate-0" : "scale-90 rotate-5"
        }`}
      >
        <div className="w-1/2 order-2 p-5">
          <h2 className="text-4xl font-extrabold mb-6 text-gray-800">Essay Examples</h2>
          <p className="text-xl mb-6 text-gray-700">
            Get inspired by successful essays from students who got into top universities.
          </p>
        </div>
        <div className="w-1/2 order-1">
          <img
            src="/assets/essays.png"
            alt="Essay Examples"
            className="rounded-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:-rotate-3"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
