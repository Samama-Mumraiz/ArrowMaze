import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Rect,
  Path,
  Circle,
  Text as SvgText,
  G,
} from 'react-native-svg';

interface WoodenSignpostProps {
  width?: number;
  height?: number;
}

export default function WoodenSignpost({
  width = 96,
  height = 96,
}: WoodenSignpostProps): React.JSX.Element {
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
        <Defs>
          {/* Wooden Plank Main Gradient */}
          <SvgLinearGradient id="woodPlankGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#9C6634" />
            <Stop offset="30%" stopColor="#805125" />
            <Stop offset="70%" stopColor="#673E18" />
            <Stop offset="100%" stopColor="#4A2B0E" />
          </SvgLinearGradient>

          {/* Wooden Post Gradient */}
          <SvgLinearGradient id="woodPostGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#543212" />
            <Stop offset="50%" stopColor="#6E431B" />
            <Stop offset="100%" stopColor="#41240B" />
          </SvgLinearGradient>

          {/* Wood Bevel Highlight */}
          <SvgLinearGradient id="woodBevel" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#C48E59" />
            <Stop offset="100%" stopColor="#4A2B0E" />
          </SvgLinearGradient>
        </Defs>

        {/* 1. Anchored Vertical Post */}
        <Rect
          x="42"
          y="56"
          width="16"
          height="42"
          rx="3"
          fill="url(#woodPostGrad)"
          stroke="#2E1706"
          strokeWidth="1.5"
        />

        {/* 2. Bulky Wooden Sign Board (Chunky Rounded Rect with Wood Grain) */}
        {/* Drop Shadow */}
        <Rect
          x="10"
          y="18"
          width="82"
          height="62"
          rx="7"
          fill="#1C0E04"
          opacity={0.45}
        />

        {/* Main Plank Body */}
        <Rect
          x="8"
          y="14"
          width="82"
          height="60"
          rx="7"
          fill="url(#woodPlankGrad)"
          stroke="#381D08"
          strokeWidth="2.5"
        />

        {/* Inner Highlight Border */}
        <Rect
          x="10.5"
          y="16.5"
          width="77"
          height="55"
          rx="5"
          fill="none"
          stroke="url(#woodBevel)"
          strokeWidth="1"
          opacity={0.65}
        />

        {/* Horizontal Plank Seam Divider */}
        <Path
          d="M8,44 L90,44"
          stroke="#331A06"
          strokeWidth="2"
        />
        <Path
          d="M10,46 L88,46"
          stroke="#BA8652"
          strokeWidth="0.8"
          opacity={0.5}
        />

        {/* Wood Grain Lines & Knot Details */}
        <Path
          d="M16,24 Q36,22 56,25 Q74,27 82,24"
          stroke="#4D2A0C"
          strokeWidth="1"
          fill="none"
          opacity={0.5}
        />
        <Path
          d="M14,56 Q40,54 62,58 Q78,57 84,55"
          stroke="#4D2A0C"
          strokeWidth="1"
          fill="none"
          opacity={0.5}
        />

        {/* Corner Iron Nail Bolts */}
        {/* Top-left bolt */}
        <Circle cx="15" cy="21" r="3" fill="#6B7280" stroke="#1F2937" strokeWidth="1" />
        <Circle cx="14" cy="20" r="1" fill="#D1D5DB" />
        {/* Top-right bolt */}
        <Circle cx="83" cy="21" r="3" fill="#6B7280" stroke="#1F2937" strokeWidth="1" />
        <Circle cx="82" cy="20" r="1" fill="#D1D5DB" />
        {/* Bottom-left bolt */}
        <Circle cx="15" cy="67" r="3" fill="#6B7280" stroke="#1F2937" strokeWidth="1" />
        <Circle cx="14" cy="66" r="1" fill="#D1D5DB" />
        {/* Bottom-right bolt */}
        <Circle cx="83" cy="67" r="3" fill="#6B7280" stroke="#1F2937" strokeWidth="1" />
        <Circle cx="82" cy="66" r="1" fill="#D1D5DB" />

        {/* 3. Carved Text Lines: "Small Moves", "Big Paths" */}
        <G>
          {/* Shadow line 1 */}
          <SvgText
            x="49"
            y="31"
            textAnchor="middle"
            fill="#2A1404"
            fontSize="10"
            fontWeight="900"
          >
            Small Moves
          </SvgText>
          {/* Face line 1 */}
          <SvgText
            x="49"
            y="30"
            textAnchor="middle"
            fill="#FEF3C7"
            fontSize="10"
            fontWeight="900"
          >
            Small Moves
          </SvgText>

          {/* Shadow line 2 */}
          <SvgText
            x="49"
            y="57"
            textAnchor="middle"
            fill="#2A1404"
            fontSize="10.5"
            fontWeight="900"
          >
            Big Paths
          </SvgText>
          {/* Face line 2 */}
          <SvgText
            x="49"
            y="56"
            textAnchor="middle"
            fill="#FEF3C7"
            fontSize="10.5"
            fontWeight="900"
          >
            Big Paths
          </SvgText>
        </G>

        {/* 4. Small Engraved Carved Arrow Below "Big Paths" */}
        {/* Arrow Shadow */}
        <Path
          d="M36,66 L56,66 M52,63 L57,66 L52,69"
          stroke="#2A1404"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Arrow Face */}
        <Path
          d="M36,65 L56,65 M52,62 L57,65 L52,68"
          stroke="#FDE68A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

