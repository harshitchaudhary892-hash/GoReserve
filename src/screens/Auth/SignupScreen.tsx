import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING } from '../../config/theme';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';

interface SignupScreenProps { navigation: any; }

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signUp } = useAuth();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!displayName.trim()) newErrors.displayName = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp(email.trim(), password, displayName.trim());
    } catch (error: any) {
      let message = 'Sign up failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') message = 'An account with this email already exists';
      else if (error.code === 'auth/invalid-email') message = 'Invalid email address';
      else if (error.code === 'auth/weak-password') message = 'Password is too weak';
      Alert.alert('Sign Up Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logoIcon}>🏨</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Go Reserve and discover amazing places</Text>
        </View>
        <View style={styles.form}>
          <Input label="Full Name" placeholder="Enter your full name" value={displayName} onChangeText={(text) => { setDisplayName(text); if (errors.displayName) setErrors({ ...errors, displayName: '' }); }} autoCapitalize="words" error={errors.displayName} leftIcon={<Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />} />
          <Input label="Email" placeholder="Enter your email" value={email} onChangeText={(text) => { setEmail(text); if (errors.email) setErrors({ ...errors, email: '' }); }} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} error={errors.email} leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />} />
          <Input label="Password" placeholder="Create a password (min. 6 characters)" value={password} onChangeText={(text) => { setPassword(text); if (errors.password) setErrors({ ...errors, password: '' }); }} secureTextEntry={!showPassword} error={errors.password} leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />} rightIcon={<TouchableOpacity onPress={() => setShowPassword(!showPassword)}><Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} /></TouchableOpacity>} />
          <Input label="Confirm Password" placeholder="Re-enter your password" value={confirmPassword} onChangeText={(text) => { setConfirmPassword(text); if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' }); }} secureTextEntry={!showPassword} error={errors.confirmPassword} leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />} />
          <View style={{ marginTop: SPACING.base }}><Button title="Sign Up" onPress={handleSignUp} loading={loading} fullWidth size="large" /></View>
          <View style={styles.footer}><Text style={styles.footerText}>Already have an account? </Text><TouchableOpacity onPress={() => navigation.navigate('Login')}><Text style={styles.footerLink}>Sign In</Text></TouchableOpacity></View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: SPACING.xl },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  logoIcon: { fontSize: 48, marginBottom: SPACING.base },
  title: { fontSize: SIZES.xxl, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.xs },
  subtitle: { fontSize: SIZES.base, color: COLORS.textSecondary },
  form: { width: '100%' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
  footerText: { fontSize: SIZES.base, color: COLORS.textSecondary },
  footerLink: { fontSize: SIZES.base, color: COLORS.primary, fontWeight: '700' },
});
