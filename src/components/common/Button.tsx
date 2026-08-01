import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS, SIZES } from '../../config/theme';

interface ButtonProps { title: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'outline' | 'text'; size?: 'small' | 'medium' | 'large'; loading?: boolean; disabled?: boolean; style?: ViewStyle; textStyle?: TextStyle; icon?: React.ReactNode; fullWidth?: boolean; }

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', size = 'medium', loading = false, disabled = false, style, textStyle, icon, fullWidth = false }) => {
  return (
    <TouchableOpacity style={[styles.base, styles[`variant_${variant}`], styles[`size_${size}`], fullWidth && styles.fullWidth, disabled && styles.disabled, style]} onPress={onPress} disabled={disabled || loading} activeOpacity={0.7}>
      {loading ? <ActivityIndicator size="small" color={variant === 'primary' ? COLORS.white : COLORS.primary} /> : <View style={styles.content}>{icon && <View style={styles.icon}>{icon}</View>}<Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`], disabled && styles.textDisabled, textStyle]}>{title}</Text></View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: RADIUS.md },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  icon: { marginRight: SPACING.sm },
  fullWidth: { width: '100%' },
  variant_primary: { backgroundColor: COLORS.primary, ...SHADOWS.medium },
  variant_secondary: { backgroundColor: COLORS.secondary, ...SHADOWS.medium },
  variant_outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
  variant_text: { backgroundColor: 'transparent' },
  size_small: { paddingHorizontal: SPACING.base, paddingVertical: SPACING.sm, minHeight: 36 },
  size_medium: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, minHeight: 48 },
  size_large: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.base, minHeight: 56 },
  text: { fontWeight: '600' },
  text_primary: { color: COLORS.white },
  text_secondary: { color: COLORS.white },
  text_outline: { color: COLORS.primary },
  text_text: { color: COLORS.primary },
  textSize_small: { fontSize: SIZES.sm },
  textSize_medium: { fontSize: SIZES.base },
  textSize_large: { fontSize: SIZES.lg },
  disabled: { opacity: 0.5 },
  textDisabled: { opacity: 0.7 },
});
