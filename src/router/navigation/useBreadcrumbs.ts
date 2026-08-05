import { useMemo } from 'react';
import useNavigation from './useNavigation';
import useCurrentRoute from './useCurrentRoute';
import BreadcrumbBuilder from './BreadcrumbBuilder';

export default function useBreadcrumbs() {
  const current = useCurrentRoute();

  const { lookup } = useNavigation();

  return useMemo(() => {
    return new BreadcrumbBuilder().build(current, lookup);
  }, [current, lookup]);
}
