import { type PropsWithChildren, useMemo } from 'react';
import NavigationContext from './NavigationContext';
import RouteTreeBuilder from './RouteTreeBuilder';
import { routeRegistry } from '../RouteRegistry';

export default function NavigationProvider({ children }: Readonly<PropsWithChildren>) {
  const navigation = useMemo(() => {
    return new RouteTreeBuilder().build(routeRegistry.getRoutes());
  }, []);

  return <NavigationContext.Provider value={navigation}>{children}</NavigationContext.Provider>;
}
