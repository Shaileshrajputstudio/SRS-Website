import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-side read client using the publishable key — respects Row Level
// Security (public read-only on content tables), used by every
// public-facing page's data fetching. Admin write operations use
// supabaseAdmin (the secret key) instead, in src/app/admin/*.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);
