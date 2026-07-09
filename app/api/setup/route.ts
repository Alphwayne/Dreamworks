import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST - Create required tables if they don't exist
export async function POST() {
    const results: string[] = [];

    // Try to create blog_comments table
    const { error: commentsError } = await supabase.rpc("exec_sql", {
        sql: `
            CREATE TABLE IF NOT EXISTS blog_comments (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                post_slug TEXT NOT NULL,
                name TEXT DEFAULT 'Guest',
                content TEXT NOT NULL,
                is_anonymous BOOLEAN DEFAULT false,
                parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
                likes INTEGER DEFAULT 0,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `,
    });

    if (commentsError) {
        // If rpc doesn't exist, try direct SQL via REST
        results.push(`blog_comments: ${commentsError.message}`);
    } else {
        results.push("blog_comments: OK");
    }

    // Try to create blog_likes table
    const { error: likesError } = await supabase.rpc("exec_sql", {
        sql: `
            CREATE TABLE IF NOT EXISTS blog_likes (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                post_slug TEXT,
                comment_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
                visitor_id TEXT NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(post_slug, visitor_id, comment_id)
            );
        `,
    });

    if (likesError) {
        results.push(`blog_likes: ${likesError.message}`);
    } else {
        results.push("blog_likes: OK");
    }

    // Try to create site_content table
    const { error: contentError } = await supabase.rpc("exec_sql", {
        sql: `
            CREATE TABLE IF NOT EXISTS site_content (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                content JSONB,
                "order" INTEGER DEFAULT 0,
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `,
    });

    if (contentError) {
        results.push(`site_content: ${contentError.message}`);
    } else {
        results.push("site_content: OK");
    }

    return NextResponse.json({ results, note: "If rpc exec_sql is not available, create tables manually in Supabase SQL editor." });
}

// GET - Check table status
export async function GET() {
    const tables: Record<string, string> = {};

    const { error: e1 } = await supabase.from("blog_comments").select("id").limit(1);
    tables.blog_comments = e1 ? `Error: ${e1.message}` : "OK";

    const { error: e2 } = await supabase.from("blog_likes").select("id").limit(1);
    tables.blog_likes = e2 ? `Error: ${e2.message}` : "OK";

    const { error: e3 } = await supabase.from("site_content").select("id").limit(1);
    tables.site_content = e3 ? `Error: ${e3.message}` : "OK";

    return NextResponse.json({ tables });
}
