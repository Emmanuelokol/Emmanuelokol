import { createClient, SupabaseClient } from "@supabase/supabase-js";

console.log("[supabase] Module initializing...");

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

let supabase: SupabaseClient;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("[supabase] Client created with real credentials");
  } else {
    console.warn(
      "[supabase] URL or anon key is missing. Auth features will not work. " +
        "Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
    supabase = createClient(
      "https://placeholder.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder"
    );
    console.log("[supabase] Placeholder client created (no env vars)");
  }
} catch (e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("[supabase] CRASH during createClient:", msg);
  // Last-resort fallback — create an inert client so imports don't throw
  supabase = createClient(
    "https://placeholder.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder"
  );
}

console.log("[supabase] Module init complete");

export { supabase };
