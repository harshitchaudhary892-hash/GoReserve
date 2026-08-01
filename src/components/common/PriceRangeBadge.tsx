import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RADIUS, SIZES } from '../../config/theme';
interface PriceRangeBadgeProps { priceRange: string; size?: string; }
export const PriceRangeBadge: React.FC<PriceRangeBadgeProps> = ({ priceRange, size = 'small' }) => {
  const colors: Record<string,{bg:string;text:string}> = { '$':{bg:'#E8F5E9',text:'#4CAF50'}, '$$':{bg:'#FFF8E1',text:'#FFC107'}, '$$$':{bg:'#FFF3E0',text:'#FF9800'}, '$$$$':{bg:'#FFEBEE',text:'#F44336'} };
  const { bg, text: tc } = colors[priceRange] || colors['$'];
  return (<View style={[styles.c,{backgroundColor:bg},styles[`s_${size}`]]}><Text style={[styles.t,{color:tc},styles[`ts_${size}`]]}>{priceRange}</Text></View>);
};
const styles = StyleSheet.create({
  c: { borderRadius: RADIUS.xs, alignItems: 'center', justifyContent: 'center' }, s_small: { paddingHorizontal: 6, paddingVertical: 2 }, s_medium: { paddingHorizontal: 8, paddingVertical: 3 },
  t: { fontWeight: '700' }, ts_small: { fontSize: SIZES.xs }, ts_medium: { fontSize: SIZES.sm },
});
