import DefaultLayout from "../../layouts/DefaultLayout";
import { defineRoute } from "../../router";

const dashboardRoutes = [
  defineRoute({
    path: "/dashboard",
    component: () => import("./DashboardPage"),
    options: {
      nav: {
        label: "Dashboard",
      },
      layout: {
        Component: DefaultLayout,
      },
      requiresAuth: true,
    },
  }),
];

export default dashboardRoutes;
