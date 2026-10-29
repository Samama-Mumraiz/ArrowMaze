import React from 'react';
import GameStartOverlay from './GameStartOverlay';

interface StartOverlayProps {
  onStart: () => void;
  levelNumber?: number;
}

export default function StartOverlay({ onStart, levelNumber = 1 }: StartOverlayProps): React.JSX.Element {
  return (
    <GameStartOverlay
      visible={true}
      levelNumber={levelNumber}
      onStart={onStart}
    />
  );
}
