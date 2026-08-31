import { Link } from "react-router-dom";

export function UnauthorizedPage() {
  return (
    <div>
      <h1>Unauthorized</h1>
      <p>You don't have permission to view this page.</p>
      <Link to="/dashboard">Back to dashboard</Link>
    </div>
  );
}
