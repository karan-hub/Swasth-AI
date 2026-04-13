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
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const BRAND       = '#0D9268';
const BRAND_DARK  = '#0a7a57';
const BRAND_LIGHT = '#E1F5EE';
const BRAND_MID   = '#9FE1CB';
const BG          = '#F5F7F6';
const SURFACE     = '#FFFFFF';
const TEXT        = '#0f2419';
const MUTED       = '#8aaa99';
const BORDER      = '#E3EDE9';

// ─── Dosha Progress Bar ────────────────────────────────────────────────────────
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

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ value, label, color }) => (
  <View style={styles.statCard}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ─── Health Info Card ──────────────────────────────────────────────────────────
const iconColorMap = {
  '#EDE9FE': '#7C3AED',
  '#D1FAE5': '#059669',
  '#FEF3C7': '#D97706',
  '#DBEAFE': '#1D4ED8',
  '#FCE7F3': '#DB2777',
};

const HealthCard = ({ icon, iconBg, label, value, tags }) => (
  <View style={styles.healthCard}>
    <View style={[styles.healthIcon, { backgroundColor: iconBg }]}>
      <Ionicons name={icon} size={20} color={iconColorMap[iconBg] || '#7C3AED'} />
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

// ─── Dinacharya Item ───────────────────────────────────────────────────────────
const dinacharyaIconColor = {
  '#FEF3C7': '#D97706',
  '#EDE9FE': '#7C3AED',
  '#D1FAE5': '#059669',
  '#DBEAFE': '#1D4ED8',
  '#F3E8FF': '#7C3AED',
};

const DinacharyaItem = ({ icon, iconBg, title, subtitle, done, onToggle }) => (
  <TouchableOpacity style={styles.activityItem} onPress={onToggle} activeOpacity={0.7}>
    <View style={[styles.actIcon, { backgroundColor: iconBg }]}>
      <Ionicons name={icon} size={20} color={dinacharyaIconColor[iconBg] || '#7C3AED'} />
    </View>
    <View style={styles.actInfo}>
      <Text style={[styles.actName, done && { color: MUTED, textDecorationLine: 'line-through' }]}>{title}</Text>
      <Text style={styles.actSub}>{subtitle}</Text>
    </View>
    {done ? (
      <View style={styles.doneCheck}>
        <Ionicons name="checkmark" size={16} color="#059669" />
      </View>
    ) : (
      <View style={styles.pendingCheck} />
    )}
  </TouchableOpacity>
);

// ─── Chip ──────────────────────────────────────────────────────────────────────
const Chip = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.chip, active && styles.chipActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

// ─── Edit Profile Modal ────────────────────────────────────────────────────────
const EditProfileModal = ({ visible, profile, onSave, onClose }) => {
  const [form, setForm] = useState({ ...profile });

  // Reset form when modal opens
  React.useEffect(() => {
    if (visible) setForm({ ...profile });
  }, [visible]);

  const Field = ({ label, field, keyboardType = 'default', placeholder = '' }) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={String(form[field] ?? '')}
        onChangeText={(v) => setForm((p) => ({ ...p, [field]: v }))}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={MUTED}
        autoCapitalize={field === 'email' ? 'none' : 'words'}
      />
    </View>
  );

  const toggleGoal = (g) => {
    const goals = form.wellnessGoals ?? [];
    setForm((p) => ({
      ...p,
      wellnessGoals: goals.includes(g) ? goals.filter((x) => x !== g) : [...goals, g],
    }));
  };

  const initials =
    (form.firstName?.[0] ?? 'P').toUpperCase() +
    (form.lastName?.[0] ?? 'K').toUpperCase();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit profile</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={20} color={TEXT} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalBody}
            keyboardShouldPersistTaps="handled"
          >
            {/* Avatar */}
            <View style={styles.modalAvatarWrap}>
              <View style={styles.modalAvatar}>
                <Text style={styles.modalAvatarText}>{initials}</Text>
              </View>
              <TouchableOpacity style={styles.avatarEditBtn}>
                <Ionicons name="camera-outline" size={14} color={BRAND} />
                <Text style={styles.avatarEditText}>Change photo</Text>
              </TouchableOpacity>
            </View>

            {/* Name row */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Field label="First name" field="firstName" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Last name" field="lastName" />
              </View>
            </View>

            <Field label="Email" field="email" keyboardType="email-address" />

            {/* Physical stats row */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Field label="Age" field="age" keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Height (cm)" field="height" keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Weight (kg)" field="weight" keyboardType="numeric" />
              </View>
            </View>

            <Field label="Health score (%)" field="healthScore" keyboardType="numeric" />

            {/* Agni */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Agni (Digestion)</Text>
              <View style={styles.chipRow}>
                {['Strong', 'Moderate', 'Weak', 'Variable'].map((d) => (
                  <Chip
                    key={d}
                    label={d}
                    active={form.agni === d}
                    onPress={() => setForm((p) => ({ ...p, agni: d }))}
                  />
                ))}
              </View>
            </View>

            {/* Dosha picker */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Prakriti / Dosha</Text>
              <View style={styles.chipRow}>
                {['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha'].map((d) => (
                  <Chip
                    key={d}
                    label={d}
                    active={form.dosha === d}
                    onPress={() => setForm((p) => ({ ...p, dosha: d }))}
                  />
                ))}
              </View>
            </View>

            {/* Dosha sliders */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Dosha balance (%)</Text>
              {[
                { key: 'vata', label: 'Vata', color: '#8B5CF6' },
                { key: 'pitta', label: 'Pitta', color: '#F59E0B' },
                { key: 'kapha', label: 'Kapha', color: '#10B981' },
              ].map(({ key, label, color }) => (
                <View key={key} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={[styles.doshaDot, { backgroundColor: color }]} />
                      <Text style={{ fontSize: 13, color: TEXT, fontWeight: '600' }}>{label}</Text>
                    </View>
                    <Text style={{ fontSize: 13, color, fontWeight: '600' }}>
                      {form.doshaBalance?.[key] ?? 0}%
                    </Text>
                  </View>
                  <View style={styles.sliderTrack}>
                    <View
                      style={[
                        styles.sliderFill,
                        {
                          width: `${form.doshaBalance?.[key] ?? 0}%`,
                          backgroundColor: color,
                        },
                      ]}
                    />
                  </View>
                  {/* Simulated slider steps */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                    {[0, 20, 40, 60, 80, 100].map((v) => (
                      <TouchableOpacity
                        key={v}
                        onPress={() =>
                          setForm((p) => ({
                            ...p,
                            doshaBalance: { ...(p.doshaBalance ?? {}), [key]: v },
                          }))
                        }
                      >
                        <View
                          style={[
                            styles.sliderStep,
                            (form.doshaBalance?.[key] ?? 0) >= v && { backgroundColor: color },
                          ]}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            {/* Wellness Goals */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Wellness goals</Text>
              <View style={styles.chipRow}>
                {['Weight loss', 'Better sleep', 'Digestion', 'Stress relief', 'Energy', 'Immunity'].map((g) => (
                  <Chip
                    key={g}
                    label={g}
                    active={form.wellnessGoals?.includes(g)}
                    onPress={() => toggleGoal(g)}
                  />
                ))}
              </View>
            </View>

            {/* Diet */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Diet type</Text>
              <View style={styles.chipRow}>
                {['Vegetarian', 'Vegan', 'Non-veg', 'Sattvic', 'Spicy', 'Sweet', 'Sour'].map((d) => (
                  <Chip
                    key={d}
                    label={d}
                    active={form.diet?.includes(d)}
                    onPress={() => {
                      const list = form.diet ?? [];
                      setForm((p) => ({
                        ...p,
                        diet: list.includes(d) ? list.filter((x) => x !== d) : [...list, d],
                      }));
                    }}
                  />
                ))}
              </View>
            </View>

            {/* Sleep */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Field label="Wake-up time" field="wakeTime" placeholder="e.g. 6:00 AM" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Sleep time" field="sleepTime" placeholder="e.g. 10:30 PM" />
              </View>
            </View>

            {/* Current symptoms */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Current symptoms</Text>
              <View style={styles.chipRow}>
                {['Fatigue', 'Acidity', 'Bloating', 'Headache', 'Anxiety', 'Insomnia', 'None'].map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    active={form.symptoms?.includes(s)}
                    onPress={() => {
                      const list = form.symptoms ?? [];
                      setForm((p) => ({
                        ...p,
                        symptoms: list.includes(s) ? list.filter((x) => x !== s) : [...list, s],
                      }));
                    }}
                  />
                ))}
              </View>
            </View>

            {/* Medical */}
            <Field label="Current medications" field="medications" placeholder="e.g. Ashwagandha, Triphala" />
            <Field label="Food / herb allergies" field="allergies" placeholder="e.g. None" />
            <Field label="Diagnosed conditions" field="conditions" placeholder="e.g. None" />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => { onSave(form); onClose(); }}
            >
              <Text style={styles.saveBtnText}>Save changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ─── Main Screen ───────────────────────────────────────────────────────────────
const ProfileScreen = ({ navigation }) => {
  const [editVisible, setEditVisible] = useState(false);

  const [profile, setProfile] = useState({
    firstName: 'Prathamesh',
    lastName: 'Kadam',
    email: 'prathamesh@ayurveda.com',
    age: '28',
    height: '175',
    weight: '72',
    dosha: 'Vata-Pitta',
    agni: 'Moderate',
    healthScore: 85,
    doshaBalance: { vata: 45, pitta: 35, kapha: 20 },
    wellnessGoals: ['Better sleep', 'Digestion', 'Stress relief', 'Energy'],
    diet: ['Spicy', 'Sweet'],
    wakeTime: '6–7 AM',
    sleepTime: '10–11 PM',
    symptoms: ['Fatigue', 'Acidity'],
    medications: 'Ashwagandha, Turmeric, Triphala',
    allergies: 'None',
    conditions: 'None',
  });

  const [dinacharyaDone, setDinacharyaDone] = useState([true, true, false, false, false]);

  const toggleDinacharya = (i) =>
    setDinacharyaDone((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const initials =
    (profile.firstName?.[0] ?? 'P').toUpperCase() +
    (profile.lastName?.[0] ?? 'K').toUpperCase();

  const dinacharyaItems = [
    { icon: 'sunny-outline',      iconBg: '#FEF3C7', title: 'Wake up & Oil Pulling',  subtitle: '6:00 AM · 15 min' },
    { icon: 'body-outline',       iconBg: '#EDE9FE', title: 'Morning Yoga',            subtitle: '6:30 AM · 45 min' },
    { icon: 'restaurant-outline', iconBg: '#D1FAE5', title: 'Breakfast',               subtitle: '8:00 AM · Warm, light meal' },
    { icon: 'aperture-outline',   iconBg: '#DBEAFE', title: 'Evening Meditation',      subtitle: '6:00 PM · 20 min' },
    { icon: 'moon-outline',       iconBg: '#F3E8FF', title: 'Wind Down & Sleep',       subtitle: '10:00 PM' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation?.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#4A5568" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Home</Text>
          <TouchableOpacity
            style={[styles.iconBtn, styles.editBtn]}
            onPress={() => setEditVisible(true)}
          >
            <Ionicons name="create-outline" size={20} color={BRAND} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileCardInner}>
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.avatarInfo}>
                <Text style={styles.profileName}>
                  {profile.firstName} {profile.lastName}
                </Text>
                <Text style={styles.profileMeta}>
                  {profile.age} yrs · {profile.height} cm · {profile.weight} kg
                </Text>
              </View>
            </View>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{profile.dosha}</Text>
              </View>
              <View style={[styles.badge, styles.badgeGreen]}>
                <Ionicons name="checkmark-circle" size={13} color="#10B981" style={{ marginRight: 4 }} />
                <Text style={[styles.badgeText, styles.badgeGreenText]}>Profile Complete</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Score {profile.healthScore}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <StatCard value={profile.wakeTime || '6–7 AM'} label="Wake-up" color={BRAND} />
          <StatCard value={profile.sleepTime || '10–11 PM'} label="Sleep" color="#7C3AED" />
          <StatCard value={profile.agni} label="Agni" color="#F59E0B" />
        </View>

        {/* Dosha Balance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dosha Balance</Text>
            <TouchableOpacity onPress={() => setEditVisible(true)}>
              <Text style={styles.seeAll}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <DoshaBar name="Vata"  percentage={profile.doshaBalance?.vata  ?? 45} color="#8B5CF6" />
            <DoshaBar name="Pitta" percentage={profile.doshaBalance?.pitta ?? 35} color="#F59E0B" />
            <DoshaBar name="Kapha" percentage={profile.doshaBalance?.kapha ?? 20} color="#10B981" />
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={18} color="#7C3AED" style={{ marginTop: 1 }} />
              <Text style={styles.infoText}>
                {profile.dosha} constitution — focus on balancing your dominant dosha with appropriate lifestyle and diet.
              </Text>
            </View>
          </View>
        </View>

        {/* Health Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Health Overview</Text>
            <TouchableOpacity onPress={() => setEditVisible(true)}>
              <Text style={styles.seeAll}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.healthGrid}>
            <HealthCard icon="flame-outline"      iconBg="#EDE9FE" label="Agni (Digestion)"  value={profile.agni} />
            <HealthCard icon="leaf-outline"        iconBg="#D1FAE5" label="Prakriti Type"     value={profile.dosha} />
            <HealthCard icon="sunny-outline"       iconBg="#FEF3C7" label="Wake-up Time"      value={profile.wakeTime || '6–7 AM'} />
            <HealthCard icon="moon-outline"        iconBg="#DBEAFE" label="Sleep Time"        value={profile.sleepTime || '10–11 PM'} />
            <HealthCard
              icon="bandage-outline"
              iconBg="#FCE7F3"
              label="Current Symptoms"
              tags={
                profile.symptoms?.length
                  ? profile.symptoms.map((s) => ({ label: s, bg: '#FEE2E2', color: '#991B1B' }))
                  : [{ label: 'None', bg: '#D1FAE5', color: '#065F46' }]
              }
            />
            <HealthCard
              icon="restaurant-outline"
              iconBg="#D1FAE5"
              label="Diet Type"
              tags={
                profile.diet?.length
                  ? profile.diet.map((d, i) => ({
                      label: d,
                      bg: i % 2 === 0 ? '#D1FAE5' : '#EDE9FE',
                      color: i % 2 === 0 ? '#065F46' : '#5B21B6',
                    }))
                  : [{ label: 'Not set', bg: '#F1F5F9', color: '#64748B' }]
              }
            />
          </View>
        </View>

        {/* Wellness Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Wellness Goals</Text>
            <TouchableOpacity onPress={() => setEditVisible(true)}>
              <Text style={styles.seeAll}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.card, { padding: 16 }]}>
            <View style={styles.chipRow}>
              {(profile.wellnessGoals ?? []).map((g) => (
                <View key={g} style={styles.goalBadge}>
                  <Ionicons name="checkmark-circle" size={13} color={BRAND} style={{ marginRight: 4 }} />
                  <Text style={styles.goalBadgeText}>{g}</Text>
                </View>
              ))}
              {(!profile.wellnessGoals || profile.wellnessGoals.length === 0) && (
                <Text style={{ color: MUTED, fontSize: 13 }}>No goals set — tap Edit to add some.</Text>
              )}
            </View>
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
            {dinacharyaItems.map((item, i) => (
              <DinacharyaItem
                key={i}
                {...item}
                done={dinacharyaDone[i]}
                onToggle={() => toggleDinacharya(i)}
              />
            ))}
          </View>
        </View>

        {/* Medical Safety */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medical Safety</Text>
            <TouchableOpacity onPress={() => setEditVisible(true)}>
              <Text style={styles.seeAll}>Update</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            {[
              { label: 'Diagnosed Conditions', value: profile.conditions || 'None' },
              { label: 'Current Medications',  value: profile.medications || 'None' },
              { label: 'Food / Herb Allergies', value: profile.allergies  || 'None listed' },
            ].map((item, i, arr) => (
              <View key={i} style={[styles.safetyRow, i < arr.length - 1 && styles.safetyBorder]}>
                <Text style={styles.safetyLabel}>{item.label}</Text>
                <Text
                  style={[
                    styles.safetyValue,
                    {
                      color:
                        item.value === 'None' || item.value === 'None listed'
                          ? '#10B981'
                          : BRAND_DARK,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Update Profile Button */}
        <TouchableOpacity
          style={styles.updateBtn}
          activeOpacity={0.85}
          onPress={() => setEditVisible(true)}
        >
          <Ionicons name="create-outline" size={20} color="white" />
          <Text style={styles.updateBtnText}>Update Profile</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Edit Modal */}
      <EditProfileModal
        visible={editVisible}
        profile={profile}
        onSave={(updated) => setProfile(updated)}
        onClose={() => setEditVisible(false)}
      />
    </SafeAreaView>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingBottom: 20 },

  bgCircle1: {
    position: 'absolute', top: -80, right: -40,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(13,146,104,0.05)',
  },
  bgCircle2: {
    position: 'absolute', top: 200, left: -100,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(13,146,104,0.03)',
  },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 40, paddingBottom: 12,
  },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
    alignItems: 'center', justifyContent: 'center',
  },
  editBtn:     { backgroundColor: BRAND_LIGHT, borderColor: BRAND_MID },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },

  // Profile card
  profileCard: {
    marginHorizontal: 20, marginBottom: 16,
    borderRadius: 24, backgroundColor: BRAND, overflow: 'hidden',
  },
  profileCardInner: { padding: 22 },
  avatarRow: {
    flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 18,
  },
  avatar: {
    width: 66, height: 66, borderRadius: 33,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText:   { fontSize: 24, fontWeight: '800', color: '#fff' },
  avatarInfo:   { flex: 1 },
  profileName:  { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 4 },
  profileMeta:  { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  badgeRow:     { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
    flexDirection: 'row', alignItems: 'center',
  },
  badgeText:      { fontSize: 12, fontWeight: '700', color: '#fff' },
  badgeGreen:     { backgroundColor: 'rgba(16,185,129,0.25)', borderColor: 'rgba(16,185,129,0.5)' },
  badgeGreenText: { color: '#6EE7B7' },

  // Stats
  statsRow:   { flexDirection: 'row', marginHorizontal: 20, gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 16,
    paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center',
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  statValue: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  statLabel: {
    fontSize: 11, color: '#94A3B8', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },

  // Section
  section:       { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  seeAll:       { fontSize: 13, color: BRAND, fontWeight: '600' },
  card: {
    backgroundColor: '#fff', marginHorizontal: 20,
    borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#F1F5F9',
  },

  // Dosha
  doshaRow:    { marginBottom: 14 },
  doshaTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  doshaNameRow:{ flexDirection: 'row', alignItems: 'center', gap: 8 },
  doshaDot:    { width: 10, height: 10, borderRadius: 5 },
  doshaName:   { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  doshaPct:    { fontSize: 13, fontWeight: '700' },
  barBg:       { height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  barFill:     { height: '100%', borderRadius: 4 },
  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#F3E8FF', borderRadius: 12, padding: 12, marginTop: 6,
  },
  infoText: { flex: 1, fontSize: 13, color: '#6D28D9', fontWeight: '500', lineHeight: 19 },

  // Health grid
  healthGrid: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 10,
  },
  healthCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14,
    width: (width - 50) / 2, borderWidth: 1, borderColor: '#F1F5F9',
  },
  healthIcon: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  healthLabel: {
    fontSize: 11, color: '#94A3B8', fontWeight: '600',
    marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.3,
  },
  healthValue: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  tagRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  tag:         { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  tagText:     { fontSize: 11, fontWeight: '700' },

  // Goals
  goalBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: BRAND_LIGHT, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 0.5, borderColor: BRAND_MID,
  },
  goalBadgeText: { fontSize: 12, fontWeight: '600', color: BRAND_DARK },

  // Dinacharya
  activityItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F8FAFC',
  },
  actIcon:    { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  actInfo:    { flex: 1 },
  actName:    { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  actSub:     { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  doneCheck:  { width: 28, height: 28, borderRadius: 14, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center' },
  pendingCheck:{ width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#E2E8F0' },

  // Medical safety
  safetyRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  safetyBorder: { borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  safetyLabel:  { fontSize: 13, color: '#94A3B8', fontWeight: '600', flex: 1 },
  safetyValue:  { fontSize: 13, fontWeight: '700', flex: 1, textAlign: 'right' },

  // Update button
  updateBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: 20, height: 54,
    backgroundColor: BRAND, borderRadius: 16,
    shadowColor: BRAND, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  updateBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  // ── Edit Modal ──
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: SURFACE,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '92%',
  },
  modalHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: BORDER, alignSelf: 'center', marginTop: 12, marginBottom: 4,
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: BORDER,
  },
  modalTitle:    { fontSize: 17, fontWeight: '700', color: TEXT },
  modalCloseBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: BG, alignItems: 'center', justifyContent: 'center',
  },
  modalBody: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },

  modalAvatarWrap: { alignItems: 'center', marginBottom: 20, gap: 10 },
  modalAvatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center',
  },
  modalAvatarText: { fontSize: 24, fontWeight: '700', color: '#fff' },
  avatarEditBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: BRAND_LIGHT, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6,
  },
  avatarEditText: { fontSize: 12, fontWeight: '600', color: BRAND },

  fieldWrap:  { marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: MUTED, marginBottom: 6 },
  fieldInput: {
    backgroundColor: BG, borderRadius: 10, borderWidth: 0.5, borderColor: BORDER,
    paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: TEXT,
  },

  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    borderWidth: 0.5, borderColor: BORDER, backgroundColor: BG,
  },
  chipActive:     { backgroundColor: BRAND, borderColor: BRAND },
  chipText:       { fontSize: 12, fontWeight: '600', color: MUTED },
  chipTextActive: { color: '#fff' },

  // Dosha slider (simulated)
  sliderTrack: { height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  sliderFill:  { height: '100%', borderRadius: 4 },
  sliderStep: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },

  // Modal footer
  modalFooter: {
    flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 12,
    borderTopWidth: 0.5, borderTopColor: BORDER,
  },
  cancelBtn: {
    flex: 1, height: 48, borderRadius: 12,
    borderWidth: 0.5, borderColor: BORDER, backgroundColor: BG,
    alignItems: 'center', justifyContent: 'center',
  },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: MUTED },
  saveBtn: {
    flex: 2, height: 48, borderRadius: 12,
    backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center',
  },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});

export default ProfileScreen;