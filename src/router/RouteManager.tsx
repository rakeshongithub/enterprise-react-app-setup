import { Route, Routes } from 'react-router-dom';

import { routeRegistry } from './RouteRegistry';

import PageWrapper from './PageWrapper';

export default function RouteManager() {
  const routes = routeRegistry.getRoutes();

  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={<PageWrapper route={route} />} />
      ))}
    </Routes>
  );
}
