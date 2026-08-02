import { registerModules } from "./registerModules";
import { RouteProvider } from "../router";

registerModules();

export default function AppRouter() {
  return <RouteProvider />;
}
