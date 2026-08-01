import { CategoryItem } from '../types';

export const CATEGORIES: CategoryItem[] = [
  {
    id: '1',
    name: 'Hotels',
    icon: 'hotel',
    type: 'Hotel',
    color: '#7B1FA2',
  },
  {
    id: '2',
    name: 'Resorts',
    icon: 'beach-access',
    type: 'Resort',
    color: '#00838F',
  },
  {
    id: '3',
    name: 'Restaurants',
    icon: 'restaurant',
    type: 'Restaurant',
    color: '#E64A19',
  },
  {
    id: '4',
    name: 'Cafes',
    icon: 'local-cafe',
    type: 'Cafe',
    color: '#6D4C41',
  },
];

export const SORT_OPTIONS = [
  { label: 'Rating (High to Low)', value: 'rating', order: 'desc' as const },
  { label: 'Rating (Low to High)', value: 'rating', order: 'asc' as const },
  { label: 'Distance (Nearest)', value: 'distance', order: 'asc' as const },
  { label: 'Price (Low to High)', value: 'price', order: 'asc' as const },
  { label: 'Price (High to Low)', value: 'price', order: 'desc' as const },
  { label: 'Name (A-Z)', value: 'name', order: 'asc' as const },
];

export const PRICE_RANGES = ['$', '$$', '$$$', '$$$$'] as const;
export const AVAILABILITY_OPTIONS = ['Open', 'Closed', 'Busy'] as const;

export const AMENITY_OPTIONS = [
  'WiFi',
  'Parking',
  'Pool',
  'Gym',
  'Spa',
  'Restaurant',
  'Bar',
  'Pet Friendly',
  'Air Conditioning',
  'Room Service',
  'Laundry',
  'Breakfast',
];
