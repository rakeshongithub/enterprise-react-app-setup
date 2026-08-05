import type { ManagedRoute } from './types';
import BlankLayout from '../layouts/BlankLayout';
import ProtectedRoute from './ProtectedRoute';
import LoadingBoundary from './LoadingBoundary';

interface Props {
  route: ManagedRoute;
}

export default function PageWrapper({ route }: Props) {
  const { Component, meta } = route;

  const Layout = meta?.layout ?? BlankLayout;

  let page = (
    <LoadingBoundary>
      <Layout>
        <Component />
      </Layout>
    </LoadingBoundary>
  );

  if (meta?.requiresAuth) {
    page = <ProtectedRoute>{page}</ProtectedRoute>;
  }

  return page;
}
