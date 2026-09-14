import { createClient } from "@supabase/supabase-js";

// Browser-side client using the publishable key (safe to expose — it can
// only do what the RLS policies allow, which is public read on content
// tables and nothing on admin_settings). Used for direct-to-storage image
// uploads from the admin UI, bypassing Next.js server actions entirely —
// Vercel's serverless functions have a hard, non-configurable 4.5MB
// request-body limit, and real product photography routinely exceeds
// that (see the SRS Catalogue project's own fix for the identical bug).
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);
