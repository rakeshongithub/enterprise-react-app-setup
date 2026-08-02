import DefaultLayout from "../../layouts/DefaultLayout";
import { routeRegistry } from "../../router";

routeRegistry.register("/dashboard", () => import("./DashboardPage"), {
  layout: {
    Component: DefaultLayout,
  },
  nav: {
    label: "Dashboard",
  },
});
