import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-side Supabase client using service role key (bypasses RLS)
// Use this ONLY in API routes (server-side), never expose to client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// If service role key is not set, fall back to anon key (will rely on GRANT permissions)
const key = supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseAdmin: SupabaseClient;

if (supabaseUrl && key) {
    supabaseAdmin = createClient(supabaseUrl, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
} else {
    // Dummy client for builds without Supabase env vars
    supabaseAdmin = createClient(
        "https://placeholder.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYyNjAwMDAwMCwiZXhwIjoxOTQxNTc2MDAwfQ.placeholder",
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}

export { supabaseAdmin };
