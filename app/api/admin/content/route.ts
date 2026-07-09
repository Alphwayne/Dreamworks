import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// GET - Load all content for admin content manager
export async function GET() {
    const results: any = {};

    // Load hero slides from site_content
    const { data: heroData } = await supabaseAdmin
        .from("site_content")
        .select("*")
        .eq("type", "hero_slide")
        .order("order", { ascending: true });

    if (heroData && heroData.length > 0) {
        results.heroSlides = heroData.map((d: any) => ({ ...d.content, id: d.id }));
    } else {
        results.heroSlides = [
            { id: "1", title: "Oraimo Smart Accessories", subtitle: "Smart Life. Simplified.", cta_text: "Shop Oraimo", cta_link: "/brands/oraimo", bg_image: "/dw-oraimo.png", bg_video: "", is_active: true, order: 1 },
            { id: "2", title: "Samsung Galaxy Z Fold7", subtitle: "Unfold the future", cta_text: "Shop Samsung", cta_link: "/brands/samsung", bg_image: "", bg_video: "/Galaxy-Z-Fold7_Home_Hero_PC_1920x1080_LTR.mp4", is_active: true, order: 2 },
        ];
    }

    // Load featured products - if none in site_content, load from products table
    const { data: featuredData } = await supabaseAdmin
        .from("site_content")
        .select("*")
        .eq("type", "featured_product")
        .order("order", { ascending: true });

    if (featuredData && featuredData.length > 0) {
        results.featuredProducts = featuredData.map((d: any) => ({ ...d.content, id: d.id, is_active: true }));
    } else {
        // Auto-load from products table
        const { data: autoFeatured } = await supabaseAdmin
            .from("products")
            .select("id, product_name, slug, image_url, selling_price")
            .eq("is_active", true)
            .not("image_url", "is", null)
            .order("selling_price", { ascending: false })
            .limit(12);
        results.featuredProducts = (autoFeatured || []).map((p: any) => ({ ...p, is_active: true }));
    }

    // Load trending - if none in site_content, load from products (most expensive)
    const { data: trendingData } = await supabaseAdmin
        .from("site_content")
        .select("*")
        .eq("type", "trending_product")
        .order("order", { ascending: true });

    if (trendingData && trendingData.length > 0) {
        results.trendingProducts = trendingData.map((d: any) => ({ ...d.content, id: d.id }));
    } else {
        const { data: autoTrending } = await supabaseAdmin
            .from("products")
            .select("id, product_name, slug, image_url, selling_price")
            .eq("is_active", true)
            .order("selling_price", { ascending: false })
            .limit(8);
        results.trendingProducts = autoTrending || [];
    }

    // Load just launched - if none in site_content, load newest
    const { data: launchedData } = await supabaseAdmin
        .from("site_content")
        .select("*")
        .eq("type", "launched_product")
        .order("order", { ascending: true });

    if (launchedData && launchedData.length > 0) {
        results.launchedProducts = launchedData.map((d: any) => ({ ...d.content, id: d.id }));
    } else {
        const { data: autoLaunched } = await supabaseAdmin
            .from("products")
            .select("id, product_name, slug, image_url, selling_price")
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(5);
        results.launchedProducts = autoLaunched || [];
    }

    // Load config
    const { data: configData } = await supabaseAdmin
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
    const body = await req.json();
    const { heroSlides, featuredProducts, trendingProducts, launchedProducts, config } = body;

    try {
        // Save hero slides
        if (heroSlides) {
            // Delete old hero slides
            await supabaseAdmin.from("site_content").delete().eq("type", "hero_slide");
            for (const slide of heroSlides) {
                await supabaseAdmin.from("site_content").insert({
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
            await supabaseAdmin.from("site_content").delete().eq("type", "featured_product");
            for (let i = 0; i < featuredProducts.length; i++) {
                await supabaseAdmin.from("site_content").insert({
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
            await supabaseAdmin.from("site_content").delete().eq("type", "trending_product");
            for (let i = 0; i < trendingProducts.length; i++) {
                await supabaseAdmin.from("site_content").insert({
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
            await supabaseAdmin.from("site_content").delete().eq("type", "launched_product");
            for (let i = 0; i < launchedProducts.length; i++) {
                await supabaseAdmin.from("site_content").insert({
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
            await supabaseAdmin.from("site_content").upsert({
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
