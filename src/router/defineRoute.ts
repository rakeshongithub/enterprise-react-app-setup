import type { ImportComponent, RouteOptions } from "./types";

export interface RouteDefinition {
  path: string;

  component: ImportComponent;

  options?: RouteOptions;
}

export function defineRoute(route: RouteDefinition): RouteDefinition {
  return route;
}
