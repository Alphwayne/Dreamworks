"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";

import { CartDrawer } from "@/components/CartDrawer";
import { supabase } from "@/lib/supabase";
import { Heart, MessageCircle, Share2, Clock, User, Tag, ChevronRight, Search } from "lucide-react";

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    thumbnail: string | null;
    category: string;
    author: string;
    published_at: string;
    likes: number;
    read_time: number;
}

const CATEGORIES = ["All", "Tech Tips", "Product News", "Deals", "HP Store", "World Cup"];

const PLACEHOLDER_POSTS: BlogPost[] = [
    {
        id: 1,
        title: "The 2026 World Cup Is Becoming a Tech Showcase Disguised as Football",
        slug: "world-cup-2026-tech-showcase",
        excerpt: "The World Cup has always been about football, passion, and national pride. But in 2026, something remarkable is happening — it's quietly becoming the world's biggest technology showcase.",
        content: "",
        thumbnail: null,
        category: "World Cup",
        author: "Dreamworks Integrated Systems",
        published_at: "2026-06-13",
        likes: 47,
        read_time: 5,
    },
    {
        id: 2,
        title: "Why Dreamworks Is Nigeria's Trusted Technology Partner",
        slug: "dreamworks-trusted-technology-partner",
        excerpt: "For over 22 years, Dreamworks has been delivering authentic, quality technology products to Nigerians across the country.",
        content: "",
        thumbnail: null,
        category: "Product News",
        author: "Dreamworks Integrated Systems",
        published_at: "2026-06-06",
        likes: 32,
        read_time: 4,
    },
    {
        id: 3,
        title: "Nigeria's No.1 HP Store: Where Buying Tech Is Just the Beginning",
        slug: "dreamworks-no1-hp-store-nigeria",
        excerpt: "As Nigeria's number one authorised HP store, Dreamworks Direct doesn't just sell HP products — we deliver an experience.",
        content: "",
        thumbnail: null,
        category: "HP Store",
        author: "Dreamworks Integrated Systems",
        published_at: "2026-06-04",
        likes: 28,
        read_time: 3,
    },
    {
        id: 4,
        title: "HP Devices: Technology Designed for the Way You Work and Live",
        slug: "hp-devices-technology-work-live",
        excerpt: "HP has always understood something fundamental: technology should work the way you do, not the other way around.",
        content: "",
        thumbnail: null,
        category: "HP Store",
        author: "Dreamworks Integrated Systems",
        published_at: "2026-06-10",
        likes: 19,
        read_time: 4,
    },
    {
        id: 5,
        title: "Buy One, Get One Free! The Best Tech Deals Right Now",
        slug: "buy-one-get-one-free-deals",
        excerpt: "Some deals help you save money. Others help you get more for your money. The best deals do both.",
        content: "",
        thumbnail: null,
        category: "Deals",
        author: "Dreamworks Integrated Systems",
        published_at: "2026-06-23",
        likes: 63,
        read_time: 2,
    },
    {
        id: 6,
        title: "Top 5 Smart Home Devices You Need in 2026",
        slug: "top-5-smart-home-devices-2026",
        excerpt: "Transform your home into a smart living space with the latest tech from Dreamworks Direct.",
        content: "",
        thumbnail: null,
        category: "Tech Tips",
        author: "Dreamworks Integrated Systems",
        published_at: "2026-05-28",
        likes: 41,
        read_time: 6,
    },
];

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes);

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        if (liked) {
            setLikes((l) => l - 1);
        } else {
            setLikes((l) => l + 1);
        }
        setLiked(!liked);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        if (navigator.share) {
            navigator.share({
                title: post.title,
                url: `${window.location.origin}/blog/${post.slug}`,
            });
        } else {
            navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`);
            alert("Link copied to clipboard!");
        }
    };

    const CATEGORY_COLORS: Record<string, string> = {
        "World Cup": "bg-green-100 text-green-700",
        "HP Store": "bg-blue-100 text-blue-700",
        "Deals": "bg-orange-100 text-orange-700",
        "Tech Tips": "bg-purple-100 text-purple-700",
        "Product News": "bg-cyan-100 text-cyan-700",
    };

    if (featured) {
        return (
            <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative rounded-3xl overflow-hidden" style={{ height: "420px" }}>
                    {post.thumbnail ? (
                        <Image src={post.thumbnail} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-900 to-purple-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${CATEGORY_COLORS[post.category] || "bg-white/20 text-white"}`}>
                            {post.category}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight group-hover:text-blue-200 transition-colors">
                            {post.title}
                        </h2>
                        <p className="text-white/60 text-sm line-clamp-2 mb-4">{post.excerpt}</p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white/50 text-xs">
                                <span className="flex items-center gap-1"><Clock size={12} /> {post.read_time} min read</span>
                                <span>·</span>
                                <span>{new Date(post.published_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={handleLike} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${liked ? "bg-red-500 border-red-500 text-white" : "border-white/30 text-white/60 hover:border-white hover:text-white"}`}>
                                    <Heart size={12} fill={liked ? "white" : "none"} /> {likes}
                                </button>
                                <button onClick={handleShare} className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors">
                                    <Share2 size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/blog/${post.slug}`} className="group block">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                    {post.thumbnail ? (
                        <Image src={post.thumbnail} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                            <div className="text-5xl opacity-20">📰</div>
                        </div>
                    )}
                    <div className="absolute top-3 left-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] || "bg-blue-100 text-blue-700"}`}>
                            {post.category}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{post.excerpt}</p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <Clock size={11} /> {post.read_time} min
                            <span className="mx-1">·</span>
                            {new Date(post.published_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-all ${liked ? "bg-red-50 border-red-200 text-red-500" : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400"}`}
                            >
                                <Heart size={11} fill={liked ? "currentColor" : "none"} /> {likes}
                            </button>
                            <button
                                onClick={handleShare}
                                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-200 transition-colors"
                            >
                                <Share2 size={11} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [posts, setPosts] = useState<BlogPost[]>(PLACEHOLDER_POSTS);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch("/api/admin/blog");
                const data = await res.json();
                if (data.posts && data.posts.length > 0) {
                    setPosts(data.posts.map((p: any) => ({ ...p, likes: p.likes || 0 })));
                }
            } catch (err) {
                // Keep using PLACEHOLDER_POSTS
            }
        }
        fetchPosts();
    }, []);

    const filtered = posts.filter((p) => {
        const matchesCat = activeCategory === "All" || p.category === activeCategory;
        const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const featured = filtered[0];
    const rest = filtered.slice(1);

    return (
        <>
            <CartDrawer />
            <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fafbff 50%, #f5f0ff 100%)" }}>
                <Header />

                {/* Blog hero */}
                <div className="relative py-20 px-4 overflow-hidden" style={{ background: "linear-gradient(135deg, #003B7E 0%, #1565C0 50%, #003B7E 100%)" }}>
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                    </div>
                    <div className="relative max-w-4xl mx-auto text-center">
                        <span className="inline-block text-xs font-bold text-blue-200 uppercase tracking-widest mb-4">DreamWorks Blog</span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            Tech Insights &<br />
                            <span className="text-blue-200">Latest News</span>
                        </h1>
                        <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
                            Stay ahead with tips, deals, product news and everything happening in the world of tech.
                        </p>

                        {/* Search */}
                        <div className="relative max-w-md mx-auto">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-10">
                    {/* Category tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeCategory === cat
                                    ? "bg-blue-700 text-white shadow-lg shadow-blue-500/30"
                                    : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg">No articles found</p>
                            <button onClick={() => { setActiveCategory("All"); setSearch(""); }} className="text-blue-600 font-semibold hover:underline mt-2">
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Featured post */}
                            {featured && (
                                <div className="mb-8">
                                    <BlogCard post={featured} featured />
                                </div>
                            )}

                            {/* Grid */}
                            {rest.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {rest.map((post) => (
                                        <BlogCard key={post.id} post={post} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                
            </div>
        </>
    );
}