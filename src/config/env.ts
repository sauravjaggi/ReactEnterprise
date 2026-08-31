// Centralized, validated access to environment variables.
// Fails loudly at startup instead of with a cryptic runtime error later.

function requireEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Check your .env file.`,
    );
  }
  return value;
}

export const env = {
  supabaseUrl: requireEnv("VITE_SUPABASE_URL"),
  supabaseAnonKey: requireEnv("VITE_SUPABASE_PUBLISHABLE_KEY"),
};
