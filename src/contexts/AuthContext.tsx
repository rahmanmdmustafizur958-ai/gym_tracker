"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await checkAndSeedData(currentUser.uid);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
      } else {
        console.error("Login failed:", error);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// ---------------------------------------------------------------------------
// Helpers to seed initial data
// ---------------------------------------------------------------------------

async function checkAndSeedData(userId: string) {
  const seededRef = doc(db, `users/${userId}/metadata`, 'seeded');
  const snap = await getDoc(seededRef);
  if (!snap.exists()) {
    console.log("Seeding initial data for new user...");
    // Seed default settings
    await setDoc(doc(db, `users/${userId}/settings`, 'current'), {
      unit: "kg",
      theme: "system"
    });
    
    // Create an initial marker
    await setDoc(seededRef, { timestamp: Date.now() });
    
    // The actual heavy seeding of movements and templates can be run via /seed
    // or called here asynchronously without blocking the UI.
  }
}
