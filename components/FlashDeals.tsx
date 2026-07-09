"use client";

import { useState, useEffect } from "react";
import { Zap, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/types";

interface FlashDeal {
    id: number;
    product_name: string;
    selling_price: number;
    compare_price: number | null;
    image_url: string | null;
    slug: string;
    category: string;
}

function CountdownTimer({ endTime }: { endTime: Date }) {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime.getTime() - now;
            if (distance < 0) {
                clearInterval(timer);
                return;
            }
            setTimeLeft({
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [endTime]);

    return (
        <div className="flex items-center gap-1.5">
            {[
                { value: timeLeft.hours, label: "H" },
                { value: timeLeft.minutes, label: "M" },
                { value: timeLeft.seconds, label: "S" },
            ].map((unit, i) => (
                <div key={i} className="flex items-center gap-1.5">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1.5 min-w-[44px] text-center">
                        <span className="text-white font-bold text-lg tabular-nums">{String(unit.value).padStart(2, "0")}</span>
                        <span className="text-white/60 text-[9px] ml-0.5">{unit.label}</span>
                    </div>
                    {i < 2 && <span className="text-white/40 font-bold text-lg">:</span>}
                </div>
            ))}
        </div>
    );
}

export function FlashDeals({ deals }: { deals: FlashDeal[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // End time: midnight tonight
    const endTime = new Date();
    endTime.setHours(23, 59, 59, 999);

    useEffect(() => {
        if (deals.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % Math.max(1, deals.length - 3));
        }, 5000);
        return () => clearInterval(interval);
    }, [deals.length]);

    if (!deals.length) return null;

    return (
        <section className="py-8 px-4 max-w-7xl mx-auto">
            <div className="rounded-3xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #dc2626 0%, #991b1b 40%, #7f1d1d 100%)" }}>
                {/* Animated background elements — reduced on mobile for performance */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-yellow-500/10 rounded-full sm:animate-pulse" />
                    <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-orange-500/10 rounded-full hidden sm:block sm:animate-pulse" style={{ animationDelay: "1s" }} />
                    <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-red-400/5 rounded-full -translate-x-1/2 -translate-y-1/2 hidden sm:block sm:animate-ping" style={{ animationDuration: "3s" }} />
                </div>

                {/* Header */}
                <div className="relative px-6 md:px-10 pt-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-400/30 animate-bounce" style={{ animationDuration: "2s" }}>
                            <Zap size={24} className="text-red-900" fill="currentColor" />
                        </div>
                        <div>
                            <h2 className="text-white text-xl md:text-2xl font-bold tracking-tight">Flash Deals</h2>
                            <p className="text-red-200/80 text-xs">Limited time offers — grab them before they&apos;re gone</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-red-200/80 text-xs">
                            <Clock size={12} />
                            <span>Ends in</span>
                        </div>
                        <CountdownTimer endTime={endTime} />
                    </div>
                </div>

                {/* Products */}
                <div className="relative px-6 md:px-10 pb-6 overflow-hidden">
                    <div
                        className="flex gap-4 transition-transform duration-700 ease-out"
                        style={{ transform: `translateX(-${currentIndex * 280}px)` }}
                    >
                        {deals.map((deal) => {
                            const discount = deal.compare_price
                                ? Math.round(((deal.compare_price - deal.selling_price) / deal.compare_price) * 100)
                                : 0;

                            return (
                                <Link
                                    key={deal.id}
                                    href={`/products/${deal.slug}`}
                                    className="flex-shrink-0 w-[260px] group"
                                >
                                    <div className="bg-white rounded-2xl p-3 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 hover:-translate-y-1 h-full">
                                        {/* Image */}
                                        <div className="relative h-40 bg-gray-50 rounded-xl overflow-hidden mb-3">
                                            <Image
                                                src={deal.image_url || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=75"}
                                                alt={deal.product_name}
                                                fill
                                                sizes="260px"
                                                loading="lazy"
                                                className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {discount > 0 && (
                                                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
                                                    -{discount}%
                                                </div>
                                            )}
                                            <div className="absolute bottom-2 right-2 bg-yellow-400 text-red-900 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                                FLASH
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider mb-1">{deal.category}</p>
                                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 leading-tight group-hover:text-red-600 transition-colors">
                                            {deal.product_name}
                                        </h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-bold text-red-600">{formatPrice(deal.selling_price)}</span>
                                            {deal.compare_price && (
                                                <span className="text-xs text-gray-400 line-through">{formatPrice(deal.compare_price)}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* View All */}
                <div className="relative px-6 md:px-10 pb-6">
                    <Link
                        href="/collections/all?sort=discount"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
                    >
                        View All Deals <ChevronRight size={14} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
