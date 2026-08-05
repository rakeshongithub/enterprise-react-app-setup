import { matchRoutes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { routeRegistry } from '../RouteRegistry';

import useNavigation from './useNavigation';

import createReactRoutes from '../core/createReactRoutes';

export default function useCurrentRoute() {
  const location = useLocation();

  const { routeLookup } = useNavigation();

  const matches = matchRoutes(createReactRoutes(routeRegistry.getDefinitions()), location);

  if (!matches?.length) {
    return undefined;
  }

  const last = matches[matches.length - 1];

  return routeLookup.get(last.route.path!);
}
