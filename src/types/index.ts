export interface Place {
  id: string;
  name: string;
  category: 'Hotel' | 'Resort' | 'Restaurant' | 'Cafe';
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  phone: string;
  description: string;
  rating: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  imageUrl: string;
  amenities: string[];
  availability: 'Open' | 'Closed' | 'Busy';
  createdAt?: any;
  updatedAt?: any;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  phone?: string;
  favorites: string[];
  createdAt?: any;
}

export interface FilterOptions {
  category: Place['category'] | 'All';
  priceRange: Place['priceRange'] | 'All';
  availability: Place['availability'] | 'All';
  rating: number;
  amenities: string[];
  maxDistance: number;
  sortBy: 'rating' | 'distance' | 'price' | 'name';
  sortOrder: 'asc' | 'desc';
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  type: Place['category'];
  color: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
}
