import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { PlayerHandPanel } from '../PlayerHandPanel';

describe('PlayerHandPanel', () => {
  const player = {
    id: 1,
    name: 'Alice',
    hand: [
      { id: 'dwarf1', tribe: 'dwarf' as const, kingdom: 'Homeland' as const },
      { id: 'elf1', tribe: 'elf' as const, kingdom: 'Underglen' as const },
    ],
    score: 10,
    eraScores: [4, 6],
  };

  test('renders player name and card count', () => {
    render(
      <PlayerHandPanel
        player={player}
        selectedCards={[]}
        onToggleCard={() => {}}
        onDraw={() => {}}
        onPlayBand={() => {}}
        onAdvanceEra={() => {}}
        deckEmpty={false}
      />
    );

    expect(screen.getByText(/vez de: alice/i)).toBeInTheDocument();
    expect(screen.getByText(/2 cartas na mão/i)).toBeInTheDocument();
  });

  test('enables play button only when cards are selected', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <PlayerHandPanel
        player={player}
        selectedCards={[]}
        onToggleCard={() => {}}
        onDraw={() => {}}
        onPlayBand={() => {}}
        onAdvanceEra={() => {}}
        deckEmpty={false}
      />
    );

    expect(screen.getByRole('button', { name: /jogar bando/i })).toBeDisabled();

    rerender(
      <PlayerHandPanel
        player={player}
        selectedCards={['dwarf1']}
        onToggleCard={() => {}}
        onDraw={() => {}}
        onPlayBand={() => {}}
        onAdvanceEra={() => {}}
        deckEmpty={false}
      />
    );

    expect(screen.getByRole('button', { name: /jogar bando \(1\)/i })).not.toBeDisabled();
  });

  test('disables draw button when deck is empty', () => {
    render(
      <PlayerHandPanel
        player={player}
        selectedCards={[]}
        onToggleCard={() => {}}
        onDraw={() => {}}
        onPlayBand={() => {}}
        onAdvanceEra={() => {}}
        deckEmpty={true}
      />
    );

    expect(screen.getByRole('button', { name: /comprar carta/i })).toBeDisabled();
  });

  test('calls onDraw when draw button is clicked', async () => {
    const user = userEvent.setup();
    const onDraw = vi.fn();

    render(
      <PlayerHandPanel
        player={player}
        selectedCards={[]}
        onToggleCard={() => {}}
        onDraw={onDraw}
        onPlayBand={() => {}}
        onAdvanceEra={() => {}}
        deckEmpty={false}
      />
    );

    await user.click(screen.getByRole('button', { name: /comprar carta/i }));
    expect(onDraw).toHaveBeenCalledTimes(1);
  });

  test('displays error message when provided', () => {
    render(
      <PlayerHandPanel
        player={player}
        selectedCards={[]}
        onToggleCard={() => {}}
        onDraw={() => {}}
        onPlayBand={() => {}}
        onAdvanceEra={() => {}}
        deckEmpty={false}
        error="Invalid band!"
      />
    );

    expect(screen.getByText(/invalid band!/i)).toBeInTheDocument();
  });
});
