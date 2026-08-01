import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, SPACING } from '../../config/theme';
export const LoadingScreen: React.FC<{ message?: string; fullScreen?: boolean }> = ({ message = 'Loading...', fullScreen = true }) => (
  <View style={fullScreen ? styles.fs : styles.il}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    {message && <Text style={styles.m}>{message}</Text>}
  </View>
);
const styles = StyleSheet.create({
  fs: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  il: { justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  m: { marginTop: SPACING.base, fontSize: SIZES.base, color: COLORS.textSecondary },
});
