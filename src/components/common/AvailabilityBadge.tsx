import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SIZES } from '../../config/theme';
import { Place } from '../../types';
interface AvailabilityBadgeProps { availability: Place['availability']; size?: string; }
export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({ availability, size = 'small' }) => {
  const config: Record<string,{bg:string;text:string;dot:string}> = { Open:{bg:'#E8F5E9',text:'#4CAF50',dot:'#4CAF50'}, Closed:{bg:'#FFEBEE',text:'#F44336',dot:'#F44336'}, Busy:{bg:'#FFF3E0',text:'#FF9800',dot:'#FF9800'} };
  const { bg, text: tc, dot } = config[availability] || config.Open;
  return (<View style={[styles.c,{backgroundColor:bg},styles[`s_${size}`]]}><View style={[styles.dot,{backgroundColor:dot}]} /><Text style={[styles.t,{color:tc},styles[`ts_${size}`]]}>{availability}</Text></View>);
};
const styles = StyleSheet.create({
  c: { flexDirection: 'row', alignItems: 'center', borderRadius: 6 }, s_small: { paddingHorizontal: 8, paddingVertical: 3 }, s_medium: { paddingHorizontal: 10, paddingVertical: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 }, t: { fontWeight: '600' }, ts_small: { fontSize: SIZES.xs }, ts_medium: { fontSize: SIZES.sm },
});
