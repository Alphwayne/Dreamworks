import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create a robust server-side client - tries service role key first, falls back to anon
function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const key = serviceKey || anonKey;

    return createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}

// GET - Load all content for admin content manager
export async function GET() {
    const supabase = getSupabaseAdmin();
    const results: any = {};

    // Load hero slides from site_content
    const { data: heroData } = await supabase
        .from("site_content")
        .select("*")
        .eq("type", "hero_slide")
        .order("order", { ascending: true });

    if (heroData && heroData.length > 0) {
        results.heroSlides = heroData.map((d: any) => ({ ...d.content, id: d.id }));
    } else {
        // Default hero slides matching the actual HeroSlider component
        results.heroSlides = [
            { id: "1", title: "Oraimo Smart Accessories", cta_text: "Shop Oraimo", cta_link: "/brands/oraimo", bg_image: "/dw-oraimo.png", bg_video: "", is_active: true, order: 1 },
            { id: "2", title: "LG Premium Electronics", cta_text: "Shop LG", cta_link: "/brands/lg", bg_image: "/dw-lg.png", bg_video: "", is_active: true, order: 2 },
            { id: "3", title: "Hisense World Cup Edition", cta_text: "Shop Hisense", cta_link: "/brands/hisense", bg_image: "/dw-hisensecup.png", bg_video: "", is_active: true, order: 3 },
        ];
    }

    // Load featured products - uses interleaved multi-category logic (same as homepage getCatchyProducts)
    const { data: featuredData } = await supabase
        .from("site_content")
        .select("*")
        .eq("type", "featured_product")
        .order("order", { ascending: true });

    if (featuredData && featuredData.length > 0) {
        results.featuredProducts = featuredData.map((d: any) => ({ ...d.content, id: d.id, is_active: true }));
    } else {
        // Interleave from multiple categories (matches homepage Featured Strip logic)
        const categories = [
            "COMPUTING ACCESSORIES", "MOBILE & TABLET", "CONSUMER ELECTRONICS",
            "ENTERPRISE", "ACCESSORIES", "POWER", "APPLE",
        ];
        const catResults = await Promise.all(
            categories.map((cat) =>
                supabase
                    .from("products")
                    .select("id, product_name, slug, image_url, selling_price, category")
                    .eq("category", cat)
                    .eq("is_active", true)
                    .not("image_url", "is", null)
                    .order("selling_price", { ascending: false })
                    .limit(2)
                    .then(({ data }) => data || [])
            )
        );
        // Interleave products from different categories
        const mixed: any[] = [];
        const maxLen = Math.max(...catResults.map((r) => r.length), 0);
        for (let i = 0; i < maxLen; i++) {
            for (const arr of catResults) {
                if (arr[i]) mixed.push(arr[i]);
            }
        }
        results.featuredProducts = mixed.slice(0, 14).map((p: any) => ({ ...p, is_active: true }));
    }

    // Load trending - if none in site_content, load most expensive products (same as homepage)
    const { data: trendingData } = await supabase
        .from("site_content")
        .select("*")
        .eq("type", "trending_product")
        .order("order", { ascending: true });

    if (trendingData && trendingData.length > 0) {
        results.trendingProducts = trendingData.map((d: any) => ({ ...d.content, id: d.id }));
    } else {
        // Get IDs already used in featured to avoid duplicates
        const featuredIds = (results.featuredProducts || []).map((p: any) => p.id);
        const { data: autoTrending } = await supabase
            .from("products")
            .select("id, product_name, slug, image_url, selling_price, category")
            .eq("is_active", true)
            .not("image_url", "is", null)
            .order("selling_price", { ascending: false })
            .limit(20);
        // Filter out products already in featured strip
        const filtered = (autoTrending || []).filter((p: any) => !featuredIds.includes(p.id));
        results.trendingProducts = filtered.slice(0, 8);
    }

    // Load just launched - if none in site_content, load newest
    const { data: launchedData } = await supabase
        .from("site_content")
        .select("*")
        .eq("type", "launched_product")
        .order("order", { ascending: true });

    if (launchedData && launchedData.length > 0) {
        results.launchedProducts = launchedData.map((d: any) => ({ ...d.content, id: d.id }));
    } else {
        const { data: autoLaunched } = await supabase
            .from("products")
            .select("id, product_name, slug, image_url, selling_price, category, created_at")
            .eq("is_active", true)
            .not("image_url", "is", null)
            .order("created_at", { ascending: false })
            .limit(5);
        results.launchedProducts = autoLaunched || [];
    }

    // Load config
    const { data: configData } = await supabase
        .from("site_content")
        .select("content")
        .eq("type", "site_config")
        .single();

    if (configData) {
        results.config = configData.content;
    }

    return NextResponse.json(results);
}

// POST - Save content from admin
export async function POST(req: NextRequest) {
    const supabase = getSupabaseAdmin();
    const body = await req.json();
    const { heroSlides, featuredProducts, trendingProducts, launchedProducts, config } = body;

    try {
        // Save hero slides
        if (heroSlides) {
            await supabase.from("site_content").delete().eq("type", "hero_slide");
            for (const slide of heroSlides) {
                await supabase.from("site_content").insert({
                    id: slide.id || `slide_${Date.now()}_${Math.random().toString(36).slice(2)}`,
                    type: "hero_slide",
                    content: slide,
                    order: slide.order || 0,
                    updated_at: new Date().toISOString(),
                });
            }
        }

        // Save featured products
        if (featuredProducts) {
            await supabase.from("site_content").delete().eq("type", "featured_product");
            for (let i = 0; i < featuredProducts.length; i++) {
                await supabase.from("site_content").insert({
                    id: `featured_${Date.now()}_${i}`,
                    type: "featured_product",
                    content: featuredProducts[i],
                    order: i,
                    updated_at: new Date().toISOString(),
                });
            }
        }

        // Save trending products
        if (trendingProducts) {
            await supabase.from("site_content").delete().eq("type", "trending_product");
            for (let i = 0; i < trendingProducts.length; i++) {
                await supabase.from("site_content").insert({
                    id: `trending_${Date.now()}_${i}`,
                    type: "trending_product",
                    content: trendingProducts[i],
                    order: i,
                    updated_at: new Date().toISOString(),
                });
            }
        }

        // Save just launched products
        if (launchedProducts) {
            await supabase.from("site_content").delete().eq("type", "launched_product");
            for (let i = 0; i < launchedProducts.length; i++) {
                await supabase.from("site_content").insert({
                    id: `launched_${Date.now()}_${i}`,
                    type: "launched_product",
                    content: launchedProducts[i],
                    order: i,
                    updated_at: new Date().toISOString(),
                });
            }
        }

        // Save config
        if (config) {
            await supabase.from("site_content").upsert({
                id: "site_config",
                type: "site_config",
                content: config,
                updated_at: new Date().toISOString(),
            });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Save content error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
