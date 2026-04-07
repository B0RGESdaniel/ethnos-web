import type { KingdomControl, Player } from '../types';

const KINGDOM_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  Homeland:   { icon: '🏔️', color: 'text-amber-300',  bg: 'from-amber-950 to-amber-900' },
  Underglen:  { icon: '🌲', color: 'text-green-300',  bg: 'from-green-950 to-green-900' },
  Rivermeet:  { icon: '🌊', color: 'text-blue-300',   bg: 'from-blue-950 to-blue-900' },
  Thornwood:  { icon: '🌋', color: 'text-red-300',    bg: 'from-red-950 to-red-900' },
  Skyfell:    { icon: '☁️', color: 'text-sky-300',    bg: 'from-sky-950 to-sky-900' },
  Shadowmoor: { icon: '🌑', color: 'text-purple-300', bg: 'from-purple-950 to-purple-900' },
};

const PLAYER_COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
];

interface Props {
  kingdoms: KingdomControl[];
  players: Player[];
}

export function KingdomBoard({ kingdoms, players }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      {kingdoms.map((k) => {
        const cfg = KINGDOM_CONFIG[k.kingdom];
        const total = Object.values(k.markers).reduce((a, b) => a + b, 0);

        return (
          <div
            key={k.kingdom}
            className={`bg-gradient-to-b ${cfg.bg} rounded-2xl border border-white/10 p-3 flex flex-col gap-2 shadow-lg`}
          >
            {/* Header */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">{cfg.icon}</span>
              <div>
                <div className={`text-sm font-bold ${cfg.color}`}>{k.kingdom}</div>
                <div className="text-xs text-white/40">{total} marcadores</div>
              </div>
            </div>

            {/* Controller badge */}
            {k.controller !== null && (
              <div className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${PLAYER_COLORS[k.controller]}`} />
                <span className="text-xs text-white/70">
                  {players[k.controller]?.name ?? `J${k.controller + 1}`}
                </span>
              </div>
            )}

            {/* Marker counts per player */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {players.map((p) => {
                const count = k.markers[p.id] ?? 0;
                if (count === 0) return null;
                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10`}
                  >
                    <div className={`w-2 h-2 rounded-full ${PLAYER_COLORS[p.id]}`} />
                    <span className="text-xs text-white/80">{count}</span>
                  </div>
                );
              })}
              {total === 0 && (
                <span className="text-xs text-white/30 italic">Sem controle</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
