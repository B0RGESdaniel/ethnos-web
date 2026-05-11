import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { HistoryScreen } from '../HistoryScreen';
import { getGameHistory } from '../../db/gameResults';

vi.mock('../../db/gameResults', () => ({
  getGameHistory: vi.fn(),
}));

describe('HistoryScreen', () => {
  test('displays loading state initially', () => {
    vi.mocked(getGameHistory).mockImplementation(() => new Promise(() => {}));

    render(<HistoryScreen onBack={() => {}} />);

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  test('displays empty state when no history', async () => {
    vi.mocked(getGameHistory).mockResolvedValue([]);

    render(<HistoryScreen onBack={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText(/nenhuma partida registrada/i)).toBeInTheDocument();
    });
  });

  test('displays game history', async () => {
    const mockHistory = [
      {
        id: 1,
        players: ['Alice', 'Bob'],
        scores: { Alice: 12, Bob: 8 },
        winner: 'Alice',
        played_at: '2026-05-11T10:00:00Z',
      },
    ];

    vi.mocked(getGameHistory).mockResolvedValue(mockHistory);

    render(<HistoryScreen onBack={() => {}} />);

    await waitFor(() => {
      expect(screen.getAllByText(/alice/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/12/)).toBeInTheDocument();
      expect(screen.getByText(/8/)).toBeInTheDocument();
    });
  });

  test('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();

    vi.mocked(getGameHistory).mockResolvedValue([]);

    render(<HistoryScreen onBack={onBack} />);

    await waitFor(() => {
      expect(screen.getByText(/nenhuma partida registrada/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /voltar/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
