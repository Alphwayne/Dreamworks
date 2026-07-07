import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Debug: log if env vars are missing (only in development)
if (typeof window !== "undefined" && (!supabaseUrl || !supabaseAnonKey)) {
    console.error("[Supabase] MISSING ENV VARS!", {
        url: supabaseUrl ? "✓ set" : "✗ MISSING",
        key: supabaseAnonKey ? `✓ set (${supabaseAnonKey.slice(0, 20)}...)` : "✗ MISSING",
    });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);