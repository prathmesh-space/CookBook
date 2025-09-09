import { createContext, useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, 
         createUserWithEmailAndPassword, signOut, updateProfile, 
         GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { firebaseApp } from "../firebase/firebaseConfig";

const AuthContext = createContext();
const auth = getAuth(firebaseApp); // ✅ always use getAuth

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Track user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Login with email
  const loginUser = async ({ email, password }) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
    setLoading(false);
  };

  // Register new user
  const registerUser = async ({ email, password1, name }) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password1);
      await updateProfile(userCredential.user, { displayName: name });
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
    }
    setLoading(false);
  };

  // Logout
  const logoutUser = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Google sign-in
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("Google Sign-in Error:", error);
    }
  };

  const contextData = {
    user,
    loginUser,
    logoutUser,
    registerUser,
    signInWithGoogle,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
