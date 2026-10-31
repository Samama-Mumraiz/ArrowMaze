import React from 'react';
import { StyleSheet, View } from 'react-native';
import GameBoard from './GameBoard';
import { TangledStrand } from '../../model/types';

export interface BoardViewProps {
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
  canvasBg?: string;
  dotColor?: string;
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
  canvasBg,
  dotColor,
}: BoardViewProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <GameBoard
        strands={strands}
        rows={rows}
        cols={cols}
        exitingStrandIds={exitingStrandIds}
        blockedStrandId={blockedStrandId}
        hintStrandId={hintStrandId}
        isAnimating={isAnimating}
        screenShake={screenShake}
        onStrandPress={onStrandPress}
        onExitComplete={onExitComplete}
        canvasBg={canvasBg}
        dotColor={dotColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
