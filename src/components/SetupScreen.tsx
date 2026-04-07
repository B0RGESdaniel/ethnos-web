import { useState } from 'react';

interface Props {
  onConfirm: (names: string[]) => void;
}

export function SetupScreen({ onConfirm }: Props) {
  const [count, setCount] = useState(2);
  const [names, setNames] = useState(['', '', '', '']);

  const handleConfirm = () => {
    const filled = names.slice(0, count).map((n, i) => n.trim() || `Jogador ${i + 1}`);
    onConfirm(filled);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0a2e] to-[#0d1b3e] text-white px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2 text-amber-300">Configurar Partida</h2>
        <p className="text-center text-purple-300 mb-8 text-sm">Defina os jogadores</p>

        {/* Player count */}
        <div className="mb-6">
          <label className="block text-sm text-purple-300 mb-2 uppercase tracking-wider">
            Número de Jogadores
          </label>
          <div className="flex gap-3">
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all cursor-pointer ${
                  count === n
                    ? 'bg-amber-400 text-gray-900 shadow-lg scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Player names */}
        <div className="space-y-3 mb-8">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i}>
              <label className="block text-xs text-purple-400 mb-1 uppercase tracking-wider">
                Jogador {i + 1}
              </label>
              <input
                type="text"
                placeholder={`Jogador ${i + 1}`}
                value={names[i]}
                onChange={(e) => {
                  const n = [...names];
                  n[i] = e.target.value;
                  setNames(n);
                }}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 font-bold text-lg rounded-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-xl"
        >
          Começar Jogo
        </button>
      </div>
    </div>
  );
}
