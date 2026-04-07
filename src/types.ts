export type Tribe =
  | 'dwarf'
  | 'elf'
  | 'halfling'
  | 'merfolk'
  | 'minotaur'
  | 'orc'
  | 'skeleton'
  | 'troll'
  | 'wingfolk'
  | 'wizard';

export type Kingdom =
  | 'Homeland'
  | 'Underglen'
  | 'Rivermeet'
  | 'Thornwood'
  | 'Skyfell'
  | 'Shadowmoor';

export interface TribeCard {
  id: string;
  tribe: Tribe;
  kingdom: Kingdom;
}

export interface Player {
  id: number;
  name: string;
  hand: TribeCard[];
  score: number;
  eraScores: number[];
}

export interface KingdomControl {
  kingdom: Kingdom;
  markers: Record<number, number>; // playerId -> count
  controller: number | null; // playerId or null
}

export type GamePhase = 'setup' | 'playing' | 'end';

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  deck: TribeCard[];
  discardPile: TribeCard[];
  kingdoms: KingdomControl[];
  era: number; // 1, 2 or 3
  selectedCards: string[]; // card ids selected in hand
}
