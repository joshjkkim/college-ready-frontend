import { 
  initializeApp 
} from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect,
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqsD0f9AV20lJkT1QDBHIFchFKSImYzqw",
  authDomain: "auth.collegeready.me",
  projectId: "collegeprep-6d519",
  storageBucket: "collegeprep-6d519.firebasestorage.app",
  messagingSenderId: "695212357545",
  appId: "1:695212357545:web:13a1b5687830993e97f6b8",
  measurementId: "G-ZR8ZW41CFF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    if (window.innerWidth <= 768) {
      // Use Redirect for Mobile (Fixes Google Secure Browser Policy)
      const result = await signInWithRedirect(auth, provider);
      return result.user;
    } else {
      // Use Popup for Desktop
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in:", result.user);
      return result.user;
    }
  } catch (error) {
    console.error("Error signing in with Google:", error.message);
    throw error;
  }
};

export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Send verification email after successful sign-up
    await sendEmailVerification(user);
    console.log("User signed up:", user, "Verification email sent.");
    return user;
  } catch (error) {
    console.error("Error signing up:", error.message);
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error.message);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out:", error.message);
  }
};

export { auth, provider };
