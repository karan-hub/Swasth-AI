import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
<<<<<<< HEAD
  Image,
  Dimensions,
=======
  Switch,
  SafeAreaView,
  StatusBar,
  Alert,
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';

<<<<<<< HEAD
const { width } = Dimensions.get('window');

// ============================================
// USER PROFILE DATA & UTILITIES
// ============================================

// Create a sample user profile
const createUserProfile = (data) => {
  const now = new Date();

  return {
    id: data.id || `user_${Date.now()}`,
    username: data.username || '',
    email: data.email || '',
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    avatar: data.avatar || null,
    bio: data.bio || '',
    phoneNumber: data.phoneNumber || '',
    dateOfBirth: data.dateOfBirth || null,
    address: data.address || null,
    socialLinks: data.socialLinks || null,
    preferences: data.preferences || {
      theme: 'auto',
      notifications: true,
      language: 'en',
      emailUpdates: true,
    },
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    isActive: data.isActive !== undefined ? data.isActive : true,
    // Ayurvedic specific fields
    dosha: data.dosha || 'Vata-Pitta',
    healthScore: data.healthScore || 85,
    lastCheckup: data.lastCheckup || '2024-02-15',
    nextAppointment: data.nextAppointment || '2024-03-20',
    lifestyle: data.lifestyle || {
      diet: 'Vegetarian',
      exercise: 'Yoga & Meditation',
      sleep: '7-8 hours',
      stressLevel: 'Medium',
    },
    medications: data.medications || [
      'Ashwagandha',
      'Turmeric',
      'Triphala',
    ],
    wellnessGoals: data.wellnessGoals || [
      'Improve digestion',
      'Reduce stress',
      'Better sleep quality',
      'Increase energy ',
    ],
  };
};

// Get user's full name
const getFullName = (user) => {
  return `${user.firstName} ${user.lastName}`.trim();
};

// Calculate user's age
const getUserAge = (user) => {
  if (!user.dateOfBirth) return null;

  const today = new Date();
  const birthDate = new Date(user.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

// Sample user data
const sampleUser = createUserProfile({
  username: 'ayurvedic_wellness',
  email: 'gayatri4334@gmail.com',
  firstName: 'Gayatri',
  lastName: '...',
  avatar: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fthumbnails%2F045%2F711%2F171%2Fsmall_2x%2Fdefault-placeholder-avatar-profile-on-gray-background-woman-with-dark-hair-in-silhouette-greyscale-vector.jpg&f=1&nofb=1&ipt=0a3a6621f515ca6674bbedfa41962d90ae2c66eb089c2c74f928e9984d2f595c',
  bio: 'Ayurveda enthusiast focused on holistic wellness. Passionate about natural healing, yoga, and balanced living. Following Ayurvedic principles for 3 years.',
  phoneNumber: '+91-9867453421',
  dateOfBirth: new Date('1990-05-15'),
  address: {
    street: '123 ABC Street',
    city: 'pune',
    state: 'Maharashtra',
    zipCode: '249201',
    country: 'India',
  }
});

=======
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
// ============================================
// COMPONENTS
// ============================================

<<<<<<< HEAD
// Info Row Component
const InfoRow = ({ label, value, icon, color = '#7C3AED' }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconContainer}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

// Wellness Card Component
const WellnessCard = ({ title, value, icon, color, unit = '' }) => (
  <View style={[styles.wellnessCard, { borderLeftColor: color }]}>
    <View style={styles.wellnessHeader}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={styles.wellnessTitle}>{title}</Text>
    </View>
    <View style={styles.wellnessValueContainer}>
      <Text style={[styles.wellnessValue, { color }]}>{value}</Text>
      {unit && <Text style={styles.wellnessUnit}>{unit}</Text>}
    </View>
  </View>
);

// Goal Item Component
const GoalItem = ({ goal, index }) => (
  <View style={styles.goalItem}>
    <View style={[styles.goalIndicator, { backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899'][index % 4] }]}>
      <Text style={styles.goalNumber}>{index + 1}</Text>
    </View>
    <Text style={styles.goalText}>{goal}</Text>
    <Ionicons name="checkmark-circle-outline" size={20} color="#94A3B8" />
  </View>
);

// Medication Item Component
const MedicationItem = ({ medication }) => (
  <View style={styles.medicationItem}>
    <View style={styles.medicationIcon}>
      <Ionicons name="leaf-outline" size={16} color="#059669" />
    </View>
    <Text style={styles.medicationText}>{medication}</Text>
  </View>
);

// ============================================
// PROFILE SCREEN
// ============================================

const ProfileScreen = ({ user }) => (
  <ScrollView
    style={styles.screenContainer}
    showsVerticalScrollIndicator={false}
  >
    {/* Background decorative elements */}
    <View style={styles.backgroundCircle1} />
    <View style={styles.backgroundCircle2} />

    {/* Header Section with Gradient */}
    <View style={styles.profileHeader}>
      <View style={styles.headerGradient}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.avatarStatus}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          </View>
        </View>

        {/* User Info */}
        <Text style={styles.profileName}>{getFullName(user)}</Text>
        <View style={styles.usernameContainer}>
          <Ionicons name="at" size={16} color="#7C3AED" />
          <Text style={styles.username}>@{user.username}</Text>
        </View>

        {/* Dosha Tag */}
        <View style={styles.doshaTag}>
          <Ionicons name="heart-circle-outline" size={16} color="#DC2626" />
          <Text style={styles.doshaText}>{user.dosha} Dosha</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{getUserAge(user)}</Text>
          <Text style={styles.statLabel}>Age</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.healthScore}%</Text>
          <Text style={styles.statLabel}>Health Score</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Years</Text>
        </View>
      </View>
    </View>

    {/* Bio Section */}
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="document-text-outline" size={20} color="#7C3AED" />
        <Text style={styles.sectionTitle}>About</Text>
      </View>
      <View style={styles.bioCard}>
        <Text style={styles.bio}>{user.bio}</Text>
      </View>
    </View>

    {/* Wellness Overview */}
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="pulse-outline" size={20} color="#DC2626" />
        <Text style={styles.sectionTitle}>Wellness Overview</Text>
      </View>
      <View style={styles.wellnessGrid}>
        <WellnessCard
          title="Sleep Quality"
          value="8.2"
          unit="hours"
          icon="moon-outline"
          color="#8B5CF6"
        />
        <WellnessCard
          title="Stress Level"
          value="Medium"
          icon="trending-down-outline"
          color="#3B82F6"
        />
        <WellnessCard
          title="Exercise"
          value="45"
          unit="min/day"
          icon="barbell-outline"
          color="#10B981"
        />
        <WellnessCard
          title="Meditation"
          value="20"
          unit="min/day"
          icon="time-outline"
          color="#EC4899"
        />
      </View>
=======
const SettingRow = ({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  onPress,
  rightElement,
  danger = false,
}) => (
  <TouchableOpacity
    style={styles.row}
    onPress={onPress}
    activeOpacity={onPress ? 0.6 : 1}
  >
    <View style={[styles.rowIcon, { backgroundColor: danger ? '#FEF2F2' : iconBg }]}>
      <Ionicons
        name={icon}
        size={19}
        color={danger ? '#DC2626' : iconColor}
      />
    </View>
    <View style={styles.rowBody}>
      <Text style={[styles.rowTitle, danger && styles.dangerText]}>{title}</Text>
      {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
    </View>
    <View style={styles.rowRight}>
      {rightElement}
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
    </View>
  </TouchableOpacity>
);

const SettingToggle = ({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  value,
  onValueChange,
}) => (
  <View style={styles.row}>
    <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
      <Ionicons name={icon} size={19} color={iconColor} />
    </View>
    <View style={styles.rowBody}>
      <Text style={styles.rowTitle}>{title}</Text>
      {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#E2E8F0', true: '#10B981' }}
      thumbColor="#ffffff"
      ios_backgroundColor="#E2E8F0"
    />
  </View>
);

const BadgeValue = ({ label, green = false }) => (
  <View style={[styles.badge, green && styles.badgeGreen]}>
    <Text style={[styles.badgeText, green && styles.badgeGreenText]}>{label}</Text>
  </View>
);

<<<<<<< HEAD

    <View style={{ height: 30 }} />
  </ScrollView>
=======
const SectionLabel = ({ title }) => (
  <Text style={styles.sectionLabel}>{title}</Text>
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
);

// ============================================
// SETTINGS SCREEN
// ============================================

const SettingsScreen = ({ navigation, user }) => {
  // Notification toggles
  const [pushNotif, setPushNotif] = useState(true);
  const [wellnessReminders, setWellnessReminders] = useState(true);
  const [appointmentAlerts, setAppointmentAlerts] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  // Privacy toggles
  const [twoFactor, setTwoFactor] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => navigation?.replace('Login'),
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone. All your data will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
<<<<<<< HEAD
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Ayurvedic Profile</Text>
=======
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Background decorations */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSub}>Manage your preferences</Text>
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
          </View>
          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Banner */}
        <View style={styles.profileBanner}>
          <View style={styles.bannerAvatar}>
            <Text style={styles.bannerAvatarText}>
              {(user?.firstName?.[0] ?? 'J') + (user?.lastName?.[0] ?? 'D')}
            </Text>
          </View>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerName}>
              {user ? `${user.firstName} ${user.lastName}` : 'John Doe'}
            </Text>
            <Text style={styles.bannerEmail}>
              {user?.email ?? 'john.doe@ayurveda.com'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bannerEditBtn}
            onPress={() => navigation?.navigate('EditProfile')}
          >
            <Text style={styles.bannerEditText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ── Ayurvedic Profile ── */}
        <View style={styles.section}>
          <SectionLabel title="Ayurvedic Profile" />
          <View style={styles.card}>
            <SettingRow
              icon="flame-outline"
              iconBg="#EDE9FE"
              iconColor="#7C3AED"
              title="Prakriti Type"
              subtitle="Your body constitution"
              onPress={() => navigation?.navigate('PrakritiDetail')}
              rightElement={
                <>
                  <BadgeValue label={user?.dosha ?? 'Vata-Pitta'} />
                  <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
                </>
              }
            />
            <SettingRow
              icon="trophy-outline"
              iconBg="#D1FAE5"
              iconColor="#059669"
              title="Health Goals"
              subtitle={`${user?.wellnessGoals?.length ?? 4} active goals`}
              onPress={() => navigation?.navigate('HealthGoals')}
              rightElement={<Ionicons name="chevron-forward" size={16} color="#CBD5E0" />}
            />
            <SettingRow
              icon="leaf-outline"
              iconBg="#FEF3C7"
              iconColor="#D97706"
              title="Current Medications"
              subtitle={user?.medications?.join(', ') ?? 'Ashwagandha, Turmeric, Triphala'}
              onPress={() => navigation?.navigate('Medications')}
              rightElement={<Ionicons name="chevron-forward" size={16} color="#CBD5E0" />}
            />
            <SettingRow
              icon="pulse-outline"
              iconBg="#DBEAFE"
              iconColor="#1D4ED8"
              title="Health Score"
              subtitle="Last updated today"
              onPress={() => navigation?.navigate('HealthScore')}
              rightElement={
                <>
                  <BadgeValue label={`${user?.healthScore ?? 85}%`} green />
                  <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
                </>
              }
            />
          </View>
        </View>

        {/* ── Notifications ── */}
        <View style={styles.section}>
          <SectionLabel title="Notifications" />
          <View style={styles.card}>
            <SettingToggle
              icon="notifications-outline"
              iconBg="#EDE9FE"
              iconColor="#7C3AED"
              title="Push Notifications"
              subtitle="Reminders & daily tips"
              value={pushNotif}
              onValueChange={setPushNotif}
            />
            <SettingToggle
              icon="heart-outline"
              iconBg="#D1FAE5"
              iconColor="#059669"
              title="Wellness Reminders"
              subtitle="Morning & evening routine"
              value={wellnessReminders}
              onValueChange={setWellnessReminders}
            />
            <SettingToggle
              icon="calendar-outline"
              iconBg="#FEF3C7"
              iconColor="#D97706"
              title="Appointment Alerts"
              subtitle="48h & 1h before"
              value={appointmentAlerts}
              onValueChange={setAppointmentAlerts}
            />
            <SettingToggle
              icon="mail-outline"
              iconBg="#FCE7F3"
              iconColor="#DB2777"
              title="Email Updates"
              subtitle="Weekly wellness digest"
              value={emailUpdates}
              onValueChange={setEmailUpdates}
            />
          </View>
        </View>

        {/* ── Appearance ── */}
        <View style={styles.section}>
          <SectionLabel title="Appearance" />
          <View style={styles.card}>
            <SettingRow
              icon="contrast-outline"
              iconBg="#EDE9FE"
              iconColor="#7C3AED"
              title="Theme"
              subtitle="System default"
              onPress={() => navigation?.navigate('ThemeSettings')}
              rightElement={
                <>
                  <BadgeValue label="Auto" />
                  <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
                </>
              }
            />
            <SettingRow
              icon="globe-outline"
              iconBg="#D1FAE5"
              iconColor="#059669"
              title="Language"
              subtitle="App display language"
              onPress={() => navigation?.navigate('LanguageSettings')}
              rightElement={
                <>
                  <BadgeValue label="English" />
                  <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
                </>
              }
            />
            <SettingRow
              icon="options-outline"
              iconBg="#FEF3C7"
              iconColor="#D97706"
              title="Units"
              subtitle="Height, weight & temperature"
              onPress={() => navigation?.navigate('UnitsSettings')}
              rightElement={
                <>
                  <BadgeValue label="Metric" />
                  <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
                </>
              }
            />
          </View>
        </View>

        {/* ── Privacy & Security ── */}
        <View style={styles.section}>
          <SectionLabel title="Privacy & Security" />
          <View style={styles.card}>
            <SettingRow
              icon="lock-closed-outline"
              iconBg="#EDE9FE"
              iconColor="#7C3AED"
              title="Change Password"
              subtitle="Last changed 3 months ago"
              onPress={() => navigation?.navigate('ChangePassword')}
              rightElement={<Ionicons name="chevron-forward" size={16} color="#CBD5E0" />}
            />
            <SettingToggle
              icon="shield-checkmark-outline"
              iconBg="#D1FAE5"
              iconColor="#059669"
              title="Two-Factor Auth"
              subtitle="Extra account security"
              value={twoFactor}
              onValueChange={setTwoFactor}
            />
            <SettingToggle
              icon="eye-outline"
              iconBg="#FEF3C7"
              iconColor="#D97706"
              title="Data Sharing"
              subtitle="Anonymous usage analytics"
              value={dataSharing}
              onValueChange={setDataSharing}
            />
            <SettingRow
              icon="document-text-outline"
              iconBg="#DBEAFE"
              iconColor="#1D4ED8"
              title="Privacy Policy"
              subtitle="How we use your data"
              onPress={() => navigation?.navigate('PrivacyPolicy')}
              rightElement={<Ionicons name="chevron-forward" size={16} color="#CBD5E0" />}
            />
          </View>
        </View>

        {/* ── Support ── */}
        <View style={styles.section}>
          <SectionLabel title="Support" />
          <View style={styles.card}>
            <SettingRow
              icon="help-circle-outline"
              iconBg="#D1FAE5"
              iconColor="#059669"
              title="Help & FAQ"
              subtitle="Common questions answered"
              onPress={() => navigation?.navigate('Help')}
              rightElement={<Ionicons name="chevron-forward" size={16} color="#CBD5E0" />}
            />
            <SettingRow
              icon="chatbubble-outline"
              iconBg="#EDE9FE"
              iconColor="#7C3AED"
              title="Contact Support"
              subtitle="Mon–Fri, 9am–6pm IST"
              onPress={() => navigation?.navigate('Support')}
              rightElement={<Ionicons name="chevron-forward" size={16} color="#CBD5E0" />}
            />
            <SettingRow
              icon="star-outline"
              iconBg="#FEF3C7"
              iconColor="#D97706"
              title="Rate the App"
              subtitle="Share your experience"
              onPress={() => {}}
              rightElement={<Ionicons name="chevron-forward" size={16} color="#CBD5E0" />}
            />
          </View>
        </View>

        {/* ── Account ── */}
        <View style={styles.section}>
          <SectionLabel title="Account" />
          <View style={styles.card}>
            <SettingRow
              icon="log-out-outline"
              iconBg="#FEF2F2"
              iconColor="#DC2626"
              title="Sign Out"
              subtitle="You'll need to log in again"
              onPress={handleSignOut}
              danger
              rightElement={<Ionicons name="chevron-forward" size={16} color="#FCA5A5" />}
            />
            <SettingRow
              icon="trash-outline"
              iconBg="#FEF2F2"
              iconColor="#DC2626"
              title="Delete Account"
              subtitle="Permanent — cannot be undone"
              onPress={handleDeleteAccount}
              danger
              rightElement={<Ionicons name="chevron-forward" size={16} color="#FCA5A5" />}
            />
          </View>
        </View>


        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  bgCircle1: {
    position: 'absolute',
    top: -80,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
    pointerEvents: 'none',
  },
  bgCircle2: {
    position: 'absolute',
    top: 260,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(16, 185, 129, 0.03)',
    pointerEvents: 'none',
  },
  scroll: {
    paddingBottom: 20,
  },

  // Header
  header: {
<<<<<<< HEAD
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 6,
    paddingTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,

  },
  headerContent: {
=======
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
<<<<<<< HEAD
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    backgroundImage: 'linear-gradient(135deg, #7C3AED 0%, #10B981 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  // Profile Header Styles
  profileHeader: {
    backgroundColor: 'white',
    marginBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  headerGradient: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundImage: 'linear-gradient(135deg, #7C3AED 10%, #10B981 100%)',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'blue',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
  profileName: {
=======
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerSub: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // Profile Banner
  profileBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
  },
  bannerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bannerAvatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  bannerInfo: {
    flex: 1,
  },
  bannerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 3,
  },
  bannerEmail: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  bannerEditBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  bannerEditText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  // Section
  section: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },

<<<<<<< HEAD
  // Section Styles
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
=======
  // Row
  row: {
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  rowSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dangerText: {
    color: '#DC2626',
  },

  // Badge
  badge: {
    backgroundColor: '#EDE9FE',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
<<<<<<< HEAD

  // Bio Card
  bioCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
=======
  badgeGreen: {
    backgroundColor: '#D1FAE5',
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
  },
  badgeGreenText: {
    color: '#059669',
  },
<<<<<<< HEAD
  bio: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    fontWeight: '500',
  },

  // Wellness Grid
  wellnessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  wellnessCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: (width - 52) / 2,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  wellnessHeader: {
    flexDirection: 'row',
=======

  // Version card
  versionCard: {
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
    alignItems: 'center',
    paddingVertical: 22,
  },
<<<<<<< HEAD
  wellnessTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  wellnessValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  wellnessValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  wellnessUnit: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },

  // Double Section Layout
  doubleSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  halfSection: {
    flex: 1,
  },
  lifestyleCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  goalsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },

  // Info Row
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },

  // Goal Items
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  goalIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalNumber: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
  },
  goalText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },

  // Medications
  medicationsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  medicationIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medicationText: {
    flex: 1,
    fontSize: 15,
    color: '#065F46',
    fontWeight: '600',
  },

  // Contact Card
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },

  // Social Links
  socialLinksCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    flex: 1,
    fontSize: 15,
    color: '#475569',
    fontWeight: '600',
  },

  // Appointments
  appointmentsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  appointmentCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
=======
  versionDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
>>>>>>> 733bef07f557dc9f8b47c8e7bb6aa5830ff4db1a
    marginBottom: 8,
  },
  versionAppName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  versionNum: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
  },
  versionBadge: {
    backgroundColor: '#D1FAE5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  versionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
});

export default SettingsScreen;