import { type PropsWithChildren, useEffect, useMemo, useState } from "react";

import { AuthContext } from "./AuthContext";

import AuthService from "./AuthService";

import { type AuthState } from "./types";

export default function AuthProvider({
  children,
}: Readonly<PropsWithChildren>) {
  const manager = AuthService.getManager();

  const [state, setState] = useState<AuthState>(manager.getState());

  useEffect(() => {
    return manager.subscribe(setState);
  }, [manager]);

  const value = useMemo(() => ({ state, manager }), [state, manager]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
