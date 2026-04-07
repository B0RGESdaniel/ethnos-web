import type { TribeCard, Kingdom, Tribe, Player, KingdomControl, GameState } from './types';

const TRIBES: Tribe[] = [
  'dwarf', 'elf', 'halfling', 'merfolk', 'minotaur',
  'orc', 'skeleton', 'troll', 'wingfolk', 'wizard',
];

const KINGDOMS: Kingdom[] = [
  'Homeland', 'Underglen', 'Rivermeet', 'Thornwood', 'Skyfell', 'Shadowmoor',
];

export const KINGDOM_POINTS = [1, 3, 6];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildDeck(): TribeCard[] {
  const cards: TribeCard[] = [];
  let id = 0;
  TRIBES.forEach((tribe) => {
    KINGDOMS.forEach((kingdom) => {
      cards.push({ id: `c-${id++}`, tribe, kingdom });
      cards.push({ id: `c-${id++}`, tribe, kingdom });
    });
  });
  // 3 dragon cards trigger end-of-era (marked with id prefix 'dragon')
  for (let i = 0; i < 3; i++) {
    cards.push({ id: `dragon-${i}`, tribe: 'wizard', kingdom: 'Homeland' });
  }
  return shuffle(cards);
}

export function createInitialState(playerNames: string[]): GameState {
  const deck = buildDeck();
  const players: Player[] = playerNames.map((name, i) => ({
    id: i,
    name,
    hand: [],
    score: 0,
    eraScores: [],
  }));

  const kingdoms: KingdomControl[] = KINGDOMS.map((k) => ({
    kingdom: k,
    markers: {},
    controller: null,
  }));

  let deckLeft = [...deck];
  for (const player of players) {
    for (let i = 0; i < 3; i++) {
      const card = deckLeft.shift();
      if (card) player.hand.push(card);
    }
  }

  return {
    phase: 'playing',
    players,
    currentPlayerIndex: 0,
    deck: deckLeft,
    discardPile: [],
    kingdoms,
    era: 1,
    selectedCards: [],
  };
}

export function drawCard(state: GameState): GameState {
  if (state.deck.length === 0) return state;
  const [card, ...rest] = state.deck;
  const players = state.players.map((p, i) =>
    i === state.currentPlayerIndex ? { ...p, hand: [...p.hand, card] } : p
  );
  return { ...state, deck: rest, players, selectedCards: [] };
}

export function toggleCardSelection(state: GameState, cardId: string): GameState {
  const { selectedCards } = state;
  if (selectedCards.includes(cardId)) {
    return { ...state, selectedCards: selectedCards.filter((id) => id !== cardId) };
  }
  return { ...state, selectedCards: [...selectedCards, cardId] };
}

export function validateBand(cards: TribeCard[]): boolean {
  if (cards.length === 0) return false;
  const sameTribe = cards.every((c) => c.tribe === cards[0].tribe);
  const sameKingdom = cards.every((c) => c.kingdom === cards[0].kingdom);
  return sameTribe || sameKingdom;
}

export function playBand(state: GameState): { state: GameState; error?: string } {
  const player = state.players[state.currentPlayerIndex];
  const selected = player.hand.filter((c) => state.selectedCards.includes(c.id));

  if (!validateBand(selected)) {
    return { state, error: 'Bando inválido: cartas devem ser da mesma tribo ou mesmo reino.' };
  }

  const kingdoms = state.kingdoms.map((k) => {
    const relevant = selected.filter((c) => c.kingdom === k.kingdom);
    if (relevant.length === 0) return k;
    const newCount = (k.markers[player.id] ?? 0) + relevant.length;
    const markers = { ...k.markers, [player.id]: newCount };
    let controller: number | null = null;
    let max = 0;
    for (const [pid, count] of Object.entries(markers)) {
      if (count > max) { max = count; controller = Number(pid); }
    }
    return { ...k, markers, controller };
  });

  const newHand = player.hand.filter((c) => !state.selectedCards.includes(c.id));
  const players = state.players.map((p, i) =>
    i === state.currentPlayerIndex ? { ...p, hand: newHand } : p
  );

  const next = (state.currentPlayerIndex + 1) % state.players.length;

  return {
    state: {
      ...state,
      players,
      kingdoms,
      currentPlayerIndex: next,
      selectedCards: [],
      discardPile: [...state.discardPile, ...selected],
    },
  };
}

export function calculateScores(kingdoms: KingdomControl[], players: Player[]): Record<number, number> {
  const scores: Record<number, number> = {};
  players.forEach((p) => { scores[p.id] = 0; });

  kingdoms.forEach((k) => {
    const ranked = Object.entries(k.markers)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    ranked.forEach(([pid], idx) => {
      scores[Number(pid)] += KINGDOM_POINTS[idx] ?? 0;
    });
  });
  return scores;
}

export function advanceEra(state: GameState): GameState {
  const scores = calculateScores(state.kingdoms, state.players);
  const players = state.players.map((p) => ({
    ...p,
    score: p.score + (scores[p.id] ?? 0),
    eraScores: [...p.eraScores, scores[p.id] ?? 0],
  }));

  if (state.era >= 3) {
    return { ...state, players, phase: 'end' };
  }

  const kingdoms = state.kingdoms.map((k) => ({ ...k, markers: {}, controller: null }));
  return { ...state, players, kingdoms, era: state.era + 1, deck: shuffle([...state.deck]) };
}
