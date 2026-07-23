"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { Heart, Share2, MessageCircle, Clock, ChevronLeft, Send, User, ThumbsUp } from "lucide-react";

interface Comment {
    id: string;
    post_slug: string;
    name: string;
    content: string;
    created_at: string;
    likes: number;
    is_anonymous: boolean;
    parent_id: string | null;
    replies: Comment[];
}

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
    read_time: number;
}

const DEFAULT_CONTENT = `
Nigeria's tech landscape has evolved dramatically over the past decade, and at the center of this evolution stands Dreamworks Direct — a brand that has been consistently delivering authentic, quality technology for over 22 years.

## Our Story

What started as a small technology shop in Lagos has grown into Nigeria's premier destination for premium tech products. We've served over 10,000 customers, processed 750+ orders, and built relationships with the world's leading technology brands.

## Why We Stand Out

**Authenticity Guaranteed** — Every product sold through Dreamworks Direct is 100% genuine. We are an authorised dealer for HP, Samsung, LG, JBL, Hisense, and many more premium brands.

**Competitive Pricing** — We work directly with manufacturers and authorised distributors to bring you the best prices in Nigeria.

**Expert Support** — Our team of technology experts is available 24/7 to help you choose the right products for your needs.

**Flexible Payment** — With our Dream Now, Pay Later programme, you don't have to wait to get the tech you need. Spread your payments with zero hassle.

## What's Next

We're constantly expanding our catalogue, improving our delivery network, and building new ways for customers to engage with us. The future of tech retail in Nigeria is digital, fast, and customer-first — and Dreamworks Direct is leading the charge.
`;

// Fallback images for blog posts by slug
const BLOG_IMAGES: Record<string, string> = {
    "world-cup-2026-tech-showcase": "/blog/world-cup-tech.jpg",
    "dreamworks-trusted-technology-partner": "/blog/dreamworks-partner.jpg",
    "buy-one-get-one-free-deals": "/blog/tech-deals-bogo.jpg",
    "dreamworks-no1-hp-store-nigeria": "/blog/dreamworks-partner.jpg",
    "hp-devices-technology-work-live": "/blog/dreamworks-partner.jpg",
    "top-5-smart-home-devices-2026": "/blog/tech-deals-bogo.jpg",
};

// Generate a persistent visitor ID for like tracking
function getVisitorId(): string {
    if (typeof window === "undefined") return "";
    let id = localStorage.getItem("dw_visitor_id");
    if (!id) {
        id = "v_" + Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
        localStorage.setItem("dw_visitor_id", id);
    }
    return id;
}

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [commentName, setCommentName] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

    // Load post data from API
    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch("/api/admin/blog");
                const data = await res.json();
                if (data.posts && data.posts.length > 0) {
                    const found = data.posts.find((p: BlogPost) => p.slug === slug);
                    if (found) setPost(found);
                }
            } catch (err) {
                console.error("Failed to load post:", err);
            }
            setLoading(false);
        }
        fetchPost();
    }, [slug]);

    // Load comments from API
    const loadComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/blog/comments?slug=${slug}`);
            const data = await res.json();
            if (data.comments) setComments(data.comments);
        } catch (err) {
            console.error("Failed to load comments:", err);
        }
    }, [slug]);

    // Load post likes from API
    const loadLikes = useCallback(async () => {
        try {
            const res = await fetch(`/api/blog/likes?slug=${slug}`);
            const data = await res.json();
            if (typeof data.likes === "number") setLikes(data.likes);
        } catch (err) {
            console.error("Failed to load likes:", err);
        }
    }, [slug]);

    // Check if user already liked this post
    useEffect(() => {
        const likedPosts = JSON.parse(localStorage.getItem("dw_liked_posts") || "[]");
        if (likedPosts.includes(slug)) setLiked(true);

        const likedCmts = JSON.parse(localStorage.getItem("dw_liked_comments") || "[]");
        setLikedComments(new Set(likedCmts));
    }, [slug]);

    useEffect(() => {
        loadComments();
        loadLikes();
    }, [loadComments, loadLikes]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: post?.title || "DreamWorks Blog", url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied!");
        }
    };

    // Toggle post like
    const toggleLike = async () => {
        const visitorId = getVisitorId();
        try {
            const res = await fetch("/api/blog/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ post_slug: slug, visitor_id: visitorId }),
            });
            const data = await res.json();

            if (data.action === "liked") {
                setLiked(true);
                setLikes((prev) => prev + 1);
                const likedPosts = JSON.parse(localStorage.getItem("dw_liked_posts") || "[]");
                localStorage.setItem("dw_liked_posts", JSON.stringify([...likedPosts, slug]));
            } else {
                setLiked(false);
                setLikes((prev) => Math.max(0, prev - 1));
                const likedPosts = JSON.parse(localStorage.getItem("dw_liked_posts") || "[]");
                localStorage.setItem("dw_liked_posts", JSON.stringify(likedPosts.filter((s: string) => s !== slug)));
            }
        } catch (err) {
            console.error("Failed to toggle like:", err);
        }
    };

    // Toggle comment like
    const toggleCommentLike = async (commentId: string) => {
        const visitorId = getVisitorId();
        try {
            const res = await fetch("/api/blog/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment_id: commentId, visitor_id: visitorId }),
            });
            const data = await res.json();

            const newLikedComments = new Set(likedComments);
            if (data.action === "liked") {
                newLikedComments.add(commentId);
            } else {
                newLikedComments.delete(commentId);
            }
            setLikedComments(newLikedComments);
            localStorage.setItem("dw_liked_comments", JSON.stringify([...newLikedComments]));

            loadComments();
        } catch (err) {
            console.error("Failed to toggle comment like:", err);
        }
    };

    // Submit comment
    const submitComment = async () => {
        if (!newComment.trim() || submitting) return;
        setSubmitting(true);

        try {
            const res = await fetch("/api/blog/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    post_slug: slug,
                    name: isAnonymous ? "Anonymous" : (commentName || "Guest"),
                    content: newComment,
                    is_anonymous: isAnonymous,
                }),
            });
            const data = await res.json();
            if (data.comment) {
                setComments([{ ...data.comment, replies: [] }, ...comments]);
                setNewComment("");
                setCommentName("");
            }
        } catch (err) {
            console.error("Failed to submit comment:", err);
        }
        setSubmitting(false);
    };

    // Submit reply
    const submitReply = async (commentId: string) => {
        if (!replyText.trim() || submitting) return;
        setSubmitting(true);

        try {
            const res = await fetch("/api/blog/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    post_slug: slug,
                    name: isAnonymous ? "Anonymous" : "Guest",
                    content: replyText,
                    is_anonymous: isAnonymous,
                    parent_id: commentId,
                }),
            });
            const data = await res.json();
            if (data.comment) {
                setComments(comments.map((c) => {
                    if (c.id === commentId) {
                        return { ...c, replies: [...c.replies, data.comment] };
                    }
                    return c;
                }));
                setReplyText("");
                setReplyingTo(null);
            }
        } catch (err) {
            console.error("Failed to submit reply:", err);
        }
        setSubmitting(false);
    };

    function formatTimestamp(dateStr: string): string {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
    }

    const displayTitle = post?.title || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    const displayContent = post?.content || DEFAULT_CONTENT;
    const displayCategory = post?.category || "Product News";
    const displayAuthor = post?.author || "Dreamworks Integrated Systems";
    const displayReadTime = post?.read_time || 4;
    const displayDate = post?.published_at || "2026-06-06";

    if (loading) {
        return (
            <>
                <CartDrawer />
                <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fafbff 50%, #f5f0ff 100%)" }}>
                    <Header />
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
                </div>
            </>
        );
    }

    return (
        <>
            <CartDrawer />
            <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #fafbff 50%, #f5f0ff 100%)" }}>
                <Header />

                <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
                    {/* Back */}
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6">
                        <ChevronLeft size={16} /> Back to Blog
                    </Link>

                    {/* Article */}
                    <article className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm mb-8">
                        {/* Hero */}
                        <div className="h-64 md:h-80 relative overflow-hidden">
                            {(post?.thumbnail || BLOG_IMAGES[slug]) ? (
                                <Image src={post?.thumbnail || BLOG_IMAGES[slug]} alt={displayTitle} fill className="object-cover" />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-900 to-purple-900">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                        <span className="text-9xl">📰</span>
                                    </div>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <span className="bg-blue-500/80 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                                    {displayCategory}
                                </span>
                                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                                    {displayTitle}
                                </h1>
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="px-6 md:px-8 py-4 border-b border-gray-50 flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5">
                                    <User size={14} /> {displayAuthor}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock size={14} /> {displayReadTime} min read
                                </span>
                                <span>{new Date(displayDate).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleLike}
                                    className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border transition-all ${liked ? "bg-red-50 border-red-200 text-red-500" : "border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400"}`}
                                >
                                    <Heart size={14} fill={liked ? "currentColor" : "none"} /> {likes}
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border border-gray-200 text-gray-500 hover:border-blue-200 hover:text-blue-500 transition-all"
                                >
                                    <Share2 size={14} /> Share
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 md:px-8 py-8 prose prose-blue max-w-none">
                            {displayContent.split("\n").map((para, i) => {
                                if (para.startsWith("## ")) {
                                    return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">{para.replace("## ", "")}</h2>;
                                }
                                if (para.startsWith("**") && para.endsWith("**")) {
                                    return <p key={i} className="font-bold text-gray-800 mb-1">{para.replace(/\*\*/g, "")}</p>;
                                }
                                if (para.match(/^\*\*.*\*\* —/)) {
                                    const parts = para.split(" — ");
                                    return <p key={i} className="text-gray-600 leading-relaxed mb-4"><strong className="text-gray-800">{parts[0].replace(/\*\*/g, "")}</strong> — {parts.slice(1).join(" — ")}</p>;
                                }
                                if (para.trim()) {
                                    return <p key={i} className="text-gray-600 leading-relaxed mb-4">{para}</p>;
                                }
                                return null;
                            })}
                        </div>
                    </article>

                    {/* Comments section */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <MessageCircle size={20} className="text-blue-500" />
                            Comments ({comments.length})
                        </h3>

                        {/* Comment form */}
                        <div className="bg-gray-50 rounded-2xl p-5 mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isAnonymous}
                                        onChange={(e) => setIsAnonymous(e.target.checked)}
                                        className="accent-blue-600"
                                    />
                                    <span className="text-sm text-gray-600 font-medium">Comment anonymously</span>
                                </label>
                            </div>

                            {!isAnonymous && (
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={commentName}
                                    onChange={(e) => setCommentName(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            )}

                            <div className="flex gap-3">
                                <textarea
                                    placeholder="Share your thoughts..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    rows={3}
                                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={submitComment}
                                    disabled={!newComment.trim() || submitting}
                                    className="self-end w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors disabled:opacity-50 flex-shrink-0"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Comments list */}
                        <div className="space-y-5">
                            {comments.length === 0 && (
                                <p className="text-center text-gray-400 text-sm py-8">No comments yet. Be the first to share your thoughts!</p>
                            )}
                            {comments.map((comment) => (
                                <div key={comment.id} className="border-b border-gray-50 pb-5 last:border-0">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                            {comment.is_anonymous ? "?" : comment.name[0]?.toUpperCase() || "G"}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-sm text-gray-900">{comment.name}</span>
                                                <span className="text-xs text-gray-400">{formatTimestamp(comment.created_at)}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed mb-2">{comment.content}</p>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleCommentLike(comment.id)}
                                                    className={`flex items-center gap-1 text-xs transition-colors ${likedComments.has(comment.id) ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
                                                >
                                                    <Heart size={12} fill={likedComments.has(comment.id) ? "currentColor" : "none"} /> {comment.likes || 0}
                                                </button>
                                                <button
                                                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                                    className="text-xs text-gray-400 hover:text-blue-500 transition-colors font-medium"
                                                >
                                                    Reply
                                                </button>
                                            </div>

                                            {/* Reply form */}
                                            {replyingTo === comment.id && (
                                                <div className="mt-3 flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Write a reply..."
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <button
                                                        onClick={() => submitReply(comment.id)}
                                                        disabled={submitting}
                                                        className="px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50"
                                                    >
                                                        Post
                                                    </button>
                                                </div>
                                            )}

                                            {/* Nested replies */}
                                            {comment.replies && comment.replies.length > 0 && (
                                                <div className="mt-4 ml-4 space-y-3 border-l-2 border-gray-100 pl-4">
                                                    {comment.replies.map((reply) => (
                                                        <div key={reply.id} className="flex items-start gap-2">
                                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                                {reply.is_anonymous ? "?" : reply.name[0]?.toUpperCase() || "G"}
                                                            </div>
                                                            <div>
                                                                <span className="font-semibold text-xs text-gray-800">{reply.name}</span>
                                                                <span className="text-xs text-gray-400 ml-2">{formatTimestamp(reply.created_at)}</span>
                                                                <p className="text-sm text-gray-600 mt-0.5">{reply.content}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
