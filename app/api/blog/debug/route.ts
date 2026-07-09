import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Debug endpoint to check blog table access
// Visit /api/blog/debug to see what's happening
export async function GET() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    const debug: any = {
        env: {
            NEXT_PUBLIC_SUPABASE_URL: url ? `${url.slice(0, 30)}...` : "NOT SET",
            SUPABASE_SERVICE_ROLE_KEY: serviceKey ? `SET (${serviceKey.slice(0, 10)}...)` : "NOT SET",
            NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey ? `SET (${anonKey.slice(0, 10)}...)` : "NOT SET",
            using_key: serviceKey ? "SERVICE_ROLE" : (anonKey ? "ANON" : "NONE"),
        },
        tests: {},
    };

    const key = serviceKey || anonKey;
    if (!url || !key) {
        debug.error = "Missing Supabase URL or key";
        return NextResponse.json(debug);
    }

    const supabase = createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    // Test 1: Can we read blog_likes?
    const { data: likesData, error: likesError } = await supabase
        .from("blog_likes")
        .select("id")
        .limit(1);
    debug.tests.blog_likes_read = likesError ? { error: likesError.message, code: likesError.code } : { success: true, count: likesData?.length };

    // Test 2: Can we read blog_comments?
    const { data: commentsData, error: commentsError } = await supabase
        .from("blog_comments")
        .select("id")
        .limit(1);
    debug.tests.blog_comments_read = commentsError ? { error: commentsError.message, code: commentsError.code } : { success: true, count: commentsData?.length };

    // Test 3: Can we insert into blog_likes?
    const testId = "debug_test_" + Date.now();
    const { error: insertError } = await supabase
        .from("blog_likes")
        .insert({ post_slug: "test", visitor_id: testId, created_at: new Date().toISOString() });
    debug.tests.blog_likes_insert = insertError ? { error: insertError.message, code: insertError.code } : { success: true };

    // Clean up test insert
    if (!insertError) {
        await supabase.from("blog_likes").delete().eq("visitor_id", testId);
    }

    // Test 4: Can we insert into blog_comments?
    const { data: commentInsert, error: commentInsertError } = await supabase
        .from("blog_comments")
        .insert({ post_slug: "test", name: "Debug", content: "test", created_at: new Date().toISOString() })
        .select()
        .single();
    debug.tests.blog_comments_insert = commentInsertError ? { error: commentInsertError.message, code: commentInsertError.code } : { success: true };

    // Clean up test comment
    if (commentInsert) {
        await supabase.from("blog_comments").delete().eq("id", commentInsert.id);
    }

    // Test 5: Can we read products?
    const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("id")
        .limit(1);
    debug.tests.products_read = productsError ? { error: productsError.message, code: productsError.code } : { success: true, count: productsData?.length };

    return NextResponse.json(debug, { status: 200 });
}
