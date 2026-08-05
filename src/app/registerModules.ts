import homeRoutes from '../modules/home/routes';
import dashboardRoutes from '../modules/dashboard/routes';

import { routeRegistry } from '../router';
import rolesRoutes from '../modules/roles/route';
import usersRoutes from '../modules/users/route';
import userDetailsRoutes from '../modules/userDetails/route';

export function registerModules() {
  routeRegistry.register([
    ...homeRoutes,
    ...dashboardRoutes,
    ...rolesRoutes,
    ...usersRoutes,
    ...userDetailsRoutes,
  ]);
}
