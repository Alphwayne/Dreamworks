"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { Product, formatPrice, formatDiscount, getProductImage } from "@/lib/types";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((s) => s.addItem);
    const discount = formatDiscount(product.selling_price, product.compare_price);
    const image = getProductImage(product);
    const [added, setAdded] = useState(false);
    const [liked, setLiked] = useState(false);

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
        setLiked(!liked);
    };

    return (
        <Link href={`/products/${product.slug}`} className="group block h-full">
            <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100/60 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.12)] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">

                {/* IMAGE SECTION - fills top 50% of card, large and prominent */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/20">
                    {/* Product image - fills the space */}
                    <Image
                        src={image}
                        alt={product.product_name}
                        fill
                        loading="lazy"
                        className="object-contain p-4 sm:p-6 group-hover:scale-108 transition-transform duration-700 ease-out"
                        sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
                        unoptimized
                    />

                    {/* Discount badge - top left */}
                    {discount && (
                        <div className="absolute top-3 left-3 z-10">
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-lg shadow-blue-500/25 backdrop-blur-sm">
                                -{discount}%
                            </span>
                        </div>
                    )}

                    {/* Heart + Eye icons - top right, appear on hover */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <button
                            onClick={handleLike}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-md ${liked
                                ? "bg-red-500 border-red-400 scale-110"
                                : "bg-white/90 border border-white/60 hover:bg-red-50 hover:scale-110"
                                }`}
                        >
                            <Heart size={14} className={liked ? "text-white fill-white" : "text-gray-600"} />
                        </button>
                        <button
                            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-white/60 flex items-center justify-center hover:bg-blue-50 hover:scale-110 transition-all duration-300 shadow-lg"
                        >
                            <Eye size={14} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Add to Cart - slides up from bottom of image on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-full group-hover:translate-y-0">
                        <button
                            onClick={handleAdd}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all shadow-xl backdrop-blur-md ${added
                                ? "bg-blue-600 text-white shadow-blue-500/40"
                                : "bg-white/95 text-gray-900 hover:bg-blue-600 hover:text-white border border-white/80 hover:border-blue-600 hover:shadow-blue-500/40"
                                }`}
                        >
                            <ShoppingCart size={15} />
                            {added ? "Added ✓" : "Add to Cart"}
                        </button>
                    </div>

                    {/* Subtle shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>

                {/* INFO SECTION - bottom portion */}
                <div className="p-4 flex flex-col flex-1">
                    {/* Category tag */}
                    <p className="text-[9px] font-bold text-blue-500/80 uppercase tracking-[0.12em] mb-2">
                        {product.category.split(" ").slice(0, 2).join(" ")}
                    </p>

                    {/* Product name */}
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-auto group-hover:text-blue-600 transition-colors leading-snug">
                        {product.product_name}
                    </h3>

                    {/* Price section */}
                    <div className="mt-3 pt-3 border-t border-gray-100/80">
                        <div className="flex items-baseline gap-2">
                            <span className="text-base font-bold text-gray-900">
                                {formatPrice(product.selling_price)}
                            </span>
                            {product.compare_price && product.compare_price > product.selling_price && (
                                <span className="text-[11px] text-gray-400 line-through">
                                    {formatPrice(product.compare_price)}
                                </span>
                            )}
                        </div>

                        {/* Mobile add to cart - always visible on mobile */}
                        <button
                            onClick={handleAdd}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all mt-3 sm:hidden ${added
                                ? "bg-blue-600 text-white"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20"
                                }`}
                        >
                            <ShoppingCart size={14} />
                            {added ? "Added ✓" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
