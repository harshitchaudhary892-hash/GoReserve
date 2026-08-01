import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING } from '../../config/theme';
interface EmptyStateProps { icon?: string; title: string; message: string; actionLabel?: string; onAction?: () => void; }
export const EmptyState: React.FC<EmptyStateProps> = ({ icon = 'alert-circle-outline', title, message, actionLabel, onAction }) => (
  <View style={styles.c}>
    <Ionicons name={icon as any} size={64} color={COLORS.textLight} />
    <Text style={styles.t}>{title}</Text>
    <Text style={styles.m}>{message}</Text>
    {actionLabel && onAction && (<TouchableOpacity style={styles.b} onPress={onAction}><Text style={styles.bt}>{actionLabel}</Text></TouchableOpacity>)}
  </View>
);
const styles = StyleSheet.create({
  c: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xxl },
  t: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.text, marginTop: SPACING.base, textAlign: 'center' },
  m: { fontSize: SIZES.base, color: COLORS.textSecondary, marginTop: SPACING.sm, textAlign: 'center', lineHeight: 22 },
  b: { marginTop: SPACING.xl, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, backgroundColor: COLORS.primary, borderRadius: 8 },
  bt: { color: COLORS.white, fontSize: SIZES.base, fontWeight: '600' },
});
