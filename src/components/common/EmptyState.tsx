import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING } from '../../config/theme';

interface EmptyStateProps { icon?: string; title: string; message: string; actionLabel?: string; onAction?: () => void; }

export const EmptyState: React.FC<EmptyStateProps> = ({ icon = 'alert-circle-outline', title, message, actionLabel, onAction }) => (
  <View style={styles.container}>
    <Ionicons name={icon as any} size={64} color={COLORS.textLight} />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    {actionLabel && onAction && <TouchableOpacity style={styles.button} onPress={onAction}><Text style={styles.buttonText}>{actionLabel}</Text></TouchableOpacity>}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xxl },
  title: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.text, marginTop: SPACING.base, textAlign: 'center' },
  message: { fontSize: SIZES.base, color: COLORS.textSecondary, marginTop: SPACING.sm, textAlign: 'center', lineHeight: 22 },
  button: { marginTop: SPACING.xl, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, backgroundColor: COLORS.primary, borderRadius: 8 },
  buttonText: { color: COLORS.white, fontSize: SIZES.base, fontWeight: '600' },
});
