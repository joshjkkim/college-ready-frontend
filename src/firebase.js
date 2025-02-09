import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqsD0f9AV20lJkT1QDBHIFchFKSImYzqw",
  authDomain: "collegeprep-6d519.firebaseapp.com",
  projectId: "collegeprep-6d519",
  storageBucket: "collegeprep-6d519.firebasestorage.app",
  messagingSenderId: "695212357545",
  appId: "1:695212357545:web:13a1b5687830993e97f6b8",
  measurementId: "G-ZR8ZW41CFF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Authentication instance
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Sign-in with Google function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User signed in:", user);
    return user;
  } catch (error) {
    console.error("Error signing in:", error.message);
    return null;
  }
};

// Sign out function
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out:", error.message);
  }
};

export { auth, provider };
