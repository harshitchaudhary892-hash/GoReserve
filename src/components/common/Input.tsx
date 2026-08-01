import React from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { COLORS, RADIUS, SIZES, SPACING } from '../../config/theme';

interface InputProps extends TextInputProps { label?: string; error?: string; containerStyle?: ViewStyle; leftIcon?: React.ReactNode; rightIcon?: React.ReactNode; }

export const Input: React.FC<InputProps> = ({ label, error, containerStyle, leftIcon, rightIcon, ...props }) => (
  <View style={[styles.container, containerStyle]}>
    {label && <Text style={styles.label}>{label}</Text>}
    <View style={[styles.inputContainer, error && styles.inputError]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      <TextInput style={[styles.input, leftIcon ? styles.inputWithLeftIcon : null, rightIcon ? styles.inputWithRightIcon : null]} placeholderTextColor={COLORS.textLight} {...props} />
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
    {error && <Text style={styles.error}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.base },
  label: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, backgroundColor: COLORS.surface, minHeight: 48 },
  inputError: { borderColor: COLORS.error },
  input: { flex: 1, paddingHorizontal: SPACING.base, paddingVertical: SPACING.md, fontSize: SIZES.base, color: COLORS.text },
  inputWithLeftIcon: { paddingLeft: SPACING.xs },
  inputWithRightIcon: { paddingRight: SPACING.xs },
  leftIcon: { paddingLeft: SPACING.md },
  rightIcon: { paddingRight: SPACING.md },
  error: { fontSize: SIZES.xs, color: COLORS.error, marginTop: SPACING.xs },
});
