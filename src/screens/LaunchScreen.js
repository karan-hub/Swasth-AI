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
} from 'react-native';

const { width, height } = Dimensions.get('window');

const LaunchScreen = () => {
  const navigation = useNavigation(); // Get navigation object

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(30)).current;
  const taglineFadeAnim = useRef(new Animated.Value(0)).current;
  const taglineSlideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Logo appears with fade and scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 10,
          friction: 3,
          useNativeDriver: true,
        }),
      ]),
      // Wait a bit
      Animated.delay(300),
      // Main text appears
      Animated.parallel([
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textSlideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Wait a bit
      Animated.delay(200),
      // Tagline appears
      Animated.parallel([
        Animated.timing(taglineFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(taglineSlideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Navigate to next screen after total animation time
    const timer = setTimeout(() => {
      navigation.replace('ProfileSetup');
    }, 3500); // Total time: 800 + 300 + 600 + 200 + 600 + buffer

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10B981" />
      
      {/* Background gradient effect */}
      <View style={styles.gradientTop} />
      <View style={styles.gradientBottom} />

      {/* Content */}
      <View style={styles.content}>
        {/* Animated Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.logoWrapper}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Animated Welcome Text */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textFadeAnim,
              transform: [{ translateY: textSlideAnim }],
            },
          ]}
        >
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appName}>Swasthya AI</Text>
        </Animated.View>

        {/* Animated Tagline */}
        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: taglineFadeAnim,
              transform: [{ translateY: taglineSlideAnim }],
            },
          ]}
        >
          <Text style={styles.tagline}>Your Personal Ayurvedic Health Assistant</Text>
          <View style={styles.taglineUnderline} />
        </Animated.View>

        {/* Decorative elements */}
        <Animated.View
          style={[
            styles.leafDecoration,
            {
              opacity: taglineFadeAnim,
            },
          ]}
        >
          <Text style={styles.leafIcon}>🌿</Text>
        </Animated.View>
      </View>

      {/* Bottom decoration */}
      <View style={styles.bottomDecoration}>
        <Text style={styles.bottomText}>Powered by Ancient Wisdom & Modern AI</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
    backgroundColor: '#059669',
    opacity: 0.3,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
    backgroundColor: '#047857',
    opacity: 0.3,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoWrapper: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 140,
    height: 140,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    color: '#E8F5E9',
    fontWeight: '300',
    letterSpacing: 1,
    marginBottom: 8,
  },
  appName: {
    fontSize: 42,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  taglineContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  tagline: {
    fontSize: 16,
    color: '#E8F5E9',
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 0.5,
    lineHeight: 24,
    paddingHorizontal: 30,
  },
  taglineUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    borderRadius: 2,
  },
  leafDecoration: {
    position: 'absolute',
    bottom: -80,
    alignItems: 'center',
  },
  leafIcon: {
    fontSize: 40,
    opacity: 0.6,
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 12,
    color: '#E8F5E9',
    fontWeight: '300',
    letterSpacing: 1,
    opacity: 0.8,
  },
});

export default LaunchScreen;