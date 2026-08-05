import DefaultLayout from '../../layouts/DefaultLayout';
import { defineRoute } from '../../router';

const homeRoutes = [
  defineRoute({
    id: 'home',
    path: '/',
    component: () => import('./HomePage'),
    meta: {
      title: 'Home',
      breadcrumb: 'Home',
      layout: DefaultLayout,
      requiresAuth: true,
      permissions: ['home:view'],
      nav: {
        label: 'Home',
        order: 0,
        hierarchy: ['General'],
      },
    },
  }),
];

export default homeRoutes;
