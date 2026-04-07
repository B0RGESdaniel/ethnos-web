interface Props {
  onStart: () => void;
}

export function StartScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0a2e] to-[#0d1b3e] text-white">
      {/* Logo / Title */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-5xl">⚔️</span>
          <h1 className="text-7xl font-bold tracking-tight bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
            ETHNOS
          </h1>
          <span className="text-5xl">🛡️</span>
        </div>
        <p className="text-purple-300 text-xl tracking-widest uppercase">
          Jogo de Tribos &amp; Reinos
        </p>
      </div>

      {/* Decorative kingdoms preview */}
      <div className="flex gap-3 mb-12">
        {['🏔️', '🌲', '🌊', '🌋', '☁️', '🌑'].map((icon, i) => (
          <div
            key={i}
            className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shadow-lg"
          >
            {icon}
          </div>
        ))}
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        className="px-12 py-4 text-xl font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
      >
        Iniciar Partida
      </button>

      <p className="mt-6 text-purple-400 text-sm">2 a 4 jogadores · Local (hotseat)</p>
    </div>
  );
}
