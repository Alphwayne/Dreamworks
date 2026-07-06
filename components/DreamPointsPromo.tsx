"use client";

import { Star, Gift, ArrowRight } from "lucide-react";
import Link from "next/link";

export function DreamPointsPromo() {
    return (
        <section className="py-8 px-4 max-w-7xl mx-auto">
            <div
                className="rounded-2xl overflow-hidden relative"
                style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)" }}
            >
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="relative px-8 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl flex-shrink-0">
                            <Star size={28} className="text-white" />
                        </div>
                        <div className="text-white">
                            <h3 className="text-xl md:text-2xl font-bold mb-1">DreamPoints Rewards</h3>
                            <p className="text-indigo-200 text-sm max-w-md">
                                Earn points on every purchase. Redeem for discounts, exclusive products, and VIP perks. The more you shop, the more you save.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/dreampoints"
                            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-all shadow-xl text-sm hover:scale-105"
                        >
                            <Gift size={16} /> Join Now <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
