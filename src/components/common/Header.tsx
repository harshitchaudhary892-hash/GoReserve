import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING, SHADOWS } from '../../config/theme';
import { Ionicons } from '@expo/vector-icons';
interface HeaderProps { title: string; onBack?: () => void; showBack?: boolean; rightIcon?: React.ReactNode; onRightPress?: () => void; }
export const Header: React.FC<HeaderProps> = ({ title, onBack, showBack = true, rightIcon, onRightPress }) => {
  const insets = useSafeAreaInsets();
  return (<View style={[styles.c,{paddingTop:insets.top+SPACING.sm}]}><View style={styles.l}>{showBack && <TouchableOpacity onPress={onBack} style={styles.bb}><Ionicons name="arrow-back" size={24} color={COLORS.text} /></TouchableOpacity>}</View><Text style={styles.t} numberOfLines={1}>{title}</Text><View style={styles.r}>{rightIcon && <TouchableOpacity onPress={onRightPress} style={styles.rb}>{rightIcon}</TouchableOpacity>}</View></View>);
};
const styles = StyleSheet.create({
  c: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.base, paddingBottom: SPACING.md, backgroundColor: COLORS.surface, ...SHADOWS.small },
  l: { width: 48, alignItems: 'flex-start' }, t: { flex: 1, fontSize: SIZES.xl, fontWeight: '700', color: COLORS.text, textAlign: 'center' }, r: { width: 48, alignItems: 'flex-end' },
  bb: { padding: SPACING.xs, borderRadius: 20 }, rb: { padding: SPACING.xs, borderRadius: 20 },
});
