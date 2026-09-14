import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
);

const { data: buckets, error: listError } = await supabase.storage.listBuckets();
if (listError) throw listError;

if (buckets.some((b) => b.name === "media")) {
  console.log("Bucket 'media' already exists.");
} else {
  const { error } = await supabase.storage.createBucket("media", {
    public: true,
    fileSizeLimit: "10MB",
  });
  if (error) throw error;
  console.log("Created public bucket 'media'.");
}
