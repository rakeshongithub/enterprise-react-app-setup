import { type ReactNode } from 'react';
import type { RouteInfo } from '../core/RouteInfo';

export interface NavigationItem {
  id: string;

  label: string;

  path?: string;

  icon?: ReactNode;

  order: number;

  level: number;

  isGroup: boolean;

  /**
   * Parent node id.
   */
  parentId?: string;

  children: NavigationItem[];

  /**
   * Lightweight route information.
   */
  route?: RouteInfo;
}
