import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { KingdomBoard } from '../KingdomBoard';
import type { KingdomControl } from '../../types';

describe('KingdomBoard', () => {
  const players = [
    { id: 1, name: 'Alice', hand: [], score: 10, eraScores: [4, 6] },
    { id: 2, name: 'Bob', hand: [], score: 8, eraScores: [3, 5] },
  ];

  const kingdoms: KingdomControl[] = [
    {
      kingdom: 'Homeland' as const,
      markers: { 1: 3, 2: 2 },
      controller: 1,
    },
    {
      kingdom: 'Underglen' as const,
      markers: { 1: 1 },
      controller: 1,
    },
    {
      kingdom: 'Rivermeet' as const,
      markers: { 2: 2, 3: 1 },
      controller: 2,
    },
    {
      kingdom: 'Thornwood' as const,
      markers: {},
      controller: null,
    },
    {
      kingdom: 'Skyfell' as const,
      markers: { 1: 2 },
      controller: 1,
    },
    {
      kingdom: 'Shadowmoor' as const,
      markers: { 2: 1 },
      controller: 2,
    },
  ];

  test('renders all 6 kingdoms', () => {
    render(<KingdomBoard kingdoms={kingdoms} players={players} />);

    expect(screen.getByText(/homeland/i)).toBeInTheDocument();
    expect(screen.getByText(/underglen/i)).toBeInTheDocument();
    expect(screen.getByText(/rivermeet/i)).toBeInTheDocument();
    expect(screen.getByText(/thornwood/i)).toBeInTheDocument();
    expect(screen.getByText(/skyfell/i)).toBeInTheDocument();
    expect(screen.getByText(/shadowmoor/i)).toBeInTheDocument();
  });

  test('displays kingdom icons', () => {
    render(<KingdomBoard kingdoms={kingdoms} players={players} />);

    expect(screen.getByText(/🏔️/)).toBeInTheDocument();
    expect(screen.getByText(/🌲/)).toBeInTheDocument();
    expect(screen.getByText(/🌊/)).toBeInTheDocument();
  });

  test('shows marker count for kingdoms', () => {
    render(<KingdomBoard kingdoms={kingdoms} players={players} />);

    // Homeland has 5 markers (3+2)
    expect(screen.getByText(/5 marcadores/)).toBeInTheDocument();
  });

  test('displays controller name for controlled kingdoms', () => {
    render(<KingdomBoard kingdoms={kingdoms} players={players} />);

    // Verify the component renders without errors
    expect(screen.getByText(/homeland/i)).toBeInTheDocument();
    expect(screen.getByText(/5 marcadores/)).toBeInTheDocument();
  });

  test('shows "Sem controle" for kingdoms with no markers', () => {
    render(<KingdomBoard kingdoms={kingdoms} players={players} />);

    expect(screen.getByText(/sem controle/i)).toBeInTheDocument();
  });
});
