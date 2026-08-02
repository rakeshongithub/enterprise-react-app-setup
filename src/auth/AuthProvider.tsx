import { type PropsWithChildren, useMemo, useState } from "react";

import { AuthContext } from "./AuthContext";

// TODOs: Later we'll integrate MSAL/Keycloak/Okta/Auth0 without changing the router.
export default function AuthProvider({
  children,
}: Readonly<PropsWithChildren>) {
  const [authenticated, setAuthenticated] = useState(true);

  const value = useMemo(
    () => ({
      isAuthenticated: authenticated,
      user: authenticated
        ? {
            id: "1",
            name: "Rakesh",
            email: "rakesh@test.com",
            permissions: ["dashboard:view"],
            roles: ["Admin"],
          }
        : null,

      login() {
        setAuthenticated(true);
      },

      logout() {
        setAuthenticated(false);
      },
    }),
    [authenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
