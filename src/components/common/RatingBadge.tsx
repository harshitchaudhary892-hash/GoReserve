import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../config/theme';

interface RatingBadgeProps { rating: number; size?: 'small' | 'medium' | 'large'; showText?: boolean; }

export const RatingBadge: React.FC<RatingBadgeProps> = ({ rating, size = 'small', showText = true }) => {
  const getColor = (r: number) => { if (r >= 4.5) return '#4CAF50'; if (r >= 4.0) return '#8BC34A'; if (r >= 3.0) return '#FFC107'; if (r >= 2.0) return '#FF9800'; return '#F44336'; };
  return (
    <View style={[styles.container, styles[`container_${size}`], { backgroundColor: getColor(rating) }]}>
      <Ionicons name="star" size={size === 'large' ? 16 : size === 'medium' ? 14 : 12} color={COLORS.white} />
      {showText && <Text style={[styles.text, styles[`text_${size}`]]}>{rating.toFixed(1)}</Text>}
    </View>
  );
};

import { Ionicons } from '@expo/vector-icons';
