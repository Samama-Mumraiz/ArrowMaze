import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions, GestureResponderEvent } from 'react-native';
import Svg, { Defs, Pattern, Line, Rect } from 'react-native-svg';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Arrow from './Arrow';
import { TangledStrand } from '../../model/types';
import { checkStrandRaycast } from '../../model/raycast';
import { useTheme } from '../../theme/ThemeContext';
import { colors } from '../../theme/colors';

interface BoardViewProps {
  strands: TangledStrand[];
  rows: number;
  cols: number;
  exitingStrandIds: string[];
  blockedStrandId: string | null;
  hintStrandId?: string | null;
  isAnimating: boolean;
  screenShake: { value: number };
  onStrandPress: (strandId: string) => void;
  onExitComplete: (strandId: string) => void;
}

export default function BoardView({
  strands,
  rows,
  cols,
  exitingStrandIds,
  blockedStrandId,
  hintStrandId,
  isAnimating,
  screenShake,
  onStrandPress,
  onExitComplete,
}: BoardViewProps): React.JSX.Element {
  const { theme } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Dense Maze Layout: blueprint grid frame sized proportionally to screen
  const { cellSize, boardWidth, boardHeight } = useMemo(() => {
    const maxAvailableWidth = screenWidth - 28;
    const maxAvailableHeight = Math.max(380, screenHeight - 210);

    const size = Math.floor(Math.min(maxAvailableWidth / cols, maxAvailableHeight / rows));
    return {
      cellSize: size,
      boardWidth: size * cols,
      boardHeight: size * rows,
    };
  }, [screenWidth, screenHeight, rows, cols]);

  // Dynamically calculate which active strands are currently unblocked (clear to move)
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

  // Touch handling
  const handleBoardTouch = (e: GestureResponderEvent) => {
    if (isAnimating) return;
    const { locationX, locationY } = e.nativeEvent;
    if (
      locationX < 0 ||
      locationY < 0 ||
      locationX > boardWidth ||
      locationY > boardHeight
    ) {
      return;
    }

    const col = Math.floor(locationX / cellSize);
    const row = Math.floor(locationY / cellSize);

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
    let closestStrand: TangledStrand | null = null;
    let closestDist = 1.25;

    for (const s of active) {
      for (const cell of s.occupiedCells) {
        const cellCenterX = cell.c * cellSize + cellSize / 2;
        const cellCenterY = cell.r * cellSize + cellSize / 2;
        const dist = Math.hypot(cellCenterX - locationX, cellCenterY - locationY) / cellSize;
        if (dist < closestDist) {
          closestDist = dist;
          closestStrand = s;
        }
      }
    }

    if (closestStrand) {
      onStrandPress(closestStrand.id);
    }
  };

  const animatedBoardShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: screenShake.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.outerContainer,
        {
          width: boardWidth,
          height: boardHeight,
        },
        animatedBoardShakeStyle,
      ]}
    >
      {/* 1. Dark Blueprint-Style Grid Background (Screen 4 Reference) */}
      <View
        style={[
          styles.blueprintFrame,
          {
            width: boardWidth,
            height: boardHeight,
          },
        ]}
      >
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern
              id="boardBlueprintGrid"
              width={cellSize}
              height={cellSize}
              patternUnits="userSpaceOnUse"
            >
              <Line
                x1="0"
                y1="0"
                x2={cellSize}
                y2="0"
                stroke="rgba(0, 240, 255, 0.08)"
                strokeWidth="0.8"
              />
              <Line
                x1="0"
                y1="0"
                x2="0"
                y2={cellSize}
                stroke="rgba(0, 240, 255, 0.08)"
                strokeWidth="0.8"
              />
            </Pattern>
          </Defs>
          <Rect
            x="0"
            y="0"
            width={boardWidth}
            height={boardHeight}
            fill="url(#boardBlueprintGrid)"
          />
        </Svg>
      </View>

      {/* 2. Board Canvas with Touch Responder & Neon Arrows */}
      <View
        style={[
          styles.boardCanvas,
          {
            width: boardWidth,
            height: boardHeight,
          },
        ]}
        onStartShouldSetResponder={() => true}
        onResponderRelease={handleBoardTouch}
      >
        <View
          style={[StyleSheet.absoluteFill, { zIndex: 10, overflow: 'visible' }]}
          pointerEvents="none"
        >
          {strands.map((strand, index) => {
            // Give one strand the vibrant Neon Magenta accent color (Screen 4 Reference)
            const strandWithAccent = {
              ...strand,
              color: strand.color || (index === 1 ? '#FF2A85' : '#00F0FF'),
            };

            return (
              <Arrow
                key={strand.id}
                strand={strandWithAccent}
                cellSize={cellSize}
                boardWidth={boardWidth}
                boardHeight={boardHeight}
                boardDimension={Math.max(boardWidth, boardHeight)}
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
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    backgroundColor: 'transparent',
  },
  blueprintFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
  boardCanvas: {
    position: 'relative',
    overflow: 'visible',
    backgroundColor: 'transparent',
  },
});
