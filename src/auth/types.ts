export type Role = "admin" | "client" | "user";

export type Claims = {
  email?: string;
  sub?: string;
  role?: string; // Postgres role (e.g. "authenticated") — not the same as user_role
  user_role?: Role; // custom claim from the access token hook
  aud?: string;
  [key: string]: unknown;
};
