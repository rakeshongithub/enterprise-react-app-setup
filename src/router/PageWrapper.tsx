import type { ManagedRoute } from "./types";
import BlankLayout from "../layouts/BlankLayout";
import ProtectedRoute from "./ProtectedRoute";
import LoadingBoundary from "./LoadingBoundary";

interface Props {
  route: ManagedRoute;
}

export default function PageWrapper({ route }: Props) {
  const { Component, options } = route;

  const Layout = options?.layout?.Component ?? BlankLayout;

  let page = (
    <LoadingBoundary>
      <Layout>
        <Component />
      </Layout>
    </LoadingBoundary>
  );

  if (options?.requiresAuth) {
    page = <ProtectedRoute>{page}</ProtectedRoute>;
  }

  return page;
}
