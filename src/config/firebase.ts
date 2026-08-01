import { initializeApp } from 'firebase/app';
import { 
  initializeAuth,
  inMemoryPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBxfgkAJDI0wcKzcUI5-VlPfvXtE6uE2p8",
  authDomain: "go-reserve-73fec.firebaseapp.com",
  projectId: "go-reserve-73fec",
  storageBucket: "go-reserve-73fec.firebasestorage.app",
  messagingSenderId: "667126214623",
  appId: "1:667126214623:web:cb3f486897842020acde6a",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: inMemoryPersistence,
});

const db = getFirestore(app);
const storage = getStorage(app);

export {
  app,
  auth,
  db,
  storage,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
};

export type FirebaseUser = User;
