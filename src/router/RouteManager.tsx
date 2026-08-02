import { Route, Routes } from "react-router-dom";
import BlankLayout from "../layouts/BlankLayout";
import LoadingBoundary from "./LoadingBoundary";
import { routeRegistry } from "./RouteRegistry";

export default function RouteManager() {
  const routes = routeRegistry.getRoutes();

  return (
    <Routes>
      {routes.map(({ path, Component, options }) => {
        const Layout = options?.layout?.Component ?? BlankLayout;

        return (
          <Route
            key={path}
            path={path}
            element={
              <LoadingBoundary>
                <Layout>
                  <Component />
                </Layout>
              </LoadingBoundary>
            }
          />
        );
      })}
    </Routes>
  );
}
