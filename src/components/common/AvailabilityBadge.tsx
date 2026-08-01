import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SIZES } from '../../config/theme';
import { Place } from '../../types';

interface AvailabilityBadgeProps { availability: Place['availability']; size?: 'small' | 'medium'; }

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({ availability, size = 'small' }) => {
  const config = { Open: { bg: '#E8F5E9', text: '#4CAF50', dot: '#4CAF50' }, Closed: { bg: '#FFEBEE', text: '#F44336', dot: '#F44336' }, Busy: { bg: '#FFF3E0', text: '#FF9800', dot: '#FF9800' } };
  const { bg, text: textColor, dot } = config[availability] || config.Open;
  return (
    <View style={[styles.container, { backgroundColor: bg }, styles[`size_${size}`]]}>
      <View style={[styles.dot, { backgroundColor: dot }]} />
      <Text style={[styles.text, { color: textColor }, styles[`text_${size}`]]}>{availability}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', borderRadius: 6 },
  size_small: { paddingHorizontal: 8, paddingVertical: 3 },
  size_medium: { paddingHorizontal: 10, paddingVertical: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  text: { fontWeight: '600' },
  text_small: { fontSize: SIZES.xs },
  text_medium: { fontSize: SIZES.sm },
});
