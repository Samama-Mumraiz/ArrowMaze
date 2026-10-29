import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Pattern, Line, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { ARROWMAZE_PALETTE } from '../theme/ThemeContext';
import NeonLogoMark from '../view/components/NeonLogoMark';
import NeonIsometricCube from '../view/components/NeonIsometricCube';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SplashScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const progress = useSharedValue(0);

  useEffect(() => {
    // Smooth loading progress bar (2.4s)
    progress.value = withTiming(
      1,
      {
        duration: 2400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      },
      (finished) => {
        if (finished) {
          runOnJS(handleNavigation)();
        }
      }
    );
  }, [progress]);

  const handleNavigation = () => {
    navigation.navigate('Home');
  };

  const animatedProgressBar = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      {/* 1. Deep Navy / Midnight Blue Background Gradient */}
      <LinearGradient
        colors={[ARROWMAZE_PALETTE.bgDark, ARROWMAZE_PALETTE.bgMid, ARROWMAZE_PALETTE.bgLight]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* 2. Subtle Blueprint Grid Pattern in Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern id="splashGrid" width="36" height="36" patternUnits="userSpaceOnUse">
              <Line x1="0" y1="0" x2="36" y2="0" stroke="rgba(0, 240, 255, 0.05)" strokeWidth="1" />
              <Line x1="0" y1="0" x2="0" y2="36" stroke="rgba(0, 240, 255, 0.05)" strokeWidth="1" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#splashGrid)" />
        </Svg>
      </View>

      <SafeAreaView edges={['top', 'bottom']} style={styles.contentSafeArea}>
        {/* TOP: Neon Geometric Arrow Logo & "ArrowMaze" (Screen 1 Reference) */}
        <View style={styles.topLogoContainer}>
          <NeonLogoMark
            size="large"
            tagline="Think • Tap • Solve"
            showSubtitle={true}
          />
        </View>

        {/* CENTER: 3D Isometric Glowing Cube with Pedestal (Screen 1 Reference) */}
        <View style={styles.centerGraphicContainer}>
          <NeonIsometricCube size={260} showPedestal={true} />
        </View>

        {/* BOTTOM: Glowing Neon Progress Bar & "Loading..." Text */}
        <View style={styles.bottomSection}>
          <View style={styles.progressBarTrack}>
            <Animated.View style={[styles.progressBarFill, animatedProgressBar]} />
          </View>

          <Text style={styles.loadingText}>Loading...</Text>

          {/* Tap anywhere to skip prompt */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleNavigation}
            style={styles.skipPrompt}
            accessibilityLabel="Tap to Start"
          >
            <Text style={styles.skipPromptText}>TAP TO SKIP</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ARROWMAZE_PALETTE.bgDark,
  },
  contentSafeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  topLogoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  centerGraphicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  bottomSection: {
    width: '100%',
    maxWidth: 290,
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 240, 255, 0.25)',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: ARROWMAZE_PALETTE.neonCyan,
    shadowColor: ARROWMAZE_PALETTE.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  loadingText: {
    fontFamily: 'Sora_400Regular',
    fontSize: 13,
    color: '#8FA6CC',
    marginTop: 12,
    letterSpacing: 0.8,
  },
  skipPrompt: {
    marginTop: 14,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(11, 26, 58, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(46, 123, 255, 0.4)',
  },
  skipPromptText: {
    fontFamily: 'Sora_700Bold',
    fontSize: 10,
    color: '#22D3FF',
    letterSpacing: 1.5,
  },
});
