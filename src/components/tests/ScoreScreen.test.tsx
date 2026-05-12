import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { ScoreScreen } from '../ScoreScreen';
import { saveGameResult } from '../../db/gameResults';

vi.mock('../../db/gameResults', () => ({
  saveGameResult: vi.fn().mockResolvedValue(undefined),
}));

describe('ScoreScreen', () => {
  const players = [
    {
      id: 1,
      name: 'Alice',
      hand: [],
      score: 12,
      eraScores: [4, 4, 4],
    },
    {
      id: 2,
      name: 'Bob',
      hand: [],
      score: 8,
      eraScores: [3, 2, 3],
    },
  ];

  test('renders the winner, scores and restart button', async () => {
    const onRestart = vi.fn();

    render(<ScoreScreen players={players} onRestart={onRestart} />);

    expect(screen.getByRole('heading', { name: /alice venceu!/i })).toBeInTheDocument();
    expect(screen.getByText(/12 pontos totais/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /nova partida/i })).toBeInTheDocument();
    expect(screen.getByText(/bob/i)).toBeInTheDocument();
    expect(screen.getByText(/era 1: 4pts/i)).toBeInTheDocument();
    expect(screen.getByText(/era 2: 4pts/i)).toBeInTheDocument();
    expect(screen.getByText(/era 3: 4pts/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(saveGameResult).toHaveBeenCalledWith({
        players: ['Alice', 'Bob'],
        scores: { Alice: 12, Bob: 8 },
        winner: 'Alice',
      });
    });
  });

  test('calls onRestart when the restart button is clicked', async () => {
    const user = userEvent.setup();
    const onRestart = vi.fn();

    render(<ScoreScreen players={players} onRestart={onRestart} />);

    await user.click(screen.getByRole('button', { name: /nova partida/i }));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });
});
