import { Navigate } from "react-router-dom";

import useAuth from "../auth/core/useAuth";

import { type PropsWithChildren } from "react";

export default function ProtectedRoute({
  children,
}: Readonly<PropsWithChildren>) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
