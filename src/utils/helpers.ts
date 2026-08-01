import { Place } from '../types';
import { calculateDistance } from '../hooks/useLocation';

export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  return phone;
};

export const sortPlaces = (places: Place[], sortBy: string, order: 'asc' | 'desc', userLat?: number, userLon?: number): Place[] => {
  const sorted = [...places];
  sorted.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'rating': comparison = a.rating - b.rating; break;
      case 'price': const priceOrder = { '$': 1, '$$': 2, '$$$': 3, '$$$$': 4 }; comparison = (priceOrder[a.priceRange] || 0) - (priceOrder[b.priceRange] || 0); break;
      case 'name': comparison = a.name.localeCompare(b.name); break;
      case 'distance': if (userLat !== undefined && userLon !== undefined) { comparison = calculateDistance(userLat, userLon, a.latitude, a.longitude) - calculateDistance(userLat, userLon, b.latitude, b.longitude); } break;
    }
    return order === 'desc' ? -comparison : comparison;
  });
  return sorted;
};

export const filterPlaces = (places: Place[], filters: { category?: string; priceRange?: string; availability?: string; minRating?: number; amenities?: string[]; maxDistance?: number; userLat?: number; userLon?: number; }): Place[] => {
  return places.filter((place) => {
    if (filters.category && filters.category !== 'All' && place.category !== filters.category) return false;
    if (filters.priceRange && filters.priceRange !== 'All' && place.priceRange !== filters.priceRange) return false;
    if (filters.availability && filters.availability !== 'All' && place.availability !== filters.availability) return false;
    if (filters.minRating && place.rating < filters.minRating) return false;
    if (filters.amenities && filters.amenities.length > 0 && !filters.amenities.every((a) => place.amenities.includes(a))) return false;
    if (filters.maxDistance && filters.maxDistance > 0 && filters.userLat !== undefined && filters.userLon !== undefined) { if (calculateDistance(filters.userLat, filters.userLon, place.latitude, place.longitude) > filters.maxDistance) return false; }
    return true;
  });
};

export const getInitials = (name: string): string => {
  if (!name) return '?';
  return name.split(' ').map((part) => part.charAt(0).toUpperCase()).join('').slice(0, 2);
};
