import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Path,
  Polygon,
} from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';

const MaskedViewComponent = MaskedView as unknown as React.ComponentType<any>;

interface NeonLogoMarkProps {
  size?: 'normal' | 'large';
  tagline?: string;
  showSubtitle?: boolean;
}

export default function NeonLogoMark({
  size = 'large',
  tagline = 'Think • Tap • Solve',
  showSubtitle = true,
}: NeonLogoMarkProps): React.JSX.Element {
  const isLarge = size === 'large';
  const iconWidth = isLarge ? 84 : 56;
  const iconHeight = isLarge ? 84 : 56;
  const fontSize = isLarge ? 40 : 32;

  return (
    <View style={styles.container}>
      {/* 1. Neon Geometric Arrow Mark */}
      <View style={[styles.iconWrapper, { width: iconWidth, height: iconHeight }]}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
          <Defs>
            <SvgLinearGradient id="logoNeonCyan" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colors.accent} />
              <Stop offset="1" stopColor={colors.primaryA} />
            </SvgLinearGradient>
          </Defs>

          {/* Outer Cyan Glow Blur Simulation */}
          <Path
            d="M 68 25 L 30 25 L 30 75 L 70 75 L 70 52 L 52 52"
            stroke={colors.accent}
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.25"
          />

          {/* Geometric Angular Winding Pathway (C-Shape that shoots outward) */}
          <Path
            d="M 68 25 L 30 25 L 30 75 L 70 75 L 70 52 L 86 52"
            stroke="url(#logoNeonCyan)"
            strokeWidth="8.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Core White Highlight */}
          <Path
            d="M 68 25 L 30 25 L 30 75 L 70 75 L 70 52 L 86 52"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.85"
          />

          {/* Sharp High-Tech Arrowhead Pointing Up-Right */}
          <Polygon
            points="76,38 98,52 82,66"
            fill={colors.accent}
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
        </Svg>
      </View>

      {/* 2. Exact "ArrowMaze" logo: "Arrow" in white, "Maze" in cyan->blue gradient (#22D3FF -> #2E7BFF) with MaskedView */}
      <View style={styles.titleRow}>
        <Text style={[styles.logoTextArrow, { fontSize }]}>Arrow</Text>

        <MaskedViewComponent
          maskElement={
            <Text style={[styles.logoTextMazeMask, { fontSize }]}>
              Maze
            </Text>
          }
        >
          <LinearGradient
            colors={['#22D3FF', '#2E7BFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[styles.logoTextMazePlaceholder, { fontSize }]}>
              Maze
            </Text>
          </LinearGradient>
        </MaskedViewComponent>
      </View>

      {/* 3. Subtitle / Tagline in Sora_600SemiBold */}
      {showSubtitle && (
        <Text style={[styles.taglineText, isLarge && styles.taglineTextLarge]}>
          {tagline}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTextArrow: {
    fontFamily: 'Sora_800ExtraBold',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(34, 211, 255, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  logoTextMazeMask: {
    fontFamily: 'Sora_800ExtraBold',
    color: '#000000',
    backgroundColor: 'transparent',
    letterSpacing: -0.5,
  },
  logoTextMazePlaceholder: {
    fontFamily: 'Sora_800ExtraBold',
    opacity: 0,
    letterSpacing: -0.5,
  },
  taglineText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 3,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  taglineTextLarge: {
    fontSize: 13,
    letterSpacing: 4,
    marginTop: 8,
  },
});
