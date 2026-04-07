import type { Player } from '../types';

const PLAYER_COLORS = [
  { ring: 'ring-red-500',    dot: 'bg-red-500',    text: 'text-red-400' },
  { ring: 'ring-blue-500',   dot: 'bg-blue-500',   text: 'text-blue-400' },
  { ring: 'ring-green-500',  dot: 'bg-green-500',  text: 'text-green-400' },
  { ring: 'ring-yellow-500', dot: 'bg-yellow-500', text: 'text-yellow-400' },
];

interface Props {
  players: Player[];
  currentPlayerIndex: number;
  era: number;
  deckCount: number;
}

export function PlayerHUD({ players, currentPlayerIndex, era, deckCount }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-black/30 backdrop-blur border-b border-white/10">
      {/* Era indicator */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {[1, 2, 3].map((e) => (
            <div
              key={e}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                e === era
                  ? 'bg-amber-400 border-amber-300 text-gray-900'
                  : e < era
                  ? 'bg-white/20 border-white/30 text-white/50'
                  : 'bg-white/5 border-white/10 text-white/30'
              }`}
            >
              {e}
            </div>
          ))}
        </div>
        <span className="text-xs text-white/50">Era {era}/3</span>
      </div>

      {/* Players */}
      <div className="flex gap-4">
        {players.map((p, i) => {
          const colors = PLAYER_COLORS[i];
          const isActive = i === currentPlayerIndex;
          return (
            <div
              key={p.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                isActive ? 'bg-white/15 ring-2 ' + colors.ring : 'opacity-50'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
              <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/60'}`}>
                {p.name}
              </span>
              <span className={`text-sm font-bold ${colors.text}`}>{p.score} pts</span>
            </div>
          );
        })}
      </div>

      {/* Deck count */}
      <div className="flex items-center gap-2 text-sm text-white/50">
        <span className="text-xl">🃏</span>
        <span>{deckCount} cartas</span>
      </div>
    </div>
  );
}
