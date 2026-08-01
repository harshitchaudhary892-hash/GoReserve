import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING, RADIUS, SHADOWS } from '../../config/theme';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserProfile } from '../../services/user';
import { getInitials } from '../../utils/helpers';

interface ProfileScreenProps { navigation: any; }

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, userProfile, signOut, refreshUserProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSave = useCallback(async () => {
    if (!user || !displayName.trim()) return;
    setSaving(true);
    try { await updateUserProfile(user.uid, { displayName: displayName.trim(), phone: phone.trim() || undefined }); await refreshUserProfile(); setEditing(false); Alert.alert('Success', 'Profile updated.'); }
    catch (error) { Alert.alert('Error', 'Failed to update profile.'); }
    finally { setSaving(false); }
  }, [user, displayName, phone]);

  const handleSignOut = useCallback(async () => {
    Alert.alert('Sign Out', 'Are you sure?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Sign Out', style: 'destructive', onPress: async () => { setSigningOut(true); try { await signOut(); } catch (error) { Alert.alert('Error', 'Failed to sign out.'); setSigningOut(false); } } }]);
  }, [signOut]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {userProfile?.photoURL ? <Image source={{ uri: userProfile.photoURL }} style={styles.avatar} /> : <View style={styles.avatarPlaceholder}><Text style={styles.avatarText}>{getInitials(userProfile?.displayName || user?.displayName || 'User')}</Text></View>}
          </View>
          <Text style={styles.displayName}>{userProfile?.displayName || user?.displayName || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.stats}><View style={styles.statItem}><Text style={styles.statNumber}>{userProfile?.favorites?.length || 0}</Text><Text style={styles.statLabel}>Favorites</Text></View></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          {editing ? (
            <View style={styles.editForm}>
              <Input label="Display Name" value={displayName} onChangeText={setDisplayName} placeholder="Enter your name" leftIcon={<Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />} />
              <Input label="Phone Number" value={phone} onChangeText={setPhone} placeholder="Enter your phone" keyboardType="phone-pad" leftIcon={<Ionicons name="call-outline" size={20} color={COLORS.textSecondary} />} />
              <View style={styles.editActions}><Button title="Cancel" onPress={() => { setEditing(false); setDisplayName(userProfile?.displayName || ''); setPhone(userProfile?.phone || ''); }} variant="outline" style={{ flex: 1 }} /><Button title="Save Changes" onPress={handleSave} loading={saving} style={{ flex: 1 }} /></View>
            </View>
          ) : (
            <View>
              <TouchableOpacity style={styles.infoCard} onPress={() => setEditing(true)}><Ionicons name="person-outline" size={20} color={COLORS.primary} /><View style={styles.infoContent}><Text style={styles.infoLabel}>Name</Text><Text style={styles.infoValue}>{userProfile?.displayName || 'Not set'}</Text></View><Ionicons name="chevron-forward" size={18} color={COLORS.textLight} /></TouchableOpacity>
              <View style={styles.infoCard}><Ionicons name="mail-outline" size={20} color={COLORS.primary} /><View style={styles.infoContent}><Text style={styles.infoLabel}>Email</Text><Text style={styles.infoValue}>{user?.email}</Text></View></View>
              <TouchableOpacity style={styles.infoCard} onPress={() => setEditing(true)}><Ionicons name="call-outline" size={20} color={COLORS.primary} /><View style={styles.infoContent}><Text style={styles.infoLabel}>Phone</Text><Text style={styles.infoValue}>{userProfile?.phone || 'Not set'}</Text></View><Ionicons name="chevron-forward" size={18} color={COLORS.textLight} /></TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}><Text style={styles.sectionTitle}>Quick Links</Text><TouchableOpacity style={styles.linkCard} onPress={() => navigation.navigate('Favorites')}><Ionicons name="heart-outline" size={20} color={COLORS.heart} /><Text style={styles.linkText}>My Favorites</Text><Text style={styles.linkCount}>{userProfile?.favorites?.length || 0}</Text><Ionicons name="chevron-forward" size={18} color={COLORS.textLight} /></TouchableOpacity></View>

        <View style={styles.section}><Text style={styles.sectionTitle}>About</Text><View style={styles.infoCard}><Ionicons name="information-circle-outline" size={20} color={COLORS.primary} /><View style={styles.infoContent}><Text style={styles.infoLabel}>App Version</Text><Text style={styles.infoValue}>1.0.0</Text></View></View><View style={styles.infoCard}><Ionicons name="cloud-done-outline" size={20} color={COLORS.success} /><View style={styles.infoContent}><Text style={styles.infoLabel}>Database</Text><Text style={styles.infoValue}>Firebase Firestore</Text></View></View></View>

        <View style={[styles.section, { marginBottom: SPACING.xxxl }]}><Button title="Sign Out" onPress={handleSignOut} variant="outline" fullWidth size="large" loading={signingOut} icon={<Ionicons name="log-out-outline" size={18} color={COLORS.error} />} style={{ borderColor: COLORS.error }} textStyle={{ color: COLORS.error }} /></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  profileHeader: { alignItems: 'center', paddingVertical: SPACING.xxl, backgroundColor: COLORS.surface, ...SHADOWS.small },
  avatarContainer: { marginBottom: SPACING.base },
  avatar: { width: 88, height: 88, borderRadius: 44, borderWidth: 3, borderColor: COLORS.primary },
  avatarPlaceholder: { width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: COLORS.primaryLight },
  avatarText: { fontSize: SIZES.xxl, fontWeight: '700', color: COLORS.white },
  displayName: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.text },
  email: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  stats: { flexDirection: 'row', marginTop: SPACING.lg, gap: SPACING.xxxl },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: SIZES.xl, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  section: { paddingHorizontal: SPACING.base, marginTop: SPACING.xl },
  sectionTitle: { fontSize: SIZES.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  editForm: { gap: SPACING.sm },
  editActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.base },
  infoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, padding: SPACING.base, borderRadius: RADIUS.md, marginBottom: SPACING.sm, ...SHADOWS.small, gap: SPACING.md },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: SIZES.xs, color: COLORS.textSecondary },
  infoValue: { fontSize: SIZES.base, color: COLORS.text, fontWeight: '500' },
  linkCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, padding: SPACING.base, borderRadius: RADIUS.md, ...SHADOWS.small, gap: SPACING.md },
  linkText: { flex: 1, fontSize: SIZES.base, color: COLORS.text, fontWeight: '500' },
  linkCount: { fontSize: SIZES.base, color: COLORS.primary, fontWeight: '600' },
});
