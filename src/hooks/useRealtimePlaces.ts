import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Place } from '../types';

export const useRealtimePlaces = (limitCount: number = 50) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const placesQuery = query(
      collection(db, 'places'),
      orderBy('name')
    );

    const unsubscribe = onSnapshot(
      placesQuery,
      (snapshot) => {
        const placeList: Place[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          placeList.push({
            id: doc.id,
            name: data.name || '',
            category: data.category || 'Hotel',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            latitude: data.latitude || 0,
            longitude: data.longitude || 0,
            phone: data.phone || '',
            description: data.description || '',
            rating: data.rating || 0,
            priceRange: data.priceRange || '$',
            imageUrl: data.imageUrl || '',
            amenities: data.amenities || [],
            availability: data.availability || 'Open',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        });
        setPlaces(placeList.slice(0, limitCount));
        setLoading(false);
      },
      (err) => {
        console.error('Firestore listener error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limitCount]);

  return { places, loading, error };
};
