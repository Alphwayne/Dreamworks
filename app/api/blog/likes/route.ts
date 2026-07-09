import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// GET - get likes count for a post or comment
export async function GET(req: NextRequest) {
    const slug = req.nextUrl.searchParams.get("slug");
    const commentId = req.nextUrl.searchParams.get("comment_id");

    if (slug) {
        const { data, error } = await supabaseAdmin
            .from("blog_likes")
            .select("id", { count: "exact" })
            .eq("post_slug", slug)
            .is("comment_id", null);

        if (error) {
            console.error("blog_likes GET error:", error.message);
            return NextResponse.json({ likes: 0, _error: error.message });
        }
        return NextResponse.json({ likes: data?.length || 0 });
    }

    if (commentId) {
        const { data, error } = await supabaseAdmin
            .from("blog_likes")
            .select("id", { count: "exact" })
            .eq("comment_id", commentId);

        if (error) {
            console.error("blog_likes GET error:", error.message);
            return NextResponse.json({ likes: 0, _error: error.message });
        }
        return NextResponse.json({ likes: data?.length || 0 });
    }

    return NextResponse.json({ error: "slug or comment_id required" }, { status: 400 });
}

// POST - toggle like on a post or comment
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { post_slug, comment_id, visitor_id } = body;

    if (!visitor_id) {
        return NextResponse.json({ error: "visitor_id required" }, { status: 400 });
    }

    // Check if already liked
    let query = supabaseAdmin
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
        console.error("blog_likes query error:", queryError.message);
        return NextResponse.json({ error: queryError.message, action: "error" }, { status: 500 });
    }

    if (existing && existing.length > 0) {
        // Unlike - remove the like
        const { error: delError } = await supabaseAdmin.from("blog_likes").delete().eq("id", existing[0].id);
        if (delError) {
            return NextResponse.json({ error: delError.message, action: "error" }, { status: 500 });
        }
        return NextResponse.json({ action: "unliked" });
    } else {
        // Like - add the like
        const { error: insError } = await supabaseAdmin.from("blog_likes").insert({
            post_slug: post_slug || null,
            comment_id: comment_id || null,
            visitor_id,
            created_at: new Date().toISOString(),
        });
        if (insError) {
            return NextResponse.json({ error: insError.message, action: "error" }, { status: 500 });
        }
        return NextResponse.json({ action: "liked" });
    }
}
