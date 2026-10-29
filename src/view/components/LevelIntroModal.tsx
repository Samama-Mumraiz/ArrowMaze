import React from 'react';
import GameStartOverlay from './GameStartOverlay';

interface LevelIntroModalProps {
  visible: boolean;
  levelNumber: number;
  difficulty?: string;
  strandCount?: number;
  onStart: () => void;
}

export default function LevelIntroModal(props: LevelIntroModalProps): React.JSX.Element | null {
  return <GameStartOverlay {...props} />;
}
