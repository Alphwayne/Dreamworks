import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;
    const limit = parseInt(searchParams.get("limit") || "200");

    try {
        let query = supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (status && status !== "All") {
            query = query.eq("financial_status", status);
        }

        if (search) {
            query = query.or(`order_number.ilike.%${search}%,email.ilike.%${search}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error("[API /admin/orders] Error:", error.message);
            return NextResponse.json({ orders: [], error: error.message }, { status: 500 });
        }

        return NextResponse.json({ orders: data || [] });
    } catch (err: any) {
        console.error("[API /admin/orders] Exception:", err.message);
        return NextResponse.json({ orders: [], error: err.message }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderNumber, fulfillmentStatus } = body;

        if (!orderNumber || !fulfillmentStatus) {
            return NextResponse.json({ error: "Missing orderNumber or fulfillmentStatus" }, { status: 400 });
        }

        const { error } = await supabase
            .from("orders")
            .update({ fulfillment_status: fulfillmentStatus })
            .eq("order_number", orderNumber);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
