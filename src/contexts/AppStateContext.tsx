import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FilterOptions, LocationCoords } from '../types';

interface AppStateContextType {
  currentLocation: LocationCoords | null;
  setCurrentLocation: (loc: LocationCoords | null) => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterOptions = {
  category: 'All',
  priceRange: 'All',
  availability: 'All',
  rating: 0,
  amenities: [],
  maxDistance: 0,
  sortBy: 'rating',
  sortOrder: 'desc',
};

const AppStateContext = createContext<AppStateContextType>({
  currentLocation: null,
  setCurrentLocation: () => {},
  filters: defaultFilters,
  setFilters: () => {},
  resetFilters: () => {},
});

export const useAppState = () => useContext(AppStateContext);

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <AppStateContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        filters,
        setFilters,
        resetFilters,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};
