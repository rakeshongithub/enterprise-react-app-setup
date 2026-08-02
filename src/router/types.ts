/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type ComponentType,
  type LazyExoticComponent,
  type ReactNode,
} from "react";

/**
 * Lazy imported page module.
 */
export interface RouteModule {
  default: ComponentType<any>;
}

export type ImportComponent = () => Promise<RouteModule>;

/**
 * Navigation metadata.
 */
export interface NavigationMeta {
  label: string;
  icon?: ReactNode;
  order?: number;
  /**
   * Used to build grouped navigation.
   *
   * Example:
   *
   * ["Administration"]
   *
   * or
   *
   * ["Administration","Identity"]
   */
  hierarchy?: string[];
  /**
   * Hide from navigation.
   */
  visible?: boolean;
}

/**
 * Route metadata.
 */
export interface RouteMeta {
  title?: string;
  breadcrumb?: string | ((params: Record<string, string>) => string);
  layout?: ComponentType<any>;
  requiresAuth?: boolean;
  permissions?: string[];
  roles?: string[];
  featureFlag?: string;
  nav?: NavigationMeta;
}

/**
 * Route Definition
 */
export interface RouteDefinition {
  id: string;
  path: string;
  component: ImportComponent;
  meta?: RouteMeta;
}

/**
 * Internal Route
 */
export interface ManagedRoute {
  id: string;
  path: string;
  Component: LazyExoticComponent<ComponentType<any>>;
  meta?: RouteMeta;
}
