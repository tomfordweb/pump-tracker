import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WorkoutCreateForm from './WorkoutCreateForm';

describe('<WorkoutCreateForm />', () => {
  test('it should mount', () => {
    render(<WorkoutCreateForm />);
    
    const workoutCreateForm = screen.getByTestId('WorkoutCreateForm');

    expect(workoutCreateForm).toBeInTheDocument();
  });
});