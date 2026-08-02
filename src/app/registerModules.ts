import homeRoutes from "../modules/home/routes";
import dashboardRoutes from "../modules/dashboard/routes";

import { routeRegistry } from "../router";

export function registerModules() {
  routeRegistry.register([...homeRoutes, ...dashboardRoutes]);
}
