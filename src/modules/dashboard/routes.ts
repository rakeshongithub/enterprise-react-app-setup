import DefaultLayout from "../../layouts/DefaultLayout";
import { defineRoute } from "../../router";

const dashboardRoutes = [
  defineRoute({
    id: "dashboard",
    path: "/dashboard",
    component: () => import("./DashboardPage"),
    meta: {
      title: "Dashboard",
      breadcrumb: "Dashboard",
      layout: DefaultLayout,
      requiresAuth: true,
      permissions: ["dashboard:view"],
      nav: {
        label: "Dashboard",
        order: 2,
      },
    },
  }),
];

export default dashboardRoutes;
