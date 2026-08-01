import { collection, doc, getDoc, getDocs, query, where, orderBy, limit, startAfter, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Place } from '../types';

const PLACES_COLLECTION = 'places';

const convertDoc = (docSnapshot: QueryDocumentSnapshot): Place => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id, name: data.name || '', category: data.category || 'Hotel', address: data.address || '',
    city: data.city || '', state: data.state || '', latitude: data.latitude || 0, longitude: data.longitude || 0,
    phone: data.phone || '', description: data.description || '', rating: data.rating || 0,
    priceRange: data.priceRange || '$', imageUrl: data.imageUrl || '', amenities: data.amenities || [],
    availability: data.availability || 'Open', createdAt: data.createdAt, updatedAt: data.updatedAt,
  };
};

export const getPlaces = async (pageSize: number = 20, lastDoc?: DocumentSnapshot): Promise<{ places: Place[]; lastVisible: DocumentSnapshot | null }> => {
  const q = lastDoc ? query(collection(db, PLACES_COLLECTION), orderBy('name'), startAfter(lastDoc), limit(pageSize)) : query(collection(db, PLACES_COLLECTION), orderBy('name'), limit(pageSize));
  const snapshot = await getDocs(q);
  return { places: snapshot.docs.map(convertDoc), lastVisible: snapshot.docs[snapshot.docs.length - 1] || null };
};

export const getPlaceById = async (id: string): Promise<Place | null> => {
  const docRef = doc(db, PLACES_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return convertDoc(docSnap as QueryDocumentSnapshot);
};
