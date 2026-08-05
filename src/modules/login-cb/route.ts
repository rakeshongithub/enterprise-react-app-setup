import { defineRoute } from "../../router";

const loginCbRoutes = [
  defineRoute({
    id: "login-callback",
    path: "/login/callback",
    component: () => import("./LoginCallbackPage"),
    meta: {
      title: "Signing In",
    },
  }),
];

export default loginCbRoutes;
