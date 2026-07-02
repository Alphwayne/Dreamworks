"use client";

import Link from "next/link";
import { Star, Gift, ShoppingBag, Heart } from "lucide-react";

const POINTS = [
    { icon: <Star size={20} />, action: "Sign Up", points: "50,000", color: "from-yellow-500 to-orange-500" },
    { icon: <ShoppingBag size={20} />, action: "Place an Order", points: "1pt / ₦1", color: "from-blue-500 to-blue-700" },
    { icon: <span className="text-base font-bold">IG</span>, action: "Follow on Instagram", points: "20,000", color: "from-pink-500 to-purple-600" },
    { icon: <span className="text-base font-bold">TK</span>, action: "Follow on TikTok", points: "20,000", color: "from-gray-800 to-gray-900" },
    { icon: <Gift size={20} />, action: "Refer a Friend", points: "₦1,500", color: "from-emerald-500 to-teal-600" },
];

export function DreamPointsBanner() {
    return (
        <section className="py-16 px-4 relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0f0a2e 0%, #1a0a4e 40%, #0a1a3e 100%)" }} />
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-5 py-2 mb-4">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-300 text-xs font-bold uppercase tracking-widest">DreamPoints Loyalty</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
                        Earn Points.<br />
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                            Unlock Rewards.
                        </span>
                    </h2>
                    <p className="text-white/50 text-base max-w-md mx-auto">
                        Every purchase, follow, and sign-up earns you DreamPoints. Redeem for real discounts.
                    </p>
                </div>

                {/* Points grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                    {POINTS.map((item, i) => (
                        <div
                            key={i}
                            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                {item.icon}
                            </div>
                            <p className="text-white/60 text-xs mb-1">{item.action}</p>
                            <p className="text-white font-bold text-lg">{item.points}</p>
                            <p className="text-white/40 text-[10px]">DreamPoints</p>
                        </div>
                    ))}
                </div>

                {/* Redemption info */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                            <Gift size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-lg">Redeem Your Points</p>
                            <p className="text-white/50 text-sm">100,000 DreamPoints = ₦1,000 discount on your next order</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Points expire after</p>
                            <p className="text-white font-bold text-2xl">6 months</p>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div className="text-center">
                            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Referral bonus</p>
                            <p className="text-white font-bold text-2xl">₦1,500</p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link
                        href="/auth/register"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold px-8 py-4 rounded-2xl hover:from-yellow-400 hover:to-orange-400 transition-all shadow-2xl shadow-orange-500/30 text-sm hover:scale-105"
                    >
                        <Star size={16} className="fill-white" />
                        Start Earning DreamPoints
                    </Link>
                    <p className="text-white/30 text-xs mt-3">
                        Already have an account?{" "}
                        <Link href="/auth/signin" className="text-white/60 hover:text-white underline transition-colors">
                            Sign in to check your balance
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}