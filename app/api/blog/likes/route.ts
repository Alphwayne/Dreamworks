import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getDb() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const key = serviceKey || anonKey;
    if (!url || !key) {
        console.error("[blog/likes] Missing env vars:", { url: !!url, serviceKey: !!serviceKey, anonKey: !!anonKey });
    }
    return createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}

// GET - get likes count for a post or comment
export async function GET(req: NextRequest) {
    const supabase = getDb();
    const slug = req.nextUrl.searchParams.get("slug");
    const commentId = req.nextUrl.searchParams.get("comment_id");

    if (slug) {
        const { data, error } = await supabase
            .from("blog_likes")
            .select("id")
            .eq("post_slug", slug)
            .is("comment_id", null);

        if (error) {
            console.error("blog_likes GET error:", error.message);
            return NextResponse.json({ likes: 0, _debug: error.message });
        }
        return NextResponse.json({ likes: data?.length || 0 });
    }

    if (commentId) {
        const { data, error } = await supabase
            .from("blog_likes")
            .select("id")
            .eq("comment_id", commentId);

        if (error) {
            console.error("blog_likes GET error:", error.message);
            return NextResponse.json({ likes: 0, _debug: error.message });
        }
        return NextResponse.json({ likes: data?.length || 0 });
    }

    return NextResponse.json({ error: "slug or comment_id required" }, { status: 400 });
}

// POST - toggle like on a post or comment
export async function POST(req: NextRequest) {
    const supabase = getDb();
    const body = await req.json();
    const { post_slug, comment_id, visitor_id } = body;

    if (!visitor_id) {
        return NextResponse.json({ error: "visitor_id required" }, { status: 400 });
    }

    try {
        // Check if already liked
        let query = supabase
            .from("blog_likes")
            .select("id")
            .eq("visitor_id", visitor_id);

        if (comment_id) {
            query = query.eq("comment_id", comment_id);
        } else if (post_slug) {
            query = query.eq("post_slug", post_slug).is("comment_id", null);
        } else {
            return NextResponse.json({ error: "post_slug or comment_id required" }, { status: 400 });
        }

        const { data: existing, error: queryError } = await query;

        if (queryError) {
            console.error("blog_likes query error:", queryError.message, queryError.details, queryError.hint);
            return NextResponse.json({ error: queryError.message, action: "error", _hint: "Check RLS policies or SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
        }

        if (existing && existing.length > 0) {
            // Unlike - remove the like
            const { error: delError } = await supabase.from("blog_likes").delete().eq("id", existing[0].id);
            if (delError) {
                console.error("blog_likes delete error:", delError.message);
                return NextResponse.json({ error: delError.message, action: "error" }, { status: 500 });
            }
            return NextResponse.json({ action: "unliked" });
        } else {
            // Like - add the like
            const { error: insError } = await supabase.from("blog_likes").insert({
                post_slug: post_slug || null,
                comment_id: comment_id || null,
                visitor_id,
                created_at: new Date().toISOString(),
            });
            if (insError) {
                console.error("blog_likes insert error:", insError.message, insError.details, insError.hint);
                return NextResponse.json({ error: insError.message, action: "error" }, { status: 500 });
            }
            return NextResponse.json({ action: "liked" });
        }
    } catch (err: any) {
        console.error("blog_likes unexpected error:", err);
        return NextResponse.json({ error: err.message, action: "error" }, { status: 500 });
    }
}
