import type { Player } from '../types';
import { TribeCard } from './TribeCard';

const PLAYER_COLORS = [
  'text-red-400 border-red-500/40 bg-red-950/30',
  'text-blue-400 border-blue-500/40 bg-blue-950/30',
  'text-green-400 border-green-500/40 bg-green-950/30',
  'text-yellow-400 border-yellow-500/40 bg-yellow-950/30',
];

interface Props {
  player: Player;
  selectedCards: string[];
  onToggleCard: (id: string) => void;
  onDraw: () => void;
  onPlayBand: () => void;
  onAdvanceEra: () => void;
  error?: string;
  deckEmpty: boolean;
}

export function PlayerHandPanel({
  player,
  selectedCards,
  onToggleCard,
  onDraw,
  onPlayBand,
  onAdvanceEra,
  error,
  deckEmpty,
}: Props) {
  const colors = PLAYER_COLORS[player.id] ?? PLAYER_COLORS[0];
  const hasSelection = selectedCards.length > 0;

  return (
    <div className={`border-t border-white/10 bg-black/40 backdrop-blur`}>
      {/* Turn indicator */}
      <div className={`px-4 py-2 border-b ${colors} border flex items-center justify-between`}>
        <span className={`font-bold text-sm ${colors.split(' ')[0]}`}>
          Vez de: {player.name}
        </span>
        <span className="text-xs text-white/40">{player.hand.length} cartas na mão</span>
      </div>

      {/* Hand */}
      <div className="px-4 py-4">
        {player.hand.length === 0 ? (
          <div className="text-center text-white/30 text-sm py-4">Sem cartas na mão</div>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center">
            {player.hand.map((card) => (
              <TribeCard
                key={card.id}
                card={card}
                selected={selectedCards.includes(card.id)}
                onClick={() => onToggleCard(card.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-4 mb-3 px-4 py-2 bg-red-900/50 border border-red-500/50 rounded-xl text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 px-4 pb-4">
        <button
          onClick={onDraw}
          disabled={deckEmpty}
          className="flex-1 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all cursor-pointer"
        >
          🃏 Comprar Carta
        </button>
        <button
          onClick={onPlayBand}
          disabled={!hasSelection}
          className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg"
        >
          ⚔️ Jogar Bando ({selectedCards.length})
        </button>
        <button
          onClick={onAdvanceEra}
          className="px-4 py-3 bg-purple-900/60 hover:bg-purple-800/60 text-purple-300 font-medium rounded-xl transition-all cursor-pointer border border-purple-500/30 text-sm"
          title="Avançar Era (Carta Dragão)"
        >
          🐉 Era
        </button>
      </div>
    </div>
  );
}
