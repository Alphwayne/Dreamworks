import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const limit = parseInt(searchParams.get("limit") || "24");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    try {
        let query = supabase
            .from("products")
            .select("*", { count: "exact" })
            .eq("is_active", true)
            .order(sortBy, { ascending: sortOrder === "asc" })
            .range(offset, offset + limit - 1);

        if (category) {
            query = query.eq("category", category);
        }

        if (search) {
            query = query.ilike("product_name", `%${search}%`);
        }

        if (brand) {
            query = query.ilike("product_name", `%${brand}%`);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error("[API /products] Error:", error.message);
            return NextResponse.json({ products: [], count: 0, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ products: data || [], count: count || 0 });
    } catch (err: any) {
        console.error("[API /products] Exception:", err.message);
        return NextResponse.json({ products: [], count: 0, error: err.message }, { status: 500 });
    }
}
