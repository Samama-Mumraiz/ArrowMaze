import React, { useMemo, useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Polygon } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { ArrowProps, Coordinate } from '../../types';
import { CELL_SIZE as DEFAULT_CELL_SIZE } from '../../utils/constants';
import { getArrowheadPoints } from '../../utils/arrowGeometry';
import { useTheme } from '../../theme/ThemeContext';

export const TILE_GAP = 0;
export const DIRECTION_ROTATION: Record<string, number> = {
  UP: 270,
  U: 270,
  DOWN: 90,
  D: 90,
  LEFT: 180,
  L: 180,
  RIGHT: 0,
  R: 0,
};

export default function Arrow({
  pathData: directPathData,
  direction: directDirection,
  CELL_SIZE: directCellSize,
  arrow,
  cellSize,
  boardDimension = 360,
  boardWidth: directBoardWidth,
  boardHeight: directBoardHeight,
  isHighlighted = false,
  isClearable = false,
  isExiting = false,
  isBlocked = false,
  onPress,
  onExitComplete,
}: ArrowProps): React.JSX.Element | null {
  const { theme } = useTheme();

  // Resolve pathData from direct prop or arrow object
  const pathData: Coordinate[] = useMemo(() => {
    if (directPathData && directPathData.length > 0) return directPathData;
    if (arrow?.path && arrow.path.length > 0) return arrow.path;
    if (arrow?.points && arrow.points.length > 0) return arrow.points;
    if (arrow?.x !== undefined && arrow?.y !== undefined) return [{ x: arrow.x, y: arrow.y }];
    return [];
  }, [directPathData, arrow?.path, arrow?.points, arrow?.x, arrow?.y]);

  if (!pathData || pathData.length === 0) return null;

  const direction = (directDirection || arrow?.direction || 'RIGHT') as string;
  const CELL_SIZE = directCellSize || cellSize || DEFAULT_CELL_SIZE;

  // 1. Draw ONE Continuous Snake-Like Path (M at index 0, L for all subsequent)
  const dString = useMemo(() => {
    if (pathData.length === 1) {
      const px = pathData[0].x * CELL_SIZE + CELL_SIZE / 2;
      const py = pathData[0].y * CELL_SIZE + CELL_SIZE / 2;
      return `M ${px},${py} L ${px},${py}`;
    }
    return pathData
      .map((pt, index) => {
        const px = pt.x * CELL_SIZE + CELL_SIZE / 2;
        const py = pt.y * CELL_SIZE + CELL_SIZE / 2;
        return `${index === 0 ? 'M' : 'L'} ${px},${py}`;
      })
      .join(' ');
  }, [pathData, CELL_SIZE]);

  // 2. Position Arrowhead Strictly at the LAST coordinate in pathData
  const lastPt = pathData[pathData.length - 1];
  const endX = lastPt.x * CELL_SIZE + CELL_SIZE / 2;
  const endY = lastPt.y * CELL_SIZE + CELL_SIZE / 2;

  // Absolute pixel coordinates for arrowhead - 100% reliable across all orientations
  const arrowheadPoints = useMemo(() => {
    return getArrowheadPoints(endX, endY, direction, 9.5, 5.5);
  }, [endX, endY, direction]);

  // 3. Smooth "Snake-Like" Exit Animation (420ms duration)
  const exitOffset = useSharedValue(0);
  const blockedOffset = useSharedValue(0);

  useEffect(() => {
    if (isExiting) {
      const exitDistance = boardDimension + 140;
      exitOffset.value = withTiming(
        exitDistance,
        {
          duration: 420,
          easing: Easing.out(Easing.quad),
        },
        (finished) => {
          if (finished && onExitComplete) {
            const arrowId = arrow?.id || 'arrow';
            runOnJS(onExitComplete)(arrowId);
          }
        }
      );
    } else {
      exitOffset.value = 0;
    }
  }, [isExiting, boardDimension, onExitComplete, arrow?.id, exitOffset]);

  useEffect(() => {
    if (isBlocked) {
      blockedOffset.value = withSequence(
        withTiming(7, { duration: 35 }),
        withTiming(-5, { duration: 35 }),
        withTiming(3, { duration: 35 }),
        withSpring(0, { damping: 10, stiffness: 240 })
      );
    }
  }, [isBlocked, blockedOffset]);

  const dirUpper = direction.toUpperCase();
  const animatedStyle = useAnimatedStyle(() => {
    let tx = 0;
    let ty = 0;

    if (dirUpper === 'RIGHT' || dirUpper === 'R') {
      tx = exitOffset.value + blockedOffset.value;
    } else if (dirUpper === 'LEFT' || dirUpper === 'L') {
      tx = -exitOffset.value - blockedOffset.value;
    } else if (dirUpper === 'DOWN' || dirUpper === 'D') {
      ty = exitOffset.value + blockedOffset.value;
    } else if (dirUpper === 'UP' || dirUpper === 'U') {
      ty = -exitOffset.value - blockedOffset.value;
    }

    return {
      transform: [{ translateX: tx }, { translateY: ty }],
      zIndex: isExiting ? 999 : isHighlighted ? 888 : 10,
    };
  });

  // Sleek lines: strokeWidth 4.5 and deep navy (#061234) as in the screenshot
  const strokeWidth = 4.5;
  const deepNavy = '#061234';
  const arrowColor = isBlocked
    ? '#ef4444'
    : isHighlighted
      ? '#FACC15'
      : (theme.isDark ? '#38BDF8' : deepNavy);

  const svgWidth = directBoardWidth || boardDimension;
  const svgHeight = directBoardHeight || boardDimension;

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        animatedStyle,
        { overflow: 'visible', pointerEvents: isExiting ? 'none' : 'box-none' },
      ]}
    >
      <Svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: svgWidth,
          height: svgHeight,
          overflow: 'visible',
        }}
      >
        {/* Continuous Snake Path */}
        <Path
          d={dString}
          fill="none"
          stroke={arrowColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Attached Arrowhead strictly at the last coordinate in pathData */}
        <Polygon
          points={arrowheadPoints}
          fill={arrowColor}
        />
      </Svg>

      {/* Immediate One-Tap Responsive Hitboxes */}
      {arrow?.id && onPress && !isExiting && pathData.map((pt, idx) => (
        <Pressable
          key={`hit-${arrow.id}-${pt.x}-${pt.y}-${idx}`}
          onPress={() => onPress(arrow.id!)}
          hitSlop={8}
          style={[
            styles.hitbox,
            {
              left: pt.x * CELL_SIZE,
              top: pt.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            },
          ]}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hitbox: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 100,
  },
});
