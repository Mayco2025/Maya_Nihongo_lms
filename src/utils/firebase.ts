import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FirebaseConfig } from '../types';

// Helper: Get App ID and Firebase Config
export const getAppId = (): string => {
  return process.env.REACT_APP_APP_ID || 'default-japanese-school';
};

export const getFirebaseConfig = (): FirebaseConfig => {
  // Try to get config from environment variables first
  const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };

  // If we have the required fields, return the config
  if (config.apiKey && config.authDomain && config.projectId) {
    return config as FirebaseConfig;
  }

  // Fallback to global variables if they exist
  if (typeof window !== 'undefined' && window.__firebase_config) {
    return JSON.parse(window.__firebase_config);
  }
  
  if (typeof __firebase_config !== 'undefined') {
    return JSON.parse(__firebase_config);
  }

  // Return empty config if nothing is available
  return {} as FirebaseConfig;
};

export const initializeFirebase = () => {
  const firebaseConfig = getFirebaseConfig();
  
  if (Object.keys(firebaseConfig).length === 0) {
    throw new Error('Firebase configuration is not available');
  }

  const app = initializeApp(firebaseConfig);
  const authInstance = getAuth(app);
  const dbInstance = getFirestore(app);

  return { app, authInstance, dbInstance };
};

export const authenticateUser = async (auth: any) => {
  try {
    // Try to get token from environment variable first
    const initialAuthToken = process.env.REACT_APP_INITIAL_AUTH_TOKEN;
    
    if (initialAuthToken) {
      await signInWithCustomToken(auth, initialAuthToken);
    } else if (typeof window !== 'undefined' && window.__initial_auth_token) {
      // Fallback to global variable if it exists
      await signInWithCustomToken(auth, window.__initial_auth_token);
    } else if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      // Fallback to global variable if it exists
      await signInWithCustomToken(auth, __initial_auth_token);
    } else {
      // Default to anonymous authentication
      await signInAnonymously(auth);
    }
  } catch (error) {
    console.error("Authentication failed:", error);
    // Fallback to anonymous auth if custom token fails
    try {
      await signInAnonymously(auth);
    } catch (fallbackError) {
      console.error("Anonymous authentication also failed:", fallbackError);
      throw fallbackError;
    }
  }
};

// Mock data for seeding
export const MOCK_SCHEDULE = [
  { 
    id: 'class1', 
    name: 'N5 Grammar - Lesson 1', 
    teacher: 'Tanaka Sensei', 
    dateTime: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), 
    zoomLink: '#', 
    duration: 60 
  },
  { 
    id: 'class2', 
    name: 'N5 Vocabulary & Kanji', 
    teacher: 'Sato Sensei', 
    dateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), 
    zoomLink: '#', 
    duration: 60 
  },
  { 
    id: 'class3', 
    name: 'N5 Grammar - Lesson 2', 
    teacher: 'Tanaka Sensei', 
    dateTime: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(), 
    zoomLink: '#', 
    duration: 60 
  },
];

export const MOCK_MATERIALS = [
  { 
    id: 'mat1', 
    lessonName: 'Lesson 1: Greetings & Introductions', 
    classId: 'class1', 
    pptUrl: 'https://example.com/lesson1.ppt' 
  },
  { 
    id: 'mat2', 
    lessonName: 'Lesson 2: Particles は, が, も', 
    classId: 'class3', 
    pptUrl: 'https://example.com/lesson2.ppt' 
  },
]; 