"use client";

import { TrendingUp, Flame, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/types";

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
    if (!products.length) return null;

    return (
        <section className="py-10 px-4 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
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

            {/* Horizontal scroll */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                {products.map((product, index) => {
                    const discount = product.compare_price
                        ? Math.round(((product.compare_price - product.selling_price) / product.compare_price) * 100)
                        : 0;
                    const viewers = Math.floor(Math.random() * 30) + 5;

                    return (
                        <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            className="flex-shrink-0 w-[200px] group"
                        >
                            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 h-full">
                                {/* Rank badge */}
                                <div className="relative">
                                    <div className="absolute top-2 left-2 z-10 bg-gray-900/80 backdrop-blur-sm text-white text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center">
                                        #{index + 1}
                                    </div>
                                    {discount > 0 && (
                                        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                            -{discount}%
                                        </div>
                                    )}

                                    {/* Image */}
                                    <div className="relative h-44 bg-gray-50 p-4">
                                        <Image
                                            src={product.image_url || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=75"}
                                            alt={product.product_name}
                                            fill
                                            className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">{product.category?.split(" ")[0]}</p>
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
        </section>
    );
}
