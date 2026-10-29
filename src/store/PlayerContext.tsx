import React from 'react';
import {
  GameStateProvider,
  useGameState,
  Trophy,
  PlayerStats,
  GameStateContextType,
  INITIAL_AWARDS,
} from './GameStateContext';

export type { Trophy, PlayerStats, GameStateContextType };
export { INITIAL_AWARDS };

export function PlayerProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <GameStateProvider>{children}</GameStateProvider>;
}

export function usePlayer(): GameStateContextType {
  return useGameState();
}
