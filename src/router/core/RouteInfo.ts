import { type RouteMeta } from "../types";

export interface RouteInfo {
  id: string;
  path: string;
  meta?: RouteMeta;
}
