import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const showInactive = searchParams.get("showInactive") === "true";

    try {
        let query = supabase
            .from("products")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (!showInactive) {
            query = query.eq("is_active", true);
        }

        if (category) {
            query = query.eq("category", category);
        }

        if (search) {
            query = query.ilike("product_name", `%${search}%`);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error("[API /admin/products] GET Error:", error.message);
            return NextResponse.json({ products: [], count: 0, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ products: data || [], count: count || 0 });
    } catch (err: any) {
        console.error("[API /admin/products] GET Exception:", err.message);
        return NextResponse.json({ products: [], count: 0, error: err.message }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        // Only allow specific fields to be updated
        const allowedFields = [
            "product_name",
            "selling_price",
            "compare_price",
            "category",
            "description",
            "image_url",
            "is_active",
            "item_code",
            "slug",
        ];

        const sanitizedUpdates: Record<string, any> = {};
        for (const key of allowedFields) {
            if (key in updates) {
                sanitizedUpdates[key] = updates[key];
            }
        }

        if (Object.keys(sanitizedUpdates).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("products")
            .update(sanitizedUpdates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("[API /admin/products] PATCH Error:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ product: data });
    } catch (err: any) {
        console.error("[API /admin/products] PATCH Exception:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        // Soft delete - set is_active to false
        const { error } = await supabase
            .from("products")
            .update({ is_active: false })
            .eq("id", id);

        if (error) {
            console.error("[API /admin/products] DELETE Error:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("[API /admin/products] DELETE Exception:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
