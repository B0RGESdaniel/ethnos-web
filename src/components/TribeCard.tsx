import type { TribeCard as TribeCardType } from '../types';

const TRIBE_CONFIG: Record<string, { emoji: string; color: string; bg: string }> = {
  dwarf:    { emoji: '⛏️', color: 'text-orange-300', bg: 'from-orange-900 to-orange-700' },
  elf:      { emoji: '🌿', color: 'text-green-300',  bg: 'from-green-900 to-green-700' },
  halfling: { emoji: '🍀', color: 'text-lime-300',   bg: 'from-lime-900 to-lime-700' },
  merfolk:  { emoji: '🐚', color: 'text-blue-300',   bg: 'from-blue-900 to-blue-700' },
  minotaur: { emoji: '🐂', color: 'text-red-300',    bg: 'from-red-900 to-red-700' },
  orc:      { emoji: '🪓', color: 'text-emerald-300',bg: 'from-emerald-900 to-emerald-700' },
  skeleton: { emoji: '💀', color: 'text-gray-300',   bg: 'from-gray-800 to-gray-600' },
  troll:    { emoji: '🪨', color: 'text-stone-300',  bg: 'from-stone-900 to-stone-700' },
  wingfolk: { emoji: '🦅', color: 'text-sky-300',    bg: 'from-sky-900 to-sky-700' },
  wizard:   { emoji: '🔮', color: 'text-purple-300', bg: 'from-purple-900 to-purple-700' },
};

const KINGDOM_ICONS: Record<string, string> = {
  Homeland:   '🏔️',
  Underglen:  '🌲',
  Rivermeet:  '🌊',
  Thornwood:  '🌋',
  Skyfell:    '☁️',
  Shadowmoor: '🌑',
};

interface Props {
  card: TribeCardType;
  selected?: boolean;
  onClick?: () => void;
  small?: boolean;
}

export function TribeCard({ card, selected, onClick, small }: Props) {
  const isDragon = card.id.startsWith('dragon');
  const cfg = isDragon
    ? { emoji: '🐉', color: 'text-yellow-300', bg: 'from-yellow-900 to-yellow-700' }
    : TRIBE_CONFIG[card.tribe] ?? TRIBE_CONFIG.wizard;

  if (small) {
    return (
      <div
        onClick={onClick}
        className={`
          relative w-14 h-20 rounded-lg bg-gradient-to-b ${cfg.bg}
          border-2 flex flex-col items-center justify-center gap-1 cursor-pointer
          transition-all select-none
          ${selected ? 'border-amber-400 scale-110 shadow-amber-400/50 shadow-lg -translate-y-2' : 'border-white/20 hover:border-white/50'}
        `}
      >
        <span className="text-lg">{cfg.emoji}</span>
        <span className="text-[8px] text-white/70 text-center leading-tight px-1">
          {isDragon ? 'Dragão' : card.tribe}
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`
        relative w-24 h-36 rounded-xl bg-gradient-to-b ${cfg.bg}
        border-2 flex flex-col items-center justify-between p-2 cursor-pointer
        transition-all select-none
        ${selected ? 'border-amber-400 scale-110 shadow-amber-400/50 shadow-xl -translate-y-3' : 'border-white/20 hover:border-white/50 hover:-translate-y-1'}
      `}
    >
      {/* Kingdom icon top */}
      <div className="text-lg self-start">{KINGDOM_ICONS[card.kingdom] ?? '?'}</div>

      {/* Tribe emoji center */}
      <div className="text-4xl">{cfg.emoji}</div>

      {/* Labels bottom */}
      <div className="w-full text-center">
        <div className={`text-xs font-bold capitalize ${cfg.color}`}>
          {isDragon ? 'Dragão' : card.tribe}
        </div>
        <div className="text-[10px] text-white/60">{card.kingdom}</div>
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
          <span className="text-xs text-gray-900 font-bold">✓</span>
        </div>
      )}
    </div>
  );
}
