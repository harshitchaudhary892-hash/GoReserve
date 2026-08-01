import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SIZES, RADIUS } from '../../config/theme';

interface PriceRangeBadgeProps { priceRange: '$' | '$$' | '$$$' | '$$$$'; size?: 'small' | 'medium'; }

export const PriceRangeBadge: React.FC<PriceRangeBadgeProps> = ({ priceRange, size = 'small' }) => {
  const colors = { '$': { bg: '#E8F5E9', text: '#4CAF50' }, '$$': { bg: '#FFF8E1', text: '#FFC107' }, '$$$': { bg: '#FFF3E0', text: '#FF9800' }, '$$$$': { bg: '#FFEBEE', text: '#F44336' } };
  const { bg, text: textColor } = colors[priceRange] || colors['$'];
  return (
    <View style={[styles.container, { backgroundColor: bg }, styles[`size_${size}`]]}>
      <Text style={[styles.text, { color: textColor }, styles[`text_${size}`]]}>{priceRange}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { borderRadius: RADIUS.xs, alignItems: 'center', justifyContent: 'center' },
  size_small: { paddingHorizontal: 6, paddingVertical: 2 },
  size_medium: { paddingHorizontal: 8, paddingVertical: 3 },
  text: { fontWeight: '700' },
  text_small: { fontSize: SIZES.xs },
  text_medium: { fontSize: SIZES.sm },
});
