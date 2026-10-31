import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path, Polygon } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withSequence,
  withTiming,
  withSpring,
  withRepeat,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Direction, GridCoord, Point2D, TangledStrand } from '../../model/types';
import {
  translateOrthogonalNodesToSvgPath,
  getProportionalArrowheadPoints,
} from '../../utils/arrowGeometry';
import { FLAT_TECH_PALETTE, useTheme } from '../../theme/ThemeContext';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface ArrowProps {
  strand?: TangledStrand;
  id?: string;
  path?: Array<Point2D | GridCoord>;
  points?: GridCoord[];
  direction?: Direction | string;
  cellSize: number;
  boardDimension: number;
  boardWidth?: number;
  boardHeight?: number;
  isExiting?: boolean;
  isBlocked?: boolean;
  isClear?: boolean;
  isHinted?: boolean;
  disabled?: boolean;
  onPress?: (id: string) => void;
  onExitComplete?: (id: string) => void;
}

function ArrowComponent({
  strand,
  id: propId,
  path: propPath,
  points: propPoints,
  direction: propDirection,
  cellSize,
  boardDimension,
  boardWidth,
  boardHeight,
  isExiting = false,
  isBlocked = false,
  isHinted = false,
  onExitComplete,
}: ArrowProps): React.JSX.Element {
  const { theme } = useTheme();

  const id = strand?.id || propId || 'arrow';
  const direction = (strand?.direction || propDirection || 'R') as Direction;
  const dirUpper = (direction || 'R').toUpperCase();

  const onExitCompleteRef = useRef(onExitComplete);
  onExitCompleteRef.current = onExitComplete;

  const handleFinish = useCallback(
    (finished?: boolean) => {
      if (finished) {
        onExitCompleteRef.current?.(id);
      }
    },
    [id]
  );

  // 1. Resolve raw path coordinates ({x, y} or {r, c})
  const rawPath = useMemo(() => {
    if (propPath && propPath.length > 0) return propPath;
    if (strand?.path && strand.path.length > 0) return strand.path;
    if (propPoints && propPoints.length > 0) return propPoints;
    if (strand?.points && strand.points.length > 0) return strand.points;
    return [];
  }, [propPath, strand, propPoints]);

  // Convert raw path to uniform Point2D grid points ({x, y})
  const gridPoints: Point2D[] = useMemo(() => {
    return rawPath.map((pt) => {
      if ('x' in pt && 'y' in pt) {
        return { x: pt.x, y: pt.y };
      }
      return { x: (pt as GridCoord).c, y: (pt as GridCoord).r };
    });
  }, [rawPath]);

  // Convert grid coordinates to pixel track centered at (cellSize / 2)
  const pixelCoords = useMemo(() => {
    return gridPoints.map((pt) => ({
      x: +(pt.x * cellSize + cellSize / 2).toFixed(2),
      y: +(pt.y * cellSize + cellSize / 2).toFixed(2),
    }));
  }, [gridPoints, cellSize]);

  // Last coordinate for arrowhead positioning
  const lastCoord = useMemo(() => {
    if (pixelCoords.length > 0) {
      return pixelCoords[pixelCoords.length - 1];
    }
    return { x: 0, y: 0 };
  }, [pixelCoords]);

  // 2. Dynamic Path Translation with Standard SVG Absolute Tracking (M, H, V)
  const exitDistance = Math.max(boardWidth || boardDimension, boardHeight || boardDimension) + 240;

  const { fullPathD, origLength, totalLength } = useMemo(() => {
    if (pixelCoords.length === 0) {
      return { fullPathD: '', origLength: 1, totalLength: 1 };
    }

    // Dynamic translation using M, H, V
    const baseD = translateOrthogonalNodesToSvgPath(gridPoints, cellSize);

    let origLen = 0;
    for (let i = 1; i < pixelCoords.length; i++) {
      const p0 = pixelCoords[i - 1];
      const p1 = pixelCoords[i];
      origLen += Math.hypot(p1.x - p0.x, p1.y - p0.y);
    }

    let extraX = lastCoord.x;
    let extraY = lastCoord.y;

    if (dirUpper === 'RIGHT' || dirUpper === 'R') {
      extraX += exitDistance;
    } else if (dirUpper === 'LEFT' || dirUpper === 'L') {
      extraX -= exitDistance;
    } else if (dirUpper === 'DOWN' || dirUpper === 'D') {
      extraY += exitDistance;
    } else if (dirUpper === 'UP' || dirUpper === 'U') {
      extraY -= exitDistance;
    }

    // Append exit vector with H or V
    let exitCmd = '';
    if (extraY === lastCoord.y && extraX !== lastCoord.x) {
      exitCmd = ` H ${extraX}`;
    } else if (extraX === lastCoord.x && extraY !== lastCoord.y) {
      exitCmd = ` V ${extraY}`;
    } else {
      exitCmd = ` L ${extraX} ${extraY}`;
    }

    const fullD = `${baseD}${exitCmd}`;
    const totLen = origLen + exitDistance;

    return {
      fullPathD: fullD,
      origLength: Math.max(1, origLen),
      totalLength: Math.max(1, totLen),
    };
  }, [pixelCoords, gridPoints, cellSize, lastCoord, dirUpper, exitDistance]);

  // Proportional Arrowhead Polygon Vertices (scaled for 4px-5px slim stroke)
  const arrowheadPoints = useMemo(() => {
    const scaleFactor = Math.min(1.2, Math.max(0.7, cellSize / 40));
    const headLength = 7.5 * scaleFactor;
    const headHalfWidth = 4.0 * scaleFactor;

    return getProportionalArrowheadPoints(
      lastCoord.x,
      lastCoord.y,
      dirUpper,
      headLength,
      headHalfWidth
    );
  }, [lastCoord, dirUpper, cellSize]);

  // Reanimated Shared Values for Interactive State Layer
  const slitherOffset = useSharedValue(0);
  const blockedShake = useSharedValue(0);
  const hintPulse = useSharedValue(1);

  // Smooth Slithering Animation (750ms with inOut ease)
  useEffect(() => {
    if (isExiting) {
      slitherOffset.value = withTiming(
        totalLength,
        {
          duration: 750,
          easing: Easing.inOut(Easing.ease),
        },
        (finished) => {
          'worklet';
          if (finished) {
            runOnJS(handleFinish)(finished);
          }
        }
      );
    } else {
      slitherOffset.value = 0;
    }
  }, [isExiting, totalLength, handleFinish, slitherOffset]);

  // Snappy blocked shake animation on invalid tap
  useEffect(() => {
    if (isBlocked) {
      blockedShake.value = withSequence(
        withTiming(5, { duration: 35 }),
        withTiming(-5, { duration: 35 }),
        withTiming(2, { duration: 35 }),
        withSpring(0, { damping: 10, stiffness: 250 })
      );
    }
  }, [isBlocked, blockedShake]);

  // Hint pulse animation
  useEffect(() => {
    if (isHinted) {
      hintPulse.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 380 }),
          withTiming(1.0, { duration: 380 })
        ),
        -1,
        true
      );
    } else {
      hintPulse.value = withTiming(1, { duration: 180 });
    }
  }, [isHinted, hintPulse]);

  // Animated strokeDashoffset props for organic snake crawling along turns
  const animatedPathProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: -slitherOffset.value,
    };
  });

  // Animated style for arrowhead gliding forward along exit line in sync with snake head
  const animatedHeadStyle = useAnimatedStyle(() => {
    let hx = 0;
    let hy = 0;
    const current = slitherOffset.value;

    if (dirUpper === 'RIGHT' || dirUpper === 'R') {
      hx = current;
    } else if (dirUpper === 'LEFT' || dirUpper === 'L') {
      hx = -current;
    } else if (dirUpper === 'DOWN' || dirUpper === 'D') {
      hy = current;
    } else if (dirUpper === 'UP' || dirUpper === 'U') {
      hy = -current;
    }

    let sx = 0;
    let sy = 0;
    if (dirUpper === 'UP' || dirUpper === 'DOWN' || dirUpper === 'U' || dirUpper === 'D') {
      sx = blockedShake.value;
    } else {
      sy = blockedShake.value;
    }

    return {
      transform: [
        { translateX: hx + sx },
        { translateY: hy + sy },
        { scale: hintPulse.value },
      ],
      opacity: isExiting ? (current >= exitDistance ? 0 : 1) : 1,
    };
  });

  // Root container shake on blocked tap
  const animatedContainerStyle = useAnimatedStyle(() => {
    let sx = 0;
    let sy = 0;
    if (dirUpper === 'UP' || dirUpper === 'DOWN' || dirUpper === 'U' || dirUpper === 'D') {
      sx = blockedShake.value;
    } else {
      sy = blockedShake.value;
    }
    return {
      transform: [{ translateX: sx }, { translateY: sy }, { scale: hintPulse.value }],
      zIndex: isExiting ? 999 : isHinted ? 888 : 10,
    };
  });

  // Flat Vector Tech Color Palette Mapping
  const resolvedColor = useMemo(() => {
    if (strand?.color && FLAT_TECH_PALETTE.includes(strand.color)) {
      return strand.color;
    }
    if (strand?.colorIndex !== undefined && strand.colorIndex >= 0) {
      return FLAT_TECH_PALETTE[strand.colorIndex % FLAT_TECH_PALETTE.length];
    }
    return FLAT_TECH_PALETTE[0];
  }, [strand]);

  const blockedColor = '#E52323';
  const hintColor = '#FFD700';

  const bodyColor = isBlocked ? blockedColor : isHinted ? hintColor : resolvedColor;

  // Proportional stroke-width: restricted to 4px - 5px max on 40px grid
  const scale = cellSize / 40;
  const coreStrokeWidth = Math.max(3.8, Math.min(5.0, 4.2 * scale));

  const svgWidth = boardWidth || boardDimension;
  const svgHeight = boardHeight || boardDimension;

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        animatedContainerStyle,
        { overflow: 'visible' },
      ]}
      pointerEvents="none"
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
        pointerEvents="none"
      >
        {/* Uniform monoline stroke with strict round caps and round joins */}
        <AnimatedPath
          id={`path-${id}`}
          d={fullPathD}
          fill="none"
          stroke={bodyColor}
          strokeWidth={coreStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={[origLength, totalLength * 2]}
          animatedProps={animatedPathProps}
        />
      </Svg>

      {/* Proportional Arrowhead aligned with the slim monoline stroke */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          animatedHeadStyle,
          { overflow: 'visible' },
        ]}
        pointerEvents="none"
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
          pointerEvents="none"
        >
          <Polygon
            id={`head-${id}`}
            points={arrowheadPoints}
            fill={bodyColor}
            stroke={bodyColor}
            strokeWidth={0.5}
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

export default React.memo(ArrowComponent);
