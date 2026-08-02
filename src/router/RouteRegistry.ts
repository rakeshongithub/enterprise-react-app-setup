import { lazy } from "react";
import { type ManagedRoute } from "./types";
import { type RouteDefinition } from "./defineRoute";

class RouteRegistry {
  private readonly routes: ManagedRoute[] = [];

  register(routes: RouteDefinition[]) {
    routes.forEach((route) => {
      const exists = this.routes.some((r) => r.path === route.path);

      if (exists) {
        throw new Error(`Duplicate route "${route.path}"`);
      }

      this.routes.push({
        path: route.path,
        Component: lazy(route.component),
        options: route.options,
      });
    });
  }

  getRoutes() {
    return this.routes;
  }
}

export const routeRegistry = new RouteRegistry();
