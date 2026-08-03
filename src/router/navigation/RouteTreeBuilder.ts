import type { ManagedRoute } from "../types";
import type { RouteInfo } from "../core/RouteInfo";
import type { NavigationItem } from "./types";
import type { NavigationState } from "./NavigationState";

export default class RouteTreeBuilder {
  build(routes: ManagedRoute[]): NavigationState {
    const root: NavigationItem[] = [];

    const lookup = new Map<string, NavigationItem>();

    const routeLookup = new Map<string, NavigationItem>();

    routes
      .filter((route) => route.meta?.nav?.visible !== false)
      .forEach((route) => {
        const hierarchy = route.meta?.nav?.hierarchy ?? [];

        let current = root;

        let parentId: string | undefined;

        hierarchy.forEach((group, index) => {
          const groupId = `navigation-${hierarchy
            .slice(0, index + 1)
            .join("-")
            .toLowerCase()}`;

          let node = current.find((x) => x.id === groupId);

          if (!node) {
            node = {
              id: groupId,

              label: group,

              order: 0,

              level: index,

              isGroup: true,

              parentId,

              children: [],
            };

            current.push(node);

            lookup.set(groupId, node);
          }

          parentId = groupId;

          current = node.children;
        });

        const routeInfo: RouteInfo = {
          id: route.id,
          path: route.path,
          meta: route.meta,
        };

        const pageNode: NavigationItem = {
          id: route.id,

          label: route.meta?.nav?.label ?? route.meta?.title ?? route.id,

          path: route.path,

          icon: route.meta?.nav?.icon,

          order: route.meta?.nav?.order ?? 999,

          level: hierarchy.length,

          isGroup: false,

          parentId,

          children: [],

          route: routeInfo,
        };

        current.push(pageNode);

        lookup.set(pageNode.id, pageNode);

        routeLookup.set(route.path, pageNode);
      });

    this.sort(root);

    return {
      tree: root,
      lookup,
      routeLookup,
    };
  }

  private sort(nodes: NavigationItem[]) {
    nodes.sort((a, b) => a.order - b.order);

    nodes.forEach((node) => this.sort(node.children));
  }
}
