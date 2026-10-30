import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions, GestureResponderEvent } from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Rect,
  Path,
  G,
} from 'react-native-svg';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Arrow from './Arrow';
import { TangledStrand } from '../../model/types';
import { checkStrandRaycast } from '../../model/raycast';

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
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Dynamic, modular calculation for flexible and irregular grid sizes
  const { cellSize, boardWidth, boardHeight } = useMemo(() => {
    // Leave safe padding for HUD and bottom controls
    const maxAvailableWidth = screenWidth - 28;
    const maxAvailableHeight = Math.max(340, screenHeight - 230);

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

  // Build 2D list of modular tiles
  const tilesList = useMemo(() => {
    const list: Array<{ r: number; c: number }> = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        list.push({ r, c });
      }
    }
    return list;
  }, [rows, cols]);

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
      {/* ============================================================== */}
      {/* 1. BORDERLESS FLAT DARK-BLUE SQUARE TILE GRID                  */}
      {/* (No bulky island frames, no grassy borders around puzzle)     */}
      {/* ============================================================== */}
      <View
        style={[
          styles.tilesContainer,
          {
            width: boardWidth,
            height: boardHeight,
          },
        ]}
        pointerEvents="none"
      >
        <Svg width={boardWidth} height={boardHeight} viewBox={`0 0 ${boardWidth} ${boardHeight}`}>
          <Defs>
            {/* Tile Surface Gradient */}
            <SvgLinearGradient id="tileBodyGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#1B3F6B" />
              <Stop offset="40%" stopColor="#143256" />
              <Stop offset="100%" stopColor="#0D223C" />
            </SvgLinearGradient>

            {/* Tile Highlight Rim */}
            <SvgLinearGradient id="tileHighlightRim" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#3B6FA8" />
              <Stop offset="100%" stopColor="#16375E" />
            </SvgLinearGradient>
          </Defs>

          {/* Render individual modular square tiles with gaps */}
          {tilesList.map(({ r, c }) => {
            const tileX = c * cellSize + 2;
            const tileY = r * cellSize + 2;
            const tileSize = cellSize - 4;
            const tileRadius = Math.max(4, Math.floor(cellSize * 0.13));

            return (
              <G key={`tile-${r}-${c}`}>
                {/* 3D Under-Shadow */}
                <Rect
                  x={tileX}
                  y={tileY + 2.5}
                  width={tileSize}
                  height={tileSize}
                  rx={tileRadius}
                  fill="#061221"
                  opacity={0.65}
                />

                {/* Flat Dark-Blue Tile Face */}
                <Rect
                  x={tileX}
                  y={tileY}
                  width={tileSize}
                  height={tileSize}
                  rx={tileRadius}
                  fill="url(#tileBodyGrad)"
                  stroke="url(#tileHighlightRim)"
                  strokeWidth="1.2"
                />

                {/* Subtle Tile Corner Stone Texture Accent */}
                <Path
                  d={`M${tileX + 4},${tileY + 5} L${tileX + 10},${tileY + 5} M${tileX + 5},${tileY + 4} L${tileX + 5},${tileY + 10}`}
                  stroke="#3B6FA8"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  opacity={0.4}
                />
              </G>
            );
          })}
        </Svg>
      </View>

      {/* ============================================================== */}
      {/* 2. BOARD CANVAS WITH TOUCH RESPONDER & NEON ARROWS             */}
      {/* ============================================================== */}
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
            // Identify accent pathway arrow (render in vibrant Red/Coral matching reference)
            const isRedAccent =
              strand.color === '#FF2A85' ||
              strand.color === '#FF3366' ||
              index === strands.length - 1 || // bottom-most strand
              strand.id?.includes('magenta') ||
              strand.id?.includes('accent');

            const strandWithColor = {
              ...strand,
              color: isRedAccent ? '#FF3366' : '#00F0FF',
            };

            return (
              <Arrow
                key={strand.id}
                strand={strandWithColor}
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
  tilesContainer: {
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
