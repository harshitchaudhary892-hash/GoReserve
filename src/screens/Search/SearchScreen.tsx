import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Modal, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING, RADIUS, SHADOWS } from '../../config/theme';
import { PlaceCard } from '../../components/place/PlaceCard';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { useRealtimePlaces } from '../../hooks/useRealtimePlaces';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { useAppState } from '../../contexts/AppStateContext';
import { Place, FilterOptions } from '../../types';
import { CATEGORIES, AMENITY_OPTIONS, PRICE_RANGES, AVAILABILITY_OPTIONS, SORT_OPTIONS } from '../../config/constants';
import { filterPlaces, sortPlaces } from '../../utils/helpers';

interface SearchScreenProps { navigation: any; }

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { places } = useRealtimePlaces(100);
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
  const { currentLocation, filters, setFilters, resetFilters } = useAppState();
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const results = useMemo(() => {
    if (!searchText.trim()) return [];
    const query = searchText.toLowerCase();
    let filtered = places.filter((p) => p.name.toLowerCase().includes(query) || p.city.toLowerCase().includes(query) || p.state.toLowerCase().includes(query) || p.address.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    filtered = filterPlaces(filtered, { category: localFilters.category, priceRange: localFilters.priceRange, availability: localFilters.availability, minRating: localFilters.rating, amenities: localFilters.amenities, maxDistance: localFilters.maxDistance, userLat: currentLocation?.latitude, userLon: currentLocation?.longitude });
    filtered = sortPlaces(filtered, localFilters.sortBy, localFilters.sortOrder, currentLocation?.latitude, currentLocation?.longitude);
    return filtered;
  }, [places, searchText, localFilters, currentLocation]);

  const handleSearch = useCallback((text: string) => { setSearchText(text); setIsSearching(text.length > 0); }, []);
  const handleHistoryPress = useCallback((query: string) => { setSearchText(query); setIsSearching(true); addToHistory(query); }, [addToHistory]);
  const handleSubmit = useCallback(() => { if (searchText.trim()) addToHistory(searchText.trim()); }, [searchText, addToHistory]);
  const applyFilters = useCallback(() => { setFilters(localFilters); setShowFilters(false); }, [localFilters, setFilters]);
  const toggleAmenity = useCallback((amenity: string) => { setLocalFilters((prev) => { const amenities = prev.amenities.includes(amenity) ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity]; return { ...prev, amenities }; }); }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Ionicons name="arrow-back" size={24} color={COLORS.text} /></TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={18} color={COLORS.textSecondary} />
          <TextInput style={styles.searchInput} placeholder="Search places..." value={searchText} onChangeText={handleSearch} onSubmitEditing={handleSubmit} autoFocus returnKeyType="search" placeholderTextColor={COLORS.textLight} />
          {searchText.length > 0 && (<TouchableOpacity onPress={() => handleSearch('')}><Ionicons name="close-circle" size={18} color={COLORS.textSecondary} /></TouchableOpacity>)}
        </View>
        <View style={styles.filterActions}>
          <TouchableOpacity onPress={() => setShowSort(true)} style={styles.filterBtn}><Ionicons name="swap-vertical" size={20} color={COLORS.text} /></TouchableOpacity>
          <TouchableOpacity onPress={() => setShowFilters(true)} style={styles.filterBtn}><Ionicons name="options-outline" size={20} color={COLORS.text} /></TouchableOpacity>
        </View>
      </View>
      {isSearching ? (
        <FlatList data={results} keyExtractor={(item) => item.id} renderItem={({ item }) => <PlaceCard place={item} variant="horizontal" showDistance />} ListEmptyComponent={<EmptyState icon="search-outline" title="No Results" message={`No places found for "${searchText}".`} />} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} ItemSeparatorComponent={() => <View style={{ height: SPACING.xs }} />} ListFooterComponent={results.length > 0 ? <Text style={styles.resultFooter}>{results.length} results</Text> : null} />
      ) : (
        <View style={styles.historyContainer}>
          {history.length > 0 ? (<><View style={styles.historyHeader}><Text style={styles.historyTitle}>Recent Searches</Text><TouchableOpacity onPress={clearHistory}><Text style={styles.clearText}>Clear All</Text></TouchableOpacity></View>{history.map((item) => (<View key={item.id} style={styles.historyItem}><TouchableOpacity style={styles.historyPressable} onPress={() => handleHistoryPress(item.query)}><Ionicons name="time-outline" size={18} color={COLORS.textSecondary} /><Text style={styles.historyText} numberOfLines={1}>{item.query}</Text></TouchableOpacity><TouchableOpacity onPress={() => removeFromHistory(item.id)}><Ionicons name="close" size={16} color={COLORS.textLight} /></TouchableOpacity></View>))}</>) : (<EmptyState icon="search-outline" title="Search Places" message="Find hotels, resorts, restaurants and cafes near you." />)}
        </View>
      )}
      <Modal visible={showFilters} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowFilters(false)}>
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}><TouchableOpacity onPress={() => setShowFilters(false)}><Ionicons name="close" size={24} color={COLORS.text} /></TouchableOpacity><Text style={styles.modalTitle}>Filters</Text><TouchableOpacity onPress={resetFilters}><Text style={styles.resetText}>Reset</Text></TouchableOpacity></View>
          <ScrollView style={styles.filterContent}>
            <Text style={styles.filterLabel}>Category</Text>
            <View style={styles.chipContainer}>{[{ type: 'All', name: 'All' }, ...CATEGORIES].map((cat) => (<TouchableOpacity key={cat.type} style={[styles.chip, localFilters.category === cat.type && styles.chipSelected]} onPress={() => setLocalFilters({ ...localFilters, category: cat.type as FilterOptions['category'] })}><Text style={[styles.chipText, localFilters.category === cat.type && styles.chipTextSelected]}>{cat.name}</Text></TouchableOpacity>))}</View>
            <Text style={styles.filterLabel}>Price Range</Text>
            <View style={styles.chipContainer}>{['All', ...PRICE_RANGES].map((p) => (<TouchableOpacity key={p} style={[styles.chip, localFilters.priceRange === p && styles.chipSelected]} onPress={() => setLocalFilters({ ...localFilters, priceRange: p as FilterOptions['priceRange'] })}><Text style={[styles.chipText, localFilters.priceRange === p && styles.chipTextSelected]}>{p === 'All' ? 'All' : p}</Text></TouchableOpacity>))}</View>
            <Text style={styles.filterLabel}>Availability</Text>
            <View style={styles.chipContainer}>{['All', ...AVAILABILITY_OPTIONS].map((a) => (<TouchableOpacity key={a} style={[styles.chip, localFilters.availability === a && styles.chipSelected]} onPress={() => setLocalFilters({ ...localFilters, availability: a as FilterOptions['availability'] })}><Text style={[styles.chipText, localFilters.availability === a && styles.chipTextSelected]}>{a}</Text></TouchableOpacity>))}</View>
            <Text style={styles.filterLabel}>Minimum Rating: {localFilters.rating}★</Text>
            <View style={styles.chipContainer}>{[0, 2, 3, 4, 4.5].map((r) => (<TouchableOpacity key={r} style={[styles.chip, localFilters.rating === r && styles.chipSelected]} onPress={() => setLocalFilters({ ...localFilters, rating: r })}><Text style={[styles.chipText, localFilters.rating === r && styles.chipTextSelected]}>{r === 0 ? 'Any' : `${r}+ ★`}</Text></TouchableOpacity>))}</View>
            <Text style={styles.filterLabel}>Amenities</Text>
            <View style={styles.chipContainer}>{AMENITY_OPTIONS.map((amenity) => (<TouchableOpacity key={amenity} style={[styles.chip, localFilters.amenities.includes(amenity) && styles.chipSelected]} onPress={() => toggleAmenity(amenity)}><Text style={[styles.chipText, localFilters.amenities.includes(amenity) && styles.chipTextSelected]}>{amenity}</Text></TouchableOpacity>))}</View>
            <Text style={styles.filterLabel}>Max Distance: {localFilters.maxDistance > 0 ? `${localFilters.maxDistance} km` : 'No Limit'}</Text>
            <View style={styles.chipContainer}>{[0, 1, 5, 10, 25, 50].map((d) => (<TouchableOpacity key={d} style={[styles.chip, localFilters.maxDistance === d && styles.chipSelected]} onPress={() => setLocalFilters({ ...localFilters, maxDistance: d })}><Text style={[styles.chipText, localFilters.maxDistance === d && styles.chipTextSelected]}>{d === 0 ? 'No Limit' : `${d} km`}</Text></TouchableOpacity>))}</View>
          </ScrollView>
          <View style={styles.filterFooter}><Button title="Apply Filters" onPress={applyFilters} fullWidth size="large" /></View>
        </View>
      </Modal>
      <Modal visible={showSort} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowSort(false)}>
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}><TouchableOpacity onPress={() => setShowSort(false)}><Ionicons name="close" size={24} color={COLORS.text} /></TouchableOpacity><Text style={styles.modalTitle}>Sort By</Text><View style={{ width: 32 }} /></View>
          <ScrollView style={styles.filterContent}>{SORT_OPTIONS.map((option, index) => (<TouchableOpacity key={index} style={[styles.sortOption, localFilters.sortBy === option.value && localFilters.sortOrder === option.order && styles.sortOptionSelected]} onPress={() => { setLocalFilters({ ...localFilters, sortBy: option.value as FilterOptions['sortBy'], sortOrder: option.order }); setFilters({ ...filters, sortBy: option.value as FilterOptions['sortBy'], sortOrder: option.order }); setShowSort(false); }}><Text style={[styles.sortOptionText, localFilters.sortBy === option.value && localFilters.sortOrder === option.order && styles.sortOptionTextSelected]}>{option.label}</Text>{localFilters.sortBy === option.value && localFilters.sortOrder === option.order && (<Ionicons name="checkmark" size={20} color={COLORS.primary} />)}</TouchableOpacity>))}</ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.sm, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface, ...SHADOWS.small, gap: SPACING.sm },
  backBtn: { padding: 4 },
  searchInputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, height: 42, gap: SPACING.sm },
  searchInput: { flex: 1, fontSize: SIZES.base, color: COLORS.text },
  filterActions: { flexDirection: 'row', gap: 4 },
  filterBtn: { padding: 8 },
  listContent: { paddingBottom: SPACING.xxl },
  resultFooter: { textAlign: 'center', fontSize: SIZES.sm, color: COLORS.textSecondary, paddingVertical: SPACING.base },
  historyContainer: { flex: 1, padding: SPACING.base },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  historyTitle: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.text },
  clearText: { fontSize: SIZES.sm, color: COLORS.primary, fontWeight: '600' },
  historyItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  historyPressable: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  historyText: { fontSize: SIZES.base, color: COLORS.text, flex: 1 },
  modalContainer: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.base, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, ...SHADOWS.small },
  modalTitle: { fontSize: SIZES.lg, fontWeight: '700', color: COLORS.text },
  resetText: { fontSize: SIZES.base, color: COLORS.primary, fontWeight: '600' },
  filterContent: { flex: 1, padding: SPACING.base },
  filterLabel: { fontSize: SIZES.base, fontWeight: '700', color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.md },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.round, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  chipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: SIZES.sm, color: COLORS.text, fontWeight: '500' },
  chipTextSelected: { color: COLORS.white },
  filterFooter: { padding: SPACING.base, backgroundColor: COLORS.surface, ...SHADOWS.medium },
  sortOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.base, paddingHorizontal: SPACING.base, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  sortOptionSelected: { backgroundColor: COLORS.primaryLight },
  sortOptionText: { fontSize: SIZES.base, color: COLORS.text },
  sortOptionTextSelected: { color: COLORS.primary, fontWeight: '700' },
});
