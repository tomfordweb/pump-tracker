import React, { lazy, Suspense } from 'react';

const LazyWorkoutCreateForm = lazy(() => import('./WorkoutCreateForm'));

const WorkoutCreateForm = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyWorkoutCreateForm {...props} />
  </Suspense>
);

export default WorkoutCreateForm;
