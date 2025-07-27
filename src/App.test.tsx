import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('App', () => {
  it('renders the heading', () => {
    render(<App />);
    expect(screen.getByText(/2025 Weather Reporter. All rights reserved./i)).toBeInTheDocument();
  });
});
