import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../auth/AuthContext";

// Central place to stack app-wide providers (Auth, Redux, Theme, etc.)
// as the app grows, instead of nesting them inline in main.tsx.
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
}
