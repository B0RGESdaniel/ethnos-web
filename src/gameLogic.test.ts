import { describe, it, expect } from 'vitest'
import {
  KINGDOM_POINTS,
  advanceEra,
  buildDeck,
  calculateScores,
  createInitialState,
  drawCard,
  playBand,
  toggleCardSelection,
  validateBand,
} from './gameLogic'
import type { GameState, Kingdom, KingdomControl, Player, TribeCard } from './types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function card(
  id: string,
  tribe: TribeCard['tribe'] = 'dwarf',
  kingdom: TribeCard['kingdom'] = 'Homeland',
): TribeCard {
  return { id, tribe, kingdom }
}

const ALL_KINGDOMS: Kingdom[] = [
  'Homeland', 'Underglen', 'Rivermeet', 'Thornwood', 'Skyfell', 'Shadowmoor',
]

function emptyKingdoms(): KingdomControl[] {
  return ALL_KINGDOMS.map(k => ({ kingdom: k, markers: {} as Record<number, number>, controller: null }))
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    phase: 'playing',
    players: [
      { id: 0, name: 'Alice', hand: [], score: 0, eraScores: [] },
      { id: 1, name: 'Bob', hand: [], score: 0, eraScores: [] },
    ],
    currentPlayerIndex: 0,
    deck: [],
    discardPile: [],
    kingdoms: emptyKingdoms(),
    era: 1,
    selectedCards: [],
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// buildDeck
// ---------------------------------------------------------------------------

describe('buildDeck', () => {
  it('returns 123 cards total (10 tribes × 6 kingdoms × 2 + 3 dragons)', () => {
    expect(buildDeck()).toHaveLength(123)
  })

  it('contains exactly 3 dragon cards', () => {
    const dragons = buildDeck().filter(c => c.id.startsWith('dragon-'))
    expect(dragons).toHaveLength(3)
  })

  it('has all unique card ids', () => {
    const deck = buildDeck()
    expect(new Set(deck.map(c => c.id)).size).toBe(deck.length)
  })

  it('has exactly 2 non-dragon cards per tribe-kingdom pair', () => {
    const nonDragon = buildDeck().filter(c => !c.id.startsWith('dragon-'))
    const counts: Record<string, number> = {}
    for (const c of nonDragon) {
      const key = `${c.tribe}:${c.kingdom}`
      counts[key] = (counts[key] ?? 0) + 1
    }
    for (const count of Object.values(counts)) {
      expect(count).toBe(2)
    }
  })
})

// ---------------------------------------------------------------------------
// createInitialState
// ---------------------------------------------------------------------------

describe('createInitialState', () => {
  it('creates the correct number of players', () => {
    expect(createInitialState(['Alice', 'Bob', 'Carol']).players).toHaveLength(3)
  })

  it('assigns sequential ids starting at 0', () => {
    const state = createInitialState(['Alice', 'Bob', 'Carol'])
    expect(state.players.map(p => p.id)).toEqual([0, 1, 2])
  })

  it('deals exactly 3 cards to each player', () => {
    const state = createInitialState(['Alice', 'Bob'])
    for (const p of state.players) {
      expect(p.hand).toHaveLength(3)
    }
  })

  it('removes dealt cards from the deck (123 - players × 3)', () => {
    const state = createInitialState(['Alice', 'Bob'])
    expect(state.deck).toHaveLength(117)
  })

  it('starts at era 1, phase "playing", currentPlayerIndex 0', () => {
    const state = createInitialState(['Alice'])
    expect(state.era).toBe(1)
    expect(state.phase).toBe('playing')
    expect(state.currentPlayerIndex).toBe(0)
  })

  it('initialises 6 kingdoms with empty markers and no controller', () => {
    const state = createInitialState(['Alice'])
    expect(state.kingdoms).toHaveLength(6)
    for (const k of state.kingdoms) {
      expect(k.markers).toEqual({})
      expect(k.controller).toBeNull()
    }
  })
})

// ---------------------------------------------------------------------------
// drawCard
// ---------------------------------------------------------------------------

describe('drawCard', () => {
  it('adds the top deck card to the current player hand', () => {
    const top = card('c-1')
    const state = makeState({ deck: [top, card('c-2')] })
    expect(drawCard(state).players[0].hand).toContainEqual(top)
  })

  it('removes the drawn card from the deck', () => {
    const state = makeState({ deck: [card('c-1'), card('c-2')] })
    expect(drawCard(state).deck).toHaveLength(1)
  })

  it('returns the same state reference when the deck is empty', () => {
    const state = makeState({ deck: [] })
    expect(drawCard(state)).toBe(state)
  })

  it('clears selectedCards', () => {
    const state = makeState({ deck: [card('c-1')], selectedCards: ['old'] })
    expect(drawCard(state).selectedCards).toEqual([])
  })

  it('does not touch the other player hand', () => {
    const state = makeState({ deck: [card('c-1')] })
    expect(drawCard(state).players[1].hand).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// toggleCardSelection
// ---------------------------------------------------------------------------

describe('toggleCardSelection', () => {
  it('adds a card id that is not yet selected', () => {
    const state = makeState({ selectedCards: [] })
    expect(toggleCardSelection(state, 'c-1').selectedCards).toContain('c-1')
  })

  it('removes a card id that is already selected', () => {
    const state = makeState({ selectedCards: ['c-1', 'c-2'] })
    expect(toggleCardSelection(state, 'c-1').selectedCards).not.toContain('c-1')
  })

  it('keeps other selected cards when deselecting one', () => {
    const state = makeState({ selectedCards: ['c-1', 'c-2'] })
    expect(toggleCardSelection(state, 'c-1').selectedCards).toContain('c-2')
  })
})

// ---------------------------------------------------------------------------
// validateBand
// ---------------------------------------------------------------------------

describe('validateBand', () => {
  it('returns false for an empty array', () => {
    expect(validateBand([])).toBe(false)
  })

  it('returns true for a single card', () => {
    expect(validateBand([card('c-1')])).toBe(true)
  })

  it('returns true when all cards share the same tribe', () => {
    expect(validateBand([
      card('c-1', 'dwarf', 'Homeland'),
      card('c-2', 'dwarf', 'Underglen'),
      card('c-3', 'dwarf', 'Rivermeet'),
    ])).toBe(true)
  })

  it('returns true when all cards share the same kingdom', () => {
    expect(validateBand([
      card('c-1', 'dwarf', 'Homeland'),
      card('c-2', 'elf', 'Homeland'),
      card('c-3', 'orc', 'Homeland'),
    ])).toBe(true)
  })

  it('returns false for mixed tribe and mixed kingdom', () => {
    expect(validateBand([
      card('c-1', 'dwarf', 'Homeland'),
      card('c-2', 'elf', 'Underglen'),
    ])).toBe(false)
  })

  it('returns false for three cards where none share tribe or kingdom', () => {
    expect(validateBand([
      card('c-1', 'dwarf', 'Homeland'),
      card('c-2', 'elf', 'Underglen'),
      card('c-3', 'orc', 'Rivermeet'),
    ])).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// playBand
// ---------------------------------------------------------------------------

describe('playBand', () => {
  it('returns an error and leaves state unchanged for an invalid band', () => {
    const hand = [card('c-1', 'dwarf', 'Homeland'), card('c-2', 'elf', 'Underglen')]
    const state = makeState({
      players: [
        { id: 0, name: 'Alice', hand, score: 0, eraScores: [] },
        { id: 1, name: 'Bob', hand: [], score: 0, eraScores: [] },
      ],
      selectedCards: ['c-1', 'c-2'],
    })
    const result = playBand(state)
    expect(result.error).toBeDefined()
    expect(result.state).toBe(state)
  })

  it('removes played cards from the current player hand', () => {
    const hand = [
      card('c-1', 'dwarf', 'Homeland'),
      card('c-2', 'dwarf', 'Underglen'),
      card('keep', 'elf', 'Underglen'),
    ]
    const state = makeState({
      players: [
        { id: 0, name: 'Alice', hand, score: 0, eraScores: [] },
        { id: 1, name: 'Bob', hand: [], score: 0, eraScores: [] },
      ],
      selectedCards: ['c-1', 'c-2'],
    })
    const { state: next } = playBand(state)
    expect(next.players[0].hand.map(c => c.id)).toEqual(['keep'])
  })

  it('adds played cards to the discard pile', () => {
    const hand = [card('c-1', 'dwarf', 'Homeland'), card('c-2', 'dwarf', 'Homeland')]
    const state = makeState({
      players: [
        { id: 0, name: 'Alice', hand, score: 0, eraScores: [] },
        { id: 1, name: 'Bob', hand: [], score: 0, eraScores: [] },
      ],
      selectedCards: ['c-1', 'c-2'],
    })
    expect(playBand(state).state.discardPile).toHaveLength(2)
  })

  it('advances the turn to the next player', () => {
    const hand = [card('c-1', 'dwarf', 'Homeland')]
    const state = makeState({
      players: [
        { id: 0, name: 'Alice', hand, score: 0, eraScores: [] },
        { id: 1, name: 'Bob', hand: [], score: 0, eraScores: [] },
      ],
      currentPlayerIndex: 0,
      selectedCards: ['c-1'],
    })
    expect(playBand(state).state.currentPlayerIndex).toBe(1)
  })

  it('wraps turn back to player 0 after the last player', () => {
    const hand = [card('c-1', 'dwarf', 'Homeland')]
    const state = makeState({
      players: [
        { id: 0, name: 'Alice', hand: [], score: 0, eraScores: [] },
        { id: 1, name: 'Bob', hand, score: 0, eraScores: [] },
      ],
      currentPlayerIndex: 1,
      selectedCards: ['c-1'],
    })
    expect(playBand(state).state.currentPlayerIndex).toBe(0)
  })

  it('adds played card count to the matching kingdom markers', () => {
    const hand = [card('c-1', 'dwarf', 'Homeland'), card('c-2', 'elf', 'Homeland')]
    const state = makeState({
      players: [
        { id: 0, name: 'Alice', hand, score: 0, eraScores: [] },
        { id: 1, name: 'Bob', hand: [], score: 0, eraScores: [] },
      ],
      selectedCards: ['c-1', 'c-2'],
    })
    const { state: next } = playBand(state)
    expect(next.kingdoms.find(k => k.kingdom === 'Homeland')!.markers[0]).toBe(2)
  })

  it('sets controller to the player who now has the most markers', () => {
    const hand = [card('c-1', 'dwarf', 'Homeland'), card('c-2', 'dwarf', 'Homeland')]
    const kingdoms = emptyKingdoms().map(k =>
      k.kingdom === 'Homeland'
        ? { ...k, markers: { 1: 1 } as Record<number, number>, controller: 1 }
        : k,
    )
    const state = makeState({
      players: [
        { id: 0, name: 'Alice', hand, score: 0, eraScores: [] },
        { id: 1, name: 'Bob', hand: [], score: 0, eraScores: [] },
      ],
      kingdoms,
      selectedCards: ['c-1', 'c-2'],
    })
    const { state: next } = playBand(state)
    expect(next.kingdoms.find(k => k.kingdom === 'Homeland')!.controller).toBe(0)
  })

  it('clears selectedCards after a successful play', () => {
    const hand = [card('c-1', 'dwarf', 'Homeland')]
    const state = makeState({
      players: [
        { id: 0, name: 'Alice', hand, score: 0, eraScores: [] },
        { id: 1, name: 'Bob', hand: [], score: 0, eraScores: [] },
      ],
      selectedCards: ['c-1'],
    })
    expect(playBand(state).state.selectedCards).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// calculateScores
// ---------------------------------------------------------------------------

describe('calculateScores', () => {
  const players: Player[] = [
    { id: 0, name: 'Alice', hand: [], score: 0, eraScores: [] },
    { id: 1, name: 'Bob', hand: [], score: 0, eraScores: [] },
  ]

  it('returns 0 for all players when no kingdoms have markers', () => {
    const scores = calculateScores(emptyKingdoms(), players)
    expect(scores[0]).toBe(0)
    expect(scores[1]).toBe(0)
  })

  it('awards KINGDOM_POINTS[0] to the player with the most markers in a kingdom', () => {
    const kingdoms = emptyKingdoms().map(k =>
      k.kingdom === 'Homeland'
        ? { ...k, markers: { 0: 3, 1: 1 } as Record<number, number>, controller: 0 }
        : k,
    )
    const scores = calculateScores(kingdoms, players)
    expect(scores[0]).toBe(KINGDOM_POINTS[0])
  })

  it('awards KINGDOM_POINTS[1] to the second-place player in a kingdom', () => {
    const kingdoms = emptyKingdoms().map(k =>
      k.kingdom === 'Homeland'
        ? { ...k, markers: { 0: 3, 1: 1 } as Record<number, number>, controller: 0 }
        : k,
    )
    const scores = calculateScores(kingdoms, players)
    expect(scores[1]).toBe(KINGDOM_POINTS[1])
  })

  it('accumulates points across multiple kingdoms', () => {
    const kingdoms = emptyKingdoms().map(k =>
      k.kingdom === 'Homeland' || k.kingdom === 'Underglen'
        ? { ...k, markers: { 0: 2 } as Record<number, number>, controller: 0 }
        : k,
    )
    const scores = calculateScores(kingdoms, players)
    expect(scores[0]).toBe(KINGDOM_POINTS[0] * 2)
  })

  it('initialises scores to 0 for players with no markers anywhere', () => {
    const kingdoms = emptyKingdoms().map(k =>
      k.kingdom === 'Homeland'
        ? { ...k, markers: { 0: 2 } as Record<number, number>, controller: 0 }
        : k,
    )
    const scores = calculateScores(kingdoms, players)
    expect(scores[1]).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// advanceEra
// ---------------------------------------------------------------------------

describe('advanceEra', () => {
  it('adds the era score to each player total score', () => {
    const kingdoms = emptyKingdoms().map(k =>
      k.kingdom === 'Homeland'
        ? { ...k, markers: { 0: 2 } as Record<number, number>, controller: 0 }
        : k,
    )
    const state = makeState({ kingdoms })
    const next = advanceEra(state)
    expect(next.players[0].score).toBeGreaterThan(0)
  })

  it('appends the era score to eraScores', () => {
    const state = makeState()
    const next = advanceEra(state)
    expect(next.players[0].eraScores).toHaveLength(1)
    expect(next.players[1].eraScores).toHaveLength(1)
  })

  it('increments era by 1 when era < 3', () => {
    expect(advanceEra(makeState({ era: 1 })).era).toBe(2)
    expect(advanceEra(makeState({ era: 2 })).era).toBe(3)
  })

  it('resets all kingdom markers and controllers when era < 3', () => {
    const kingdoms = emptyKingdoms().map(k =>
      k.kingdom === 'Homeland'
        ? { ...k, markers: { 0: 3 } as Record<number, number>, controller: 0 }
        : k,
    )
    const next = advanceEra(makeState({ era: 1, kingdoms }))
    for (const k of next.kingdoms) {
      expect(k.markers).toEqual({})
      expect(k.controller).toBeNull()
    }
  })

  it('sets phase to "end" when era is 3', () => {
    expect(advanceEra(makeState({ era: 3 })).phase).toBe('end')
  })

  it('does not increment era beyond 3', () => {
    expect(advanceEra(makeState({ era: 3 })).era).toBe(3)
  })

  it('preserves accumulated score from previous eras', () => {
    const players = [
      { id: 0, name: 'Alice', hand: [], score: 10, eraScores: [10] },
      { id: 1, name: 'Bob', hand: [], score: 0, eraScores: [0] },
    ]
    const next = advanceEra(makeState({ era: 2, players }))
    expect(next.players[0].score).toBeGreaterThanOrEqual(10)
  })
})
