import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WorkoutsPage from './WorkoutsPage';

describe('<WorkoutsPage />', () => {
  test('it should mount', () => {
    render(<WorkoutsPage />);
    
    const workoutsPage = screen.getByTestId('WorkoutsPage');

    expect(workoutsPage).toBeInTheDocument();
  });
});