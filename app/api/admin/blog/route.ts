import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create supabase client inline to ensure it works regardless of import issues
function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

// The original hardcoded posts - used to seed the database on first load
const SEED_POSTS = [
    {
        title: "The 2026 World Cup Is Becoming a Tech Showcase Disguised as Football",
        slug: "world-cup-2026-tech-showcase",
        excerpt: "The World Cup has always been about football, passion, and national pride. But in 2026, something remarkable is happening — it's quietly becoming the world's biggest technology showcase.",
        content: "Nigeria's tech landscape has evolved dramatically over the past decade. The 2026 World Cup is not just about football — it's a showcase of cutting-edge technology from VAR systems to AI-powered analytics.\n\n## The Tech Behind the Beautiful Game\n\nFrom smart stadiums equipped with 5G connectivity to AI-powered referee assistance, the 2026 World Cup is pushing boundaries.\n\n## What This Means for Nigeria\n\nAs a tech-forward nation, Nigeria is positioned to benefit from these innovations. At Dreamworks Direct, we're bringing you the same cutting-edge technology that powers the world's biggest sporting event.",
        thumbnail: null,
        category: "World Cup",
        author: "Dreamworks Integrated Systems",
        published_at: "2026-06-13",
        read_time: 5,
        is_published: true,
    },
    {
        title: "Why Dreamworks Is Nigeria's Trusted Technology Partner",
        slug: "dreamworks-trusted-technology-partner",
        excerpt: "For over 22 years, Dreamworks has been delivering authentic, quality technology products to Nigerians across the country.",
        content: "Nigeria's tech landscape has evolved dramatically over the past decade, and at the center of this evolution stands Dreamworks Direct — a brand that has been consistently delivering authentic, quality technology for over 22 years.\n\n## Our Story\n\nWhat started as a small technology shop in Lagos has grown into Nigeria's premier destination for premium tech products. We've served over 10,000 customers, processed 750+ orders, and built relationships with the world's leading technology brands.\n\n## Why We Stand Out\n\n**Authenticity Guaranteed** — Every product sold through Dreamworks Direct is 100% genuine.\n\n**Competitive Pricing** — We work directly with manufacturers and authorised distributors.\n\n**Expert Support** — Our team of technology experts is available 24/7.\n\n**Flexible Payment** — With our Dream Now, Pay Later programme, you don't have to wait.",
        thumbnail: null,
        category: "Product News",
        author: "Dreamworks Integrated Systems",
        published_at: "2026-06-06",
        read_time: 4,
        is_published: true,
    },
    {
        title: "Nigeria's No.1 HP Store: Where Buying Tech Is Just the Beginning",
        slug: "dreamworks-no1-hp-store-nigeria",
        excerpt: "As Nigeria's number one authorised HP store, Dreamworks Direct doesn't just sell HP products — we deliver an experience.",
        content: "As Nigeria's number one authorised HP store, Dreamworks Direct doesn't just sell HP products — we deliver an experience that extends far beyond the purchase.\n\n## The HP Advantage\n\nHP is one of the world's most trusted technology brands, and as their authorised partner in Nigeria, we ensure every product comes with full warranty, genuine parts, and expert support.\n\n## Our HP Range\n\nFrom the powerful HP ZBook workstations to the sleek HP Spectre laptops, we carry the full range of HP products designed for every need — whether you're a student, professional, or enterprise.",
        thumbnail: null,
        category: "HP Store",
        author: "Dreamworks Integrated Systems",
        published_at: "2026-06-04",
        read_time: 3,
        is_published: true,
    },
    {
        title: "HP Devices: Technology Designed for the Way You Work and Live",
        slug: "hp-devices-technology-work-live",
        excerpt: "HP has always understood something fundamental: technology should work the way you do, not the other way around.",
        content: "HP has always understood something fundamental: technology should work the way you do, not the other way around.\n\n## Innovation Meets Practicality\n\nEvery HP device is designed with real-world use in mind. From the all-day battery life of the HP EliteBook to the creative power of the HP ENVY series, there's an HP device for every lifestyle.\n\n## Available at Dreamworks Direct\n\nAs Nigeria's authorised HP dealer, we carry the complete range with full manufacturer warranty and expert setup assistance.",
        thumbnail: null,
        category: "HP Store",
        author: "Dreamworks Integrated Systems",
        published_at: "2026-06-10",
        read_time: 4,
        is_published: true,
    },
    {
        title: "Buy One, Get One Free! The Best Tech Deals Right Now",
        slug: "buy-one-get-one-free-deals",
        excerpt: "Some deals help you save money. Others help you get more for your money. The best deals do both.",
        content: "Some deals help you save money. Others help you get more for your money. The best deals do both — and that's exactly what we're offering right now at Dreamworks Direct.\n\n## Current Offers\n\nCheck our Flash Deals section for the latest BOGO offers and limited-time discounts on premium tech products.\n\n## Why Shop With Us\n\nEvery deal at Dreamworks Direct comes with the same guarantee of authenticity, warranty, and expert support that we're known for.",
        thumbnail: null,
        category: "Deals",
        author: "Dreamworks Integrated Systems",
        published_at: "2026-06-23",
        read_time: 2,
        is_published: true,
    },
    {
        title: "Top 5 Smart Home Devices You Need in 2026",
        slug: "top-5-smart-home-devices-2026",
        excerpt: "Transform your home into a smart living space with the latest tech from Dreamworks Direct.",
        content: "Transform your home into a smart living space with the latest tech from Dreamworks Direct. Here are our top 5 picks for 2026.\n\n## 1. Smart Speakers & Displays\n\nControl your entire home with voice commands using the latest smart speakers.\n\n## 2. Smart Security Cameras\n\nKeep your home safe with AI-powered security cameras that can distinguish between people, animals, and vehicles.\n\n## 3. Smart Lighting\n\nSet the mood with smart bulbs that adjust colour and brightness automatically.\n\n## 4. Smart Plugs & Switches\n\nMake any device smart with intelligent plugs that track energy usage.\n\n## 5. Robot Vacuums\n\nLet technology handle the cleaning while you focus on what matters.",
        thumbnail: null,
        category: "Tech Tips",
        author: "Dreamworks Integrated Systems",
        published_at: "2026-05-28",
        read_time: 6,
        is_published: true,
    },
];

// GET - fetch all blog posts, seed if empty
export async function GET() {
    const supabase = getSupabase();

    // Try to fetch posts
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });

    if (error) {
        console.error("Admin blog GET error:", error.message);
        // If table doesn't exist or permission denied, return seed posts as preview
        return NextResponse.json({
            posts: SEED_POSTS.map((p, i) => ({ ...p, id: i + 1 })),
            _source: "fallback",
            _error: error.message,
            _hint: "Run the blog_posts SQL in Supabase. Posts shown are defaults.",
        });
    }

    // If table is empty, seed it with the hardcoded posts
    if (!data || data.length === 0) {
        console.log("Blog posts table empty, seeding with default posts...");
        const { data: seeded, error: seedError } = await supabase
            .from("blog_posts")
            .insert(SEED_POSTS)
            .select();

        if (seedError) {
            console.error("Blog seed error:", seedError.message);
            // Return the seed posts as preview even if insert fails
            return NextResponse.json({
                posts: SEED_POSTS.map((p, i) => ({ ...p, id: i + 1 })),
                _source: "seed_failed",
                _error: seedError.message,
            });
        }

        return NextResponse.json({ posts: seeded || [], _source: "seeded" });
    }

    return NextResponse.json({ posts: data, _source: "database" });
}

// POST - create or update a blog post
export async function POST(req: NextRequest) {
    const supabase = getSupabase();
    const body = await req.json();
    const { id, title, slug, excerpt, content, thumbnail, category, author, published_at, read_time, is_published } = body;

    if (!title || !slug) {
        return NextResponse.json({ error: "title and slug required" }, { status: 400 });
    }

    const postData = {
        title,
        slug,
        excerpt: excerpt || "",
        content: content || "",
        thumbnail: thumbnail || null,
        category: category || "Product News",
        author: author || "Dreamworks Integrated Systems",
        published_at: published_at || new Date().toISOString().split("T")[0],
        read_time: read_time || 3,
        is_published: is_published !== false,
        updated_at: new Date().toISOString(),
    };

    if (id) {
        // Update existing
        const { data, error } = await supabase
            .from("blog_posts")
            .update(postData)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Admin blog UPDATE error:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ post: data });
    } else {
        // Create new
        const { data, error } = await supabase
            .from("blog_posts")
            .insert({ ...postData, created_at: new Date().toISOString() })
            .select()
            .single();

        if (error) {
            console.error("Admin blog INSERT error:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ post: data });
    }
}

// DELETE - delete a blog post
export async function DELETE(req: NextRequest) {
    const supabase = getSupabase();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Admin blog DELETE error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
