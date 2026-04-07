import type { Player } from '../types';

const PLAYER_COLORS = [
  { bg: 'from-red-800 to-red-600',    text: 'text-red-300',    medal: '🥇' },
  { bg: 'from-blue-800 to-blue-600',  text: 'text-blue-300',  medal: '🥈' },
  { bg: 'from-green-800 to-green-600',text: 'text-green-300', medal: '🥉' },
  { bg: 'from-yellow-800 to-yellow-600', text: 'text-yellow-300', medal: '🏅' },
];

interface Props {
  players: Player[];
  onRestart: () => void;
}

export function ScoreScreen({ players, onRestart }: Props) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0a2e] to-[#0d1b3e] text-white px-4">
      {/* Trophy */}
      <div className="text-8xl mb-4 animate-bounce">🏆</div>
      <h1 className="text-4xl font-bold text-amber-300 mb-1">{winner.name} Venceu!</h1>
      <p className="text-purple-300 mb-10 text-lg">{winner.score} pontos totais</p>

      {/* Scoreboard */}
      <div className="w-full max-w-lg space-y-3 mb-10">
        {sorted.map((p, rank) => {
          const colors = PLAYER_COLORS[rank] ?? PLAYER_COLORS[3];
          return (
            <div
              key={p.id}
              className={`bg-gradient-to-r ${colors.bg} rounded-2xl p-4 flex items-center gap-4 shadow-lg`}
            >
              <span className="text-3xl">{colors.medal}</span>
              <div className="flex-1">
                <div className="font-bold text-lg text-white">{p.name}</div>
                <div className="flex gap-2 mt-1">
                  {p.eraScores.map((s, i) => (
                    <span key={i} className={`text-xs ${colors.text}`}>
                      Era {i + 1}: {s}pts
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{p.score}</div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onRestart}
        className="px-10 py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 font-bold text-lg rounded-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-xl"
      >
        Nova Partida
      </button>
    </div>
  );
}
