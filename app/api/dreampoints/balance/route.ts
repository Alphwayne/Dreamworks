import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
    try {
        const userId = req.nextUrl.searchParams.get("user_id");
        if (!userId) return NextResponse.json({ error: "user_id required" }, { status: 400 });
        const { data, error } = await supabase
            .from("dreampoints")
            .select("points, expires_at")
            .eq("user_id", userId)
            .gt("expires_at", new Date().toISOString());
        if (error) throw error;
        const balance = (data || []).reduce((sum, row) => sum + row.points, 0);
        return NextResponse.json({ balance, history: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}