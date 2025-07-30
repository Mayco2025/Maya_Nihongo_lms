import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { User } from '../types';
import { initializeFirebase, authenticateUser, getAppId, MOCK_SCHEDULE, MOCK_MATERIALS } from '../utils/firebase';
import { isDemoMode, DEMO_USER } from '../utils/demoMode';

export const useFirebase = () => {
  const [db, setDb] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Check if we're in demo mode
    if (isDemoMode()) {
      console.log("Running in demo mode - Firebase not configured");
      setUser(DEMO_USER);
      setTimeout(() => setIsAuthReady(true), 1500);
      return;
    }

    try {
      const { app, authInstance, dbInstance } = initializeFirebase();
      setAuth(authInstance);
      setDb(dbInstance);

      const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
        if (currentUser) {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email || undefined,
            displayName: currentUser.displayName || undefined,
            role: 'student', // Default role, will be updated from database
            createdAt: new Date(),
            lastLoginAt: new Date()
          });
        } else {
          try {
            await authenticateUser(authInstance);
          } catch (error) {
            console.error("Authentication failed:", error);
          }
        }
        // Add a small delay to show the beautiful login screen
        setTimeout(() => setIsAuthReady(true), 1500);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      // Fallback to demo mode if Firebase fails
      setUser(DEMO_USER);
      setTimeout(() => setIsAuthReady(true), 1500);
    }
  }, []);

  // Data seeding effect
  useEffect(() => {
    if (db && user) {
      const seedData = async () => {
        const appId = getAppId();
        const scheduleRef = collection(db, `artifacts/${appId}/public/data/schedule`);
        const scheduleSnapshot = await getDocs(scheduleRef);
        
        if (scheduleSnapshot.empty) {
          console.log("Seeding schedule data...");
          for (const classItem of MOCK_SCHEDULE) {
            await setDoc(doc(scheduleRef, classItem.id), classItem);
          }
        }

        const materialsRef = collection(db, `artifacts/${appId}/public/data/materials`);
        const materialsSnapshot = await getDocs(materialsRef);
        
        if (materialsSnapshot.empty) {
          console.log("Seeding materials data...");
          for (const material of MOCK_MATERIALS) {
            await setDoc(doc(materialsRef, material.id), material);
          }
        }
      };
      
      seedData();
    }
  }, [db, user]);

  return { db, auth, user, isAuthReady };
}; 