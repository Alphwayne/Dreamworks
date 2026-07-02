"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { CartDrawer } from "@/components/CartDrawer";
import { supabase } from "@/lib/supabase";
import { Star, Gift, ShoppingBag, Share2, ChevronRight } from "lucide-react";

const WAYS_TO_EARN = [
    { icon: "⭐", action: "Sign Up", points: "50,000", detail: "One-time bonus for creating an account", color: "from-yellow-500 to-orange-500" },
    { icon: "🛍️", action: "Place an Order", points: "1pt per ₦1", detail: "Earn 1 DreamPoint for every ₦1 you spend", color: "from-blue-500 to-blue-700" },
    { icon: "📸", action: "Follow on Instagram", points: "20,000", detail: "Follow @dreamworksnig on Instagram", color: "from-pink-500 to-purple-600" },
    { icon: "♪", action: "Follow on TikTok", points: "20,000", detail: "Follow @dreamworksnig on TikTok", color: "from-gray-800 to-gray-700" },
    { icon: "🎁", action: "Refer a Friend", points: "₦1,500", detail: "Your friend gets ₦1,500 off, you get ₦1,500 too", color: "from-emerald-500 to-teal-600" },
];

export default function DreamPointsPage() {
    const [user, setUser] = useState<any>(null);
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const res = await fetch(`/api/dreampoints/balance?user_id=${user.id}`);
                const data = await res.json();
                setBalance(data.balance || 0);
            }
            setLoading(false);
        }
        load();
    }, []);

    const nairaValue = balance ? Math.floor(balance / 100000) * 1000 : 0;

    return (
        <>
            <CartDrawer />
            <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#eef2ff 0%,#f8faff 50%,#f0f7ff 100%)" }}>
                <Header />

                {/* Hero */}
                <div className="relative py-20 px-4 overflow-hidden" style={{ background: "linear-gradient(135deg,#0f0a2e 0%,#1a0a4e 50%,#0a1a3e 100%)" }}>
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
                    </div>
                    <div className="relative max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-5 py-2 mb-6">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-yellow-300 text-xs font-bold uppercase tracking-widest">DreamPoints Loyalty</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            Earn Points.<br />
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Unlock Rewards.</span>
                        </h1>
                        <p className="text-white/50 text-base max-w-md mx-auto mb-8">
                            Every purchase, follow, and sign-up earns you DreamPoints. Redeem for real discounts on your next order.
                        </p>
                        {!user && (
                            <Link href="/auth/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold px-8 py-4 rounded-2xl hover:from-yellow-400 hover:to-orange-400 transition-all shadow-2xl shadow-orange-500/30 hover:scale-105">
                                <Star size={16} className="fill-white" /> Join Free & Earn 50,000 Points
                            </Link>
                        )}
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 py-12">

                    {/* Balance card — only if logged in */}
                    {user && (
                        <div className="mb-10 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg,#003B7E 0%,#1565C0 100%)" }}>
                            <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-center md:text-left">
                                    <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-1">Your DreamPoints Balance</p>
                                    <p className="text-5xl font-black text-white">
                                        {loading ? "..." : balance?.toLocaleString()}
                                    </p>
                                    <p className="text-blue-200 text-sm mt-1">≈ ₦{nairaValue.toLocaleString()} in rewards</p>
                                </div>
                                <div className="flex flex-col gap-3 text-center">
                                    <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-3">
                                        <p className="text-white/60 text-xs mb-1">Redeem at</p>
                                        <p className="text-white font-bold">100,000 pts = ₦1,000 off</p>
                                    </div>
                                    <Link href="/collections/all" className="bg-white text-blue-700 font-bold px-6 py-3 rounded-2xl hover:bg-blue-50 transition-colors text-sm">
                                        Shop & Earn More →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ways to earn */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Ways to Earn</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                        {WAYS_TO_EARN.map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all hover:-translate-y-1 group">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-bold text-gray-900">{item.action}</p>
                                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{item.points}</span>
                                </div>
                                <p className="text-gray-500 text-sm">{item.detail}</p>
                            </div>
                        ))}
                    </div>

                    {/* Redemption info */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Redeem</h2>
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { step: "1", title: "Shop & Add to Cart", desc: "Browse and add your favourite products to cart" },
                                { step: "2", title: "Apply at Checkout", desc: "Your DreamPoints balance shows at checkout — apply as discount" },
                                { step: "3", title: "Save Money", desc: "100,000 DreamPoints = ₦1,000 off your order total" },
                            ].map((s) => (
                                <div key={s.step} className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-700 text-white font-black text-lg flex items-center justify-center flex-shrink-0">{s.step}</div>
                                    <div>
                                        <p className="font-bold text-gray-900 mb-1">{s.title}</p>
                                        <p className="text-gray-500 text-sm">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
                            <p className="text-amber-700 text-sm font-medium">⏱ Points expire 6 months from the date they were earned</p>
                        </div>
                    </div>

                    {/* CTA */}
                    {!user && (
                        <div className="text-center bg-gradient-to-r from-blue-700 to-purple-700 rounded-3xl p-10">
                            <h3 className="text-2xl font-bold text-white mb-2">Ready to start earning?</h3>
                            <p className="text-white/60 mb-6">Create a free account and get 50,000 DreamPoints instantly.</p>
                            <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all">
                                <Star size={16} className="text-yellow-500 fill-yellow-500" /> Create Free Account
                            </Link>
                        </div>
                    )}
                </div>

                <BottomNav />
            </div>
        </>
    );
}