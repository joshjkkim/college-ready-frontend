import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth"; // To track authentication state
import { auth } from "./firebase"; // Import auth for auth state changes
import HomePage from "./pages/HomePage"; // HomePage component
import LoginPage from "./pages/LoginPage"; // LoginPage component
import UserPage from "./User/UserPage"; // Protected UserPage
import SearchPage from "./Search/SearchPage"; // Protected UserPage
import EssayPage from "./Essays/EssayPage"; // Protected UserPage
import ProfilePage from "./Me/Profile";
import Header from "./components/Header"; // Import Header

const App = () => {
  const [user, setUser] = useState(null); // Store the current user
  const [isLoaded, setIsLoaded] = useState(false); // State to track when the app has loaded

  // Check if the user is logged in on page load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    // Simulate delay to trigger load animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500); // Delay of 500ms to let the animation trigger

    return () => {
      unsubscribe(); // Clean up the listener when the component unmounts
      clearTimeout(timer); // Cleanup the timer
    };
  }, []);

  return (
    <Router>
      <Header isLoaded={isLoaded} /> {/* Pass the isLoaded state to the Header */}
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Home Page (Landing Page) */}
          <Route path="/" element={<HomePage user={user} />} />

          {/* Login Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Pages */}
          <Route path="/search" element={user ? <SearchPage /> : <Navigate to="/" />} />
          <Route path="/user" element={user ? <UserPage /> : <Navigate to="/" />} />
          <Route path="/essays" element={user ? <EssayPage /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
