/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type ComponentType,
  type LazyExoticComponent,
  type ReactNode,
} from "react";

export interface RouteModule {
  default: ComponentType<any>;
}

export type ImportComponent = () => Promise<RouteModule>;

export interface NavOptions {
  label: string;
  icon?: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LayoutProps {}

export interface LayoutOptions {
  Component?: ComponentType<any>;
  propsFactory?: () => LayoutProps;
}

export interface RouteOptions {
  nav?: NavOptions;
  layout?: LayoutOptions;
  requiresAuth?: boolean;
  permissions?: string[];
  roles?: string[];
}

export interface ManagedRoute {
  path: string;
  Component: LazyExoticComponent<ComponentType<any>>;
  options?: RouteOptions;
}
