import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { Role } from "./types";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: Role[];
};

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { claims, role, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!claims) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
