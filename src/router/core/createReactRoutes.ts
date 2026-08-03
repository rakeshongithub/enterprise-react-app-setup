import { type RouteObject } from "react-router-dom";
import { type RouteDefinition } from "../types";

export default function createReactRoutes(
  routes: RouteDefinition[],
): RouteObject[] {
  return routes.map((route) => ({
    path: route.path,
  }));
}
