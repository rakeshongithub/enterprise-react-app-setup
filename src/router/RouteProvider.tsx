import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../auth";
import RouteManager from "./RouteManager";

export default function RouteProvider() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouteManager />
      </AuthProvider>
    </BrowserRouter>
  );
}
