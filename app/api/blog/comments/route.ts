import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// GET - fetch comments for a blog post
export async function GET(req: NextRequest) {
    const slug = req.nextUrl.searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

    const { data, error } = await supabaseAdmin
        .from("blog_comments")
        .select("*")
        .eq("post_slug", slug)
        .is("parent_id", null)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("blog_comments GET error:", error.message);
        return NextResponse.json({ comments: [], _error: error.message });
    }

    // Fetch replies for each comment
    const commentIds = (data || []).map((c: any) => c.id);
    let replies: any[] = [];
    if (commentIds.length > 0) {
        const { data: replyData } = await supabaseAdmin
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
    const body = await req.json();
    const { post_slug, name, content, is_anonymous, parent_id } = body;

    if (!post_slug || !content) {
        return NextResponse.json({ error: "post_slug and content required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
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
        console.error("blog_comments POST error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ comment: data });
}
