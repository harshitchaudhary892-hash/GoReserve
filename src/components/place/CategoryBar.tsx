import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING, RADIUS } from '../../config/theme';
import { CATEGORIES } from '../../config/constants';
import { Place } from '../../types';
interface CategoryBarProps { selectedCategory: Place['category']|'All'; onSelectCategory: (c: Place['category']|'All') => void; }
export const CategoryBar: React.FC<CategoryBarProps> = ({ selectedCategory, onSelectCategory }) => (
  <View style={styles.c}>
    <TouchableOpacity style={[styles.i, selectedCategory==='All'&&styles.s,{backgroundColor:selectedCategory==='All'?COLORS.primary:COLORS.surface}]} onPress={()=>onSelectCategory('All')}>
      <Ionicons name="grid" size={20} color={selectedCategory==='All'?COLORS.white:COLORS.textSecondary} /><Text style={[styles.n,selectedCategory==='All'&&styles.sn]}>All</Text>
    </TouchableOpacity>
    {CATEGORIES.map(cat => (<TouchableOpacity key={cat.id} style={[styles.i,selectedCategory===cat.type&&styles.s,{backgroundColor:selectedCategory===cat.type?cat.color:COLORS.surface}]} onPress={()=>onSelectCategory(cat.type)}>
      <Ionicons name={cat.icon as any} size={20} color={selectedCategory===cat.type?COLORS.white:COLORS.textSecondary} /><Text style={[styles.n,selectedCategory===cat.type&&styles.sn]}>{cat.name}</Text>
    </TouchableOpacity>))}
  </View>
);
const styles = StyleSheet.create({
  c: { flexDirection: 'row', paddingHorizontal: SPACING.base, paddingVertical: SPACING.md, gap: SPACING.sm },
  i: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.round, gap: 4, shadowColor:'#000',shadowOffset:{width:0,height:1},shadowOpacity:0.08,shadowRadius:2,elevation:1 },
  s: { shadowOffset:{width:0,height:2},shadowOpacity:0.2,shadowRadius:4,elevation:4 },
  n: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.textSecondary }, sn: { color: COLORS.white },
});
