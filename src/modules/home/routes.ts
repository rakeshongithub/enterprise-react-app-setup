import DefaultLayout from "../../layouts/DefaultLayout";
import { defineRoute } from "../../router";

const homeRoutes = [
  defineRoute({
    path: "/",
    component: () => import("./HomePage"),
    options: {
      nav: {
        label: "Home",
      },
      layout: {
        Component: DefaultLayout,
      },
    },
  }),
];

export default homeRoutes;
