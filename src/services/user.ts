import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile } from '../types';

const USERS_COLLECTION = 'users';

export const createUserProfile = async (
  uid: string,
  data: { displayName: string; email: string; photoURL?: string }
): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(userRef, {
      ...data,
      favorites: [],
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) return null;
    return { uid, ...docSnap.data() } as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, { ...data });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const addToFavorites = async (uid: string, placeId: string): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, { favorites: arrayUnion(placeId) });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (uid: string, placeId: string): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, { favorites: arrayRemove(placeId) });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const getFavoritePlaces = async (favoriteIds: string[]): Promise<any[]> => {
  try {
    if (favoriteIds.length === 0) return [];
    const { getPlaceById } = await import('./places');
    const promises = favoriteIds.map((id) => getPlaceById(id));
    const results = await Promise.all(promises);
    return results.filter((p) => p !== null);
  } catch (error) {
    console.error('Error getting favorite places:', error);
    throw error;
  }
};
