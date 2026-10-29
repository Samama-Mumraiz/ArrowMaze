import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Arrow, { TILE_GAP } from './Arrow';
import { BoardProps } from '../../types';
import { CELL_SIZE, GRID_SIZE } from '../../utils/constants';

interface GridCell {
  row: number;
  col: number;
  key: string;
}

export default function Board({
  gridSize = GRID_SIZE,
  arrows = [],
  cellSize,
  exitingArrowIds = [],
  highlightedArrowId,
  clearableArrowIds = [],
  blockedArrowId,
  onArrowPress,
  onArrowExitComplete,
}: BoardProps): React.JSX.Element {
  const { width: screenWidth } = useWindowDimensions();

  // Dynamically calculate optimal cell size so 5x5 to 8x8 grids fit perfectly on mobile screens
  const activeCellSize = useMemo(() => {
    const maxAvailableWidth = Math.min(screenWidth - 48, 420);
    const computedSize = Math.floor(maxAvailableWidth / gridSize);
    return cellSize ? Math.min(cellSize, computedSize) : Math.min(CELL_SIZE, computedSize);
  }, [screenWidth, gridSize, cellSize]);

  const boardDimension = gridSize * activeCellSize;
  const tileSize = Math.max(20, Math.floor(activeCellSize - TILE_GAP));

  // Generate recessed socket slots for empty grid cells
  const sockets = useMemo<GridCell[]>(() => {
    const list: GridCell[] = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        list.push({ row, col, key: `socket-${row}-${col}` });
      }
    }
    return list;
  }, [gridSize]);

  return (
    <View
      style={[
        styles.boardOuterContainer,
        {
          width: boardDimension + 14,
          height: boardDimension + 14,
        },
      ]}
    >
      <View
        style={[
          styles.boardGrid,
          {
            width: boardDimension,
            height: boardDimension,
          },
        ]}
      >
        {/* Recessed socket grid slots (tightly packed block matrix) */}
        {sockets.map((cell) => (
          <View
            key={cell.key}
            style={[
              styles.socketSlot,
              {
                width: tileSize,
                height: tileSize,
                left: cell.col * activeCellSize + TILE_GAP / 2,
                top: cell.row * activeCellSize + TILE_GAP / 2,
              },
            ]}
          >
            <View style={styles.socketInnerDot} />
          </View>
        ))}

        {/* Render 3D Tactile Arrow Blocks */}
        {arrows.map((arrow) => (
          <Arrow
            key={arrow.id}
            arrow={arrow}
            cellSize={activeCellSize}
            boardDimension={boardDimension}
            isHighlighted={arrow.id === highlightedArrowId}
            isClearable={clearableArrowIds.includes(arrow.id)}
            isExiting={exitingArrowIds.includes(arrow.id)}
            isBlocked={blockedArrowId === arrow.id}
            onPress={onArrowPress}
            onExitComplete={onArrowExitComplete}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardOuterContainer: {
    backgroundColor: '#0b1120',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.65,
    shadowRadius: 24,
    elevation: 14,
  },
  boardGrid: {
    position: 'relative',
    backgroundColor: '#1e293b', // Slate-800 tray
    borderRadius: 14,
    overflow: 'visible',
  },
  socketSlot: {
    position: 'absolute',
    borderRadius: 10,
    backgroundColor: '#0f172a', // Slate-900 recessed socket
    borderWidth: 1.5,
    borderColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socketInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(51, 65, 85, 0.4)',
  },
});
