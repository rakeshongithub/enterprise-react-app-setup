import { lazy } from "react";

import { type ManagedRoute, type RouteDefinition } from "./types";

class RouteRegistry {
  private readonly routes: ManagedRoute[] = [];

  register(routes: RouteDefinition[]) {
    routes.forEach((route) => {
      const exists = this.routes.some((r) => r.id === route.id);

      if (exists) {
        throw new Error(`Duplicate Route Id : ${route.id}`);
      }

      this.routes.push({
        id: route.id,
        path: route.path,
        Component: lazy(route.component),
        meta: route.meta,
      });
    });
  }

  getRoutes() {
    return this.routes;
  }
}

export const routeRegistry = new RouteRegistry();
