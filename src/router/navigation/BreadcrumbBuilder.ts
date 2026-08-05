import { type Breadcrumb } from './Breadcrumb';
import { type NavigationItem } from './types';

export default class BreadcrumbBuilder {
  build(node: NavigationItem | undefined, lookup: Map<string, NavigationItem>): Breadcrumb[] {
    if (!node) {
      return [];
    }

    const breadcrumbs: Breadcrumb[] = [];

    let current: NavigationItem | undefined = node;

    while (current) {
      breadcrumbs.unshift({
        id: current.id,
        label: current.label,
        path: current.path,
      });

      current = current.parentId ? lookup.get(current.parentId) : undefined;
    }

    return breadcrumbs;
  }
}
