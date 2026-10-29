import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
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
import { getArrowheadPoints } from '../../utils/arrowGeometry';
import { useTheme } from '../../theme/ThemeContext';

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

  // Stable callback ref so effect dependencies do not trigger re-renders
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


  // testong commit this one is 
  // Convert grid coordinates to pixel track centered at (cellSize / 2)
  const pixelCoords = useMemo(() => {
    return gridPoints.map((pt) => ({
      x: pt.x * cellSize + cellSize / 2,
      y: pt.y * cellSize + cellSize / 2,
    }));
  }, [gridPoints, cellSize]);

  // Last coordinate for arrowhead positioning
  const lastCoord = useMemo(() => {
    if (pixelCoords.length > 0) {
      return pixelCoords[pixelCoords.length - 1];
    }
    return { x: 0, y: 0 };
  }, [pixelCoords]);

  // 2. Build full extended path for true snake-like slithering
  const exitDistance = Math.max(boardWidth || boardDimension, boardHeight || boardDimension) + 240;

  const { fullPathD, origLength, totalLength } = useMemo(() => {
    if (pixelCoords.length === 0) {
      return { fullPathD: '', origLength: 1, totalLength: 1 };
    }

    let d = `M ${pixelCoords[0].x} ${pixelCoords[0].y}`;
    let origLen = 0;

    for (let i = 1; i < pixelCoords.length; i++) {
      const p0 = pixelCoords[i - 1];
      const p1 = pixelCoords[i];
      d += ` L ${p1.x} ${p1.y}`;
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

    const fullD = `${d} L ${extraX} ${extraY}`;
    const totLen = origLen + exitDistance;

    return {
      fullPathD: fullD,
      origLength: Math.max(1, origLen),
      totalLength: Math.max(1, totLen),
    };
  }, [pixelCoords, lastCoord, dirUpper, exitDistance]);

  // Arrowhead polygon vertices (sleek, small neon arrowhead)
  const arrowheadPoints = useMemo(() => {
    // Drastically reduced size: small, sleek, and perfectly aligned with the line end
    const headLength = Math.max(6.5, Math.min(10, cellSize * 0.24));
    const headHalfWidth = Math.max(3.8, Math.min(6, cellSize * 0.15));
    return getArrowheadPoints(
      lastCoord.x,
      lastCoord.y,
      dirUpper,
      headLength,
      headHalfWidth
    );
  }, [lastCoord, dirUpper, cellSize]);

  // Reanimated Shared Values
  const slitherOffset = useSharedValue(0);
  const blockedShake = useSharedValue(0);
  const hintPulse = useSharedValue(1);

  // 3. Smooth Slithering Animation (750ms with inOut ease)
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
        withTiming(6, { duration: 35 }),
        withTiming(-6, { duration: 35 }),
        withTiming(3, { duration: 35 }),
        withSpring(0, { damping: 10, stiffness: 250 })
      );
    }
  }, [isBlocked, blockedShake]);

  // Hint pulse animation
  useEffect(() => {
    if (isHinted) {
      hintPulse.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 380 }),
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

  // 4. Color Logic: Neon Cyan (`#00F0FF`) & Neon Magenta (`#FF2A85`)
  // As requested in prompt: "Arrows MUST be rendered as thick, continuous glowing neon lines (Cyan and Magenta)."
  const isMagentaStrand = useMemo(() => {
    if (strand?.color === '#FF2A85' || strand?.color?.includes('pink') || strand?.color?.includes('magenta')) {
      return true;
    }
    // Check if designated as accent strand (e.g. strand with index 1 or specific id)
    if (strand?.id === 'strand-accent' || strand?.id?.includes('magenta') || strand?.id?.endsWith('-2')) {
      return true;
    }
    return false;
  }, [strand]);

  const baseStroke = isMagentaStrand ? '#FF2A85' : '#00F0FF';
  const baseGlow = isMagentaStrand ? 'rgba(255, 42, 133, 0.45)' : 'rgba(0, 240, 255, 0.45)';

  const blockedColor = '#FF3366';
  const blockedGlow = 'rgba(255, 51, 102, 0.5)';
  const hintColor = '#FFD700';
  const hintGlow = 'rgba(255, 215, 0, 0.55)';

  const bodyColor = isBlocked ? blockedColor : isHinted ? hintColor : baseStroke;
  const glowColor = isBlocked ? blockedGlow : isHinted ? hintGlow : baseGlow;

  // Sleek continuous neon stroke
  const coreStrokeWidth = Math.max(4.2, Math.min(6, cellSize * 0.17));
  const outerGlowStrokeWidth = coreStrokeWidth + 4;

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
        {/* Layer 1: Outer Neon Glow Track */}
        <AnimatedPath
          d={fullPathD}
          fill="none"
          stroke={glowColor}
          strokeWidth={outerGlowStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={[origLength, totalLength * 2]}
          animatedProps={animatedPathProps}
        />

        {/* Layer 2: Core Vibrant Neon Line */}
        <AnimatedPath
          d={fullPathD}
          fill="none"
          stroke={bodyColor}
          strokeWidth={coreStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={[origLength, totalLength * 2]}
          animatedProps={animatedPathProps}
        />

        {/* Layer 3: High-Tech White Center Highlight */}
        <AnimatedPath
          d={fullPathD}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={coreStrokeWidth * 0.35}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity={0.65}
          strokeDasharray={[origLength, totalLength * 2]}
          animatedProps={animatedPathProps}
        />
      </Svg>

      {/* Synchronized Glowing Arrowhead at front of slithering snake */}
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
          style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
          pointerEvents="none"
        >
          {/* Arrowhead Outer Glow */}
          <Polygon
            points={arrowheadPoints}
            fill={bodyColor}
            stroke={glowColor}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          {/* Arrowhead Core */}
          <Polygon
            points={arrowheadPoints}
            fill={bodyColor}
            stroke="#FFFFFF"
            strokeWidth={1}
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

const Arrow = React.memo(ArrowComponent);
export default Arrow;
