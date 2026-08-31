import { useAuth } from "../auth/AuthContext";

export function DashboardPage() {
  const { claims, role, signOut } = useAuth();

  return (
    <div>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1>Dashboard</h1>
          <p>
            Logged in as {claims?.email} ({role})
          </p>
        </div>
        <button onClick={signOut}>Sign out</button>
      </header>
    </div>
  );
}
