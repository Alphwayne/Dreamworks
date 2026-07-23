"use client";

import Link from "next/link";
import { ShoppingCart, Eye, Heart, Star } from "lucide-react";

// Custom compare icon — split-screen side-by-side view
function CompareIcon({ size = 12 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Balance/scale icon - creative comparison symbol */}
            <path d="M10 2v16" />
            <path d="M3 5l7-3 7 3" />
            <path d="M3 5l-1 6h5L6 5" />
            <path d="M17 5l-1 6h5l-1-6" strokeWidth="0" />
            <path d="M14 5l1 6h5l-1-6" />
            <circle cx="3" cy="5" r="0.5" fill="currentColor" />
            <circle cx="17" cy="5" r="0.5" fill="currentColor" />
            <path d="M2 11a2 2 0 004 0" />
            <path d="M15 11a2 2 0 004 0" />
            <rect x="8.5" y="16" width="3" height="2" rx="1" fill="currentColor" opacity="0.3" />
        </svg>
    );
}
import { Product, formatPrice, formatDiscount, getProductImage } from "@/lib/types";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCompareStore } from "@/store/compareStore";
import { useState } from "react";
import { QuickPreview } from "./QuickPreview";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((s) => s.addItem);
    const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
    const { toggleItem: toggleCompare, isInCompare } = useCompareStore();
    const discount = formatDiscount(product.selling_price, product.compare_price);
    const image = getProductImage(product);
    const [added, setAdded] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const liked = isInWishlist(product.id);
    const comparing = isInCompare(product.id);

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    const handlePreview = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowPreview(true);
    };

    const handleCompare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleCompare(product);
    };

    return (
        <>
            <Link href={`/products/${product.slug}`} className="group block h-full">
                <div className="relative h-full rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-blue-200/60 shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.15)] transition-all duration-500 hover:-translate-y-1.5 flex flex-col">

                    {/* IMAGE SECTION */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        <img
                            src={image}
                            alt={product.product_name}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                            style={{ transform: "scale(1)", transition: "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                        />

                        {/* Subtle gradient overlay for depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Discount badge - top left */}
                        {discount && (
                            <div className="absolute top-3 left-3 z-10">
                                <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-blue-500/25">
                                    -{discount}%
                                </span>
                            </div>
                        )}

                        {/* Action icons - appear on hover, top right */}
                        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-400">
                            {/* Wishlist */}
                            <button
                                onClick={handleLike}
                                title={liked ? "Remove from Wishlist" : "Add to Wishlist"}
                                className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-lg border border-white/30 shadow-lg transition-all duration-300 hover:scale-110 ${liked
                                    ? "bg-red-500 border-red-400"
                                    : "bg-white/90 hover:bg-white"
                                    }`}
                            >
                                <Heart size={13} className={liked ? "text-white fill-white" : "text-gray-600"} />
                            </button>
                            {/* Quick Preview */}
                            <button
                                onClick={handlePreview}
                                title="Quick Preview"
                                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-lg border border-white/30 flex items-center justify-center hover:bg-blue-500 hover:text-white hover:border-blue-400 hover:scale-110 transition-all duration-300 shadow-lg"
                            >
                                <Eye size={13} className="text-gray-600 group-hover/btn:text-white" />
                            </button>
                            {/* Compare */}
                            <button
                                onClick={handleCompare}
                                title={comparing ? "Remove from Compare" : "Add to Compare"}
                                className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-lg border border-white/30 shadow-lg transition-all duration-300 hover:scale-110 ${comparing
                                    ? "bg-indigo-500 border-indigo-400"
                                    : "bg-white/90 hover:bg-white"
                                    }`}
                            >
                                <CompareIcon size={12} />
                            </button>
                        </div>

                        {/* Add to Cart - slides up from bottom of image on hover */}
                        <div className="absolute bottom-0 left-0 right-0 z-10 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out hidden sm:block">
                            <button
                                onClick={handleAdd}
                                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs backdrop-blur-lg border transition-all duration-300 shadow-xl ${added
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400/50 shadow-emerald-500/25"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500/50 shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02]"
                                    }`}
                            >
                                <ShoppingCart size={13} />
                                {added ? "Added ✓" : "Add to Cart"}
                            </button>
                        </div>
                    </div>

                    {/* INFO SECTION */}
                    <div className="p-4 flex flex-col flex-1">
                        {/* Category tag */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.15em] bg-blue-50 px-2 py-0.5 rounded-md">
                                {product.category.split(" ").slice(0, 2).join(" ")}
                            </span>
                        </div>

                        {/* Product name */}
                        <h3 className="text-[13px] font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300 leading-snug flex-1">
                            {product.product_name}
                        </h3>

                        {/* Rating stars */}
                        <div className="flex items-center gap-0.5 mt-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} className={i < 4 ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                            ))}
                            <span className="text-[9px] text-gray-400 ml-1">(4.0)</span>
                        </div>

                        {/* Price section */}
                        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                            <div>
                                <span className="text-base font-bold text-gray-900">
                                    {formatPrice(product.selling_price)}
                                </span>
                                {product.compare_price && product.compare_price > product.selling_price && (
                                    <span className="text-[10px] text-gray-400 line-through ml-1.5">
                                        {formatPrice(product.compare_price)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Mobile add to cart */}
                        <button
                            onClick={handleAdd}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs mt-3 transition-all duration-300 sm:hidden ${added
                                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20"
                                }`}
                        >
                            <ShoppingCart size={13} />
                            {added ? "Added ✓" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </Link>

            {/* Quick Preview Modal */}
            <QuickPreview
                product={product}
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
            />
        </>
    );
}
