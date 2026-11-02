import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { typography } from '../theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LOADING_BG = require('../../assets/loading_bg.jpg');

export default function SplashScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const hasNavigated = useRef(false);

  const routeToHome = useCallback(
    (unconditional: boolean = false) => {
      if (hasNavigated.current && !unconditional) return;
      hasNavigated.current = true;

      // 1. Primary: navigation.replace('Home')
      try {
        if (typeof navigation.replace === 'function') {
          navigation.replace('Home');
          return;
        }
      } catch {
        // replace fallback
      }

      // 2. Secondary: navigation.navigate('Home')
      try {
        navigation.navigate('Home');
        return;
      } catch {
        // navigate fallback
      }

      // 3. Fallback: navigation.reset
      try {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } catch (err) {
        console.warn('Fallback navigation to Home failed:', err);
      }
    },
    [navigation]
  );

  useEffect(() => {
    // Safety fallback timer: guarantees screen unconditionally proceeds even if animation or rehydration halts
    const fallbackTimer = setTimeout(() => {
      routeToHome(false);
    }, 2800);

    // Smooth loading progress animation (2.4s) with ease-in-out curve
    progress.value = withTiming(
      1,
      {
        duration: 2400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
      (finished) => {
        if (finished) {
          runOnJS(routeToHome)(false);
        }
      }
    );

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [progress, routeToHome]);

  // Loading Bar Width Animation
  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${Math.max(progress.value * 100, 4)}%`,
  }));

  // "TAP TO SKIP" Button Spring Press Feedback
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleSkipPressIn = () => {
    buttonScale.value = withTiming(0.93, {
      duration: 80,
      easing: Easing.out(Easing.ease),
    });
  };

  const handleSkipPressOut = () => {
    buttonScale.value = withSpring(1, { damping: 12, stiffness: 240 });
  };

  const handleSkipPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Platform fallback
    }
    // Unconditionally route the user to the Home screen
    routeToHome(true);
  };

  return (
    <ImageBackground
      source={LOADING_BG}
      resizeMode="cover"
      style={styles.container}
    >
      {/* ============================================================== */}
      {/* INTERACTIVE BOTTOM UI: Thick Blue Loading Bar + Skip Button    */}
      {/* Positioned cleanly over the designated bottom area of the asset*/}
      {/* ============================================================== */}
      <View
        style={[
          styles.bottomSection,
          { bottom: Math.max(28, insets.bottom + 16) },
        ]}
      >
        {/* 1. Thick Blue Progress Bar with Glowing Yellow Fill */}
        <View style={styles.progressBarWrapper}>
          <View style={styles.progressBarTrack}>
            <Animated.View style={[styles.progressBarFill, animatedProgressStyle]}>
              <LinearGradient
                colors={['#FFF9A6', '#FDE047', '#F59E0B', '#D97706']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={StyleSheet.absoluteFill}
              />
              {/* Top Gloss Reflection Streak */}
              <View style={styles.progressGlossHighlight} />
              {/* Leading Edge Bright Energy Tip */}
              <View style={styles.progressLeadingGlow} />
            </Animated.View>
          </View>
        </View>

        {/* 2. "Loading..." Cartoon Typography */}
        <Text style={styles.loadingText}>Loading...</Text>

        {/* 3. Interactive Glossy 3D Blue "TAP TO SKIP" Pill Button */}
        <Animated.View style={[styles.skipButtonWrapper, animatedButtonStyle]}>
          <TouchableOpacity
            activeOpacity={0.92}
            onPressIn={handleSkipPressIn}
            onPressOut={handleSkipPressOut}
            onPress={handleSkipPress}
            style={styles.skip3DBase}
            accessibilityLabel="Tap to Skip Loading"
          >
            {/* 3D Dark Under-Bevel Base */}
            <View style={styles.skipBevelBottom} />

            {/* Glossy Cyan/Blue Front Face */}
            <LinearGradient
              colors={['#38BDF8', '#0284C7', '#0369A1']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.skipFrontFace}
            >
              {/* Top Gloss Reflection Highlight */}
              <View style={styles.skipGlossHighlight} />

              {/* Centered Button Text */}
              <Text style={styles.skipButtonText}>TAP TO SKIP</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  bottomSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    paddingHorizontal: 20,
  },

  /* 3D Glossy Rounded Loading Bar */
  progressBarWrapper: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarTrack: {
    width: '100%',
    height: 24,
    borderRadius: 12,
    backgroundColor: '#071F48',
    borderWidth: 2.8,
    borderColor: '#0284C7',
    borderTopColor: '#38BDF8',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 9,
    overflow: 'hidden',
    position: 'relative',
  },
  progressGlossHighlight: {
    position: 'absolute',
    top: 2,
    left: 4,
    right: 4,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  progressLeadingGlow: {
    position: 'absolute',
    right: 2,
    top: 3,
    bottom: 3,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },

  /* "Loading..." Typography */
  loadingText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 18,
    color: '#0F356B',
    marginTop: 10,
    marginBottom: 14,
    letterSpacing: 0.6,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  /* 3D Blue Glossy "TAP TO SKIP" Pill Button */
  skipButtonWrapper: {
    width: '100%',
    maxWidth: 246,
    alignItems: 'center',
  },
  skip3DBase: {
    width: '100%',
    height: 52,
    position: 'relative',
  },
  skipBevelBottom: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    height: 48,
    backgroundColor: '#013D75',
    borderRadius: 26,
  },
  skipFrontFace: {
    width: '100%',
    height: 48,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#7DD3FC',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  skipGlossHighlight: {
    position: 'absolute',
    top: 2,
    left: 14,
    right: 14,
    height: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
  },
  skipButtonText: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(1, 61, 117, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
});
