import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { routeRegistry } from "./RouteRegistry";

export default function RouteManager() {
  const routes = routeRegistry.getRoutes();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {routes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </Suspense>
  );
}
