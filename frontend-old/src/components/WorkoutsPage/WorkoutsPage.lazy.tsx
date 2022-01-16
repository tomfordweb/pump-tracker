import React, { lazy, Suspense } from 'react';

const LazyWorkoutsPage = lazy(() => import('./WorkoutsPage'));

const WorkoutsPage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyWorkoutsPage {...props} />
  </Suspense>
);

export default WorkoutsPage;
