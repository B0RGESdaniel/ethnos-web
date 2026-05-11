import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StartScreen } from '../StartScreen';
import { describe, expect, test, vi } from 'vitest';

describe('StartScreen', () => {
  test('renders the title, buttons and description', () => {
    render(<StartScreen onStart={() => {}} onHistory={() => {}} />);

    expect(screen.getByRole('heading', { name: /ethnos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar partida/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ver histórico/i })).toBeInTheDocument();
    expect(screen.getByText(/2 a 4 jogadores · Local \(hotseat\)/i)).toBeInTheDocument();
  });

  test('calls onStart when the start button is clicked', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    const onHistory = vi.fn();

    render(<StartScreen onStart={onStart} onHistory={onHistory} />);

    await user.click(screen.getByRole('button', { name: /iniciar partida/i }));
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onHistory).not.toHaveBeenCalled();
  });

  test('calls onHistory when the history button is clicked', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    const onHistory = vi.fn();

    render(<StartScreen onStart={onStart} onHistory={onHistory} />);

    await user.click(screen.getByRole('button', { name: /ver histórico/i }));
    expect(onHistory).toHaveBeenCalledTimes(1);
    expect(onStart).not.toHaveBeenCalled();
  });
});
