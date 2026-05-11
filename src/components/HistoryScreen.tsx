import { useEffect, useState } from 'react';
import type { GameResult } from '../db/gameResults';
import { getGameHistory } from '../db/gameResults';

interface Props {
  onBack: () => void;
}

function formatDate(raw: string): string {
  return new Date(raw).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function GameCard({ result }: { result: GameResult }) {
  const ranked = Object.entries(result.scores).sort(([, a], [, b]) => b - a);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-amber-300">🏆 {result.winner}</span>
        <span className="text-xs text-purple-400">{formatDate(result.played_at)}</span>
      </div>
      <div className="space-y-1">
        {ranked.map(([name, score], i) => (
          <div key={name} className="flex justify-between text-sm">
            <span className="text-white/70">
              {i + 1}. {name}
            </span>
            <span className="text-purple-300 font-medium">{score} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HistoryScreen({ onBack }: Props) {
  const [history, setHistory] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGameHistory()
      .then(setHistory)
      .catch(err => console.error('[ethnos] failed to load history:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-[#1a0a2e] to-[#0d1b3e] text-white px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="text-purple-300 hover:text-white transition-colors cursor-pointer text-sm"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-amber-300">Histórico de Partidas</h1>
        </div>

        {loading && (
          <p className="text-center text-purple-400 mt-16">Carregando...</p>
        )}

        {!loading && history.length === 0 && (
          <div className="text-center mt-16">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-purple-400">Nenhuma partida registrada ainda.</p>
          </div>
        )}

        {!loading && history.length > 0 && (
          <div className="space-y-3">
            {history.map(result => (
              <GameCard key={result.id} result={result} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
