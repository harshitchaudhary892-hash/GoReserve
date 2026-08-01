import { useState, useEffect, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { LocationCoords } from '../types';
import { useAppState } from '../contexts/AppStateContext';

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentLocation } = useAppState();

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('Location permission denied');
        Alert.alert(
          'Location Required',
          'Please enable location services to find nearby places.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    } catch (err) {
      setError('Failed to request location permission');
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLoading(false);
        return null;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation(loc);

      const coords: LocationCoords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      setCurrentLocation(coords);
      setLoading(false);
      return coords;
    } catch (err) {
      setError('Failed to get location');
      setLoading(false);
      return null;
    }
  }, [requestLocationPermission, setCurrentLocation]);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    requestLocationPermission,
  };
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
