import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { COLORS, SIZES } from '../../config/theme';

interface SplashScreenProps { onFinish: () => void; }

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => onFinish());
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.logoIcon}>🏨</Text>
        <Text style={styles.title}>Go Reserve</Text>
        <Text style={styles.subtitle}>Discover & Reserve Nearby Places</Text>
      </Animated.View>
      <Text style={styles.footer}>Powered by Firebase</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center' },
  logoIcon: { fontSize: 72, marginBottom: 16 },
  title: { fontSize: SIZES.title, fontWeight: '800', color: COLORS.white, letterSpacing: 1 },
  subtitle: { fontSize: SIZES.base, color: 'rgba(255,255,255,0.8)', marginTop: 8 },
  footer: { position: 'absolute', bottom: 50, fontSize: SIZES.sm, color: 'rgba(255,255,255,0.5)' },
});
