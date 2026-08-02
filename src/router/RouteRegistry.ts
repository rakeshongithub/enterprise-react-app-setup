import { lazy } from "react";
import type { ImportComponent, ManagedRoute, RouteOptions } from "./types";

class RouteRegistry {
  private routes: ManagedRoute[] = [];

  register(
    path: string,
    importComponent: ImportComponent,
    options?: RouteOptions,
  ) {
    const exists = this.routes.some((r) => r.path === path);

    if (exists) {
      throw new Error(`Route "${path}" already exists.`);
    }

    this.routes.push({
      path,
      Component: lazy(importComponent),
      options,
    });
  }

  getRoutes() {
    return this.routes;
  }
}

export const routeRegistry = new RouteRegistry();
