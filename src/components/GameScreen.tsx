import { useState } from 'react';
import type { GameState } from '../types';
import { drawCard, toggleCardSelection, playBand, advanceEra } from '../gameLogic';
import { PlayerHUD } from './PlayerHUD';
import { KingdomBoard } from './KingdomBoard';
import { PlayerHandPanel } from './PlayerHandPanel';

interface Props {
  initialState: GameState;
  onEnd: (state: GameState) => void;
}

export function GameScreen({ initialState, onEnd }: Props) {
  const [state, setState] = useState<GameState>(initialState);
  const [error, setError] = useState<string | undefined>();

  const currentPlayer = state.players[state.currentPlayerIndex];

  const handleDraw = () => {
    setError(undefined);
    setState(drawCard(state));
  };

  const handleToggle = (id: string) => {
    setState(toggleCardSelection(state, id));
  };

  const handlePlayBand = () => {
    setError(undefined);
    const result = playBand(state);
    if (result.error) {
      setError(result.error);
    } else {
      setState(result.state);
    }
  };

  const handleAdvanceEra = () => {
    setError(undefined);
    const next = advanceEra(state);
    if (next.phase === 'end') {
      onEnd(next);
    } else {
      setState(next);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-[#1a0a2e] to-[#0d1b3e] overflow-hidden">
      {/* Top HUD */}
      <PlayerHUD
        players={state.players}
        currentPlayerIndex={state.currentPlayerIndex}
        era={state.era}
        deckCount={state.deck.length}
      />

      {/* Board */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <h2 className="text-center text-xs uppercase tracking-widest text-purple-400 mb-2">
            Tabuleiro dos Reinos
          </h2>
          <KingdomBoard kingdoms={state.kingdoms} players={state.players} />
        </div>

        {/* Discard pile info */}
        {state.discardPile.length > 0 && (
          <div className="px-4 pb-2 text-center text-xs text-white/30">
            {state.discardPile.length} cartas descartadas
          </div>
        )}
      </div>

      {/* Player hand panel */}
      <PlayerHandPanel
        player={currentPlayer}
        selectedCards={state.selectedCards}
        onToggleCard={handleToggle}
        onDraw={handleDraw}
        onPlayBand={handlePlayBand}
        onAdvanceEra={handleAdvanceEra}
        error={error}
        deckEmpty={state.deck.length === 0}
      />
    </div>
  );
}
