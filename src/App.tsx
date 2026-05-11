import { useState } from 'react';
import './index.css';
import { StartScreen } from './components/StartScreen';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';
import { ScoreScreen } from './components/ScoreScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { createInitialState } from './gameLogic';
import type { GameState } from './types';

type AppPhase = 'start' | 'setup' | 'game' | 'score' | 'history';

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('start');
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleStart = () => setPhase('setup');
  const handleHistory = () => setPhase('history');

  const handleSetup = (names: string[]) => {
    const state = createInitialState(names);
    setGameState(state);
    setPhase('game');
  };

  const handleEnd = (finalState: GameState) => {
    setGameState(finalState);
    setPhase('score');
  };

  const handleRestart = () => {
    setGameState(null);
    setPhase('start');
  };

  if (phase === 'start') return <StartScreen onStart={handleStart} onHistory={handleHistory} />;
  if (phase === 'setup') return <SetupScreen onConfirm={handleSetup} />;
  if (phase === 'game' && gameState) return <GameScreen initialState={gameState} onEnd={handleEnd} />;
  if (phase === 'score' && gameState) return <ScoreScreen players={gameState.players} onRestart={handleRestart} />;
  if (phase === 'history') return <HistoryScreen onBack={handleRestart} />;
  return null;
}
