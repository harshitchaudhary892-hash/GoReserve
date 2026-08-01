import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING, SHADOWS } from '../../config/theme';
import { PlaceCard } from '../../components/place/PlaceCard';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../contexts/AuthContext';
import { getFavoritePlaces } from '../../services/user';
import { Place } from '../../types';

interface FavoritesScreenProps { navigation: any; }

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { userProfile } = useAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = useCallback(async () => {
    if (!userProfile?.favorites) { setPlaces([]); setLoading(false); return; }
    try { const favs = await getFavoritePlaces(userProfile.favorites); setPlaces(favs as Place[]); } catch (error) { console.error('Error loading favorites:', error); } finally { setLoading(false); }
  }, [userProfile?.favorites]);

  useEffect(() => { loadFavorites(); }, [loadFavorites]);
  const onRefresh = useCallback(async () => { setRefreshing(true); await loadFavorites(); setRefreshing(false); }, [loadFavorites]);

  if (loading) return <LoadingScreen message="Loading favorites..." />;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <View style={styles.header}><Text style={styles.title}>My Favorites</Text><Text style={styles.subtitle}>{places.length} {places.length === 1 ? 'place' : 'places'} saved</Text></View>
      <FlatList data={places} keyExtractor={(item) => item.id} renderItem={({ item }) => <PlaceCard place={item} variant="horizontal" showDistance />} ListEmptyComponent={<EmptyState icon="heart-outline" title="No Favorites Yet" message="Save places you love by tapping the heart icon." actionLabel="Explore Places" onAction={() => navigation.navigate('Home')} />} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ItemSeparatorComponent={() => <View style={{ height: SPACING.xs }} />} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} tintColor={COLORS.primary} />} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.surface, paddingHorizontal: SPACING.base, paddingVertical: SPACING.lg, ...SHADOWS.small },
  title: { fontSize: SIZES.xxl, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  listContent: { paddingTop: SPACING.sm, paddingBottom: SPACING.xxl },
});
