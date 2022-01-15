import React, { lazy, Suspense } from 'react';

const LazyCreateAccountPage = lazy(() => import('./CreateAccountPage'));

const CreateAccountPage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyCreateAccountPage {...props} />
  </Suspense>
);

export default CreateAccountPage;
