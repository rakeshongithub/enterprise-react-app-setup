import { lazy } from "react";

import { type ManagedRoute, type RouteDefinition } from "./types";

class RouteRegistry {
  private readonly routes: ManagedRoute[] = [];

  private readonly definitions: RouteDefinition[] = [];

  register(routes: RouteDefinition[]) {
    console.log(this.routes);
    routes.forEach((route) => {
      this.definitions.push(route);
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

  getDefinitions() {
    return this.definitions;
  }
}

export const routeRegistry = new RouteRegistry();
