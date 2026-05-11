import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { PlayerHUD } from '../PlayerHUD';

describe('PlayerHUD', () => {
  const players = [
    { id: 1, name: 'Alice', hand: [], score: 10, eraScores: [4, 6] },
    { id: 2, name: 'Bob', hand: [], score: 8, eraScores: [3, 5] },
  ];

  test('renders era indicators', () => {
    render(<PlayerHUD players={players} currentPlayerIndex={0} era={2} deckCount={25} />);

    expect(screen.getByText(/era 2\/3/i)).toBeInTheDocument();
    expect(screen.getByText(/🃏/)).toBeInTheDocument();
  });

  test('renders players with scores', () => {
    render(<PlayerHUD players={players} currentPlayerIndex={0} era={1} deckCount={50} />);

    expect(screen.getByText(/alice/i)).toBeInTheDocument();
    expect(screen.getByText(/bob/i)).toBeInTheDocument();
    expect(screen.getByText(/10 pts/)).toBeInTheDocument();
    expect(screen.getByText(/8 pts/)).toBeInTheDocument();
  });

  test('highlights current player', () => {
    const { container } = render(<PlayerHUD players={players} currentPlayerIndex={0} era={1} deckCount={50} />);

    const aliceSection = screen.getByText(/alice/i).closest('div');
    expect(aliceSection?.className).toContain('ring');
  });

  test('displays deck count', () => {
    render(<PlayerHUD players={players} currentPlayerIndex={0} era={1} deckCount={15} />);

    expect(screen.getByText(/15 cartas/)).toBeInTheDocument();
  });
});
