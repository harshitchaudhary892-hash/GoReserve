import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Place } from '../../types';
import { COLORS, SIZES, SPACING, RADIUS, SHADOWS } from '../../config/theme';
import { RatingBadge } from '../common/RatingBadge';
import { PriceRangeBadge } from '../common/PriceRangeBadge';
import { AvailabilityBadge } from '../common/AvailabilityBadge';
import { useAuth } from '../../contexts/AuthContext';
import { addToFavorites, removeFromFavorites } from '../../services/user';
import { useAppState } from '../../contexts/AppStateContext';
import { calculateDistance } from '../../hooks/useLocation';

const { width: screenWidth } = Dimensions.get('window');
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';

interface PlaceCardProps { place: Place; variant?: 'horizontal' | 'vertical'; showDistance?: boolean; }

export const PlaceCard: React.FC<PlaceCardProps> = memo(({ place, variant = 'horizontal', showDistance = true }) => {
  const navigation = useNavigation<any>();
  const { user, userProfile, refreshUserProfile } = useAuth();
  const { currentLocation } = useAppState();
  const isFavorite = userProfile?.favorites?.includes(place.id) ?? false;
  const distance = currentLocation ? calculateDistance(currentLocation.latitude, currentLocation.longitude, place.latitude, place.longitude) : null;

  const handlePress = useCallback(() => { navigation.navigate('PlaceDetails', { placeId: place.id, place }); }, [navigation, place]);

  const handleFavoriteToggle = useCallback(async () => {
    if (!user) return;
    try { if (isFavorite) { await removeFromFavorites(user.uid, place.id); } else { await addToFavorites(user.uid, place.id); } await refreshUserProfile(); } catch (error) { console.error('Error toggling favorite:', error); }
  }, [user, isFavorite, place.id]);

  if (variant === 'vertical') {
    return (
      <TouchableOpacity style={styles.verticalContainer} onPress={handlePress} activeOpacity={0.85}>
        <View style={styles.verticalImageContainer}>
          <Image source={{ uri: place.imageUrl || PLACEHOLDER_IMAGE }} style={styles.verticalImage} resizeMode="cover" />
          <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoriteToggle}><Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={22} color={isFavorite ? COLORS.heart : COLORS.white} /></TouchableOpacity>
          <View style={styles.verticalRatingBadge}><RatingBadge rating={place.rating} size="medium" /></View>
        </View>
        <View style={styles.verticalContent}>
          <Text style={styles.name} numberOfLines={1}>{place.name}</Text>
          <View style={styles.verticalInfo}><Text style={styles.address} numberOfLines={1}>{place.city}, {place.state}</Text>{distance !== null && showDistance && <Text style={styles.distance}>{distance.toFixed(1)} km</Text>}</View>
          <View style={styles.badges}><PriceRangeBadge priceRange={place.priceRange} /><AvailabilityBadge availability={place.availability} /></View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.horizontalContainer} onPress={handlePress} activeOpacity={0.85}>
      <Image source={{ uri: place.imageUrl || PLACEHOLDER_IMAGE }} style={styles.horizontalImage} resizeMode="cover" />
      <View style={styles.horizontalContent}>
        <View style={styles.horizontalHeader}><Text style={styles.name} numberOfLines={1}>{place.name}</Text>
          <TouchableOpacity onPress={handleFavoriteToggle}><Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={20} color={isFavorite ? COLORS.heart : COLORS.textLight} /></TouchableOpacity>
        </View>
        <Text style={styles.address} numberOfLines={1}><Ionicons name="location-outline" size={12} color={COLORS.textSecondary} /> {place.address}</Text>
        <View style={styles.horizontalInfo}><RatingBadge rating={place.rating} size="small" /><PriceRangeBadge priceRange={place.priceRange} size="small" /><AvailabilityBadge availability={place.availability} size="small" />{distance !== null && showDistance && <Text style={styles.distanceText}>{distance.toFixed(1)} km</Text>}</View>
        {place.amenities && place.amenities.length > 0 && <Text style={styles.amenitiesText} numberOfLines={1}>{place.amenities.slice(0, 3).join(' • ')}</Text>}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  horizontalContainer: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, marginHorizontal: SPACING.base, marginVertical: SPACING.xs, ...SHADOWS.medium, overflow: 'hidden' },
  horizontalImage: { width: 120, height: 120 },
  horizontalContent: { flex: 1, padding: SPACING.md, justifyContent: 'space-between' },
  horizontalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  horizontalInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  amenitiesText: { fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  distanceText: { fontSize: SIZES.xs, color: COLORS.secondary, fontWeight: '600' },
  verticalContainer: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, width: screenWidth * 0.45, marginRight: SPACING.md, ...SHADOWS.medium, overflow: 'hidden' },
  verticalImageContainer: { position: 'relative' },
  verticalImage: { width: '100%', height: 140 },
  verticalContent: { padding: SPACING.md },
  verticalInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  favoriteButton: { position: 'absolute', top: 8, right: 8, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  verticalRatingBadge: { position: 'absolute', bottom: 8, left: 8 },
  name: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.text, flex: 1 },
  address: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  distance: { fontSize: SIZES.xs, color: COLORS.secondary, fontWeight: '600' },
  badges: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
});
