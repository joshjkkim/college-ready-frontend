// LoginPage.js
import React from "react";
import { signInWithGoogle } from "../firebase"; // Import the sign-in function from firebase.js
import { useNavigate } from "react-router-dom"; // Hook for navigation

const LoginPage = () => {
  const navigate = useNavigate(); // Hook to navigate to other pages

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle(); // Handle sign-in
      navigate("/"); // Redirect to the user page after successful login
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center">
      <div className="text-center text-white p-8 rounded-lg max-w-lg mx-auto bg-opacity-80">
        <h1 className="text-4xl font-bold mb-4">Login to Continue</h1>
        <button
          onClick={handleLogin} // Trigger Google sign-in on click
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-full shadow-lg transition-all transform hover:scale-110 mt-4"
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
