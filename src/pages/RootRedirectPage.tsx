import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// Handles the "/" route specifically. Not lazy-loaded like other pages —
// this is the very first thing that needs to run on app boot (including
// right after a magic-link redirect lands back on "/"), so there's no
// benefit to code-splitting it separately.
export function RootRedirectPage() {
  const { claims, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return claims ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}
