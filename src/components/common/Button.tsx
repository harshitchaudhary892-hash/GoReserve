import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS, SIZES } from '../../config/theme';
interface ButtonProps { title: string; onPress: () => void; variant?: string; size?: string; loading?: boolean; disabled?: boolean; style?: ViewStyle; textStyle?: TextStyle; icon?: React.ReactNode; fullWidth?: boolean; }
export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', size = 'medium', loading, disabled, style, textStyle, icon, fullWidth }) => (
  <TouchableOpacity style={[styles.base, styles[`v_${variant}`], styles[`s_${size}`], fullWidth && styles.fw, disabled && styles.d, style]} onPress={onPress} disabled={disabled || loading} activeOpacity={0.7}>
    {loading ? <ActivityIndicator size="small" color={variant === 'primary' ? COLORS.white : COLORS.primary} /> : <View style={styles.c}>{icon && <View style={styles.ic}>{icon}</View>}<Text style={[styles.t, styles[`tv_${variant}`], styles[`ts_${size}`], disabled && styles.td, textStyle]}>{title}</Text></View>}
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: RADIUS.md }, c: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  ic: { marginRight: SPACING.sm }, fw: { width: '100%' },
  v_primary: { backgroundColor: COLORS.primary, ...SHADOWS.medium }, v_secondary: { backgroundColor: COLORS.secondary, ...SHADOWS.medium },
  v_outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary }, v_text: { backgroundColor: 'transparent' },
  s_small: { paddingHorizontal: SPACING.base, paddingVertical: SPACING.sm, minHeight: 36 }, s_medium: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, minHeight: 48 },
  s_large: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.base, minHeight: 56 },
  t: { fontWeight: '600' }, tv_primary: { color: COLORS.white }, tv_secondary: { color: COLORS.white }, tv_outline: { color: COLORS.primary }, tv_text: { color: COLORS.primary },
  ts_small: { fontSize: SIZES.sm }, ts_medium: { fontSize: SIZES.base }, ts_large: { fontSize: SIZES.lg }, d: { opacity: 0.5 }, td: { opacity: 0.7 },
});
