"use client";

import { ArrowRight, Zap, Eye, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/types";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCompareStore } from "@/store/compareStore";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

interface NewProduct {
    id: number;
    product_name: string;
    selling_price: number;
    compare_price: number | null;
    image_url: string | null;
    slug: string;
    category: string;
    created_at: string;
}

// Custom animated flame SVG
function AnimatedFlame({ className = "" }: { className?: string }) {
    return (
        <div className={`relative ${className}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="animate-flicker">
                <path
                    d="M12 2C12 2 4 8 4 14C4 18.4183 7.58172 22 12 22C16.4183 22 20 18.4183 20 14C20 8 12 2 12 2Z"
                    className="fill-orange-400"
                />
                <path
                    d="M12 6C12 6 8 10 8 14C8 16.2091 9.79086 18 12 18C14.2091 18 16 16.2091 16 14C16 10 12 6 12 6Z"
                    className="fill-yellow-300"
                />
                <path
                    d="M12 10C12 10 10 12 10 14C10 15.1046 10.8954 16 12 16C13.1046 16 14 15.1046 14 14C14 12 12 10 12 10Z"
                    className="fill-white/80"
                />
            </svg>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-orange-400/30 blur-md animate-pulse" />
        </div>
    );
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

export function JustLaunched({ products }: { products: NewProduct[] }) {
    const [quickPreviewId, setQuickPreviewId] = useState<number | null>(null);
    const wishlist = useWishlistStore((s) => s.items);
    const toggleWishlist = useWishlistStore((s) => s.toggleItem);
    const compareItems = useCompareStore((s) => s.items);
    const addCompare = useCompareStore((s) => s.addItem);
    const removeCompare = useCompareStore((s) => s.removeItem);
    const addToCart = useCartStore((s) => s.addItem);

    if (!products.length) return null;

    const hero = products[0];
    const supporting = products.slice(1, 5);

    const isWishlisted = (id: number) => wishlist.some((w) => w.id === id);
    const isComparing = (id: number) => compareItems.some((c) => c.id === id);

    return (
        <section className="py-10 px-4 max-w-7xl mx-auto">
            {/* Header with animated flame */}
            <div className="flex items-center gap-3 mb-6">
                <div className="relative w-11 h-11 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <AnimatedFlame />
                    {/* Particle sparks */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75" />
                    <div className="absolute -top-0.5 left-0 w-1.5 h-1.5 bg-orange-300 rounded-full animate-ping opacity-60" style={{ animationDelay: "0.5s" }} />
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Just Launched
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Hot</span>
                    </h2>
                    <p className="text-xs text-gray-500">Fresh arrivals you won&apos;t find anywhere else</p>
                </div>
            </div>

            {/* Bento grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Hero product - large card */}
                <div className="lg:col-span-2 lg:row-span-2 group relative">
                    <Link href={`/products/${hero.slug}`}>
                        <div className="relative h-full min-h-[360px] bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                            {/* Badge */}
                            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-orange-500/30">
                                    <Zap size={10} /> NEW DROP
                                </span>
                                <span className="bg-white/80 backdrop-blur-sm text-gray-600 text-[10px] font-semibold px-2.5 py-1.5 rounded-full">
                                    {new Date(hero.created_at).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                                </span>
                            </div>

                            {/* Product image */}
                            <div className="absolute inset-0 flex items-center justify-center p-12">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={hero.image_url || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"}
                                        alt={hero.product_name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        loading="lazy"
                                        className="object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>

                            {/* Bottom info overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent p-6 pt-16">
                                <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">{hero.category}</p>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
                                    {hero.product_name}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-black text-gray-900">{formatPrice(hero.selling_price)}</span>
                                        {hero.compare_price && (
                                            <span className="text-sm text-gray-400 line-through">{formatPrice(hero.compare_price)}</span>
                                        )}
                                    </div>
                                    <span className="flex items-center gap-1 text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                                        Shop now <ArrowRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Action icons for hero */}
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(hero as any); }}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-md ${isWishlisted(hero.id) ? "bg-red-500 text-white" : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-50 hover:text-red-500"}`}
                        >
                            <Heart size={16} fill={isWishlisted(hero.id) ? "currentColor" : "none"} />
                        </button>
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); isComparing(hero.id) ? removeCompare(hero.id) : addCompare(hero as any); }}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-md ${isComparing(hero.id) ? "bg-blue-600 text-white" : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"}`}
                        >
                            <CompareIcon size={16} />
                        </button>
                    </div>
                </div>

                {/* Supporting products - smaller cards with action icons */}
                {supporting.map((product) => (
                    <div key={product.id} className="group relative">
                        <Link href={`/products/${product.slug}`}>
                            <div className="bg-white rounded-2xl border border-gray-100 p-4 h-full hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
                                {/* Image */}
                                <div className="relative h-32 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl mb-3 overflow-hidden">
                                    <Image
                                        src={product.image_url || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=75"}
                                        alt={product.product_name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                        loading="lazy"
                                        className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <span className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                        <Zap size={8} /> NEW
                                    </span>
                                </div>

                                {/* Info */}
                                <p className="text-[9px] text-blue-500 uppercase font-bold tracking-wider">{product.category?.split(" ")[0]}</p>
                                <h3 className="text-xs font-bold text-gray-900 line-clamp-2 mt-1 leading-tight group-hover:text-blue-600 transition-colors flex-1">
                                    {product.product_name}
                                </h3>
                                <div className="flex items-baseline gap-1.5 mt-2">
                                    <span className="text-sm font-bold text-gray-900">{formatPrice(product.selling_price)}</span>
                                    {product.compare_price && (
                                        <span className="text-[10px] text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
                                    )}
                                </div>
                            </div>
                        </Link>

                        {/* Action icons overlay */}
                        <div className="absolute top-6 right-6 z-20 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product as any); }}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shadow-sm ${isWishlisted(product.id) ? "bg-red-500 text-white" : "bg-white/90 backdrop-blur-sm text-gray-500 hover:text-red-500"}`}
                            >
                                <Heart size={13} fill={isWishlisted(product.id) ? "currentColor" : "none"} />
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); isComparing(product.id) ? removeCompare(product.id) : addCompare(product as any); }}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shadow-sm ${isComparing(product.id) ? "bg-blue-600 text-white" : "bg-white/90 backdrop-blur-sm text-gray-500 hover:text-blue-600"}`}
                            >
                                <CompareIcon size={13} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Flame flicker animation */}
            <style jsx>{`
                @keyframes flicker {
                    0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
                    25% { transform: scale(1.05) rotate(-2deg); opacity: 0.9; }
                    50% { transform: scale(0.95) rotate(1deg); opacity: 1; }
                    75% { transform: scale(1.02) rotate(-1deg); opacity: 0.95; }
                }
                .animate-flicker {
                    animation: flicker 1.5s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}
