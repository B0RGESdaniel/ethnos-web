import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { SetupScreen } from '../SetupScreen';

describe('SetupScreen', () => {
  test('renders player count buttons and input fields', () => {
    render(<SetupScreen onConfirm={() => {}} />);

    expect(screen.getByRole('button', { name: /^2$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^3$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^4$/ })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/jogador 1/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/jogador 2/i)).toBeInTheDocument();
  });

  test('changes player count when clicking button', async () => {
    const user = userEvent.setup();
    render(<SetupScreen onConfirm={() => {}} />);

    await user.click(screen.getByRole('button', { name: /^3$/ }));
    expect(screen.getByPlaceholderText(/jogador 1/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/jogador 2/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/jogador 3/i)).toBeInTheDocument();
  });

  test('calls onConfirm with player names when button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(<SetupScreen onConfirm={onConfirm} />);

    const input1 = screen.getByPlaceholderText(/jogador 1/i);
    const input2 = screen.getByPlaceholderText(/jogador 2/i);
    
    await user.type(input1, 'Alice');
    await user.type(input2, 'Bob');

    await user.click(screen.getByRole('button', { name: /começar jogo/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith(['Alice', 'Bob']);
  });

  test('uses default names when player names are not filled', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(<SetupScreen onConfirm={onConfirm} />);

    await user.click(screen.getByRole('button', { name: /começar jogo/i }));

    expect(onConfirm).toHaveBeenCalledWith(['Jogador 1', 'Jogador 2']);
  });

  test('fills only selected number of players', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(<SetupScreen onConfirm={onConfirm} />);

    await user.click(screen.getByRole('button', { name: /^3$/ }));

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'Alice');
    await user.type(inputs[1], 'Bob');
    await user.type(inputs[2], 'Charlie');

    await user.click(screen.getByRole('button', { name: /começar jogo/i }));

    expect(onConfirm).toHaveBeenCalledWith(['Alice', 'Bob', 'Charlie']);
  });
});
