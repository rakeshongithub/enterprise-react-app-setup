import { type NavigationItem } from './types';

export interface NavigationState {
  tree: NavigationItem[];

  lookup: Map<string, NavigationItem>;

  routeLookup: Map<string, NavigationItem>;
}
