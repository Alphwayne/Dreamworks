"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { Product, formatPrice, formatDiscount, getProductImage } from "@/lib/types";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

interface ProductCardProps {
    product: Product;
}

// Brand-consistent color palette - all blue/indigo mixes
const CATEGORY_COLORS: Record<string, { dot: string; badge: string; text: string }> = {
    "COMPUTING ACCESSORIES": { dot: "bg-blue-600", badge: "bg-blue-50 text-blue-700 border-blue-100", text: "text-blue-700" },
    "MOBILE & TABLET": { dot: "bg-indigo-600", badge: "bg-indigo-50 text-indigo-700 border-indigo-100", text: "text-indigo-700" },
    "ENTERPRISE": { dot: "bg-blue-700", badge: "bg-blue-50 text-blue-800 border-blue-100", text: "text-blue-800" },
    "ACCESSORIES": { dot: "bg-slate-600", badge: "bg-slate-50 text-slate-700 border-slate-100", text: "text-slate-700" },
    "POWER": { dot: "bg-blue-500", badge: "bg-sky-50 text-sky-700 border-sky-100", text: "text-sky-700" },
    "CONSUMER ELECTRONICS": { dot: "bg-indigo-500", badge: "bg-indigo-50 text-indigo-700 border-indigo-100", text: "text-indigo-700" },
    "APPLE": { dot: "bg-gray-800", badge: "bg-gray-50 text-gray-800 border-gray-200", text: "text-gray-800" },
    "HP BRAND": { dot: "bg-blue-700", badge: "bg-blue-50 text-blue-800 border-blue-100", text: "text-blue-800" },
    "PRINT & SUPPLIES": { dot: "bg-sky-600", badge: "bg-sky-50 text-sky-700 border-sky-100", text: "text-sky-700" },
    "FACTORY RECERTIFIED": { dot: "bg-blue-500", badge: "bg-blue-50 text-blue-600 border-blue-100", text: "text-blue-600" },
    "OPEN BOX": { dot: "bg-indigo-500", badge: "bg-indigo-50 text-indigo-600 border-indigo-100", text: "text-indigo-600" },
    "OTHER BRAND": { dot: "bg-gray-500", badge: "bg-gray-50 text-gray-600 border-gray-100", text: "text-gray-600" },
    "USED": { dot: "bg-slate-500", badge: "bg-slate-50 text-slate-600 border-slate-100", text: "text-slate-600" },
};

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((s) => s.addItem);
    const discount = formatDiscount(product.selling_price, product.compare_price);
    const image = getProductImage(product);
    const [added, setAdded] = useState(false);
    const colors = CATEGORY_COLORS[product.category] || { dot: "bg-blue-600", badge: "bg-blue-50 text-blue-700 border-blue-100", text: "text-blue-700" };

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    return (
        <Link href={`/products/${product.slug}`} className="group block h-full">
            <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-400 hover:-translate-y-1 flex flex-col h-full">

                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-slate-50 flex-shrink-0">
                    <Image
                        src={image}
                        alt={product.product_name}
                        fill
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+"
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-600 ease-out"
                        sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
                    />

                    {/* Top-left badge */}
                    <div className="absolute top-2.5 left-2.5">
                        {discount ? (
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                                -{discount}%
                            </span>
                        ) : (
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${colors.badge}`}>
                                Available
                            </span>
                        )}
                    </div>

                    {/* Quick view — top right */}
                    <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                        <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-gray-100">
                            <Eye size={13} className="text-gray-600" />
                        </div>
                    </div>

                    {/* Hover cart — bottom */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hidden sm:block">
                        <button
                            onClick={handleAdd}
                            className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl font-semibold text-xs transition-all ${added
                                ? "bg-blue-600 text-white"
                                : "bg-white/95 backdrop-blur-sm text-gray-800 hover:bg-blue-700 hover:text-white border border-gray-200 hover:border-blue-700"
                                }`}
                        >
                            <ShoppingCart size={12} />
                            {added ? "Added ✓" : "Add to Cart"}
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col flex-1">
                    {/* Category dot + name */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider truncate">
                            {product.category.split(" ").slice(0, 2).join(" ")}
                        </p>
                    </div>

                    <h3 className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors leading-snug flex-1">
                        {product.product_name}
                    </h3>

                    <div className="mt-auto pt-2 border-t border-gray-50">
                        <div className="flex items-baseline gap-1.5 mb-2">
                            <span className={`text-sm md:text-base font-bold ${colors.text}`}>
                                {formatPrice(product.selling_price)}
                            </span>
                            {product.compare_price && product.compare_price > product.selling_price && (
                                <span className="text-[10px] text-gray-400 line-through">
                                    {formatPrice(product.compare_price)}
                                </span>
                            )}
                        </div>

                        {/* Mobile add to cart */}
                        <button
                            onClick={handleAdd}
                            className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl font-semibold text-xs transition-all sm:hidden ${added ? "bg-blue-600 text-white" : "bg-blue-700 text-white hover:bg-blue-800"
                                }`}
                        >
                            <ShoppingCart size={12} />
                            {added ? "Added ✓" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
