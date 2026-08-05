import DefaultLayout from '../../layouts/DefaultLayout';
import { defineRoute } from '../../router';

const userDetailsRoutes = [
  defineRoute({
    id: 'userDetails',
    path: '/users/:id',
    component: () => import('./UserDetails'),
    meta: {
      title: 'User',
      breadcrumb: 'User',
      layout: DefaultLayout,
      requiresAuth: true,
      permissions: ['users:view'],
      nav: {
        label: 'User',
        // order: 2,
        // hierarchy: ["Administration"],
      },
    },
  }),
];

export default userDetailsRoutes;
