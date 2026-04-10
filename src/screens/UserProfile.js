import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ============================================
// COMPONENTS
// ============================================

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
    <View
      style={[styles.rowIcon, { backgroundColor: danger ? "#FEF2F2" : iconBg }]}
    >
      <Ionicons name={icon} size={19} color={danger ? "#DC2626" : iconColor} />
    </View>
    <View style={styles.rowBody}>
      <Text style={[styles.rowTitle, danger && styles.dangerText]}>
        {title}
      </Text>
      {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
    </View>
    <View style={styles.rowRight}>{rightElement}</View>
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
      trackColor={{ false: "#E2E8F0", true: "#10B981" }}
      thumbColor="#ffffff"
      ios_backgroundColor="#E2E8F0"
    />
  </View>
);

const BadgeValue = ({ label, green = false }) => (
  <View style={[styles.badge, green && styles.badgeGreen]}>
    <Text style={[styles.badgeText, green && styles.badgeGreenText]}>
      {label}
    </Text>
  </View>
);

const SectionLabel = ({ title }) => (
  <Text style={styles.sectionLabel}>{title}</Text>
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
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => navigation?.replace("Login"),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action is permanent and cannot be undone. All your data will be removed.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {} },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Background decorations */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSub}>Manage your preferences</Text>
          </View>
          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Banner */}
        <View style={styles.profileBanner}>
          <View style={styles.bannerAvatar}>
            <Text style={styles.bannerAvatarText}>
              {(user?.firstName?.[0] ?? "P") + (user?.lastName?.[0] ?? "K")}
            </Text>
          </View>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerName}>
              {user ? `${user.firstName} ${user.lastName}` : "Prathamesh Kadam"}
            </Text>
            <Text style={styles.bannerEmail}>
              {user?.email ?? "prathamesh@ayurveda.com"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bannerEditBtn}
            onPress={() => navigation?.navigate("EditProfile")}
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
              onPress={() => navigation?.navigate("PrakritiDetail")}
              rightElement={
                <>
                  <BadgeValue label={user?.dosha ?? "Vata-Pitta"} />
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
              onPress={() => navigation?.navigate("HealthGoals")}
              rightElement={
                <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
              }
            />
            <SettingRow
              icon="leaf-outline"
              iconBg="#FEF3C7"
              iconColor="#D97706"
              title="Current Medications"
              subtitle={
                user?.medications?.join(", ") ??
                "Ashwagandha, Turmeric, Triphala"
              }
              onPress={() => navigation?.navigate("Medications")}
              rightElement={
                <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
              }
            />
            <SettingRow
              icon="pulse-outline"
              iconBg="#DBEAFE"
              iconColor="#1D4ED8"
              title="Health Score"
              subtitle="Last updated today"
              onPress={() => navigation?.navigate("HealthScore")}
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
              onPress={() => navigation?.navigate("ThemeSettings")}
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
              onPress={() => navigation?.navigate("LanguageSettings")}
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
              onPress={() => navigation?.navigate("UnitsSettings")}
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
              onPress={() => navigation?.navigate("ChangePassword")}
              rightElement={
                <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
              }
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
              onPress={() => navigation?.navigate("PrivacyPolicy")}
              rightElement={
                <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
              }
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
              onPress={() => navigation?.navigate("Help")}
              rightElement={
                <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
              }
            />
            <SettingRow
              icon="chatbubble-outline"
              iconBg="#EDE9FE"
              iconColor="#7C3AED"
              title="Contact Support"
              subtitle="Mon–Fri, 9am–6pm IST"
              onPress={() => navigation?.navigate("Support")}
              rightElement={
                <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
              }
            />
            <SettingRow
              icon="star-outline"
              iconBg="#FEF3C7"
              iconColor="#D97706"
              title="Rate the App"
              subtitle="Share your experience"
              onPress={() => {}}
              rightElement={
                <Ionicons name="chevron-forward" size={16} color="#CBD5E0" />
              }
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
              rightElement={
                <Ionicons name="chevron-forward" size={16} color="#FCA5A5" />
              }
            />
            <SettingRow
              icon="trash-outline"
              iconBg="#FEF2F2"
              iconColor="#DC2626"
              title="Delete Account"
              subtitle="Permanent — cannot be undone"
              onPress={handleDeleteAccount}
              danger
              rightElement={
                <Ionicons name="chevron-forward" size={16} color="#FCA5A5" />
              }
            />
          </View>
        </View>

        {/* App Version */}
        <View style={styles.section}>
          <View style={[styles.card, styles.versionCard]}>
            <View style={styles.versionDot}>
              <Text style={{ fontSize: 20 }}>🌿</Text>
            </View>
            <Text style={styles.versionAppName}>AyurWell</Text>
            <Text style={styles.versionNum}>Version 2.4.1 (Build 241)</Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionBadgeText}>Up to date</Text>
            </View>
          </View>
        </View>

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
    backgroundColor: "#F8FAFC",
  },
  bgCircle1: {
    position: "absolute",
    top: -80,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(124, 58, 237, 0.05)",
    pointerEvents: "none",
  },
  bgCircle2: {
    position: "absolute",
    top: 260,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(16, 185, 129, 0.03)",
    pointerEvents: "none",
  },
  scroll: {
    paddingBottom: 20,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
  },
  headerSub: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: "#7C3AED",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  // Profile Banner
  profileBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#7C3AED",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    overflow: "hidden",
  },
  bannerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bannerAvatarText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },
  bannerInfo: {
    flex: 1,
  },
  bannerName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 3,
  },
  bannerEmail: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  bannerEditBtn: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  bannerEditText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  // Section
  section: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  rowSub: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dangerText: {
    color: "#DC2626",
  },

  // Badge
  badge: {
    backgroundColor: "#EDE9FE",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7C3AED",
  },
  badgeGreen: {
    backgroundColor: "#D1FAE5",
  },
  badgeGreenText: {
    color: "#059669",
  },

  // Version card
  versionCard: {
    alignItems: "center",
    paddingVertical: 22,
  },
  versionDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  versionAppName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 4,
  },
  versionNum: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 8,
  },
  versionBadge: {
    backgroundColor: "#D1FAE5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  versionBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#065F46",
  },
});

export default SettingsScreen;
