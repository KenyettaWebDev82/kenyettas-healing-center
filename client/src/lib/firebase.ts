import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "healing-center-demo"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "healing-center-demo",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "healing-center-demo"}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

// Authentication functions
export const signInWithGoogle = () => {
  return signInWithRedirect(auth, provider);
};

export const handleRedirect = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      // Create user document if it doesn't exist
      await createUserDocument(user);
      return user;
    }
  } catch (error) {
    console.error("Error handling redirect:", error);
    throw error;
  }
};

export const signOutUser = () => {
  return signOut(auth);
};

export const onAuthStateChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions
export const createUserDocument = async (user: any) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
      lastSignIn: new Date(),
      moodEntries: [],
      chakraTestResults: [],
      meditationSessions: [],
      preferences: {
        notifications: true,
        dailyReminders: true
      }
    };
    
    await updateDoc(userRef, userData);
  } else {
    // Update last sign in
    await updateDoc(userRef, { lastSignIn: new Date() });
  }
};

export const addMoodEntry = async (userId: string, mood: number, note?: string) => {
  const moodEntry = {
    userId,
    mood,
    note: note || "",
    timestamp: new Date(),
    date: new Date().toISOString().split('T')[0]
  };
  
  return await addDoc(collection(db, 'moodEntries'), moodEntry);
};

export const getMoodEntries = async (userId: string, days: number = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const q = query(
    collection(db, 'moodEntries'),
    where('userId', '==', userId),
    where('timestamp', '>=', startDate),
    orderBy('timestamp', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const saveChakraTestResults = async (userId: string, results: any) => {
  const testResult = {
    userId,
    results,
    timestamp: new Date(),
    date: new Date().toISOString().split('T')[0]
  };
  
  return await addDoc(collection(db, 'chakraTests'), testResult);
};

export const getLatestChakraTest = async (userId: string) => {
  const q = query(
    collection(db, 'chakraTests'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(1)
  );
  
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  }
  return null;
};

export const addMeditationSession = async (userId: string, sessionData: any) => {
  const session = {
    userId,
    ...sessionData,
    timestamp: new Date(),
    date: new Date().toISOString().split('T')[0]
  };
  
  return await addDoc(collection(db, 'meditationSessions'), session);
};

export const getMeditationSessions = async (userId: string) => {
  const q = query(
    collection(db, 'meditationSessions'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
