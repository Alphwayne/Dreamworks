import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ACTION_POINTS: Record<string, number> = {
    signup: 50000,
    instagram_follow: 20000,
    tiktok_follow: 20000,
};

export async function POST(req: NextRequest) {
    try {
        const { user_id, action } = await req.json();
        if (!user_id || !action) {
            return NextResponse.json({ error: "user_id and action required" }, { status: 400 });
        }

        const points = ACTION_POINTS[action];
        if (!points) return NextResponse.json({ error: "Invalid action" }, { status: 400 });

        // Check if already awarded for this action
        const { data: existing } = await supabase
            .from("dreampoints")
            .select("id")
            .eq("user_id", user_id)
            .eq("action", action)
            .maybeSingle();

        if (existing) {
            return NextResponse.json({ message: "Already awarded for this action" });
        }

        const { error } = await supabase.from("dreampoints").insert({
            user_id,
            points,
            action,
            expires_at: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        });

        if (error) throw error;

        return NextResponse.json({ success: true, points });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}