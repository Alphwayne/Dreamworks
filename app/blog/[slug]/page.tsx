"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";

import { CartDrawer } from "@/components/CartDrawer";
import { Heart, Share2, MessageCircle, Clock, ChevronLeft, Send, User } from "lucide-react";

interface Comment {
    id: number;
    name: string;
    content: string;
    timestamp: string;
    likes: number;
    replies: Comment[];
    isAnonymous: boolean;
}

const PLACEHOLDER_CONTENT = `
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

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(47);
    const [comments, setComments] = useState<Comment[]>([
        {
            id: 1,
            name: "Chukwuemeka A.",
            content: "This is exactly what Nigeria needs. Dreamworks has been my go-to for years!",
            timestamp: "2 days ago",
            likes: 12,
            replies: [],
            isAnonymous: false,
        },
        {
            id: 2,
            name: "Anonymous",
            content: "Great article! Would love to see more content like this.",
            timestamp: "1 day ago",
            likes: 8,
            replies: [],
            isAnonymous: true,
        },
    ]);
    const [newComment, setNewComment] = useState("");
    const [commentName, setCommentName] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState("");

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: "DreamWorks Blog", url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied!");
        }
    };

    const submitComment = () => {
        if (!newComment.trim()) return;
        const comment: Comment = {
            id: Date.now(),
            name: isAnonymous ? "Anonymous" : commentName || "Guest",
            content: newComment,
            timestamp: "Just now",
            likes: 0,
            replies: [],
            isAnonymous,
        };
        setComments([...comments, comment]);
        setNewComment("");
        setCommentName("");
    };

    const submitReply = (commentId: number) => {
        if (!replyText.trim()) return;
        setComments(comments.map((c) => {
            if (c.id === commentId) {
                return {
                    ...c,
                    replies: [...c.replies, {
                        id: Date.now(),
                        name: isAnonymous ? "Anonymous" : "Guest",
                        content: replyText,
                        timestamp: "Just now",
                        likes: 0,
                        replies: [],
                        isAnonymous,
                    }],
                };
            }
            return c;
        }));
        setReplyText("");
        setReplyingTo(null);
    };

    const likeComment = (id: number) => {
        setComments(comments.map((c) => c.id === id ? { ...c, likes: c.likes + 1 } : c));
    };

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
                        <div className="h-64 md:h-80 bg-gradient-to-br from-blue-800 via-blue-900 to-purple-900 relative">
                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                <span className="text-9xl">📰</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <span className="bg-blue-500/80 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                                    Product News
                                </span>
                                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                                    Why Dreamworks Is Nigeria's Trusted Technology Partner
                                </h1>
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="px-6 md:px-8 py-4 border-b border-gray-50 flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5">
                                    <User size={14} /> Dreamworks Integrated Systems
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock size={14} /> 4 min read
                                </span>
                                <span>June 6, 2026</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); }}
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
                            {PLACEHOLDER_CONTENT.split("\n").map((para, i) => {
                                if (para.startsWith("## ")) {
                                    return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">{para.replace("## ", "")}</h2>;
                                }
                                if (para.startsWith("**") && para.endsWith("**")) {
                                    return <p key={i} className="font-bold text-gray-800 mb-1">{para.replace(/\*\*/g, "")}</p>;
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
                                    disabled={!newComment.trim()}
                                    className="self-end w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors disabled:opacity-50 flex-shrink-0"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Comments list */}
                        <div className="space-y-5">
                            {comments.map((comment) => (
                                <div key={comment.id} className="border-b border-gray-50 pb-5 last:border-0">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                            {comment.isAnonymous ? "?" : comment.name[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-sm text-gray-900">{comment.name}</span>
                                                <span className="text-xs text-gray-400">{comment.timestamp}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed mb-2">{comment.content}</p>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => likeComment(comment.id)}
                                                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
                                                >
                                                    <Heart size={12} /> {comment.likes}
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
                                                        className="px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors"
                                                    >
                                                        Post
                                                    </button>
                                                </div>
                                            )}

                                            {/* Nested replies */}
                                            {comment.replies.length > 0 && (
                                                <div className="mt-4 ml-4 space-y-3 border-l-2 border-gray-100 pl-4">
                                                    {comment.replies.map((reply) => (
                                                        <div key={reply.id} className="flex items-start gap-2">
                                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                                {reply.isAnonymous ? "?" : reply.name[0].toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <span className="font-semibold text-xs text-gray-800">{reply.name}</span>
                                                                <span className="text-xs text-gray-400 ml-2">{reply.timestamp}</span>
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