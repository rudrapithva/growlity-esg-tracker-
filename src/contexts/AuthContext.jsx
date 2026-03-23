import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminAuth, setAdminAuth] = useState(() => {
    // Check session storage for administrative session and profile
    const isActive = sessionStorage.getItem('growlity_admin_session') === 'active';
    if (isActive) {
      try {
        return JSON.parse(sessionStorage.getItem('growlity_admin_profile'));
      } catch (e) {
        return true; // Fallback to truthy if profile is corrupted
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Email/Password Signup
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Email/Password Login
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Sign-In
  const googleSignIn = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  // Dedicated Admin Portal Auth (Gatekeeper)
  const adminLogin = async (email, password) => {
    const { verifyAdminCredentials } = await import('../services/adminService');
    const result = await verifyAdminCredentials(email, password);
    if (result.success) {
      setAdminAuth(result.profile);
      sessionStorage.setItem('growlity_admin_session', 'active');
      sessionStorage.setItem('growlity_admin_profile', JSON.stringify(result.profile));
    }
    return result;
  };

  const adminLogout = () => {
    setAdminAuth(null);
    sessionStorage.removeItem('growlity_admin_session');
    sessionStorage.removeItem('growlity_admin_profile');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Simple Admin Check (Email or Firestore Role)
        const isEmailAdmin = user.email && (user.email.toLowerCase() === 'admin@growlity.com' || user.email.toLowerCase().includes('admin'));
        
        try {
          // Check Firestore for explicit role
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          setIsAdmin(isEmailAdmin || (userData?.role === 'Platform ESG Admin' || userData?.role === 'admin'));
        } catch (e) {
          console.warn("Could not fetch user role from Firestore, falling back to email check.");
          setIsAdmin(isEmailAdmin);
        }
      } else {
        setIsAdmin(false);
      }
      
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    adminAuth,
    login,
    signup,
    logout,
    googleSignIn,
    adminLogin,
    adminLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
