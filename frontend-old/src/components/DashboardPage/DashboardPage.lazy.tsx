import React, { lazy, Suspense } from 'react';

const LazyDashboardPage = lazy(() => import('./DashboardPage'));

const DashboardPage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyDashboardPage {...props} />
  </Suspense>
);

export default DashboardPage;
