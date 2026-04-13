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
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const BRAND        = "#0D9268";
const BRAND_DARK   = "#0a7a57";
const BRAND_LIGHT  = "#E1F5EE";
const BRAND_MID    = "#9FE1CB";
const BG           = "#F5F7F6";
const SURFACE      = "#FFFFFF";
const TEXT_PRIMARY = "#0f2419";
const TEXT_MUTED   = "#8aaa99";
const BORDER       = "#E3EDE9";

// ─── Small reusable components ─────────────────────────────────────────────────

const SectionLabel = ({ title }) => (
  <Text style={styles.sectionLabel}>{title}</Text>
);

const BadgeValue = ({ label, green = false }) => (
  <View style={[styles.badge, green && styles.badgeGreen]}>
    <Text style={[styles.badgeText, green && styles.badgeGreenText]}>{label}</Text>
  </View>
);

const SettingRow = ({
  icon, iconBg, iconColor, title, subtitle,
  onPress, rightElement, danger = false,
  last = false,
}) => (
  <TouchableOpacity
    style={[styles.row, last && styles.rowLast]}
    onPress={onPress}
    activeOpacity={onPress ? 0.6 : 1}
  >
    <View style={[styles.rowIcon, { backgroundColor: danger ? "#FEF2F2" : iconBg }]}>
      <Ionicons name={icon} size={18} color={danger ? "#DC2626" : iconColor} />
    </View>
    <View style={styles.rowBody}>
      <Text style={[styles.rowTitle, danger && styles.dangerText]}>{title}</Text>
      {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
    </View>
    <View style={styles.rowRight}>{rightElement}</View>
  </TouchableOpacity>
);

const SettingToggle = ({
  icon, iconBg, iconColor, title, subtitle,
  value, onValueChange, last = false,
}) => (
  <View style={[styles.row, last && styles.rowLast]}>
    <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
      <Ionicons name={icon} size={18} color={iconColor} />
    </View>
    <View style={styles.rowBody}>
      <Text style={styles.rowTitle}>{title}</Text>
      {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#E2E8F0", true: BRAND }}
      thumbColor="#ffffff"
      ios_backgroundColor="#E2E8F0"
    />
  </View>
);

// ─── Edit Profile Modal ────────────────────────────────────────────────────────

const EditProfileModal = ({ visible, profile, onSave, onClose }) => {
  const [form, setForm] = useState({ ...profile });

  const Field = ({ label, field, keyboardType = "default" }) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={form[field]}
        onChangeText={(v) => setForm((p) => ({ ...p, [field]: v }))}
        keyboardType={keyboardType}
        placeholderTextColor={TEXT_MUTED}
        autoCapitalize={field === "email" ? "none" : "words"}
      />
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalSheet}>
          {/* Handle */}
          <View style={styles.modalHandle} />

          {/* Title row */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit profile</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={20} color={TEXT_PRIMARY} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalBody}
            keyboardShouldPersistTaps="handled"
          >
            {/* Avatar preview */}
            <View style={styles.modalAvatarWrap}>
              <View style={styles.modalAvatar}>
                <Text style={styles.modalAvatarText}>
                  {(form.firstName?.[0] ?? "P") + (form.lastName?.[0] ?? "K")}
                </Text>
              </View>
              <TouchableOpacity style={styles.modalAvatarEdit}>
                <Ionicons name="camera-outline" size={14} color={BRAND} />
                <Text style={styles.modalAvatarEditText}>Change photo</Text>
              </TouchableOpacity>
            </View>

            <Field label="First name"  field="firstName" />
            <Field label="Last name"   field="lastName" />
            <Field label="Email"       field="email"     keyboardType="email-address" />
            <Field label="Age"         field="age"       keyboardType="numeric" />
            <Field label="Height (cm)" field="height"    keyboardType="numeric" />
            <Field label="Weight (kg)" field="weight"    keyboardType="numeric" />

            {/* Dosha picker */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Prakriti / Dosha</Text>
              <View style={styles.doshaRow}>
                {["Vata", "Pitta", "Kapha", "Vata-Pitta", "Pitta-Kapha", "Vata-Kapha"].map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.doshaChip, form.dosha === d && styles.doshaChipActive]}
                    onPress={() => setForm((p) => ({ ...p, dosha: d }))}
                  >
                    <Text style={[styles.doshaChipText, form.dosha === d && styles.doshaChipTextActive]}>
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Goals multi-select */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Wellness goals</Text>
              <View style={styles.doshaRow}>
                {["Weight loss", "Better sleep", "Digestion", "Stress relief", "Energy", "Immunity"].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.doshaChip,
                      form.wellnessGoals?.includes(g) && styles.doshaChipActive,
                    ]}
                    onPress={() => {
                      const goals = form.wellnessGoals ?? [];
                      setForm((p) => ({
                        ...p,
                        wellnessGoals: goals.includes(g)
                          ? goals.filter((x) => x !== g)
                          : [...goals, g],
                      }));
                    }}
                  >
                    <Text style={[
                      styles.doshaChipText,
                      form.wellnessGoals?.includes(g) && styles.doshaChipTextActive,
                    ]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Field label="Current medications" field="medications" />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveProfileBtn}
              onPress={() => { onSave(form); onClose(); }}
            >
              <Text style={styles.saveProfileBtnText}>Save changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ─── Appearance Modal ──────────────────────────────────────────────────────────

const OptionModal = ({ visible, title, options, selected, onSelect, onClose }) => (
  <Modal visible={visible} animationType="slide" transparent>
    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.optionSheet}>
        <View style={styles.modalHandle} />
        <Text style={styles.modalTitle}>{title}</Text>
        <View style={{ marginTop: 16 }}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.optionRow}
              onPress={() => { onSelect(opt); onClose(); }}
            >
              <Text style={[styles.optionText, opt === selected && styles.optionTextActive]}>
                {opt}
              </Text>
              {opt === selected && (
                <Ionicons name="checkmark" size={18} color={BRAND} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  </Modal>
);

// ─── Main Screen ───────────────────────────────────────────────────────────────

const SettingsScreen = ({ navigation }) => {
  // Profile state
  const [profile, setProfile] = useState({
    firstName: "Prathamesh",
    lastName: "Kadam",
    email: "prathamesh@ayurveda.com",
    age: "28",
    height: "175",
    weight: "70",
    dosha: "Vata-Pitta",
    wellnessGoals: ["Better sleep", "Digestion", "Stress relief", "Energy"],
    medications: "Ashwagandha, Turmeric, Triphala",
    healthScore: 85,
  });

  // Modal states
  const [editVisible, setEditVisible]       = useState(false);
  const [themeVisible, setThemeVisible]     = useState(false);
  const [langVisible, setLangVisible]       = useState(false);
  const [unitsVisible, setUnitsVisible]     = useState(false);

  // Appearance state
  const [theme, setTheme]   = useState("Auto");
  const [lang, setLang]     = useState("English");
  const [units, setUnits]   = useState("Metric");

  // Notification toggles
  const [pushNotif,           setPushNotif]           = useState(true);
  const [wellnessReminders,   setWellnessReminders]   = useState(true);
  const [appointmentAlerts,   setAppointmentAlerts]   = useState(true);
  const [emailUpdates,        setEmailUpdates]        = useState(false);

  // Privacy toggles
  const [twoFactor,   setTwoFactor]   = useState(false);
  const [dataSharing, setDataSharing] = useState(true);

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: () => navigation?.replace("Login") },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete account",
      "This action is permanent and cannot be undone. All your data will be removed.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {} },
      ]
    );
  };

  const initials = (profile.firstName?.[0] ?? "P") + (profile.lastName?.[0] ?? "K");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSub}>Manage your preferences</Text>
          </View>
        </View>

        {/* ── Profile Banner ── */}
        <View style={styles.profileBanner}>
          <View style={styles.bannerAvatar}>
            <Text style={styles.bannerAvatarText}>{initials}</Text>
          </View>
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerName}>{profile.firstName} {profile.lastName}</Text>
            <Text style={styles.bannerEmail}>{profile.email}</Text>
            <View style={styles.bannerDoshaRow}>
              <View style={styles.bannerDoshaBadge}>
                <Text style={styles.bannerDoshaText}>{profile.dosha}</Text>
              </View>
              <View style={styles.bannerScoreBadge}>
                <Text style={styles.bannerScoreText}>Score {profile.healthScore}%</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.bannerEditBtn}
            onPress={() => setEditVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="pencil-outline" size={14} color={BRAND} />
            <Text style={styles.bannerEditText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* ── Ayurvedic Profile ── */}
        <View style={styles.section}>
          <SectionLabel title="Ayurvedic Profile" />
          <View style={styles.card}>
            <SettingRow
              icon="flame-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Prakriti type" subtitle="Your body constitution"
              onPress={() => setEditVisible(true)}
              rightElement={<>
                <BadgeValue label={profile.dosha} green />
                <Ionicons name="chevron-forward" size={16} color={BORDER} />
              </>}
            />
            <SettingRow
              icon="trophy-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Health goals" subtitle={`${profile.wellnessGoals?.length ?? 0} active goals`}
              onPress={() => setEditVisible(true)}
              rightElement={<Ionicons name="chevron-forward" size={16} color={BORDER} />}
            />
            <SettingRow
              icon="leaf-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Current medications" subtitle={profile.medications}
              onPress={() => setEditVisible(true)}
              rightElement={<Ionicons name="chevron-forward" size={16} color={BORDER} />}
            />
            <SettingRow
              icon="pulse-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Health score" subtitle="Last updated today"
              onPress={() => {}}
              last
              rightElement={<>
                <BadgeValue label={`${profile.healthScore}%`} green />
                <Ionicons name="chevron-forward" size={16} color={BORDER} />
              </>}
            />
          </View>
        </View>

        {/* ── Notifications ── */}
        <View style={styles.section}>
          <SectionLabel title="Notifications" />
          <View style={styles.card}>
            <SettingToggle
              icon="notifications-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Push notifications" subtitle="Reminders & daily tips"
              value={pushNotif} onValueChange={setPushNotif}
            />
            <SettingToggle
              icon="heart-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Wellness reminders" subtitle="Morning & evening routine"
              value={wellnessReminders} onValueChange={setWellnessReminders}
            />
            <SettingToggle
              icon="calendar-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Appointment alerts" subtitle="48h & 1h before"
              value={appointmentAlerts} onValueChange={setAppointmentAlerts}
            />
            <SettingToggle
              icon="mail-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Email updates" subtitle="Weekly wellness digest"
              value={emailUpdates} onValueChange={setEmailUpdates}
              last
            />
          </View>
        </View>

        {/* ── Appearance ── */}
        <View style={styles.section}>
          <SectionLabel title="Appearance" />
          <View style={styles.card}>
            <SettingRow
              icon="contrast-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Theme" subtitle="System default"
              onPress={() => setThemeVisible(true)}
              rightElement={<>
                <BadgeValue label={theme} />
                <Ionicons name="chevron-forward" size={16} color={BORDER} />
              </>}
            />
            <SettingRow
              icon="globe-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Language" subtitle="App display language"
              onPress={() => setLangVisible(true)}
              rightElement={<>
                <BadgeValue label={lang} />
                <Ionicons name="chevron-forward" size={16} color={BORDER} />
              </>}
            />
            <SettingRow
              icon="options-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Units" subtitle="Height, weight & temperature"
              onPress={() => setUnitsVisible(true)}
              last
              rightElement={<>
                <BadgeValue label={units} />
                <Ionicons name="chevron-forward" size={16} color={BORDER} />
              </>}
            />
          </View>
        </View>

        {/* ── Privacy & Security ── */}
        <View style={styles.section}>
          <SectionLabel title="Privacy & Security" />
          <View style={styles.card}>
            <SettingRow
              icon="lock-closed-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Change password" subtitle="Last changed 3 months ago"
              onPress={() => Alert.alert("Change password", "Password change flow coming soon.")}
              rightElement={<Ionicons name="chevron-forward" size={16} color={BORDER} />}
            />
            <SettingToggle
              icon="shield-checkmark-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Two-factor auth" subtitle="Extra account security"
              value={twoFactor} onValueChange={setTwoFactor}
            />
            <SettingToggle
              icon="eye-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Data sharing" subtitle="Anonymous usage analytics"
              value={dataSharing} onValueChange={setDataSharing}
            />
            <SettingRow
              icon="document-text-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Privacy policy" subtitle="How we use your data"
              onPress={() => Alert.alert("Privacy Policy", "Opens privacy policy.")}
              last
              rightElement={<Ionicons name="chevron-forward" size={16} color={BORDER} />}
            />
          </View>
        </View>

        {/* ── Support ── */}
        <View style={styles.section}>
          <SectionLabel title="Support" />
          <View style={styles.card}>
            <SettingRow
              icon="help-circle-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Help & FAQ" subtitle="Common questions answered"
              onPress={() => Alert.alert("Help & FAQ", "Opens help centre.")}
              rightElement={<Ionicons name="chevron-forward" size={16} color={BORDER} />}
            />
            <SettingRow
              icon="chatbubble-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Contact support" subtitle="Mon–Fri, 9am–6pm IST"
              onPress={() => Alert.alert("Contact Support", "Opens support chat.")}
              rightElement={<Ionicons name="chevron-forward" size={16} color={BORDER} />}
            />
            <SettingRow
              icon="star-outline" iconBg={BRAND_LIGHT} iconColor={BRAND}
              title="Rate the app" subtitle="Share your experience"
              onPress={() => Alert.alert("Rate App", "Opens app store rating.")}
              last
              rightElement={<Ionicons name="chevron-forward" size={16} color={BORDER} />}
            />
          </View>
        </View>

        {/* ── Account ── */}
        <View style={styles.section}>
          <SectionLabel title="Account" />
          <View style={styles.card}>
            <SettingRow
              icon="log-out-outline" danger
              title="Sign out" subtitle="You'll need to log in again"
              onPress={handleSignOut}
              rightElement={<Ionicons name="chevron-forward" size={16} color="#FCA5A5" />}
            />
            <SettingRow
              icon="trash-outline" danger last
              title="Delete account" subtitle="Permanent — cannot be undone"
              onPress={handleDeleteAccount}
              rightElement={<Ionicons name="chevron-forward" size={16} color="#FCA5A5" />}
            />
          </View>
        </View>

        {/* ── Version ── */}
        <View style={styles.section}>
          <View style={[styles.card, styles.versionCard]}>
            <View style={styles.versionIcon}>
              <Ionicons name="leaf" size={22} color={BRAND} />
            </View>
            <Text style={styles.versionAppName}>Swasthya AI</Text>
            <Text style={styles.versionNum}>Version 2.4.1 (Build 241)</Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionBadgeText}>Up to date</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Edit Profile Modal ── */}
      <EditProfileModal
        visible={editVisible}
        profile={profile}
        onSave={(updated) => setProfile(updated)}
        onClose={() => setEditVisible(false)}
      />

      {/* ── Option Modals ── */}
      <OptionModal
        visible={themeVisible} title="Theme"
        options={["Light", "Dark", "Auto"]}
        selected={theme} onSelect={setTheme}
        onClose={() => setThemeVisible(false)}
      />
      <OptionModal
        visible={langVisible} title="Language"
        options={["English", "Hindi", "Marathi", "Tamil", "Telugu", "Kannada"]}
        selected={lang} onSelect={setLang}
        onClose={() => setLangVisible(false)}
      />
      <OptionModal
        visible={unitsVisible} title="Units"
        options={["Metric", "Imperial"]}
        selected={units} onSelect={setUnits}
        onClose={() => setUnitsVisible(false)}
      />
    </SafeAreaView>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: BG },
  scroll:     { paddingBottom: 20 },

  // Header
  header: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20, paddingTop: 40, paddingBottom: 12,
  },
  headerTitle: { fontSize: 26, fontWeight: "700", color: TEXT_PRIMARY },
  headerSub:   { fontSize: 13, color: TEXT_MUTED, marginTop: 2 },

  // Profile Banner
  profileBanner: {
    marginHorizontal: 20, marginBottom: 20,
    backgroundColor: SURFACE,
    borderRadius: 16, padding: 16,
    flexDirection: "row", alignItems: "center", gap: 12,
    borderWidth: 0.5, borderColor: BORDER,
  },
  bannerAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: BRAND,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  bannerAvatarText: { fontSize: 18, fontWeight: "700", color: "#fff" },
  bannerInfo:  { flex: 1 },
  bannerName:  { fontSize: 15, fontWeight: "700", color: TEXT_PRIMARY, marginBottom: 2 },
  bannerEmail: { fontSize: 12, color: TEXT_MUTED, marginBottom: 6 },
  bannerDoshaRow: { flexDirection: "row", gap: 6 },
  bannerDoshaBadge: {
    backgroundColor: BRAND_LIGHT, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  bannerDoshaText: { fontSize: 11, fontWeight: "600", color: BRAND_DARK },
  bannerScoreBadge: {
    backgroundColor: BRAND_LIGHT, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  bannerScoreText: { fontSize: 11, fontWeight: "600", color: BRAND_DARK },
  bannerEditBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: BRAND_LIGHT,
    borderWidth: 0.5, borderColor: BRAND_MID,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  bannerEditText: { color: BRAND, fontSize: 12, fontWeight: "600" },

  // Section
  section:      { marginBottom: 16 },
  sectionLabel: {
    fontSize: 11, fontWeight: "700", color: TEXT_MUTED,
    textTransform: "uppercase", letterSpacing: 1,
    marginBottom: 8, paddingHorizontal: 24,
  },
  card: {
    backgroundColor: SURFACE, marginHorizontal: 20,
    borderRadius: 16, borderWidth: 0.5, borderColor: BORDER,
    overflow: "hidden",
  },

  // Row
  row: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: BG,
  },
  rowLast:  { borderBottomWidth: 0 },
  rowIcon:  {
    width: 34, height: 34, borderRadius: 9,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  rowBody:  { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: "600", color: TEXT_PRIMARY },
  rowSub:   { fontSize: 12, color: TEXT_MUTED, marginTop: 2 },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  dangerText: { color: "#DC2626" },

  // Badge
  badge: {
    backgroundColor: BG, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  badgeText:      { fontSize: 12, fontWeight: "600", color: TEXT_MUTED },
  badgeGreen:     { backgroundColor: BRAND_LIGHT },
  badgeGreenText: { color: BRAND_DARK },

  // Version card
  versionCard:    { alignItems: "center", paddingVertical: 22 },
  versionIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: BRAND_LIGHT,
    alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  versionAppName: { fontSize: 15, fontWeight: "700", color: TEXT_PRIMARY, marginBottom: 4 },
  versionNum:     { fontSize: 12, color: TEXT_MUTED, marginBottom: 8 },
  versionBadge:   {
    backgroundColor: BRAND_LIGHT, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  versionBadgeText: { fontSize: 12, fontWeight: "600", color: BRAND_DARK },

  // ── Edit Profile Modal ──
  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: SURFACE,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    maxHeight: "92%",
  },
  modalHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: BORDER,
    alignSelf: "center", marginTop: 12, marginBottom: 4,
  },
  modalHeader: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: BORDER,
  },
  modalTitle:    { fontSize: 17, fontWeight: "700", color: TEXT_PRIMARY },
  modalCloseBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: BG, alignItems: "center", justifyContent: "center",
  },
  modalBody: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },

  modalAvatarWrap: { alignItems: "center", marginBottom: 20 },
  modalAvatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: BRAND,
    alignItems: "center", justifyContent: "center", marginBottom: 10,
  },
  modalAvatarText: { fontSize: 24, fontWeight: "700", color: "#fff" },
  modalAvatarEdit: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: BRAND_LIGHT, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  modalAvatarEditText: { fontSize: 12, fontWeight: "600", color: BRAND },

  fieldWrap:  { marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontWeight: "600", color: TEXT_MUTED, marginBottom: 6 },
  fieldInput: {
    backgroundColor: BG, borderRadius: 10,
    borderWidth: 0.5, borderColor: BORDER,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 14, color: TEXT_PRIMARY,
  },

  doshaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  doshaChip: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, borderWidth: 0.5,
    borderColor: BORDER, backgroundColor: BG,
  },
  doshaChipActive:    { backgroundColor: BRAND, borderColor: BRAND },
  doshaChipText:      { fontSize: 12, fontWeight: "600", color: TEXT_MUTED },
  doshaChipTextActive:{ color: "#fff" },

  modalFooter: {
    flexDirection: "row", gap: 12,
    paddingHorizontal: 20, paddingTop: 12,
    borderTopWidth: 0.5, borderTopColor: BORDER,
  },
  cancelBtn: {
    flex: 1, height: 48, borderRadius: 12,
    borderWidth: 0.5, borderColor: BORDER,
    alignItems: "center", justifyContent: "center",
    backgroundColor: BG,
  },
  cancelBtnText:    { fontSize: 14, fontWeight: "600", color: TEXT_MUTED },
  saveProfileBtn: {
    flex: 2, height: 48, borderRadius: 12,
    backgroundColor: BRAND,
    alignItems: "center", justifyContent: "center",
  },
  saveProfileBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },

  // ── Option Modal ──
  optionSheet: {
    backgroundColor: SURFACE,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  optionRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: BG,
  },
  optionText:       { fontSize: 15, color: TEXT_PRIMARY, fontWeight: "500" },
  optionTextActive: { color: BRAND, fontWeight: "700" },
});

export default SettingsScreen;