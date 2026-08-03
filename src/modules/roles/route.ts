import DefaultLayout from "../../layouts/DefaultLayout";
import { defineRoute } from "../../router";

const rolesRoutes = [
  defineRoute({
    id: "roles",
    path: "/roles",
    component: () => import("./RolesPage"),
    meta: {
      title: "Roles",
      breadcrumb: "Roles",
      layout: DefaultLayout,
      requiresAuth: true,
      permissions: ["roles:view"],
      nav: {
        label: "Roles",
        order: 1,
        hierarchy: ["Administration"],
      },
    },
  }),
];

export default rolesRoutes;
