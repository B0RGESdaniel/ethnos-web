import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameScreen } from '../GameScreen';
import { buildDeck } from '../../gameLogic';

describe('GameScreen', () => {
  test('renders game board with regions', () => {
    const deck = buildDeck();
    const players = [
      { id: 0, name: 'Alice', hand: [], score: 0, eraScores: [] },
      { id: 1, name: 'Bob', hand: [], score: 0, eraScores: [] },
    ];
    const state = {
      phase: 'playing' as const,
      players,
      currentPlayerIndex: 0,
      deck: deck.slice(0, 48),
      discardPile: [],
      kingdoms: [
        { kingdom: 'Homeland' as const, markers: {}, controller: null },
        { kingdom: 'Underglen' as const, markers: {}, controller: null },
        { kingdom: 'Rivermeet' as const, markers: {}, controller: null },
        { kingdom: 'Thornwood' as const, markers: {}, controller: null },
        { kingdom: 'Skyfell' as const, markers: {}, controller: null },
        { kingdom: 'Shadowmoor' as const, markers: {}, controller: null },
      ],
      selectedCards: [],
      era: 1,
    };

    const onEnd = vi.fn();
    render(<GameScreen initialState={state} onEnd={onEnd} />);

    expect(screen.getByText(/tabuleiro dos reinos/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /comprar carta/i })).toBeInTheDocument();
  });
});
