import React, { useState, useEffect } from 'react';
import { auth } from "../firebase.js";
import { 
  updateProfile, 
  sendPasswordResetEmail, 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from "firebase/auth";
import Calendar from '../components/Calendar.js';
import LoadingScreen from '../components/LoadingScreen.js'; 
import Notes from '../components/Notes.js';
import { Helmet } from 'react-helmet';
import SEO from '../components/SEO.js';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  
  // Account Settings states
  const [newDisplayName, setNewDisplayName] = useState("");
  const [displayNameMessage, setDisplayNameMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [resetPasswordMessage, setResetPasswordMessage] = useState("");
  const [resetDisabled, setResetDisabled] = useState(false);

  const getUserId = () => {
    const user = auth.currentUser;
    return user ? user.uid : null;
  };

  const userId = getUserId();

  const fetchUserInfo = () => {
    const user = auth.currentUser;
    if (user) {
      setUserInfo({
        name: user.displayName || 'No Name Provided',
        email: user.email,
        photoURL: user.photoURL || '/assets/search.png',
      });
      setNewDisplayName(user.displayName || "");
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [userId]);

  // Update Display Name Functionality
  const handleDisplayNameUpdate = async (e) => {
    e.preventDefault();
    setDisplayNameMessage("");
    try {
      await updateProfile(auth.currentUser, { displayName: newDisplayName });
      setDisplayNameMessage("Display name updated successfully!");
      fetchUserInfo();
    } catch (error) {
      setDisplayNameMessage("Error updating display name: " + error.message);
    }
  };

  // Update Password with reauthentication
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage("");
    try {
      const user = auth.currentUser;
      // Reauthenticate using the current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      // Update the password
      await updatePassword(user, newPassword);
      setPasswordMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      setPasswordMessage("Error updating password: " + error.message);
    }
  };

  // Send Password Reset Email
  const handleResetPassword = async () => {
    setResetPasswordMessage("");
    if (resetDisabled) return; // Prevent further execution if already disabled
    setResetDisabled(true);
    try {
      await sendPasswordResetEmail(auth, userInfo.email);
      setResetPasswordMessage("Password reset email sent. Check your inbox.");
    } catch (error) {
      setResetPasswordMessage("Error sending password reset email: " + error.message);
    }
    // Re-enable the button after 60 seconds
    setTimeout(() => {
      setResetDisabled(false);
    }, 60000);
  };

  return (
    <div className="profile-container max-w-4xl mx-auto p-4">
      <SEO />
      <Helmet>
        <title>College Ready - Your Profile</title>
        <meta
          name="description"
          content="Manage your profile on College Ready: update your display name, change your password, reset your password, and view your calendar and notes."
        />
        <meta property="og:title" content="College Ready - Your Profile" />
        <meta
          property="og:description"
          content="Manage your account settings, view your calendar, and take notes—all from your College Ready profile."
        />
        <meta property="og:url" content="https://www.collegeready.me/profile" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="College Ready - Your Profile" />
        <meta
          name="twitter:description"
          content="Update your display name, change your password, and manage your profile on College Ready."
        />
      </Helmet>
      {loading && <LoadingScreen />}
      <h1 className="text-4xl font-bold text-center mb-8 shadow-lg rounded-lg p-4 bg-white">
        Your Profile
      </h1>

      <div className="user-info bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Information</h2>
        {userInfo ? (
          <div className="flex items-center">
            <img
              src={userInfo.photoURL}
              alt="Profile"
              className="w-20 h-20 rounded-full mr-6 border"
            />
            <div>
              <h3 className="text-xl font-bold">{userInfo.name}</h3>
              <p className="text-gray-600">{userInfo.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading user information...</p>
        )}
      </div>

      <div className="flex justify-center mb-8">
        <button 
          onClick={() => setShowAccountSettings(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow transition-colors"
        >
          Account Settings
        </button>
      </div>

      {showAccountSettings && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-30">
          <div className="bg-white rounded-xl p-8 shadow-xl max-w-md w-full relative">
            <button 
              onClick={() => setShowAccountSettings(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              &#10005;
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-center">Account Settings</h2>

            {/* Update Display Name */}
            <form onSubmit={handleDisplayNameUpdate} className="mb-6 space-y-4">
              <label className="block text-gray-700">
                <span className="font-medium">Display Name</span>
                <input
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  required
                />
              </label>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors"
              >
                Update Name
              </button>
              {displayNameMessage && (
                <p className="text-sm text-green-700">{displayNameMessage}</p>
              )}
            </form>

            {/* Update Password */}
            <form onSubmit={handleUpdatePassword} className="mb-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Change Password</h3>
              <input
                type="password"
                placeholder="Current Password"
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
              >
                Update Password
              </button>
              {passwordMessage && (
                <p className="text-sm text-green-700">{passwordMessage}</p>
              )}
            </form>

            {/* Password Reset */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Forgot your current password?</h3>
              <button
                onClick={handleResetPassword}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded transition-colors"
                disabled={resetDisabled}
              >
                {resetDisabled ? "Please wait..." : "Send Password Reset Email"}
              </button> 
              {resetPasswordMessage && (
                <p className="text-sm text-green-700 mt-2">{resetPasswordMessage}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <Calendar 
        userId={userId} 
        loading={loading} 
        setLoading={setLoading} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <Notes userId={userId} />
    </div>
  );
};

export default ProfilePage;
