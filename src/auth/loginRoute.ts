import { defineRoute } from "../router";

const loginPageRoutes = [
  defineRoute({
    id: "login",
    path: "/login",
    component: () => import("./LoginPage"),
    meta: {
      title: "Login",
    },
  }),
];

export default loginPageRoutes;
