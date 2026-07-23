"use client";

import { TrendingUp, Flame, Eye, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/types";
import { useRef, useEffect, useCallback, useState } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCompareStore } from "@/store/compareStore";

interface TrendingProduct {
    id: number;
    product_name: string;
    selling_price: number;
    compare_price: number | null;
    image_url: string | null;
    slug: string;
    category: string;
}

// Custom compare icon (split-screen style)
function CompareIcon({ size = 14 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2v16" />
            <path d="M3 5l7-3 7 3" />
            <path d="M3 5l-1 6h5L6 5" />
            <path d="M14 5l1 6h5l-1-6" />
            <circle cx="3" cy="5" r="0.5" fill="currentColor" />
            <circle cx="17" cy="5" r="0.5" fill="currentColor" />
            <path d="M2 11a2 2 0 004 0" />
            <path d="M15 11a2 2 0 004 0" />
            <rect x="8.5" y="16" width="3" height="2" rx="1" fill="currentColor" opacity="0.3" />
        </svg>
    );
}

export function TrendingNow({ products }: { products: TrendingProduct[] }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<number | null>(null);
    const posRef = useRef(0);
    const isPausedRef = useRef(false);
    const touchStartX = useRef(0);
    const touchStartPos = useRef(0);
    const resumeTimer = useRef<NodeJS.Timeout | null>(null);
    const [, forceRender] = useState(0);

    const wishlist = useWishlistStore((s) => s.items);
    const toggleWishlist = useWishlistStore((s) => s.toggleItem);
    const compareItems = useCompareStore((s) => s.items);
    const addCompare = useCompareStore((s) => s.addItem);
    const removeCompare = useCompareStore((s) => s.removeItem);

    if (!products.length) return null;

    const isWishlisted = (id: number) => wishlist.some((w) => w.id === id);
    const isComparing = (id: number) => compareItems.some((c) => c.id === id);

    // Duplicate for infinite scroll effect
    const displayProducts = [...products, ...products];

    // Speed: pixels per frame (~60fps)
    const speed = 1.0;

    const animate = useCallback(() => {
        if (!trackRef.current) return;

        if (!isPausedRef.current) {
            posRef.current -= speed;

            const halfWidth = trackRef.current.scrollWidth / 2;
            if (Math.abs(posRef.current) >= halfWidth) {
                posRef.current = posRef.current + halfWidth;
            }
            if (posRef.current > 0) {
                posRef.current = posRef.current - halfWidth;
            }

            trackRef.current.style.transform = `translateX(${posRef.current}px)`;
        }

        animRef.current = requestAnimationFrame(animate);
    }, [speed]);

    useEffect(() => {
        animRef.current = requestAnimationFrame(animate);
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
            if (resumeTimer.current) clearTimeout(resumeTimer.current);
        };
    }, [animate]);

    const handleMouseEnter = () => { isPausedRef.current = true; };
    const handleMouseLeave = () => { isPausedRef.current = false; };

    const handleTouchStart = (e: React.TouchEvent) => {
        isPausedRef.current = true;
        touchStartX.current = e.touches[0].clientX;
        touchStartPos.current = posRef.current;
        if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const diff = e.touches[0].clientX - touchStartX.current;
        posRef.current = touchStartPos.current + diff;
        if (trackRef.current) {
            trackRef.current.style.transform = `translateX(${posRef.current}px)`;
        }
    };

    const handleTouchEnd = () => {
        if (trackRef.current) {
            const halfWidth = trackRef.current.scrollWidth / 2;
            if (posRef.current > 0) posRef.current = posRef.current - halfWidth;
            if (Math.abs(posRef.current) >= halfWidth) posRef.current = posRef.current + halfWidth;
        }

        resumeTimer.current = setTimeout(() => {
            isPausedRef.current = false;
        }, 2000);
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
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Subtle fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/60 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/60 to-transparent z-10 pointer-events-none" />

                <div
                    ref={trackRef}
                    className="flex gap-4 pb-2"
                    style={{
                        willChange: "transform",
                        WebkitTransform: "translateZ(0)",
                        transform: "translateZ(0)",
                        touchAction: "pan-x",
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
                            <div
                                key={`${product.id}-${index}`}
                                className="flex-shrink-0 w-[200px] group relative"
                            >
                                <Link href={`/products/${product.slug}`}>
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

                                {/* Action icons overlay */}
                                <div className="absolute top-10 right-2 z-20 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product as any); forceRender((n) => n + 1); }}
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shadow-sm ${isWishlisted(product.id) ? "bg-red-500 text-white" : "bg-white/90 backdrop-blur-sm text-gray-500 hover:text-red-500"}`}
                                    >
                                        <Heart size={13} fill={isWishlisted(product.id) ? "currentColor" : "none"} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); isComparing(product.id) ? removeCompare(product.id) : addCompare(product as any); forceRender((n) => n + 1); }}
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shadow-sm ${isComparing(product.id) ? "bg-blue-600 text-white" : "bg-white/90 backdrop-blur-sm text-gray-500 hover:text-blue-600"}`}
                                    >
                                        <CompareIcon size={13} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
