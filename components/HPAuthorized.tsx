"use client";

import Link from "next/link";
import { Shield, Award, CheckCircle2 } from "lucide-react";

export function HPAuthorized() {
    return (
        <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50">
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

                {/* Accent glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />

                <div className="relative px-6 sm:px-10 py-10 sm:py-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* Left — HP Badge */}
                    <div className="flex-shrink-0 text-center lg:text-left">
                        {/* HP Logo representation */}
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
                            <div className="text-center">
                                <span className="text-4xl font-black text-white tracking-tighter">hp</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center lg:justify-start gap-2 mt-3">
                            <Shield size={14} className="text-blue-400" />
                            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Authorized Dealer</span>
                        </div>
                    </div>

                    {/* Center — Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mb-4">
                            <Award size={12} className="text-blue-400" />
                            <span className="text-[11px] font-semibold text-blue-300">Official HP Partner in Nigeria</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                            Authorized HP Dealer
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xl mb-6">
                            DreamWorks Direct is a certified and authorized dealer of HP products in Nigeria.
                            Every HP product you purchase from us comes with full manufacturer warranty,
                            genuine parts, and direct HP support access.
                        </p>

                        {/* Trust points */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                            <div className="flex items-center gap-2.5 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                                <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                                <span className="text-xs font-medium text-gray-300">100% Genuine Products</span>
                            </div>
                            <div className="flex items-center gap-2.5 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                                <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                                <span className="text-xs font-medium text-gray-300">Full HP Warranty</span>
                            </div>
                            <div className="flex items-center gap-2.5 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                                <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                                <span className="text-xs font-medium text-gray-300">Direct HP Support</span>
                            </div>
                        </div>

                        <Link
                            href="/collections/all?category=Computing+%26+Laptops"
                            className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Shop HP Products
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 8h10M9 4l4 4-4 4" />
                            </svg>
                        </Link>
                    </div>

                    {/* Right — Certification badge */}
                    <div className="hidden lg:flex flex-col items-center gap-3 flex-shrink-0">
                        <div className="w-28 h-28 rounded-full border-2 border-blue-500/30 flex items-center justify-center bg-blue-500/5">
                            <div className="w-20 h-20 rounded-full border border-blue-400/40 flex items-center justify-center bg-blue-500/10">
                                <div className="text-center">
                                    <Shield size={24} className="text-blue-400 mx-auto mb-1" />
                                    <span className="text-[9px] font-bold text-blue-300 uppercase tracking-wider block">Certified</span>
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium">Since 2004</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
