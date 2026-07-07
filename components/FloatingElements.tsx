"use client";

import { useState } from "react";
import { X, ChevronRight, Sparkles, MessageCircle } from "lucide-react";
import Link from "next/link";

const POINTS_INFO = [
    { icon: "⭐", action: "Sign Up", points: "50,000 pts", color: "from-yellow-500 to-orange-500" },
    { icon: "🛍️", action: "Place an Order", points: "1pt per ₦1", color: "from-blue-500 to-blue-700" },
    { icon: "📸", action: "Follow on Instagram", points: "20,000 pts", color: "from-pink-500 to-purple-600" },
    { icon: "♪", action: "Follow on TikTok", points: "20,000 pts", color: "from-gray-800 to-gray-600" },
    { icon: "🎁", action: "Refer a Friend", points: "₦1,500 bonus", color: "from-emerald-500 to-teal-600" },
];

export function FloatingElements() {
    const [dreamPointsOpen, setDreamPointsOpen] = useState(false);

    return (
        <>
            {/* ── CHAT BUTTON ──
                Desktop: bottom-6 → bottom-5 (DOWN slightly)
                Mobile:  bottom-20 → bottom-14 (DOWN further - closer to bottom)
            */}
            <a
                href="https://wa.me/2349027256852"
                target="_blank"
                rel="noopener noreferrer"
                title="Chat with us"
                className="fixed bottom-5 right-3 sm:bottom-5 sm:right-4 z-50 flex items-center gap-2.5 bg-gradient-to-r from-blue-800 to-blue-500 text-white px-3 py-2.5 rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all hover:scale-105 hover:-translate-y-0.5"
            >
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <MessageCircle size={18} className="text-white fill-white/30" />
                </div>
                <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold leading-none">Live Chat</p>
                    <p className="text-[10px] text-blue-100 leading-none mt-0.5">Ask us anything</p>
                </div>
                <div className="text-left block sm:hidden">
                    <p className="text-xs font-bold leading-none">Chat</p>
                </div>
            </a>

            {/* ── DREAMPOINTS PURSE ──
                Desktop: bottom-6 → bottom-5 (DOWN slightly)
                Mobile:  bottom-20 → bottom-14 (DOWN further - closer to bottom)
            */}
            <button
                onClick={() => setDreamPointsOpen(true)}
                className="fixed bottom-5 left-3 sm:bottom-5 sm:left-4 z-50 transition-all hover:scale-105 hover:-translate-y-1 group"
                title="DreamPoints"
            >
                <div className="relative flex flex-col items-center">
                    <div
                        className="w-12 h-4 rounded-t-full border-[3px] border-blue-400 bg-transparent mb-[-2px] z-10"
                        style={{ borderBottom: "none" }}
                    />
                    <div
                        className="relative w-24 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-500 shadow-xl shadow-blue-600/40 group-hover:shadow-blue-600/60 flex flex-col items-center justify-center py-3 px-2"
                        style={{ borderTopLeftRadius: "12px", borderTopRightRadius: "12px", borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}
                    >
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-5 h-1.5 rounded-full bg-yellow-300/80" />
                        <div className="absolute top-5 left-2 right-2 h-px bg-white/20 rounded-full" />
                        <div className="mt-2 flex flex-col items-center gap-1">
                            <span style={{ fontSize: "22px", lineHeight: 1 }}>💎</span>
                            <p className="text-white text-[11px] font-extrabold leading-none tracking-wide drop-shadow-sm">DreamPoints</p>
                            <p className="text-blue-100 text-[10px] leading-none font-medium drop-shadow-sm">Earn rewards</p>
                        </div>
                    </div>
                </div>
            </button>

            {/* ── DREAMPOINTS POPUP ── */}
            {dreamPointsOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        onClick={() => setDreamPointsOpen(false)}
                    />

                    <div className="fixed z-50
                        bottom-0 left-0 right-0 rounded-t-3xl
                        sm:bottom-24 sm:left-4 sm:right-auto sm:w-80 sm:rounded-3xl
                        overflow-hidden shadow-2xl shadow-black/40">

                        <div
                            className="relative p-5 pb-4"
                            style={{ background: "linear-gradient(135deg,#0f0a2e 0%,#1a0a4e 100%)" }}
                        >
                            <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-4 sm:hidden" />

                            <button
                                onClick={() => setDreamPointsOpen(false)}
                                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                            >
                                <X size={14} />
                            </button>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center shadow-lg">
                                    <span style={{ fontSize: "22px", lineHeight: 1 }}>💎</span>
                                </div>
                                <div>
                                    <p className="text-white font-bold text-base">DreamPoints</p>
                                    <p className="text-white/50 text-xs">{"Nigeria's loyalty rewards"}</p>
                                </div>
                            </div>
                            <div className="bg-white/10 rounded-2xl px-4 py-2.5 text-center">
                                <p className="text-white/60 text-xs">Redeem</p>
                                <p className="text-white font-bold text-sm">100,000 pts = ₦1,000 off</p>
                            </div>
                        </div>

                        <div className="bg-white p-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Ways to Earn</p>
                            <div className="space-y-2">
                                {POINTS_INFO.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-sm shadow-sm flex-shrink-0`}>
                                                {item.icon}
                                            </div>
                                            <span className="text-sm text-gray-700 font-medium">{item.action}</span>
                                        </div>
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                                            {item.points}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-center">
                                <p className="text-amber-700 text-xs font-medium">⏱ Points expire after 6 months</p>
                            </div>

                            <div className="mt-4 space-y-2 pb-6 sm:pb-0">
                                <Link
                                    href="/auth/register"
                                    onClick={() => setDreamPointsOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white font-bold py-3 rounded-2xl text-sm hover:from-blue-600 hover:to-blue-500 transition-all"
                                >
                                    <Sparkles size={14} className="text-yellow-300" />
                                    Start Earning — Sign Up Free
                                </Link>
                                <Link
                                    href="/auth/signin"
                                    onClick={() => setDreamPointsOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-2xl text-sm hover:bg-gray-100 transition-all"
                                >
                                    Sign in to check balance
                                    <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}