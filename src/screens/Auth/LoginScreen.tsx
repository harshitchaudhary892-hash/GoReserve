import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING, RADIUS } from '../../config/theme';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';

interface LoginScreenProps { navigation: any; }

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { signIn } = useAuth();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try { await signIn(email.trim(), password); }
    catch (error: any) {
      let message = 'Login failed.';
      if (error.code === 'auth/user-not-found') message = 'No account found with this email';
      else if (error.code === 'auth/wrong-password') message = 'Incorrect password';
      else if (error.code === 'auth/invalid-email') message = 'Invalid email address';
      Alert.alert('Login Error', message);
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logoIcon}>🏨</Text>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue with Go Reserve</Text>
        </View>
        <View style={styles.form}>
          <Input label="Email" placeholder="Enter your email" value={email} onChangeText={(text) => { setEmail(text); if (errors.email) setErrors({ ...errors, email: undefined }); }} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} error={errors.email} leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />} />
          <Input label="Password" placeholder="Enter your password" value={password} onChangeText={(text) => { setPassword(text); if (errors.password) setErrors({ ...errors, password: undefined }); }} secureTextEntry={!showPassword} error={errors.password} leftIcon={<Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />} rightIcon={<TouchableOpacity onPress={() => setShowPassword(!showPassword)}><Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} /></TouchableOpacity>} />
          <TouchableOpacity style={styles.forgotButton} onPress={() => navigation.navigate('ForgotPassword')}><Text style={styles.forgotText}>Forgot Password?</Text></TouchableOpacity>
          <Button title="Sign In" onPress={handleLogin} loading={loading} fullWidth size="large" />
          <View style={styles.divider}><View style={styles.dividerLine} /><Text style={styles.dividerText}>or</Text><View style={styles.dividerLine} /></View>
          <Button title="Create New Account" onPress={() => navigation.navigate('Signup')} variant="outline" fullWidth size="large" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: SPACING.xl },
  header: { alignItems: 'center', marginBottom: SPACING.xxxl },
  logoIcon: { fontSize: 56, marginBottom: SPACING.base },
  title: { fontSize: SIZES.xxl, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.xs },
  subtitle: { fontSize: SIZES.base, color: COLORS.textSecondary },
  form: { width: '100%' },
  forgotButton: { alignSelf: 'flex-end', marginBottom: SPACING.lg, marginTop: -SPACING.xs },
  forgotText: { color: COLORS.primary, fontSize: SIZES.sm, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { marginHorizontal: SPACING.base, color: COLORS.textSecondary, fontSize: SIZES.sm },
});
