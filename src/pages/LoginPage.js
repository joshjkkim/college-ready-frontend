import React, { useState } from "react";
import { signInWithGoogle, signUpWithEmail, signInWithEmail, signOutUser, auth } from "../firebase"; 
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom"; 
import { Helmet } from "react-helmet";
import SEO from "../components/SEO";
import ConstellationBackground from "../components/Constellation";

const LoginPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(""); // New state for username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [resetPasswordMessage, setResetPasswordMessage] = useState("");
  const [resetDisabled, setResetDisabled] = useState(false);
  const [showResetOption, setShowResetOption] = useState(false);

  const handleGoogleLogin = async () => {
    setError("");
    setVerificationMessage("");
    try {
      const user = await signInWithGoogle();
      if (user) navigate("/");
    } catch (err) {
      setError("Error signing in with Google. Please try again.");
      console.error("Error signing in with Google:", err);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    setVerificationMessage("");
    setShowResetOption(false);
    try {
      let user;
      if (isSignUp) {
        // Ensure the name field is not empty
        if (!name) {
          setError("Please enter your name.");
          return;
        }
        // Sign up new user and send a verification email
        user = await signUpWithEmail(email, password);
        if (user) {
          // Update user profile with displayName
          await updateProfile(user, { displayName: name });
          setVerificationMessage(
            "A verification email has been sent to your email address. Please check your inbox and click the link to verify your account before logging in."
          );
          // Optionally, sign out the user so that they cannot proceed until verified.
          await signOutUser();
        }
      } else {
        // Sign in existing user
        user = await signInWithEmail(email, password);
        if (user) {
          if (user.emailVerified) {
            setShowResetOption(false);
            navigate("/");
          } else {
            setError("Your email is not verified. Please verify your email before logging in.");
          }
        }
      }
    } catch (err) {
      console.error("Error during email authentication:", err);
      // Check for either wrong password or invalid credential errors
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError(err.message);
        setShowResetOption(true);
      } else {
        setError(err.message || "An error occurred. Please try again.");
        setShowResetOption(false);
      }
    }
  };

  const handleResetPassword = async () => {
    setResetPasswordMessage("");
    if (resetDisabled) return; // Prevent further execution if already disabled
    setResetDisabled(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetPasswordMessage("✅ Password reset email sent. Check your inbox.");
    } catch (error) {
      setResetPasswordMessage("❌ Error sending password reset email: " + error.message);
    }
    // Re-enable the button after 60 seconds
    setTimeout(() => {
      setResetDisabled(false);
    }, 60000);
  };

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-r from-purple-200 to-blue-200 overflow-hidden">
      <SEO />
      <Helmet>
        <title>College Ready - Login</title>
        <meta
          name="description"
          content="Sign in or sign up to College Ready to discover your perfect college, track deadlines, and stay on top of your dreams."
        />
        <meta property="og:title" content="College Ready - Login" />
        <meta
          property="og:description"
          content="Login or sign up to College Ready to find colleges, track deadlines, and get inspired."
        />
        <meta property="og:url" content="https://www.collegeready.me/login" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="College Ready - Login" />
        <meta
          name="twitter:description"
          content="Sign in or sign up to College Ready to find your college, track deadlines, and get inspired."
        />
      </Helmet>
      <div className="relative z-10">
        <div className="min-h-screen flex flex-col items-center justify-center text-center text-white drop-shadow-xl">
          <div className="fixed inset-0 w-full h-full pointer-events-none">
            <ConstellationBackground />
          </div>
          <div className="text-center text-white p-8 rounded-lg max-w-xl mx-auto bg-gradient-to-br from-indigo-900 to-blue-700">
            <h1 className="text-4xl font-bold mb-4 shadow-lg">
              {isSignUp ? "Sign Up" : "Login"} to Continue
            </h1>
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignUp && (
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-2 rounded text-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 rounded text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 rounded text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Only show the reset button if not in sign-up mode and if the wrong password error occurred */}
              {!isSignUp && showResetOption && (
                <div className="mb-4">
                  <button
                    onClick={handleResetPassword}
                    className="w-full focus:outline-none text-white"
                    disabled={resetDisabled}
                  >
                    <strong>
                      <u>{resetDisabled ? "Please wait..." : "Send Password Reset Email"}</u>
                    </strong>
                  </button>
                  {resetPasswordMessage && (
                    <p className="bg-white p-2 rounded-full text-sm font-bold text-black mt-2">
                      {resetPasswordMessage}
                    </p>
                  )}
                </div>
              )}
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-lg mt-2">
                  {error}
                </div>
              )}
              {verificationMessage && (
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg mt-2">
                  {verificationMessage}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-white text-blue-500 hover:bg-blue-500 hover:text-white font-bold text-lg px-6 py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
              >
                {isSignUp ? "Sign Up" : "Login"}
              </button>
            </form>
            <p className="mt-4 p-2 rounded-lg">
              Or{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                  setVerificationMessage("");
                  setShowResetOption(false);
                }}
                className="underline"
              >
                <strong>{isSignUp ? "Login with Email" : "Sign Up with Email"}</strong>
              </button>
            </p>
            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="bg-white p-2 rounded-full shadow-lg transition-all transform hover:scale-105"
              >
                <img src="/assets/google-logo.svg" alt="Google Logo" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
