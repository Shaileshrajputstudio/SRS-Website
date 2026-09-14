import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only client using the secret key, which bypasses Row Level
// Security entirely. Used by admin actions and public data-fetching code
// that reads with elevated access — never import this from a "use
// client" component.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);
