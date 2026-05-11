import { render, screen } from '@testing-library/react';
import { TribeCard } from '../TribeCard';
import type { TribeCard as TribeCardType } from '../../types';
import { describe, test, expect } from 'vitest';

describe('TribeCard', () => {
  const mockCard: TribeCardType = {
    id: 'dwarf1',
    tribe: 'dwarf',
    kingdom: 'Homeland',
  };

  test('renders the card with correct emoji', () => {
    render(<TribeCard card={mockCard} />);
    expect(screen.getByText('⛏️')).toBeInTheDocument();
  });

  test('renders small version when small prop is true', () => {
    render(<TribeCard card={mockCard} small />);
    expect(screen.getByText('⛏️')).toBeInTheDocument();
  });
});