import { BrowserRouter } from "react-router-dom";
import RouteManager from "./RouteManager";

export default function RouteProvider() {
  return (
    <BrowserRouter>
      <RouteManager />
    </BrowserRouter>
  );
}
