import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, StatusBar, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING, RADIUS, SHADOWS } from '../../config/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useAppState } from '../../contexts/AppStateContext';
import { useRealtimePlaces } from '../../hooks/useRealtimePlaces';
import { useLocation } from '../../hooks/useLocation';
import { PlaceCard } from '../../components/place/PlaceCard';
import { CategoryBar } from '../../components/place/CategoryBar';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { EmptyState } from '../../components/common/EmptyState';
import { Place } from '../../types';
import { filterPlaces, sortPlaces } from '../../utils/helpers';

const { width: screenWidth } = Dimensions.get('window');

interface HomeScreenProps { navigation: any; }

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { currentLocation, filters, setFilters } = useAppState();
  const { places, loading, error } = useRealtimePlaces(100);
  const { getCurrentLocation } = useLocation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Place['category'] | 'All'>('All');

  const filteredAndSortedPlaces = useMemo(() => {
    let result = [...places];
    if (selectedCategory !== 'All') result = result.filter((p) => p.category === selectedCategory);
    result = filterPlaces(result, { category: filters.category, priceRange: filters.priceRange, availability: filters.availability, minRating: filters.rating, amenities: filters.amenities, maxDistance: filters.maxDistance, userLat: currentLocation?.latitude, userLon: currentLocation?.longitude });
    result = sortPlaces(result, filters.sortBy, filters.sortOrder, currentLocation?.latitude, currentLocation?.longitude);
    return result;
  }, [places, selectedCategory, filters, currentLocation]);

  const nearbyPlaces = useMemo(() => {
    if (!currentLocation) return [];
    const { calculateDistance } = require('../../hooks/useLocation');
    return places.filter((p) => p.latitude && p.longitude).map((p) => ({ ...p, _distance: calculateDistance(currentLocation.latitude, currentLocation.longitude, p.latitude, p.longitude) })).filter((p) => (p as any)._distance <= 10).sort((a, b) => (a as any)._distance - (b as any)._distance).slice(0, 8);
  }, [places, currentLocation]);

  const onRefresh = useCallback(async () => { setRefreshing(true); await getCurrentLocation(); setRefreshing(false); }, [getCurrentLocation]);

  const handleCategoryChange = useCallback((category: Place['category'] | 'All') => { setSelectedCategory(category); }, []);

  const renderHeader = () => (
    <View>
      <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')} activeOpacity={0.8}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} />
        <Text style={styles.searchPlaceholder}>Search hotels, resorts, restaurants...</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}><Ionicons name="options-outline" size={20} color={COLORS.primary} /></TouchableOpacity>
      </TouchableOpacity>
      <CategoryBar selectedCategory={selectedCategory} onSelectCategory={handleCategoryChange} />
      {nearbyPlaces.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}><Ionicons name="navigate" size={18} color={COLORS.primary} /><Text style={styles.sectionTitle}>Nearby Places</Text></View>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.nearbyList}>
            {nearbyPlaces.map((place) => (<PlaceCard key={place.id} place={place} variant="vertical" showDistance />))}
          </ScrollView>
        </View>
      )}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}><Ionicons name="star" size={18} color={COLORS.primary} /><Text style={styles.sectionTitle}>{selectedCategory === 'All' ? 'All Places' : selectedCategory + 's'}</Text></View>
          <Text style={styles.resultCount}>{filteredAndSortedPlaces.length} found</Text>
        </View>
      </View>
    </View>
  );

  if (loading && places.length === 0) return <LoadingScreen message="Discovering places near you..." />;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <View style={styles.topBar}>
        <View><Text style={styles.greeting}>Hello, {user?.displayName || 'Guest'} 👋</Text><Text style={styles.topSubtitle}>Find your perfect place</Text></View>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}><Ionicons name="person-circle-outline" size={36} color={COLORS.primary} /></TouchableOpacity>
      </View>
      <FlatList data={filteredAndSortedPlaces} keyExtractor={(item) => item.id} renderItem={({ item }) => <PlaceCard place={item} variant="horizontal" showDistance />} ListHeaderComponent={renderHeader} ListEmptyComponent={<EmptyState icon="search-outline" title="No Places Found" message="Try changing your filters or search for something different." />} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} tintColor={COLORS.primary} />} ItemSeparatorComponent={() => <View style={{ height: SPACING.xs }} />} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.base, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, ...SHADOWS.small },
  greeting: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.text },
  topSubtitle: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  profileButton: { padding: 4 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: SPACING.base, marginTop: SPACING.md, marginBottom: SPACING.sm, paddingHorizontal: SPACING.base, paddingVertical: SPACING.md, borderRadius: RADIUS.lg, ...SHADOWS.medium, gap: SPACING.sm },
  searchPlaceholder: { flex: 1, fontSize: SIZES.md, color: COLORS.textSecondary },
  section: { paddingHorizontal: SPACING.base, marginBottom: SPACING.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: SIZES.lg, fontWeight: '700', color: COLORS.text },
  seeAll: { fontSize: SIZES.sm, color: COLORS.primary, fontWeight: '600' },
  resultCount: { fontSize: SIZES.sm, color: COLORS.textSecondary },
  nearbyList: { paddingLeft: SPACING.base, paddingRight: SPACING.sm, paddingBottom: SPACING.sm },
  listContent: { paddingBottom: SPACING.xxl },
});
