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
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ============================================
// DATA & CONSTANTS
// ============================================

const dailyRoutine = [
  { id: '1', time: '6:00 AM', activity: 'Wake up', icon: 'sunny-outline', color: '#F59E0B' },
  { id: '2', time: '6:30 AM', activity: 'Oil Pulling', icon: 'water-outline', color: '#10B981' },
  { id: '3', time: '7:00 AM', activity: 'Yoga', icon: 'body-outline', color: '#8B5CF6' },
  { id: '4', time: '8:00 AM', activity: 'Breakfast', icon: 'restaurant-outline', color: '#EC4899' },
  { id: '5', time: '12:00 PM', activity: 'Lunch', icon: 'fast-food-outline', color: '#3B82F6' },
  { id: '6', time: '6:00 PM', activity: 'Meditation', icon: 'leaf-outline', color: '#059669' },
  { id: '7', time: '10:00 PM', activity: 'Sleep', icon: 'moon-outline', color: '#7C3AED' },
];

const wellnessTips = [
  { id: '1', title: 'Drink Warm Water', description: 'Start your day with a glass of warm water', icon: 'water-outline', color: '#3B82F6' },
  { id: '2', title: 'Mindful Eating', description: 'Eat without distractions', icon: 'nutrition-outline', color: '#10B981' },
  { id: '3', title: 'Digital Detox', description: '1 hour before bed', icon: 'phone-portrait-outline', color: '#7C3AED' },
  { id: '4', title: 'Daily Walk', description: '30 minutes of walking', icon: 'walk-outline', color: '#EC4899' },
];

const doshaStatus = {
  vata: { percentage: 45, color: '#8B5CF6' },
  pitta: { percentage: 35, color: '#F59E0B' },
  kapha: { percentage: 20, color: '#10B981' },
};

const recentActivities = [
  { id: '1', type: 'Yoga', duration: '45 min', time: '2 hours ago', icon: 'body-outline' },
  { id: '2', type: 'Meditation', duration: '20 min', time: '4 hours ago', icon: 'leaf-outline' },
  { id: '3', type: 'Sleep', duration: '7.5 hours', time: 'Yesterday', icon: 'moon-outline' },
  { id: '4', type: 'Water', duration: '2.5L', time: 'Today', icon: 'water-outline' },
];

// ============================================
// COMPONENTS
// ============================================

const WellnessCard = ({ title, value, subtitle, icon, color, onPress }) => (
  <TouchableOpacity 
    style={[styles.wellnessCard, { borderLeftColor: color }]} 
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.wellnessCardHeader}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.wellnessCardTitle}>{title}</Text>
    </View>
    <View style={styles.wellnessCardContent}>
      <Text style={[styles.wellnessCardValue, { color }]}>{value}</Text>
      <Text style={styles.wellnessCardSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const RoutineItem = ({ item }) => (
  <View style={styles.routineItem}>
    <View style={styles.routineTimeContainer}>
      <Text style={styles.routineTime}>{item.time}</Text>
    </View>
    <View style={styles.routineDivider}>
      <View style={[styles.routineDot, { backgroundColor: item.color }]} />
      <View style={styles.routineLine} />
    </View>
    <View style={styles.routineContent}>
      <View style={styles.routineHeader}>
        <Ionicons name={item.icon} size={20} color={item.color} />
        <Text style={styles.routineActivity}>{item.activity}</Text>
      </View>
      {item.completed ? (
        <View style={styles.completedBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
          <Text style={styles.completedText}>Completed</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.markButton}>
          <Text style={styles.markButtonText}>Mark Done</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const TipCard = ({ tip }) => (
  <View style={[styles.tipCard, { backgroundColor: `${tip.color}10` }]}>
    <View style={styles.tipHeader}>
      <View style={[styles.tipIcon, { backgroundColor: tip.color }]}>
        <Ionicons name={tip.icon} size={20} color="white" />
      </View>
      <Text style={styles.tipTitle}>{tip.title}</Text>
    </View>
    <Text style={styles.tipDescription}>{tip.description}</Text>
    <TouchableOpacity style={styles.tipButton}>
      <Text style={[styles.tipButtonText, { color: tip.color }]}>Try Now</Text>
    </TouchableOpacity>
  </View>
);

const ActivityItem = ({ activity }) => (
  <View style={styles.activityItem}>
    <View style={styles.activityIconContainer}>
      <Ionicons name={activity.icon} size={24} color="#7C3AED" />
    </View>
    <View style={styles.activityContent}>
      <Text style={styles.activityType}>{activity.type}</Text>
      <Text style={styles.activityDuration}>{activity.duration}</Text>
    </View>
    <Text style={styles.activityTime}>{activity.time}</Text>
  </View>
);

const DoshaProgress = ({ dosha }) => (
  <View style={styles.doshaItem}>
    <View style={styles.doshaInfo}>
      <View style={[styles.doshaDot, { backgroundColor: dosha.color }]} />
      <Text style={styles.doshaName}>{dosha.name}</Text>
    </View>
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${dosha.percentage}%`, backgroundColor: dosha.color }
          ]} 
        />
      </View>
      <Text style={styles.doshaPercentage}>{dosha.percentage}%</Text>
    </View>
  </View>
);

// ============================================
// HOME SCREEN
// ============================================

const HomeScreen = () => {
  const [greeting, setGreeting] = useState('Good Morning');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Background Decorations */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{greeting},</Text>
              <Text style={styles.userName}>John Doe</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={24} color="#7C3AED" />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.avatarButton}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop' }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#94A3B8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for remedies, yoga poses, tips..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter-outline" size={20} color="#7C3AED" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>Your Ayurvedic Journey</Text>
            <Text style={styles.welcomeText}>
              Complete today's routine to maintain balance and harmony
            </Text>
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Continue Journey</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop' }}
            style={styles.welcomeImage}
          />
        </View>

        {/* Wellness Stats */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Wellness</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsGrid}>
            <WellnessCard 
              title="Sleep Quality" 
              value="8.2" 
              subtitle="hours" 
              icon="moon-outline" 
              color="#8B5CF6"
            />
            <WellnessCard 
              title="Water Intake" 
              value="2.5" 
              subtitle="liters" 
              icon="water-outline" 
              color="#3B82F6"
            />
            <WellnessCard 
              title="Activity" 
              value="65" 
              subtitle="minutes" 
              icon="walk-outline" 
              color="#10B981"
            />
            <WellnessCard 
              title="Stress Level" 
              value="Low" 
              subtitle="" 
              icon="pulse-outline" 
              color="#EC4899"
            />
          </View>
        </View>

        {/* Daily Routine */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Routine</Text>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add-circle-outline" size={20} color="#7C3AED" />
              <Text style={styles.addButtonText}>Add Activity</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.routineCard}>
            <FlatList
              data={dailyRoutine}
              renderItem={({ item }) => <RoutineItem item={item} />}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
        </View>

        {/* Dosha Balance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dosha Balance</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>Details</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.doshaCard}>
            <View style={styles.doshaProgressContainer}>
              <DoshaProgress dosha={{ name: 'Vata', ...doshaStatus.vata }} />
              <DoshaProgress dosha={{ name: 'Pitta', ...doshaStatus.pitta }} />
              <DoshaProgress dosha={{ name: 'Kapha', ...doshaStatus.kapha }} />
            </View>
            <View style={styles.doshaInfoCard}>
              <Ionicons name="information-circle-outline" size={20} color="#7C3AED" />
              <Text style={styles.doshaInfoText}>
                Your Vata is slightly dominant. Focus on grounding activities and warm foods.
              </Text>
            </View>
          </View>
        </View>

        {/* Wellness Tips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Wellness Tips</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={wellnessTips}
            renderItem={({ item }) => <TipCard tip={item} />}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tipsList}
          />
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activitiesCard}>
            {recentActivities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="restaurant-outline" size={24} color="#D97706" />
              </View>
              <Text style={styles.actionText}>Diet Plan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="fitness-outline" size={24} color="#1D4ED8" />
              </View>
              <Text style={styles.actionText}>Yoga Session</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#F3E8FF' }]}>
                <Ionicons name="leaf-outline" size={24} color="#7C3AED" />
              </View>
              <Text style={styles.actionText}>Meditation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="medkit-outline" size={24} color="#059669" />
              </View>
              <Text style={styles.actionText}>Remedies</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#7C3AED" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar-outline" size={24} color="#64748B" />
          <Text style={styles.navText}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.centralButton}>
            <Ionicons name="add" size={28} color="white" />
          </View>
          <Text style={styles.navText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="stats-chart-outline" size={24} color="#64748B" />
          <Text style={styles.navText}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#64748B" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
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
    top: 200,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(16, 185, 129, 0.03)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    backgroundImage: 'linear-gradient(135deg, #7C3AED 0%, #10B981 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  filterButton: {
    padding: 4,
  },
  welcomeCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 24,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    gap: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  welcomeImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  seeAllButton: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  wellnessCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: (width - 56) / 2,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  wellnessCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wellnessCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  wellnessCardContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  wellnessCardValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  wellnessCardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  routineCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  routineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  routineTimeContainer: {
    width: 70,
    alignItems: 'flex-end',
  },
  routineTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  routineDivider: {
    alignItems: 'center',
    width: 30,
  },
  routineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  routineLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#E2E8F0',
    position: 'absolute',
    top: 12,
  },
  routineContent: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginLeft: 8,
  },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  routineActivity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completedText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  markButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  markButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  doshaCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  doshaProgressContainer: {
    marginBottom: 16,
  },
  doshaItem: {
    marginBottom: 16,
  },
  doshaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  doshaDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  doshaName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  doshaPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    width: 40,
    textAlign: 'right',
  },
  doshaInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
  },
  doshaInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  tipsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tipCard: {
    width: 180,
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  tipDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  tipButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tipButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activitiesCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  activityDuration: {
    fontSize: 14,
    color: '#64748B',
  },
  activityTime: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  actionButton: {
    alignItems: 'center',
    width: (width - 56) / 2,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  centralButton: {
    position: 'absolute',
    top: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  navText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  navTextActive: {
    fontSize: 12,
    color: '#7C3AED',
    marginTop: 4,
    fontWeight: '700',
  },
});

export default HomeScreen;