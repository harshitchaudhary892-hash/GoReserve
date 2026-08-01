import React from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { COLORS, RADIUS, SIZES, SPACING } from '../../config/theme';
interface InputProps extends TextInputProps { label?: string; error?: string; containerStyle?: ViewStyle; leftIcon?: React.ReactNode; rightIcon?: React.ReactNode; }
export const Input: React.FC<InputProps> = ({ label, error, containerStyle, leftIcon, rightIcon, ...props }) => (
  <View style={[styles.c, containerStyle]}>
    {label && <Text style={styles.l}>{label}</Text>}
    <View style={[styles.ic, error && styles.ie]}>
      {leftIcon && <View style={styles.li}>{leftIcon}</View>}
      <TextInput style={[styles.i, leftIcon ? styles.il : null, rightIcon ? styles.ir : null]} placeholderTextColor={COLORS.textLight} {...props} />
      {rightIcon && <View style={styles.ri}>{rightIcon}</View>}
    </View>
    {error && <Text style={styles.e}>{error}</Text>}
  </View>
);
const styles = StyleSheet.create({
  c: { marginBottom: SPACING.base }, l: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  ic: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, backgroundColor: COLORS.surface, minHeight: 48 },
  ie: { borderColor: COLORS.error }, i: { flex: 1, paddingHorizontal: SPACING.base, paddingVertical: SPACING.md, fontSize: SIZES.base, color: COLORS.text },
  il: { paddingLeft: SPACING.xs }, ir: { paddingRight: SPACING.xs }, li: { paddingLeft: SPACING.md }, ri: { paddingRight: SPACING.md },
  e: { fontSize: SIZES.xs, color: COLORS.error, marginTop: SPACING.xs },
});
