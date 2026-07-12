import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const limit = parseInt(searchParams.get("limit") || "200");

    try {
        let query = supabase
            .from("customers")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (search) {
            query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error("[API /admin/customers] Error:", error.message);
            return NextResponse.json({ customers: [], error: error.message }, { status: 500 });
        }

        return NextResponse.json({ customers: data || [] });
    } catch (err: any) {
        console.error("[API /admin/customers] Exception:", err.message);
        return NextResponse.json({ customers: [], error: err.message }, { status: 500 });
    }
}
