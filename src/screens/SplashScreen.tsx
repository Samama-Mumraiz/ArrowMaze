import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

const LOADING_BG = require('../../assets/loading_bg.jpg');

// Original background image dimensions (1696x2528)
const BG_ORIGINAL_WIDTH = 1696;
const BG_ORIGINAL_HEIGHT = 2528;

export default function SplashScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const progress = useSharedValue(0);
  const hasNavigated = useRef(false);

  // Mathematically map bounding boxes from the 1696x2528 background to current screen
  const layout = useMemo(() => {
    const imageAspect = BG_ORIGINAL_WIDTH / BG_ORIGINAL_HEIGHT;
    const screenAspect = windowWidth / windowHeight;

    let renderedW: number;
    let renderedH: number;
    let offsetX: number;
    let offsetY: number;

    if (screenAspect < imageAspect) {
      // Taller screen (portrait phones): height fits, width is cropped symmetrically
      renderedH = windowHeight;
      renderedW = windowHeight * imageAspect;
      offsetX = (windowWidth - renderedW) / 2;
      offsetY = 0;
    } else {
      // Wider screen: width fits, height is cropped symmetrically
      renderedW = windowWidth;
      renderedH = windowWidth / imageAspect;
      offsetX = 0;
      offsetY = (windowHeight - renderedH) / 2;
    }

    const mapRect = (x: number, y: number, w: number, h: number) => ({
      left: offsetX + (x / BG_ORIGINAL_WIDTH) * renderedW,
      top: offsetY + (y / BG_ORIGINAL_HEIGHT) * renderedH,
      width: (w / BG_ORIGINAL_WIDTH) * renderedW,
      height: (h / BG_ORIGINAL_HEIGHT) * renderedH,
    });

    return {
      // Inner fill channel of the progress bar track drawn on the image: X=[302, 1394], Y=[1880, 1964]
      progressRect: mapRect(302, 1880, 1092, 84),
      // "Tap to Skip" button graphic drawn on the image: X=[420, 1250], Y=[2200, 2410]
      skipRect: mapRect(420, 2200, 830, 210),
    };
  }, [windowWidth, windowHeight]);

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
    // Safety fallback timer: guarantees screen unconditionally proceeds after 2.8s
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
      {/* 1. DYNAMIC PROGRESS FILL OVER PRE-DRAWN TRACK                  */}
      {/* Only native animated fill rendered; outer track is in image    */}
      {/* ============================================================== */}
      <View style={[styles.progressTrackOverlay, layout.progressRect]}>
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

      {/* ============================================================== */}
      {/* 2. TRANSPARENT HIT-ZONE OVER PRE-DRAWN "TAP TO SKIP" GRAPHIC   */}
      {/* Zero duplicate text, zero duplicate backgrounds/borders        */}
      {/* ============================================================== */}
      <TouchableOpacity
        activeOpacity={0.65}
        onPress={handleSkipPress}
        style={[styles.transparentSkipHitZone, layout.skipRect]}
        accessibilityLabel="Tap to Skip Loading"
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  /* Dynamic Progress Fill Channel */
  progressTrackOverlay: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 20,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  progressGlossHighlight: {
    position: 'absolute',
    top: 2,
    left: 4,
    right: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  progressLeadingGlow: {
    position: 'absolute',
    right: 2,
    top: 2,
    bottom: 2,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },

  /* Transparent Hit-Zone over Pre-Drawn "Tap to Skip" Button */
  transparentSkipHitZone: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 28,
    zIndex: 50,
  },
});
