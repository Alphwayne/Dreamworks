"use client";

import { useRecentlyViewedStore } from "@/store/recentlyViewedStore";
import { formatPrice, getProductImage } from "@/lib/types";
import { Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

export function RecentlyViewed() {
    const { items } = useRecentlyViewedStore();

    if (items.length < 2) return null;

    return (
        <section className="py-8 px-4 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20">
                        <Clock size={16} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Recently Viewed</h2>
                        <p className="text-xs text-gray-400">Pick up where you left off</p>
                    </div>
                </div>
            </div>

            {/* Horizontal scroll strip */}
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
                {items.map((product) => (
                    <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="flex-shrink-0 w-[140px] sm:w-[160px] group"
                    >
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-blue-200/50 transition-all duration-300 hover:-translate-y-0.5">
                            {/* Image */}
                            <div className="aspect-square bg-gray-50 p-2 overflow-hidden">
                                <img
                                    src={getProductImage(product)}
                                    alt={product.product_name}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            {/* Info */}
                            <div className="p-2.5">
                                <p className="text-[10px] text-gray-900 font-medium line-clamp-2 leading-tight">
                                    {product.product_name}
                                </p>
                                <p className="text-xs font-bold text-blue-700 mt-1.5">
                                    {formatPrice(product.selling_price)}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
