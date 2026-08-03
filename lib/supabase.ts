import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Supabase is used for: blog, DreamPoints, admin, chatbot product search
// Products/cart/checkout now use Shopify Storefront API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    // Create a dummy client that won't crash but won't work either
    // This allows the build to succeed even without Supabase env vars
    supabase = createClient(
        "https://placeholder.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MjYwMDAwMDAsImV4cCI6MTk0MTU3NjAwMH0.placeholder"
    );
    if (typeof window !== "undefined") {
        console.warn("[Supabase] ENV VARS not set — Supabase features (blog, DreamPoints, admin) will not work.");
    }
}

export { supabase };