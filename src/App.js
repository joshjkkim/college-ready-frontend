import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { getStaffRoles } from "./api/api"; // Assuming this returns { success, data }
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserPage from "./User/UserPage";
import EssayPage from "./Essays/EssayPage";
import ProfilePage from "./Me/Profile";
import Header from "./components/Header";
import AdminPage from "./pages/AdminPage";
import CollegeDashboard from "./Search/CollegeDashboard";
import AboutPage from "./About/AboutPage";

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Delay for load animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // Check the user's role once they are logged in
  useEffect(() => {
    if (user) {
      async function checkAdmin() {
        try {
          const { success, data } = await getStaffRoles(user.uid);
          setIsAdmin(success && data === "admin");
        } catch (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
        }
      }
      checkAdmin();
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  return (
    <Router>
      {/* Pass both isLoaded and isAdmin to the Header */}
      <Header isLoaded={isLoaded} isAdmin={isAdmin} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/search" element={user ? <CollegeDashboard /> : <Navigate to="/" />} />
          <Route path="/usercolleges" element={user ? <UserPage /> : <Navigate to="/" />} />
          <Route path="/essays" element={user ? <EssayPage /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
