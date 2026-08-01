import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING, RADIUS } from '../../config/theme';
import { CATEGORIES } from '../../config/constants';
import { Place } from '../../types';

interface CategoryBarProps { selectedCategory: Place['category'] | 'All'; onSelectCategory: (category: Place['category'] | 'All') => void; }

export const CategoryBar: React.FC<CategoryBarProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.categoryItem, selectedCategory === 'All' && styles.selectedItem, { backgroundColor: selectedCategory === 'All' ? COLORS.primary : COLORS.surface }]} onPress={() => onSelectCategory('All')}>
        <Ionicons name="grid" size={20} color={selectedCategory === 'All' ? COLORS.white : COLORS.textSecondary} />
        <Text style={[styles.categoryName, selectedCategory === 'All' && styles.selectedText]}>All</Text>
      </TouchableOpacity>
      {CATEGORIES.map((cat) => (
        <TouchableOpacity key={cat.id} style={[styles.categoryItem, selectedCategory === cat.type && styles.selectedItem, { backgroundColor: selectedCategory === cat.type ? cat.color : COLORS.surface }]} onPress={() => onSelectCategory(cat.type)}>
          <Ionicons name={cat.icon as any} size={20} color={selectedCategory === cat.type ? COLORS.white : COLORS.textSecondary} />
          <Text style={[styles.categoryName, selectedCategory === cat.type && styles.selectedText]}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', paddingHorizontal: SPACING.base, paddingVertical: SPACING.md, gap: SPACING.sm },
  categoryItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.round, gap: 4, elevation: 1 },
  selectedItem: { elevation: 4 },
  categoryName: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.textSecondary },
  selectedText: { color: COLORS.white },
});
