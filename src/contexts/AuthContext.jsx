import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { verifyAdminCredentials } from '../services/adminService';
import { 
  signInWithPopup,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

import { AuthContext } from './AuthContextInstance';

export function AuthProvider({ children }) {
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

  // Update User Profile Name
  const updateName = async (newName) => {
    if (!auth.currentUser) throw new Error("No user authenticated");
    
    // 1. Update Firebase Auth Profile (Primary for UI)
    await updateProfile(auth.currentUser, { displayName: newName });
    
    // 2. Update Firestore User Document (Best-effort sync)
    // We try multiple paths based on established patterns in the codebase
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, { name: newName, email: auth.currentUser.email }, { merge: true });
    } catch (e) {
      console.warn("Firestore 'users' sync skipped (permissions):", e.message);
    }

    try {
      if (auth.currentUser.email) {
        const dataRef = doc(db, 'user_data', auth.currentUser.email);
        await setDoc(dataRef, { profileName: newName }, { merge: true });
      }
    } catch (e) {
      console.warn("Firestore 'user_data' sync skipped:", e.message);
    }
    
    // 3. Refresh local state
    setCurrentUser({ ...auth.currentUser, displayName: newName });
  };

  // Dedicated Admin Portal Auth (Gatekeeper)
  const adminLogin = async (email, password) => {
    try {
      // 1. Verify credentials against the special config doc (Gatekeeper)
      const result = await verifyAdminCredentials(email, password);
      
      if (result.success) {
        // 2. IMPORTANT: Synchronize with Firebase Auth to satisfy Firestore Security Rules
        // The admin must be a valid Firebase Auth user for the 'isAdmin()' rule to work.
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (authError) {
          console.warn("Firebase Auth sync skipped or failed during admin login:", authError.message);
          // We continue because verifyAdminCredentials already succeeded for the UI,
          // but Firestore operations might fail if the user doesn't exist in Auth.
        }

        setAdminAuth(result.profile);
        sessionStorage.setItem('growlity_admin_session', 'active');
        sessionStorage.setItem('growlity_admin_profile', JSON.stringify(result.profile));
      }
      return result;
    } catch (e) {
      console.error("Admin login process error:", e);
      return { success: false, message: "Internal authentication error." };
    }
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
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsAdmin(isEmailAdmin || (userData?.role === 'Platform ESG Admin' || userData?.role === 'admin'));
          } else {
            // No document exists, just use email check
            setIsAdmin(isEmailAdmin);
          }
        } catch (e) {
          // If permission is denied, fallback to email check silently or with informative error
          if (e.code === 'permission-denied') {
            console.debug("Firestore role fetch: Permission denied. Ensure 'users' collection rules permit read.");
          } else {
            console.error("Firestore role fetch error:", e);
          }
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
    loading,
    login,
    signup,
    logout,
    updateName,
    googleSignIn,
    adminLogin,
    adminLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
