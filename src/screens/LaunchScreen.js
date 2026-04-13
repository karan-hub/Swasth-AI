import React, { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const { width } = Dimensions.get('window');

const BRAND = '#0D9268';
const BRAND_DARK = '#0a7a57';
const BRAND_LIGHT = '#E1F5EE';

// ─── Small reusable components ───────────────────────────────────────────────

const CheckIcon = () => (
  <View style={styles.checkCircle}>
    <View style={styles.checkMark} />
  </View>
);

const StarRow = () => (
  <View style={styles.starRow}>
    {[...Array(5)].map((_, i) => (
      <View key={i} style={styles.star} />
    ))}
  </View>
);

const StepDot = ({ number }) => (
  <View style={styles.stepDot}>
    <Text style={styles.stepDotText}>{number}</Text>
  </View>
);

// ─── Section: Hero ────────────────────────────────────────────────────────────

const HeroSection = ({ ctaAnim, onPress }) => (
  <View style={styles.hero}>
    <View style={styles.logoWrap}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>

    <Text style={styles.heroTitle}>
      Heal with{' '}
      <Text style={styles.heroTitleAccent}>ancient wisdom</Text>
      {',\nguided by AI'}
    </Text>

    <Text style={styles.heroSub}>
      Personalised Ayurvedic health guidance based on your Prakriti,
      lifestyle, and wellness goals.
    </Text>

    <Animated.View style={{ transform: [{ scale: ctaAnim }], width: '100%' }}>
      <TouchableOpacity style={styles.ctaBtn} onPress={onPress} activeOpacity={0.88}>
        <Text style={styles.ctaBtnText}>Begin your journey</Text>
        
      </TouchableOpacity>
    </Animated.View>

    <View style={styles.trustRow}>
      {['No prescriptions', '100% private', 'Free to start'].map((t) => (
        <View key={t} style={styles.trustItem}>
          <CheckIcon />
          <Text style={styles.trustText}>{t}</Text>
        </View>
      ))}
    </View>
  </View>
);

const FEATURES = [
  { title: 'Prakriti analysis',  desc: 'Understand your unique mind-body constitution and what it means for your health.' },
  { title: 'Dinacharya planner', desc: 'Daily routine recommendations aligned with your biological clock and dosha.' },
  { title: 'Safe guidance',      desc: 'Medical safety checks ensure advice accounts for your conditions and medications.' },
  { title: 'Agni tracking',      desc: 'Monitor your digestive fire — the root of all health in Ayurvedic tradition.' },
  { title: 'Ahara guidance',     desc: 'Personalised food and diet recommendations based on your body type and season.' },
  { title: 'Vikriti insights',   desc: 'Identify current imbalances and get targeted advice to restore equilibrium.' },
];

const FeaturesSection = () => (
  <View style={styles.section}>
    <Text style={styles.sectionLabel}>WHAT WE OFFER</Text>
    <Text style={styles.sectionTitle}>Holistic health, personalised for you</Text>
    <Text style={styles.sectionSub}>
      Built on the eight pillars of Ayurveda — from your constitution to your daily routine.
    </Text>
    <View style={styles.featureGrid}>
      {FEATURES.map((f) => (
        <View key={f.title} style={styles.featureCard}>
          <View style={styles.featureIconBox}>
            <View style={styles.featureIconDot} />
          </View>
          <Text style={styles.featureTitle}>{f.title}</Text>
          <Text style={styles.featureDesc}>{f.desc}</Text>
        </View>
      ))}
    </View>
  </View>
);

// ─── Section: Doshas ──────────────────────────────────────────────────────────

const DOSHAS = [
  {
    name: 'Vata',
    element: 'Air · Space',
    traits: ['Creative', 'Energetic', 'Quick mind'],
    bg: '#EAF3DE', border: '#97C459', nameColor: '#27500A',
    elemColor: '#3B6D11', traitColor: '#3B6D11',
  },
  {
    name: 'Pitta',
    element: 'Fire · Water',
    traits: ['Focused', 'Driven', 'Sharp intellect'],
    bg: '#FAEEDA', border: '#EF9F27', nameColor: '#633806',
    elemColor: '#854F0B', traitColor: '#854F0B',
  },
  {
    name: 'Kapha',
    element: 'Earth · Water',
    traits: ['Calm', 'Nurturing', 'Enduring'],
    bg: '#E1F5EE', border: '#5DCAA5', nameColor: '#085041',
    elemColor: '#0F6E56', traitColor: '#0F6E56',
  },
];

const DoshaSection = () => (
  <View style={styles.doshaSection}>
    <Text style={styles.sectionLabel}>THE THREE DOSHAS</Text>
    <Text style={styles.sectionTitle}>Your constitution explained</Text>
    <Text style={styles.sectionSub}>
      Every person is a unique blend of Vata, Pitta and Kapha. We decode yours.
    </Text>
    <View style={styles.doshaRow}>
      {DOSHAS.map((d) => (
        <View
          key={d.name}
          style={[styles.doshaCard, { backgroundColor: d.bg, borderColor: d.border }]}
        >
          <Text style={[styles.doshaName, { color: d.nameColor }]}>{d.name}</Text>
          <Text style={[styles.doshaElem, { color: d.elemColor }]}>{d.element}</Text>
          {d.traits.map((t) => (
            <Text key={t} style={[styles.doshaTrait, { color: d.traitColor }]}>{t}</Text>
          ))}
        </View>
      ))}
    </View>
  </View>
);

// ─── Section: How it works ────────────────────────────────────────────────────

const STEPS = [
  {
    title: 'Complete your profile',
    desc: 'Answer questions across 8 health dimensions — from your body frame to your sleep patterns and stress levels.',
  },
  {
    title: 'Get your Prakriti decoded',
    desc: 'Our AI analyses your responses to determine your unique dosha constitution and current imbalances.',
  },
  {
    title: 'Receive personalised guidance',
    desc: 'Chat with your Ayurvedic assistant for diet advice, daily routines, herbal recommendations and more — all tailored to you.',
  },
];

const HowSection = () => (
  <View style={styles.section}>
    <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
    <Text style={styles.sectionTitle}>Your path to balance</Text>
    <Text style={styles.sectionSub}>
      A simple 3-step process to unlock personalised Ayurvedic guidance.
    </Text>
    {STEPS.map((s, i) => (
      <View key={s.title} style={[styles.stepRow, i < STEPS.length - 1 && styles.stepRowBorder]}>
        <StepDot number={i + 1} />
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>{s.title}</Text>
          <Text style={styles.stepDesc}>{s.desc}</Text>
        </View>
      </View>
    ))}
  </View>
);

// ─── Section: Testimonials ────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    initials: 'PR', name: 'Priya Rao', location: 'Pune, Maharashtra',
    quote: '"After years of bloating and fatigue, Swasthya AI helped me understand my Vata-Pitta imbalance. The diet changes were simple but transformative."',
  },
  {
    initials: 'AK', name: 'Arjun Kulkarni', location: 'Bengaluru, Karnataka',
    quote: '"The daily routine planner is incredible. Waking up before sunrise and following my dinacharya has genuinely changed my energy levels."',
  },
  {
    initials: 'SM', name: 'Sunita Mehta', location: 'Mumbai, Maharashtra',
    quote: '"Finally an app that respects Ayurveda properly. Actual personalised guidance that accounts for my thyroid condition."',
  },
];
const BottomCTA = ({ onPress }) => (
  <View style={styles.bottomCta}>
    <View style={styles.bottomLogoCircle}>
      <View style={styles.bottomLeaf} />
    </View>
    <Text style={styles.bottomTitle}>Start your wellness journey today</Text>
    <Text style={styles.bottomSub}>
      It takes just 5 minutes to complete your profile and unlock your personalised Ayurvedic blueprint.
    </Text>
    <TouchableOpacity style={styles.ctaBtnLg} onPress={onPress} activeOpacity={0.88}>
      <Text style={styles.ctaBtnLgText}>Begin free profile setup  →</Text>
    </TouchableOpacity>
  </View>
);

// ─── Section: Footer ──────────────────────────────────────────────────────────

const Footer = () => (
  <View style={styles.footer}>
    <Text style={styles.footerLogo}>Swasthya AI</Text>
    <Text style={styles.footerSub}>Powered by ancient wisdom & modern intelligence</Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const LaunchScreen = () => {
  const navigation = useNavigation();

  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(40)).current;
  const ctaAnim    = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
      Animated.spring(ctaAnim, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleStart = () => {
    navigation.replace('ProfileSetup');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND} />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <HeroSection ctaAnim={ctaAnim} onPress={handleStart} />
        </Animated.View>
        <FeaturesSection />
        <DoshaSection />
        <HowSection />
        <BottomCTA onPress={handleStart} />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BRAND },

  // Hero
  hero: {
    backgroundColor: BRAND,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 64,
    alignItems: 'center',
  },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
    marginBottom: 28,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#86efac' },
  badgeText: { fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.9)' },
  logoWrap: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 28,
  },
  logo: { width: 72, height: 72 },
  heroTitle: {
    fontSize: 34, fontWeight: '600', color: '#fff',
    textAlign: 'center', lineHeight: 42, marginBottom: 16, letterSpacing: -0.5,
  },
  heroTitleAccent: { color: '#86efac' },
  heroSub: {
    fontSize: 15, color: 'rgba(255,255,255,0.82)',
    lineHeight: 24, textAlign: 'center', marginBottom: 36, maxWidth: 300,
  },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', borderRadius: 14,
    paddingVertical: 16, paddingHorizontal: 28,
    width: '100%', gap: 10,
  },
  ctaBtnText: { fontSize: 16, fontWeight: '600', color: BRAND },
  ctaArrow: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: BRAND_LIGHT,
    alignItems: 'center', justifyContent: 'center',
  },
  ctaArrowText: { fontSize: 14, color: BRAND, fontWeight: '600' },
  trustRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginTop: 28 },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkCircle: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: {
    width: 8, height: 5,
    borderLeftWidth: 1.5, borderBottomWidth: 1.5,
    borderColor: '#fff',
    transform: [{ rotate: '-45deg' }, { translateY: -1 }],
  },
  trustText: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },

  // Stats
  statsRow: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: 20, marginTop: -28, zIndex: 10,
    backgroundColor: '#fff',
    paddingBottom: 20, paddingTop: 20,
    borderBottomWidth: 0.5, borderBottomColor: '#e5e5e5',
  },
  statCard: {
    flex: 1, backgroundColor: '#f7faf8',
    borderRadius: 12, borderWidth: 0.5, borderColor: '#d1e8de',
    paddingVertical: 14, alignItems: 'center',
  },
  statNum: { fontSize: 22, fontWeight: '600', color: BRAND },
  statLbl: { fontSize: 11, color: '#666', marginTop: 4, textAlign: 'center', lineHeight: 15 },

  // Common section
  section: { backgroundColor: '#fff', padding: 28 },
  sectionLabel: { fontSize: 11, letterSpacing: 2, color: BRAND, fontWeight: '600', marginBottom: 6 },
  sectionTitle: { fontSize: 22, fontWeight: '600', color: '#1a1a1a', marginBottom: 8, lineHeight: 30 },
  sectionSub: { fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 24 },

  // Features
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureCard: {
    width: (width - 68) / 2,
    backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 0.5, borderColor: '#ddd',
    padding: 16,
  },
  featureIconBox: {
    width: 36, height: 36, borderRadius: 9,
    backgroundColor: BRAND_LIGHT,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  featureIconDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: BRAND },
  featureTitle: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', marginBottom: 5 },
  featureDesc: { fontSize: 12, color: '#666', lineHeight: 18 },

  // Doshas
  doshaSection: { backgroundColor: '#f4faf7', padding: 28 },
  doshaRow: { flexDirection: 'row', gap: 10 },
  doshaCard: {
    flex: 1, borderRadius: 12, borderWidth: 0.5,
    paddingVertical: 18, paddingHorizontal: 10, alignItems: 'center',
  },
  doshaName: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  doshaElem: { fontSize: 10, marginBottom: 12, textAlign: 'center' },
  doshaTrait: { fontSize: 11, paddingVertical: 2 },

  // Steps
  stepRow: { flexDirection: 'row', gap: 16, paddingVertical: 20 },
  stepRowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  stepDot: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepDotText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
  stepDesc: { fontSize: 13, color: '#555', lineHeight: 20 },

  // Testimonials
  testimonialSection: { backgroundColor: '#f4faf7', padding: 28 },
  tCard: {
    backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 0.5, borderColor: '#ddd',
    padding: 18, marginBottom: 12,
  },
  starRow: { flexDirection: 'row', gap: 4, marginBottom: 12 },
  star: {
    width: 12, height: 12, backgroundColor: '#EF9F27',
    // star shape approximated with a rotated square
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  tQuote: { fontSize: 14, color: '#1a1a1a', lineHeight: 22, fontStyle: 'italic', marginBottom: 14 },
  tAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: BRAND_LIGHT, alignItems: 'center', justifyContent: 'center',
  },
  tAvatarText: { fontSize: 12, fontWeight: '600', color: '#085041' },
  tName: { fontSize: 13, fontWeight: '600', color: '#1a1a1a' },
  tLoc: { fontSize: 11, color: '#888' },

  // Bottom CTA
  bottomCta: {
    backgroundColor: BRAND,
    padding: 48, alignItems: 'center',
  },
  bottomLogoCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  bottomLeaf: {
    width: 24, height: 30, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.85)',
    transform: [{ rotate: '-15deg' }],
  },
  bottomTitle: {
    fontSize: 26, fontWeight: '600', color: '#fff',
    textAlign: 'center', lineHeight: 34, marginBottom: 12,
  },
  bottomSub: {
    fontSize: 14, color: 'rgba(255,255,255,0.82)',
    textAlign: 'center', lineHeight: 22, marginBottom: 32, maxWidth: 280,
  },
  ctaBtnLg: {
    backgroundColor: '#fff', borderRadius: 14,
    paddingVertical: 18, width: '100%', alignItems: 'center',
  },
  ctaBtnLgText: { fontSize: 16, fontWeight: '600', color: BRAND },

  // Footer
  footer: {
    backgroundColor: BRAND_DARK,
    padding: 24, alignItems: 'center',
    borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.15)',
  },
  footerLogo: { fontSize: 17, fontWeight: '600', color: '#fff', marginBottom: 6 },
  footerSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
});

export default LaunchScreen;