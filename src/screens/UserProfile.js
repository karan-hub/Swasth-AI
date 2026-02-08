import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      'Increase energy levels',
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
  email: 'john.doe@ayurveda.com',
  firstName: 'John',
  lastName: 'Doe',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
  bio: 'Ayurveda enthusiast focused on holistic wellness. Passionate about natural healing, yoga, and balanced living. Following Ayurvedic principles for 3 years.',
  phoneNumber: '+1-234-567-8900',
  dateOfBirth: new Date('1990-05-15'),
  address: {
    street: '123 Wellness Street',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    zipCode: '249201',
    country: 'India',
  },
  socialLinks: {
    instagram: '@ayurveda_wellness',
    youtube: 'youtube.com/ayurvedic_living',
    website: 'ayurvedicwellness.com',
  },
});

// ============================================
// COMPONENTS
// ============================================

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
        <Ionicons name="quote" size={24} color="#CBD5E1" style={styles.quoteIcon} />
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
    </View>

    {/* Lifestyle & Wellness Goals */}
    <View style={styles.doubleSection}>
      <View style={styles.halfSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="restaurant-outline" size={18} color="#059669" />
          <Text style={styles.sectionTitleSmall}>Lifestyle</Text>
        </View>
        <View style={styles.lifestyleCard}>
          <InfoRow label="Diet" value={user.lifestyle.diet} icon="nutrition-outline" color="#059669" />
          <InfoRow label="Exercise" value={user.lifestyle.exercise} icon="fitness-outline" color="#3B82F6" />
          <InfoRow label="Sleep" value={user.lifestyle.sleep} icon="bed-outline" color="#8B5CF6" />
          <InfoRow label="Stress" value={user.lifestyle.stressLevel} icon="flash-outline" color="#DC2626" />
        </View>
      </View>

      <View style={styles.halfSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="trophy-outline" size={18} color="#7C3AED" />
          <Text style={styles.sectionTitleSmall}>Wellness Goals</Text>
        </View>
        <View style={styles.goalsCard}>
          {user.wellnessGoals.map((goal, index) => (
            <GoalItem key={index} goal={goal} index={index} />
          ))}
        </View>
      </View>
    </View>

    {/* Ayurvedic Medications */}
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="leaf-outline" size={20} color="#059669" />
        <Text style={styles.sectionTitle}>Ayurvedic Medications</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#7C3AED" />
        </TouchableOpacity>
      </View>
      <View style={styles.medicationsCard}>
        {user.medications.map((medication, index) => (
          <MedicationItem key={index} medication={medication} />
        ))}
      </View>
    </View>

    {/* Contact Information */}
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="call-outline" size={20} color="#3B82F6" />
        <Text style={styles.sectionTitle}>Contact Information</Text>
      </View>
      <View style={styles.contactCard}>
        <InfoRow label="Email" value={user.email} icon="mail-outline" color="#EC4899" />
        <InfoRow label="Phone" value={user.phoneNumber} icon="call-outline" color="#3B82F6" />
        <InfoRow label="Location" value={user.address.city} icon="location-outline" color="#10B981" />
        <InfoRow label="Member Since" value={user.createdAt.toLocaleDateString()} icon="calendar-outline" color="#8B5CF6" />
      </View>
    </View>

    {/* Social Links */}
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="share-social-outline" size={20} color="#7C3AED" />
        <Text style={styles.sectionTitle}>Connect with Me</Text>
      </View>
      <View style={styles.socialLinksCard}>
        {user.socialLinks.instagram && (
          <TouchableOpacity style={styles.socialButton}>
            <View style={[styles.socialIcon, { backgroundColor: '#E1306C' }]}>
              <Ionicons name="logo-instagram" size={20} color="white" />
            </View>
            <Text style={styles.socialText}>{user.socialLinks.instagram}</Text>
          </TouchableOpacity>
        )}
        {user.socialLinks.youtube && (
          <TouchableOpacity style={styles.socialButton}>
            <View style={[styles.socialIcon, { backgroundColor: '#FF0000' }]}>
              <Ionicons name="logo-youtube" size={20} color="white" />
            </View>
            <Text style={styles.socialText}>{user.socialLinks.youtube}</Text>
          </TouchableOpacity>
        )}
        {user.socialLinks.website && (
          <TouchableOpacity style={styles.socialButton}>
            <View style={[styles.socialIcon, { backgroundColor: '#7C3AED' }]}>
              <Ionicons name="globe-outline" size={20} color="white" />
            </View>
            <Text style={styles.socialText}>{user.socialLinks.website}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>

    {/* Appointments */}
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="calendar-outline" size={20} color="#10B981" />
        <Text style={styles.sectionTitle}>Appointments</Text>
      </View>
      <View style={styles.appointmentsContainer}>
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <Ionicons name="checkmark-done-circle-outline" size={20} color="#059669" />
            <Text style={styles.appointmentTitle}>Last Checkup</Text>
          </View>
          <Text style={styles.appointmentDate}>{user.lastCheckup}</Text>
        </View>
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <Ionicons name="time-outline" size={20} color="#3B82F6" />
            <Text style={styles.appointmentTitle}>Next Appointment</Text>
          </View>
          <Text style={styles.appointmentDate}>{user.nextAppointment}</Text>
        </View>
      </View>
    </View>

    <View style={{ height: 30 }} />
  </ScrollView>
);

// ============================================
// MAIN APP COMPONENT
// ============================================

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Ionicons name="person-circle-outline" size={28} color="#7C3AED" />
            <Text style={styles.headerTitle}>Ayurvedic Profile</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={22} color="#7C3AED" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Content */}
      <View style={styles.content}>
        <ProfileScreen user={sampleUser} />
      </View>
    </SafeAreaView>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  backgroundCircle1: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
  },
  backgroundCircle2: {
    position: 'absolute',
    top: 50,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(16, 185, 129, 0.03)',
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(124, 58, 237, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
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
    backgroundImage: 'linear-gradient(135deg, #7C3AED 0%, #10B981 100%)',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
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
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  username: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  doshaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
  },
  doshaText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
  },
  
  // Section Styles
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionTitleSmall: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  viewAllText: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '600',
  },
  
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
  },
  quoteIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    opacity: 0.5,
  },
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
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
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
    marginBottom: 8,
  },
  appointmentTitle: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  appointmentDate: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
});

export default App;