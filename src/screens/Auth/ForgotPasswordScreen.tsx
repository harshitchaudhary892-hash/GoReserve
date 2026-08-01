import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING } from '../../config/theme';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';

interface ForgotPasswordScreenProps { navigation: any; }

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const handleReset = async () => {
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Invalid email address'); return; }
    setLoading(true); setError('');
    try { await resetPassword(email.trim()); setSent(true); }
    catch (err: any) {
      let message = 'Failed to send reset email.';
      if (err.code === 'auth/user-not-found') message = 'No account found with this email';
      setError(message);
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.iconContainer}><Ionicons name="key-outline" size={48} color={COLORS.primary} /></View>
          <Text style={styles.title}>{sent ? 'Check Your Email' : 'Forgot Password'}</Text>
          <Text style={styles.subtitle}>{sent ? `We've sent a password reset link to ${email}.` : "Enter your email and we'll send you a reset link."}</Text>
        </View>
        {!sent ? (
          <View style={styles.form}>
            <Input label="Email" placeholder="Enter your email" value={email} onChangeText={(text) => { setEmail(text); setError(''); }} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} error={error} leftIcon={<Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />} />
            <Button title="Send Reset Link" onPress={handleReset} loading={loading} fullWidth size="large" />
          </View>
        ) : (
          <View style={styles.form}>
            <Button title="Back to Login" onPress={() => navigation.navigate('Login')} fullWidth size="large" />
            <View style={{ marginTop: SPACING.base }}><Button title="Resend Email" onPress={handleReset} variant="outline" fullWidth size="large" /></View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: SPACING.xl },
  header: { alignItems: 'center', marginBottom: SPACING.xxxl },
  iconContainer: { width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.lg },
  title: { fontSize: SIZES.xxl, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.sm, textAlign: 'center' },
  subtitle: { fontSize: SIZES.base, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, paddingHorizontal: SPACING.lg },
  form: { width: '100%' },
});
