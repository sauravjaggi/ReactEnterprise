import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { routeConfig } from "./routeConfig";

export function AppRoutes() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        {routeConfig.map(
          ({ path, element, protected: isProtected, allowedRoles }) => (
            <Route
              key={path}
              path={path}
              element={
                isProtected ? (
                  <ProtectedRoute allowedRoles={allowedRoles}>
                    {element}
                  </ProtectedRoute>
                ) : (
                  element
                )
              }
            />
          ),
        )}
      </Routes>
    </Suspense>
  );
}
