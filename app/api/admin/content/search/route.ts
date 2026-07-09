import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const key = serviceKey || anonKey;
    return createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}

// GET - Search products for admin content manager
export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q");
    if (!q) return NextResponse.json({ products: [] });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
        .from("products")
        .select("id, product_name, slug, image_url, selling_price")
        .ilike("product_name", `%${q}%`)
        .limit(10);

    if (error) {
        console.error("Product search error:", error.message);
        return NextResponse.json({ products: [], _error: error.message });
    }

    return NextResponse.json({ products: data || [] });
}
