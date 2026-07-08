import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        // Get the product
        const { data: product, error } = await supabase
            .from("products")
            .select("*")
            .eq("slug", slug)
            .eq("is_active", true)
            .single();

        if (error || !product) {
            return NextResponse.json({ product: null, inventory: null, related: [] }, { status: 404 });
        }

        // Get inventory
        const { data: inventory } = await supabase
            .from("inventory")
            .select("*")
            .eq("sku", product.item_code)
            .single();

        // Get related products
        const { data: related } = await supabase
            .from("products")
            .select("*")
            .eq("category", product.category)
            .eq("is_active", true)
            .neq("id", product.id)
            .limit(4);

        return NextResponse.json({
            product,
            inventory: inventory || null,
            related: related || [],
        });
    } catch (err: any) {
        console.error("[API /products/slug] Exception:", err.message);
        return NextResponse.json({ product: null, inventory: null, related: [], error: err.message }, { status: 500 });
    }
}
