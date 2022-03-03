import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { App } from './App';

describe('when the App renders', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('should display the title', () => {
    expect(
      screen.getByRole('heading', { name: 'thom app' })
    ).toBeInTheDocument();
  });
});
