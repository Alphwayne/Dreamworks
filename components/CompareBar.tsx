"use client";

import { useCompareStore } from "@/store/compareStore";
import { ArrowLeftRight, X } from "lucide-react";
import Link from "next/link";
import { getProductImage } from "@/lib/types";

export function CompareBar() {
    const { items, removeItem, clearCompare } = useCompareStore();

    if (items.length === 0) return null;

    return (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slideUp">
            <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl shadow-black/10 px-4 py-3 flex items-center gap-3">
                {/* Product thumbnails */}
                <div className="flex items-center gap-1.5">
                    {items.map((item) => (
                        <div key={item.id} className="relative group/thumb">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden border-2 border-indigo-200">
                                <img
                                    src={getProductImage(item)}
                                    alt={item.product_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                onClick={() => removeItem(item.id)}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                            >
                                <X size={8} className="text-white" />
                            </button>
                        </div>
                    ))}
                    {/* Empty slots */}
                    {[...Array(Math.max(0, 2 - items.length))].map((_, i) => (
                        <div key={`empty-${i}`} className="w-10 h-10 rounded-xl border-2 border-dashed border-gray-200" />
                    ))}
                </div>

                {/* Compare button */}
                <Link
                    href="/compare"
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-[1.02]"
                >
                    <ArrowLeftRight size={13} />
                    Compare ({items.length})
                </Link>

                {/* Clear */}
                <button
                    onClick={clearCompare}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors"
                >
                    <X size={12} className="text-gray-500" />
                </button>
            </div>
        </div>
    );
}
