import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SIZES, SPACING } from '../../config/theme';

interface LoadingScreenProps { message?: string; fullScreen?: boolean; style?: ViewStyle; }

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...', fullScreen = true, style }) => (
  <View style={[fullScreen ? styles.fullScreen : styles.inline, style]}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    {message && <Text style={styles.message}>{message}</Text>}
  </View>
);

const styles = StyleSheet.create({
  fullScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  inline: { justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  message: { marginTop: SPACING.base, fontSize: SIZES.base, color: COLORS.textSecondary },
});
