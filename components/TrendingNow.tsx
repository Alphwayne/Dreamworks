"use client";

import { TrendingUp, Flame, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/types";
import { useState, useRef, useEffect } from "react";

interface TrendingProduct {
    id: number;
    product_name: string;
    selling_price: number;
    compare_price: number | null;
    image_url: string | null;
    slug: string;
    category: string;
}

export function TrendingNow({ products }: { products: TrendingProduct[] }) {
    const [isPaused, setIsPaused] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef(0);
    const scrollOffset = useRef(0);
    const currentTranslate = useRef(0);
    const resumeTimer = useRef<NodeJS.Timeout | null>(null);

    if (!products.length) return null;

    // Duplicate for infinite scroll effect
    const displayProducts = [...products, ...products];
    // Faster: was products.length * 4, now * 2.2
    const duration = products.length * 2.2;

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsPaused(true);
        touchStartX.current = e.touches[0].clientX;

        if (trackRef.current) {
            const style = window.getComputedStyle(trackRef.current);
            const matrix = new DOMMatrix(style.transform);
            currentTranslate.current = matrix.m41;
            scrollOffset.current = currentTranslate.current;
            trackRef.current.style.animation = "none";
            trackRef.current.style.transform = `translateX(${currentTranslate.current}px)`;
        }

        if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!trackRef.current) return;
        const diff = e.touches[0].clientX - touchStartX.current;
        const newTranslate = scrollOffset.current + diff;
        trackRef.current.style.transform = `translateX(${newTranslate}px)`;
        currentTranslate.current = newTranslate;
    };

    const handleTouchEnd = () => {
        if (!trackRef.current) return;

        // Wrap around if scrolled too far
        const trackWidth = trackRef.current.scrollWidth / 2;
        let finalPos = currentTranslate.current;
        if (finalPos > 0) finalPos = -trackWidth + finalPos;
        if (finalPos < -trackWidth) finalPos = finalPos + trackWidth;

        trackRef.current.style.transform = `translateX(${finalPos}px)`;
        currentTranslate.current = finalPos;

        // Resume auto-scroll after 2.5s
        resumeTimer.current = setTimeout(() => {
            if (trackRef.current) {
                const trackWidth = trackRef.current.scrollWidth / 2;
                const progress = Math.abs(finalPos) / trackWidth;
                trackRef.current.style.animation = "";
                trackRef.current.style.transform = "";
                trackRef.current.style.animationDelay = `-${progress * duration}s`;
            }
            setIsPaused(false);
        }, 2500);
    };

    return (
        <section className="py-10 px-4 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25 sm:animate-pulse">
                        <Flame size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Trending Now</h2>
                        <p className="text-xs text-gray-500">Most viewed products this week</p>
                    </div>
                </div>
                <Link href="/collections/all?sort=popular" className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
                    See all <TrendingUp size={14} />
                </Link>
            </div>

            {/* Auto-scrolling horizontal strip */}
            <div
                className="relative overflow-hidden rounded-2xl"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Subtle fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/60 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/60 to-transparent z-10 pointer-events-none" />

                <div
                    ref={trackRef}
                    className="flex gap-4 pb-2 trending-scroll-track"
                    style={{
                        animationPlayState: isPaused ? "paused" : "running",
                        animationDuration: `${duration}s`,
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {displayProducts.map((product, index) => {
                        const discount = product.compare_price
                            ? Math.round(((product.compare_price - product.selling_price) / product.compare_price) * 100)
                            : 0;
                        const viewers = ((product.id * 7 + index * 13) % 30) + 5;

                        return (
                            <Link
                                key={`${product.id}-${index}`}
                                href={`/products/${product.slug}`}
                                className="flex-shrink-0 w-[200px] group"
                            >
                                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 h-full">
                                    {/* Rank badge */}
                                    <div className="relative">
                                        <div className="absolute top-2 left-2 z-10 bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center">
                                            #{(index % products.length) + 1}
                                        </div>
                                        {discount > 0 && (
                                            <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                                -{discount}%
                                            </div>
                                        )}

                                        {/* Image */}
                                        <div className="relative h-44 bg-gradient-to-br from-gray-50 to-blue-50/20 p-4">
                                            <Image
                                                src={product.image_url || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=75"}
                                                alt={product.product_name}
                                                fill
                                                className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                                                sizes="200px"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-3">
                                        <p className="text-[9px] text-blue-500 uppercase font-bold tracking-wider">{product.category?.split(" ")[0]}</p>
                                        <h3 className="text-xs font-bold text-gray-900 line-clamp-2 mt-1 leading-tight group-hover:text-blue-600 transition-colors min-h-[32px]">
                                            {product.product_name}
                                        </h3>
                                        <div className="flex items-baseline gap-1.5 mt-2">
                                            <span className="text-sm font-bold text-gray-900">{formatPrice(product.selling_price)}</span>
                                            {product.compare_price && (
                                                <span className="text-[10px] text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
                                            <Eye size={10} />
                                            <span>{viewers} viewing</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <style>{`
                @keyframes trendingScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .trending-scroll-track {
                    animation: trendingScroll ${duration}s linear infinite;
                    will-change: transform;
                    -webkit-transform: translateZ(0);
                    transform: translateZ(0);
                    touch-action: pan-x;
                }
            `}</style>
        </section>
    );
}
