import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ============================================
// DOSHA PROGRESS BAR
// ============================================

const DoshaBar = ({ name, percentage, color }) => (
  <View style={styles.doshaRow}>
    <View style={styles.doshaTop}>
      <View style={styles.doshaNameRow}>
        <View style={[styles.doshaDot, { backgroundColor: color }]} />
        <Text style={styles.doshaName}>{name}</Text>
      </View>
      <Text style={[styles.doshaPct, { color }]}>{percentage}%</Text>
    </View>
    <View style={styles.barBg}>
      <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: color }]} />
    </View>
  </View>
);

// ============================================
// STAT CARD
// ============================================

const StatCard = ({ value, label, color }) => (
  <View style={styles.statCard}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ============================================
// HEALTH INFO CARD
// ============================================

const HealthCard = ({ icon, iconBg, label, value, tags }) => (
  <View style={styles.healthCard}>
    <View style={[styles.healthIcon, { backgroundColor: iconBg }]}>
      <Ionicons name={icon} size={20} color={iconBg === '#EDE9FE' ? '#7C3AED' : iconBg === '#D1FAE5' ? '#059669' : iconBg === '#FEF3C7' ? '#D97706' : iconBg === '#DBEAFE' ? '#1D4ED8' : iconBg === '#FCE7F3' ? '#DB2777' : '#7C3AED'} />
    </View>
    <Text style={styles.healthLabel}>{label}</Text>
    {value ? (
      <Text style={styles.healthValue}>{value}</Text>
    ) : (
      <View style={styles.tagRow}>
        {tags?.map((tag, i) => (
          <View key={i} style={[styles.tag, { backgroundColor: tag.bg }]}>
            <Text style={[styles.tagText, { color: tag.color }]}>{tag.label}</Text>
          </View>
        ))}
      </View>
    )}
  </View>
);

// ============================================
// DINACHARYA ITEM
// ============================================

const DinacharyaItem = ({ icon, iconBg, title, subtitle, done }) => (
  <View style={styles.activityItem}>
    <View style={[styles.actIcon, { backgroundColor: iconBg }]}>
      <Ionicons name={icon} size={20} color={iconBg === '#FEF3C7' ? '#D97706' : iconBg === '#EDE9FE' ? '#7C3AED' : iconBg === '#D1FAE5' ? '#059669' : iconBg === '#DBEAFE' ? '#1D4ED8' : '#7C3AED'} />
    </View>
    <View style={styles.actInfo}>
      <Text style={styles.actName}>{title}</Text>
      <Text style={styles.actSub}>{subtitle}</Text>
    </View>
    {done ? (
      <View style={styles.doneCheck}>
        <Ionicons name="checkmark" size={16} color="#059669" />
      </View>
    ) : (
      <View style={styles.pendingCheck} />
    )}
  </View>
);

// ============================================
// PROFILE SCREEN
// ============================================

const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Background Decorations */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation?.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#4A5568" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity style={[styles.iconBtn, styles.editBtn]}>
            <Ionicons name="create-outline" size={20} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileCardInner}>
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              <View style={styles.avatarInfo}>
                <Text style={styles.profileName}>John Doe</Text>
                <Text style={styles.profileMeta}>28 yrs · Male · 175 cm · 72 kg</Text>
              </View>
            </View>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Vata-Pitta</Text>
              </View>
              <View style={[styles.badge, styles.badgeGreen]}>
                <Ionicons name="checkmark-circle" size={13} color="#10B981" style={{ marginRight: 4 }} />
                <Text style={[styles.badgeText, styles.badgeGreenText]}>Profile Complete</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <StatCard value="8.2h" label="Sleep" color="#7C3AED" />
          <StatCard value="2.5L" label="Water" color="#10B981" />
          <StatCard value="Low" label="Stress" color="#F59E0B" />
        </View>

        {/* Dosha Balance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dosha Balance</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Details</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <DoshaBar name="Vata" percentage={45} color="#8B5CF6" />
            <DoshaBar name="Pitta" percentage={35} color="#F59E0B" />
            <DoshaBar name="Kapha" percentage={20} color="#10B981" />
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={18} color="#7C3AED" style={{ marginTop: 1 }} />
              <Text style={styles.infoText}>
                Vata is dominant — focus on grounding activities, warm foods & consistent routine.
              </Text>
            </View>
          </View>
        </View>

        {/* Health Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Overview</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.healthGrid}>
            <HealthCard icon="flame-outline" iconBg="#EDE9FE" label="Agni (Digestion)" value="Moderate" />
            <HealthCard icon="leaf-outline" iconBg="#D1FAE5" label="Prakriti Type" value="Vata-Pitta" />
            <HealthCard icon="sunny-outline" iconBg="#FEF3C7" label="Wake-up Time" value="6–7 AM" />
            <HealthCard icon="moon-outline" iconBg="#DBEAFE" label="Sleep Time" value="10–11 PM" />
            <HealthCard
              icon="bandage-outline"
              iconBg="#FCE7F3"
              label="Current Symptoms"
              tags={[
                { label: 'Fatigue', bg: '#FEE2E2', color: '#991B1B' },
                { label: 'Acidity', bg: '#FEE2E2', color: '#991B1B' },
              ]}
            />
            <HealthCard
              icon="restaurant-outline"
              iconBg="#D1FAE5"
              label="Diet Type"
              tags={[
                { label: 'Spicy', bg: '#D1FAE5', color: '#065F46' },
                { label: 'Sweet', bg: '#EDE9FE', color: '#5B21B6' },
              ]}
            />
          </View>
        </View>

        {/* Today's Dinacharya */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Dinacharya</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <DinacharyaItem icon="sunny-outline" iconBg="#FEF3C7" title="Wake up & Oil Pulling" subtitle="6:00 AM · 15 min" done />
            <DinacharyaItem icon="body-outline" iconBg="#EDE9FE" title="Morning Yoga" subtitle="6:30 AM · 45 min" done />
            <DinacharyaItem icon="restaurant-outline" iconBg="#D1FAE5" title="Breakfast" subtitle="8:00 AM · Warm, light meal" done={false} />
            <DinacharyaItem icon="aperture-outline" iconBg="#DBEAFE" title="Evening Meditation" subtitle="6:00 PM · 20 min" done={false} />
            <DinacharyaItem icon="moon-outline" iconBg="#F3E8FF" title="Wind Down & Sleep" subtitle="10:00 PM" done={false} />
          </View>
        </View>

        {/* Medical Safety */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medical Safety</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Update</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            {[
              { label: 'Diagnosed Conditions', value: 'None', valueColor: '#10B981' },
              { label: 'Current Medications', value: 'None', valueColor: '#10B981' },
              { label: 'Food / Herb Allergies', value: 'None listed', valueColor: '#10B981' },
            ].map((item, i, arr) => (
              <View key={i} style={[styles.safetyRow, i < arr.length - 1 && styles.safetyBorder]}>
                <Text style={styles.safetyLabel}>{item.label}</Text>
                <Text style={[styles.safetyValue, { color: item.valueColor }]}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Update Profile Button */}
        <TouchableOpacity style={styles.updateBtn} activeOpacity={0.85}>
          <Ionicons name="create-outline" size={20} color="white" />
          <Text style={styles.updateBtnText}>Update Profile</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
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
  bgCircle1: {
    position: 'absolute',
    top: -80,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
  },
  bgCircle2: {
    position: 'absolute',
    top: 200,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(16, 185, 129, 0.03)',
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    backgroundColor: '#F3E8FF',
    borderColor: '#DDD6FE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },

  // Profile Card
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 24,
    backgroundColor: '#7C3AED',
    overflow: 'hidden',
  },
  profileCardInner: {
    padding: 22,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 18,
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  avatarInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  profileMeta: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  badgeGreen: {
    backgroundColor: 'rgba(16,185,129,0.25)',
    borderColor: 'rgba(16,185,129,0.5)',
  },
  badgeGreenText: {
    color: '#6EE7B7',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Section
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  seeAll: {
    fontSize: 13,
    color: '#7C3AED',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },

  // Dosha
  doshaRow: {
    marginBottom: 14,
  },
  doshaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  doshaNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  doshaDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  doshaName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  doshaPct: {
    fontSize: 13,
    fontWeight: '700',
  },
  barBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F3E8FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#6D28D9',
    fontWeight: '500',
    lineHeight: 19,
  },

  // Health Grid
  healthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 10,
  },
  healthCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    width: (width - 50) / 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  healthIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  healthLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  healthValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Dinacharya
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  actIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actInfo: {
    flex: 1,
  },
  actName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  actSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  doneCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },

  // Medical Safety
  safetyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  safetyBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  safetyLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  safetyValue: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Update Button
  updateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    height: 54,
    backgroundColor: '#10B981',
    borderRadius: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  updateBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
});

export default ProfileScreen;