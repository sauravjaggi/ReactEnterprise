// Single source of truth for every Supabase table/view name used in the app.
// Feature api files (e.g. features/orders/api/ordersApi.ts) import from here
// instead of hardcoding string literals — avoids typos and makes every table
// this app touches visible in one place.
//
// To add a new feature backed by a new table:
//   1. Add the table name here
//   2. Add RLS policies for it in Supabase (SQL Editor)
//   3. Create features/<name>/api/<name>Api.ts referencing TABLES.<NAME>

export const TABLES = {
  PROFILES: "profiles",
} as const;
