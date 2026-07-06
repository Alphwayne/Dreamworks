"use client";

import { useState, useEffect } from "react";
import { Star, ShoppingCart, TrendingUp, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/types";

interface DealProduct {
    id: number;
    product_name: string;
    selling_price: number;
    compare_price: number | null;
    image_url: string | null;
    slug: string;
    category: string;
    description: string | null;
}

function LiveCounter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Simulate viewers count
        setCount(Math.floor(Math.random() * 40) + 15);
        const interval = setInterval(() => {
            setCount((prev) => prev + Math.floor(Math.random() * 3) - 1);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-1.5 text-xs">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-gray-500">{count} people viewing this</span>
        </div>
    );
}

function ProgressBar({ sold, total }: { sold: number; total: number }) {
    const percentage = Math.min((sold / total) * 100, 95);

    return (
        <div className="w-full">
            <div className="flex justify-between text-xs mb-1.5">
                <span className="text-orange-600 font-bold">{sold} sold</span>
                <span className="text-gray-400">{total - sold} left</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{
                        width: `${percentage}%`,
                        background: "linear-gradient(90deg, #f97316, #dc2626)",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
            </div>
        </div>
    );
}

export function DealOfTheDay({ product }: { product: DealProduct | null }) {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const endTime = new Date();
        endTime.setHours(23, 59, 59, 999);

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime.getTime() - now;
            if (distance < 0) return;
            setTimeLeft({
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!product) return null;

    const discount = product.compare_price
        ? Math.round(((product.compare_price - product.selling_price) / product.compare_price) * 100)
        : 0;

    const savings = product.compare_price ? product.compare_price - product.selling_price : 0;

    return (
        <section className="py-8 px-4 max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-lg shadow-blue-500/5 hover:shadow-xl transition-shadow duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Left - Product Image */}
                    <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 md:p-12 flex items-center justify-center min-h-[320px]">
                        {/* Badge */}
                        <div className="absolute top-4 left-4 z-10">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-blue-500/30 flex items-center gap-1.5">
                                <Star size={12} fill="currentColor" />
                                DEAL OF THE DAY
                            </div>
                        </div>

                        {/* Discount badge */}
                        {discount > 0 && (
                            <div className="absolute top-4 right-4 z-10">
                                <div className="bg-red-500 text-white text-lg font-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                                    -{discount}%
                                </div>
                            </div>
                        )}

                        {/* Product image */}
                        <div className="relative w-full h-64 md:h-80">
                            <Image
                                src={product.image_url || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"}
                                alt={product.product_name}
                                fill
                                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        {/* Floating decorative elements */}
                        <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm">
                            <LiveCounter />
                        </div>
                    </div>

                    {/* Right - Product Info */}
                    <div className="p-6 md:p-10 flex flex-col justify-center">
                        {/* Timer */}
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-xs text-gray-500 font-medium">Offer ends in:</span>
                            <div className="flex items-center gap-1">
                                {[
                                    { value: timeLeft.hours, label: "hrs" },
                                    { value: timeLeft.minutes, label: "min" },
                                    { value: timeLeft.seconds, label: "sec" },
                                ].map((unit, i) => (
                                    <div key={i} className="flex items-center gap-1">
                                        <span className="bg-gray-900 text-white text-sm font-bold px-2 py-1 rounded-md min-w-[32px] text-center tabular-nums">
                                            {String(unit.value).padStart(2, "0")}
                                        </span>
                                        <span className="text-[9px] text-gray-400">{unit.label}</span>
                                        {i < 2 && <span className="text-gray-300 mx-0.5">:</span>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Category */}
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-2">{product.category}</p>

                        {/* Title */}
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3">
                            {product.product_name}
                        </h2>

                        {/* Description */}
                        {product.description && (
                            <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{product.description}</p>
                        )}

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-2">
                            <span className="text-3xl md:text-4xl font-black text-gray-900">{formatPrice(product.selling_price)}</span>
                            {product.compare_price && (
                                <span className="text-lg text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
                            )}
                        </div>
                        {savings > 0 && (
                            <p className="text-green-600 text-sm font-bold mb-5 flex items-center gap-1">
                                <TrendingUp size={14} /> You save {formatPrice(savings)}
                            </p>
                        )}

                        {/* Progress bar */}
                        <div className="mb-6">
                            <ProgressBar sold={Math.floor(Math.random() * 30) + 20} total={60} />
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href={`/products/${product.slug}`}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-4 rounded-2xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 text-sm"
                            >
                                <ShoppingCart size={18} /> Grab This Deal
                            </Link>
                            <Link
                                href={`/products/${product.slug}`}
                                className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-blue-200 text-gray-700 font-semibold px-6 py-4 rounded-2xl transition-all hover:bg-blue-50 text-sm"
                            >
                                <Eye size={16} /> View Details
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
