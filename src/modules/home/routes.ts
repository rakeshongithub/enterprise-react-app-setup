import { routeRegistry } from "../../router";

routeRegistry.register("/", () => import("./HomePage"));
