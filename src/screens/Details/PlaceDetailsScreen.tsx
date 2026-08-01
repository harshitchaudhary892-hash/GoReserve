import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, Linking, Platform, Alert, Dimensions, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { COLORS, SIZES, SPACING, RADIUS, SHADOWS } from '../../config/theme';
import { Button } from '../../components/common/Button';
import { RatingBadge } from '../../components/common/RatingBadge';
import { PriceRangeBadge } from '../../components/common/PriceRangeBadge';
import { AvailabilityBadge } from '../../components/common/AvailabilityBadge';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { useAuth } from '../../contexts/AuthContext';
import { useAppState } from '../../contexts/AppStateContext';
import { getPlaceById } from '../../services/places';
import { addToFavorites, removeFromFavorites } from '../../services/user';
import { Place } from '../../types';
import { calculateDistance } from '../../hooks/useLocation';
import { formatPhoneNumber } from '../../utils/helpers';

const { width: screenWidth } = Dimensions.get('window');
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';

interface PlaceDetailsScreenProps { navigation: any; route: any; }

export const PlaceDetailsScreen: React.FC<PlaceDetailsScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { user, userProfile, refreshUserProfile } = useAuth();
  const { currentLocation } = useAppState();
  const [place, setPlace] = useState<Place | null>(route.params?.place || null);
  const [loading, setLoading] = useState(!place);
  const [mapExpanded, setMapExpanded] = useState(false);

  const isFavorite = userProfile?.favorites?.includes(place?.id || '') ?? false;
  const distance = currentLocation && place ? calculateDistance(currentLocation.latitude, currentLocation.longitude, place.latitude, place.longitude) : null;

  useEffect(() => {
    if (place) return;
    const loadPlace = async () => { try { const p = await getPlaceById(route.params.placeId); setPlace(p); } catch (error) { Alert.alert('Error', 'Failed to load place details.'); navigation.goBack(); } finally { setLoading(false); } };
    loadPlace();
  }, [route.params.placeId]);

  const handleFavoriteToggle = useCallback(async () => {
    if (!user || !place) return;
    try { if (isFavorite) { await removeFromFavorites(user.uid, place.id); } else { await addToFavorites(user.uid, place.id); } await refreshUserProfile(); } catch (error) { Alert.alert('Error', 'Failed to update favorites.'); }
  }, [user, isFavorite, place]);

  const handleCall = useCallback(() => {
    if (!place?.phone) { Alert.alert('Info', 'No phone number available.'); return; }
    Linking.openURL(`tel:${place.phone.replace(/\D/g, '')}`);
  }, [place?.phone]);

  const handleDirections = useCallback(() => {
    if (!place) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}&travelmode=driving`;
    Linking.openURL(url);
  }, [place]);

  const handleShare = useCallback(async () => {
    if (!place) return;
    try { await Share.share({ message: `Check out ${place.name} on Go Reserve!\n\n${place.description}\n📍 ${place.address}\n⭐ ${place.rating} | ${place.priceRange}\n\nDownload Go Reserve to discover more amazing places!` }); } catch (error) {}
  }, [place]);

  if (loading || !place) return <LoadingScreen message="Loading place details..." />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.imageContainer}>
        <Image source={{ uri: place.imageUrl || PLACEHOLDER_IMAGE }} style={styles.image} resizeMode="cover" />
        <View style={[styles.imageOverlay, { paddingTop: insets.top }]}>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={22} color={COLORS.white} /></TouchableOpacity>
            <View style={styles.headerRightButtons}>
              <TouchableOpacity style={styles.headerButton} onPress={handleShare}><Ionicons name="share-outline" size={22} color={COLORS.white} /></TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleFavoriteToggle}><Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={22} color={isFavorite ? COLORS.heart : COLORS.white} /></TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleSection}>
          <View style={styles.titleRow}><Text style={styles.name}>{place.name}</Text><View style={styles.badges}><PriceRangeBadge priceRange={place.priceRange} size="medium" /><AvailabilityBadge availability={place.availability} size="medium" /></View></View>
          <View style={styles.ratingRow}><RatingBadge rating={place.rating} size="large" /><Text style={styles.ratingText}>{place.rating.toFixed(1)} out of 5</Text><View style={styles.categoryBadge}><Ionicons name="pricetag" size={12} color={COLORS.white} /><Text style={styles.categoryText}>{place.category}</Text></View></View>
          {distance !== null && <Text style={styles.distanceText}>📍 {distance.toFixed(1)} km away</Text>}
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}><View style={[styles.actionIcon, { backgroundColor: COLORS.success }]}><Ionicons name="call" size={20} color={COLORS.white} /></View><Text style={styles.actionLabel}>Call</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDirections}><View style={[styles.actionIcon, { backgroundColor: COLORS.secondary }]}><Ionicons name="navigate" size={20} color={COLORS.white} /></View><Text style={styles.actionLabel}>Directions</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleFavoriteToggle}><View style={[styles.actionIcon, { backgroundColor: isFavorite ? COLORS.heart : COLORS.textSecondary }]}><Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={20} color={COLORS.white} /></View><Text style={styles.actionLabel}>Save</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}><View style={[styles.actionIcon, { backgroundColor: COLORS.accent }]}><Ionicons name="share-social" size={20} color={COLORS.white} /></View><Text style={styles.actionLabel}>Share</Text></TouchableOpacity>
        </View>
        <View style={styles.section}><Text style={styles.sectionTitle}>About</Text><Text style={styles.description}>{place.description}</Text></View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location & Contact</Text>
          <TouchableOpacity style={styles.infoRow}><Ionicons name="location-outline" size={18} color={COLORS.primary} /><Text style={styles.infoText}>{place.address}, {place.city}, {place.state}</Text></TouchableOpacity>
          {place.phone ? (<TouchableOpacity style={styles.infoRow} onPress={handleCall}><Ionicons name="call-outline" size={18} color={COLORS.success} /><Text style={[styles.infoText, styles.linkText]}>{formatPhoneNumber(place.phone)}</Text></TouchableOpacity>) : null}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Map</Text>
          <TouchableOpacity style={[styles.mapContainer, mapExpanded && styles.mapExpanded]} onPress={() => setMapExpanded(!mapExpanded)} activeOpacity={0.95}>
            <MapView style={styles.map} initialRegion={{ latitude: place.latitude, longitude: place.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }} scrollEnabled={false} zoomEnabled={false} rotateEnabled={false} pitchEnabled={false}>
              <Marker coordinate={{ latitude: place.latitude, longitude: place.longitude }} title={place.name} description={place.address} />
            </MapView>
            <View style={styles.mapOverlay}><Text style={styles.mapTapText}>Tap to expand map</Text></View>
          </TouchableOpacity>
        </View>
        {place.amenities && place.amenities.length > 0 && (
          <View style={styles.section}><Text style={styles.sectionTitle}>Amenities</Text><View style={styles.amenitiesGrid}>{place.amenities.map((amenity, index) => (<View key={index} style={styles.amenityItem}><Ionicons name="checkmark-circle" size={18} color={COLORS.success} /><Text style={styles.amenityText}>{amenity}</Text></View>))}</View></View>
        )}
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
      <View style={styles.bottomBar}>
        <View style={styles.bottomInfo}><Text style={styles.bottomPrice}>{place.priceRange}</Text><Text style={styles.bottomStatus}>{place.availability}</Text></View>
        <Button title="Get Directions" onPress={handleDirections} size="large" icon={<Ionicons name="navigate" size={18} color={COLORS.white} />} style={{ flex: 1 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  imageContainer: { height: 280, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: SPACING.base },
  headerButtons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerRightButtons: { flexDirection: 'row', gap: SPACING.sm },
  headerButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, marginTop: -20, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, backgroundColor: COLORS.background },
  scrollContent: { paddingTop: SPACING.xl },
  titleSection: { paddingHorizontal: SPACING.base, marginBottom: SPACING.base },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: SPACING.sm },
  name: { flex: 1, fontSize: SIZES.xxl, fontWeight: '800', color: COLORS.text },
  badges: { flexDirection: 'row', gap: SPACING.xs },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm, gap: SPACING.sm },
  ratingText: { fontSize: SIZES.sm, color: COLORS.textSecondary },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.secondary, paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: RADIUS.round, gap: 4 },
  categoryText: { fontSize: SIZES.xs, color: COLORS.white, fontWeight: '600' },
  distanceText: { fontSize: SIZES.sm, color: COLORS.primary, fontWeight: '600', marginTop: SPACING.xs },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: SPACING.base, paddingVertical: SPACING.base, backgroundColor: COLORS.surface, marginHorizontal: SPACING.base, borderRadius: RADIUS.md, ...SHADOWS.medium, marginBottom: SPACING.lg },
  actionButton: { alignItems: 'center', gap: 6 },
  actionIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  actionLabel: { fontSize: SIZES.xs, fontWeight: '600', color: COLORS.textSecondary },
  section: { paddingHorizontal: SPACING.base, marginBottom: SPACING.xl },
  sectionTitle: { fontSize: SIZES.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  description: { fontSize: SIZES.base, color: COLORS.textSecondary, lineHeight: 24 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, gap: SPACING.md },
  infoText: { fontSize: SIZES.base, color: COLORS.textSecondary, flex: 1 },
  linkText: { color: COLORS.primary, fontWeight: '600' },
  mapContainer: { height: 180, borderRadius: RADIUS.md, overflow: 'hidden', ...SHADOWS.medium },
  mapExpanded: { height: 300 },
  map: { width: '100%', height: '100%' },
  mapOverlay: { position: 'absolute', bottom: 8, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.round },
  mapTapText: { fontSize: SIZES.xs, color: COLORS.white, fontWeight: '500' },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  amenityItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, width: '45%' },
  amenityText: { fontSize: SIZES.sm, color: COLORS.textSecondary },
  bottomBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.base, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, ...SHADOWS.large, gap: SPACING.base },
  bottomInfo: { alignItems: 'center' },
  bottomPrice: { fontSize: SIZES.xl, fontWeight: '800', color: COLORS.text },
  bottomStatus: { fontSize: SIZES.xs, color: COLORS.textSecondary },
});
