import React, { useMemo, useState, useCallback, useRef } from 'react';
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

  const cardRef = useRef<any>(null);
  const cardPageOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

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

  // High-precision touch handling mapped to normalized grid coordinates with generous hitSlop
  const handleBoardTouch = useCallback(
    (e: GestureResponderEvent) => {
      if (!onStrandPress) return;
      if (isAnimating && exitingStrandIds.length > 0) return;

      const { locationX, locationY, pageX, pageY } = e.nativeEvent;
      const activeWidth = layoutDims.width || maxContainerWidth;
      const activeHeight = layoutDims.height || activeWidth / (cols / rows);

      let touchX = locationX;
      let touchY = locationY;

      // When absolute page coordinates are available, normalize against measured container page offset
      if (
        pageX !== undefined &&
        pageY !== undefined &&
        cardPageOffset.current.x > 0 &&
        cardPageOffset.current.y > 0
      ) {
        const relX = pageX - cardPageOffset.current.x;
        const relY = pageY - cardPageOffset.current.y;
        if (
          relX >= -16 &&
          relX <= activeWidth + 16 &&
          relY >= -16 &&
          relY <= activeHeight + 16
        ) {
          touchX = Math.max(0, Math.min(activeWidth, relX));
          touchY = Math.max(0, Math.min(activeHeight, relY));
        }
      }

      if (
        touchX < -16 ||
        touchY < -16 ||
        touchX > activeWidth + 16 ||
        touchY > activeHeight + 16
      ) {
        return;
      }

      // Convert touch position to grid cell (col, row) clamped to grid bounds
      const col = Math.min(cols - 1, Math.max(0, Math.floor((touchX / activeWidth) * cols)));
      const row = Math.min(rows - 1, Math.max(0, Math.floor((touchY / activeHeight) * rows)));

      const active = strands.filter((s) => !exitingStrandIds.includes(s.id));
      if (active.length === 0) return;

      // 1. Direct hit on strand head (highest priority - where player is pointing)
      const headMatches = active.filter((s) => s.head.r === row && s.head.c === col);
      if (headMatches.length > 0) {
        const unblockedHead = headMatches.find((s) => clearStrandIds.includes(s.id));
        onStrandPress(unblockedHead ? unblockedHead.id : headMatches[0].id);
        return;
      }

      // 2. Direct hit on occupied cells
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

      // 3. Proximity hit detection with generous hitSlop (up to 1.5 grid cells radius)
      const cellPixelW = activeWidth / cols;
      const cellPixelH = activeHeight / rows;
      let closestStrand: TangledStrand | null = null;
      let closestDist = 1.5;

      for (const s of active) {
        // Prioritize distance to head
        const headCenterX = s.head.c * cellPixelW + cellPixelW / 2;
        const headCenterY = s.head.r * cellPixelH + cellPixelH / 2;
        const distHead =
          Math.hypot(headCenterX - touchX, headCenterY - touchY) /
          Math.min(cellPixelW, cellPixelH);
        if (distHead < closestDist) {
          closestDist = distHead;
          closestStrand = s;
        }

        // Check distance to occupied cells along body
        for (const cell of s.occupiedCells) {
          const cellCenterX = cell.c * cellPixelW + cellPixelW / 2;
          const cellCenterY = cell.r * cellPixelH + cellPixelH / 2;
          const dist =
            Math.hypot(cellCenterX - touchX, cellCenterY - touchY) /
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
      exitingStrandIds,
      onStrandPress,
      layoutDims,
      maxContainerWidth,
      cols,
      rows,
      strands,
      clearStrandIds,
    ]
  );

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setLayoutDims({ width, height });
    }
    cardRef.current?.measure(
      (_x: number, _y: number, _w: number, _h: number, pageX: number, pageY: number) => {
        if (pageX !== undefined && pageY !== undefined) {
          cardPageOffset.current = { x: pageX, y: pageY };
        }
      }
    );
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
        ref={cardRef}
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
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        onLayout={handleLayout}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderRelease={handleBoardTouch}
        onResponderTerminate={handleBoardTouch}
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

