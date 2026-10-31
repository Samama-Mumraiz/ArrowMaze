import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Svg, {
  Defs,
  Marker,
  Path,
  Circle,
  G,
} from 'react-native-svg';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { TangledStrand } from '../../model/types';
import { checkStrandRaycast } from '../../model/raycast';
import { FLAT_TECH_PALETTE, useTheme } from '../../theme/ThemeContext';
import Arrow from './Arrow';

export const GRID_STEP_SIZE = 40;
export const PROPORTIONAL_STROKE_WIDTH = 4.2;

export interface GameBoardProps {
  strands: TangledStrand[];
  rows: number;
  cols: number;
  exitingStrandIds?: string[];
  blockedStrandId?: string | null;
  hintStrandId?: string | null;
  isAnimating?: boolean;
  screenShake?: { value: number };
  onStrandPress?: (strandId: string) => void;
  onExitComplete?: (strandId: string) => void;
  canvasBg?: string;
  dotColor?: string;
  gridStepSize?: number;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function GameBoard({
  strands,
  rows,
  cols,
  exitingStrandIds = [],
  blockedStrandId = null,
  hintStrandId = null,
  isAnimating = false,
  screenShake,
  onStrandPress,
  onExitComplete,
  canvasBg: customCanvasBg,
  dotColor: customDotColor,
  gridStepSize = GRID_STEP_SIZE,
  strokeWidth = PROPORTIONAL_STROKE_WIDTH,
  style,
  containerStyle,
}: GameBoardProps): React.JSX.Element {
  const { theme } = useTheme();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Actual rendered pixel dimensions measured on layout
  const [layoutDims, setLayoutDims] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // Dynamic SVG viewBox bounds: W = cols * gridStepSize, H = rows * gridStepSize
  const viewBoxW = useMemo(() => cols * gridStepSize, [cols, gridStepSize]);
  const viewBoxH = useMemo(() => rows * gridStepSize, [rows, gridStepSize]);

  // Responsive container bounding constraints
  const maxContainerWidth = useMemo(() => {
    const horizontalMargin = 28;
    const maxScreenFit = windowWidth - horizontalMargin;
    const maxVerticalFit = Math.max(300, windowHeight - 220) * (cols / rows);
    return Math.floor(Math.min(maxScreenFit, maxVerticalFit, 440));
  }, [windowWidth, windowHeight, cols, rows]);

  // Theme resolution: solid off-white #F6F6F6 canvas with #D1D1D1 dots (or theme dark adapt)
  const resolvedCanvasBg = useMemo(() => {
    if (customCanvasBg) return customCanvasBg;
    return theme.isDark ? '#081730' : '#F6F6F6';
  }, [customCanvasBg, theme.isDark]);

  const resolvedDotColor = useMemo(() => {
    if (customDotColor) return customDotColor;
    return theme.isDark ? 'rgba(56, 189, 248, 0.28)' : '#D1D1D1';
  }, [customDotColor, theme.isDark]);

  const resolvedBorderColor = useMemo(() => {
    return theme.isDark ? 'rgba(56, 189, 248, 0.35)' : '#E2E8F0';
  }, [theme.isDark]);

  // Dynamically calculate which active strands are currently unblocked
  const clearStrandIds = useMemo(() => {
    const unblocked: string[] = [];
    const active = strands.filter((s) => !exitingStrandIds.includes(s.id));
    for (const strand of active) {
      const res = checkStrandRaycast(strand, active, rows, cols);
      if (res.isClear) {
        unblocked.push(strand.id);
      }
    }
    return unblocked;
  }, [strands, exitingStrandIds, rows, cols]);

  // Background Grid: Uniform 2D matrix of circular dots (#D1D1D1, r=1.75px)
  const dotMatrix = useMemo(() => {
    const dots: React.JSX.Element[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * gridStepSize + gridStepSize / 2;
        const cy = r * gridStepSize + gridStepSize / 2;
        dots.push(
          <Circle
            key={`dot-${r}-${c}`}
            cx={cx}
            cy={cy}
            r={1.75}
            fill={resolvedDotColor}
          />
        );
      }
    }
    return dots;
  }, [rows, cols, gridStepSize, resolvedDotColor]);

  // High-precision touch handling mapped to normalized grid coordinates
  const handleBoardTouch = useCallback(
    (e: GestureResponderEvent) => {
      if (isAnimating || !onStrandPress) return;
      const { locationX, locationY } = e.nativeEvent;
      const activeWidth = layoutDims.width || maxContainerWidth;
      const activeHeight = layoutDims.height || (activeWidth / (cols / rows));

      if (
        locationX < 0 ||
        locationY < 0 ||
        locationX > activeWidth ||
        locationY > activeHeight
      ) {
        return;
      }

      // Convert touch position to grid cell (col, row)
      const col = Math.floor((locationX / activeWidth) * cols);
      const row = Math.floor((locationY / activeHeight) * rows);

      const active = strands.filter((s) => !exitingStrandIds.includes(s.id));
      if (active.length === 0) return;

      // 1. Direct hit on occupied cells
      const exactMatches = active.filter((s) =>
        s.occupiedCells.some((c) => c.r === row && c.c === col)
      );

      if (exactMatches.length > 0) {
        const unblocked = exactMatches.find((s) => clearStrandIds.includes(s.id));
        if (unblocked) {
          onStrandPress(unblocked.id);
          return;
        }
        let best = exactMatches[0];
        let bestDist = Infinity;
        for (const s of exactMatches) {
          const d = Math.hypot(s.head.r - row, s.head.c - col);
          if (d < bestDist) {
            bestDist = d;
            best = s;
          }
        }
        onStrandPress(best.id);
        return;
      }

      // 2. Proximity check within 1.25 cells
      const cellPixelW = activeWidth / cols;
      const cellPixelH = activeHeight / rows;
      let closestStrand: TangledStrand | null = null;
      let closestDist = 1.25;

      for (const s of active) {
        for (const cell of s.occupiedCells) {
          const cellCenterX = cell.c * cellPixelW + cellPixelW / 2;
          const cellCenterY = cell.r * cellPixelH + cellPixelH / 2;
          const dist =
            Math.hypot(cellCenterX - locationX, cellCenterY - locationY) /
            Math.min(cellPixelW, cellPixelH);
          if (dist < closestDist) {
            closestDist = dist;
            closestStrand = s;
          }
        }
      }

      if (closestStrand) {
        onStrandPress(closestStrand.id);
      }
    },
    [
      isAnimating,
      onStrandPress,
      layoutDims,
      maxContainerWidth,
      cols,
      rows,
      strands,
      exitingStrandIds,
      clearStrandIds,
    ]
  );

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setLayoutDims({ width, height });
    }
  };

  const animatedBoardShakeStyle = useAnimatedStyle(() => {
    if (!screenShake) return {};
    return {
      transform: [{ translateX: screenShake.value }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.outerWrapper,
        animatedBoardShakeStyle,
        style,
      ]}
    >
      {/* ============================================================== */}
      {/* RESPONSIVE CONTAINER WITH ASPECT RATIO & FLAT TECH CANVAS      */}
      {/* ============================================================== */}
      <View
        style={[
          styles.responsiveCard,
          {
            maxWidth: maxContainerWidth,
            aspectRatio: cols / rows,
            backgroundColor: resolvedCanvasBg,
            borderColor: resolvedBorderColor,
          },
          containerStyle,
        ]}
        onLayout={handleLayout}
        onStartShouldSetResponder={() => true}
        onResponderRelease={handleBoardTouch}
      >
        {/* ============================================================== */}
        {/* DYNAMIC SVG WITH VIEWBOX (cols * step, rows * step)            */}
        {/* ============================================================== */}
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Defs>
            {/* SVG Markers for all 8 High-Contrast Palette Colors */}
            {FLAT_TECH_PALETTE.map((color) => {
              const markerId = `arrowhead-${color.replace('#', '')}`;
              return (
                <Marker
                  key={markerId}
                  id={markerId}
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="5.5"
                  markerHeight="5.5"
                  orient="auto-start-reverse"
                >
                  <Path d="M 1 2 L 8 5 L 1 8 z" fill={color} strokeLinejoin="round" />
                </Marker>
              );
            })}
          </Defs>

          {/* Background Grid: Uniform 2D Matrix of Circular Dots */}
          <G id="dot-matrix-grid">{dotMatrix}</G>
        </Svg>

        {/* ============================================================== */}
        {/* STATE-AWARE ARROW TRACK ELEMENTS                               */}
        {/* ============================================================== */}
        <View
          style={[StyleSheet.absoluteFill, { overflow: 'visible' }]}
          pointerEvents="none"
        >
          {strands.map((strand, index) => {
            // High-contrast color mapping to FLAT_TECH_PALETTE
            const strandColor =
              strand.color && FLAT_TECH_PALETTE.includes(strand.color)
                ? strand.color
                : FLAT_TECH_PALETTE[strand.colorIndex % FLAT_TECH_PALETTE.length] ||
                  FLAT_TECH_PALETTE[index % FLAT_TECH_PALETTE.length];

            const strandWithColor: TangledStrand = {
              ...strand,
              color: strandColor,
            };

            return (
              <Arrow
                key={strand.id}
                id={strand.id}
                strand={strandWithColor}
                cellSize={gridStepSize}
                boardWidth={viewBoxW}
                boardHeight={viewBoxH}
                boardDimension={Math.max(viewBoxW, viewBoxH)}
                isExiting={exitingStrandIds.includes(strand.id)}
                isBlocked={blockedStrandId === strand.id}
                isClear={clearStrandIds.includes(strand.id)}
                isHinted={hintStrandId === strand.id}
                disabled={isAnimating}
                onPress={onStrandPress}
                onExitComplete={onExitComplete}
              />
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  responsiveCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
});
