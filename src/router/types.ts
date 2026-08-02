/* eslint-disable @typescript-eslint/no-explicit-any */
import { type LazyExoticComponent, type ComponentType } from "react";

export interface RouteModule {
  default: ComponentType<any>;
}

export interface NavOptions {
  label: string;
  icon?: React.ReactNode;
}

export interface LayoutOptions {
  Component?: ComponentType<any>;
}

export interface RouteOptions {
  nav?: NavOptions;
  layout?: LayoutOptions;
}

export interface ManagedRoute {
  path: string;
  Component: LazyExoticComponent<ComponentType<any>>;
  options?: RouteOptions;
}

export type ImportComponent = () => Promise<RouteModule>;
