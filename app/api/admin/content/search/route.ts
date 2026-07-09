import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// GET - Search products for admin content manager
export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q");
    if (!q) return NextResponse.json({ products: [] });

    const { data, error } = await supabaseAdmin
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
