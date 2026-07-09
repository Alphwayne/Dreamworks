import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getDb() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const key = serviceKey || anonKey;
    if (!url || !key) {
        console.error("[blog/comments] Missing env vars:", { url: !!url, serviceKey: !!serviceKey, anonKey: !!anonKey });
    }
    return createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}

// GET - fetch comments for a blog post
export async function GET(req: NextRequest) {
    const supabase = getDb();
    const slug = req.nextUrl.searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

    const { data, error } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("post_slug", slug)
        .is("parent_id", null)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("blog_comments GET error:", error.message, error.details, error.hint);
        return NextResponse.json({ comments: [], _debug: error.message });
    }

    // Fetch replies for each comment
    const commentIds = (data || []).map((c: any) => c.id);
    let replies: any[] = [];
    if (commentIds.length > 0) {
        const { data: replyData } = await supabase
            .from("blog_comments")
            .select("*")
            .in("parent_id", commentIds)
            .order("created_at", { ascending: true });
        replies = replyData || [];
    }

    // Attach replies to their parent comments
    const commentsWithReplies = (data || []).map((comment: any) => ({
        ...comment,
        replies: replies.filter((r: any) => r.parent_id === comment.id),
    }));

    return NextResponse.json({ comments: commentsWithReplies });
}

// POST - add a new comment or reply
export async function POST(req: NextRequest) {
    const supabase = getDb();
    const body = await req.json();
    const { post_slug, name, content, is_anonymous, parent_id } = body;

    if (!post_slug || !content) {
        return NextResponse.json({ error: "post_slug and content required" }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from("blog_comments")
            .insert({
                post_slug,
                name: is_anonymous ? "Anonymous" : (name || "Guest"),
                content,
                is_anonymous: !!is_anonymous,
                parent_id: parent_id || null,
                likes: 0,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error("blog_comments POST error:", error.message, error.details, error.hint);
            return NextResponse.json({ error: error.message, _hint: "Check RLS policies or SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
        }
        return NextResponse.json({ comment: data });
    } catch (err: any) {
        console.error("blog_comments unexpected error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
