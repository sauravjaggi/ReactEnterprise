import { lazy, type ReactNode } from "react";
import type { Role } from "../auth/types";
import { RootRedirectPage } from "../pages/RootRedirectPage";

// React.lazy() defers downloading each page's JS (and everything it
// statically imports — components, hooks, and via ordersSlice's
// self-registration, its Redux slice) until that route is actually visited.
const LoginPage = lazy(() =>
  import("../pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const UnauthorizedPage = lazy(() =>
  import("../pages/UnauthorizedPage").then((m) => ({
    default: m.UnauthorizedPage,
  })),
);
const DashboardPage = lazy(() =>
  import("../pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const AdminPage = lazy(() =>
  import("../pages/AdminPage").then((m) => ({ default: m.AdminPage })),
);

export type RouteConfig = {
  path: string;
  element: ReactNode;
  protected?: boolean;
  allowedRoles?: Role[];
};

// Single source of truth for every route in the app. To add a new page:
//   1. Create the page component in src/pages/
//   2. Add a lazy() import above
//   3. Add one entry here — routes.tsx maps over this array automatically
export const routeConfig: RouteConfig[] = [
  {
    path: "/",
    element: <RootRedirectPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    protected: true,
  },
  {
    path: "/admin",
    element: <AdminPage />,
    protected: true,
    allowedRoles: ["admin"],
  },
];
