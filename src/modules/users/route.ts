import DefaultLayout from "../../layouts/DefaultLayout";
import { defineRoute } from "../../router";

const usersRoutes = [
  defineRoute({
    id: "users",
    path: "/users",
    component: () => import("./UsersPage"),
    meta: {
      title: "Users",
      breadcrumb: "Users",
      layout: DefaultLayout,
      requiresAuth: true,
      permissions: ["users:view"],
      nav: {
        label: "Users",
        order: 2,
        hierarchy: ["Administration"],
      },
    },
  }),
];

export default usersRoutes;
