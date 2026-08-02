import DefaultLayout from "../../layouts/DefaultLayout";
import { defineRoute } from "../../router";

const homeRoutes = [
  defineRoute({
    id: "home",
    path: "/",
    component: () => import("./HomePage"),
    meta: {
      title: "Home",
      breadcrumb: "Home",
      layout: DefaultLayout,
      nav: {
        label: "Home",
        order: 1,
      },
    },
  }),
];

export default homeRoutes;
