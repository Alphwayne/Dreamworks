"use client";

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
            <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(59,130,246,0.12)] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">

                {/* IMAGE - fills top half edge-to-edge, no padding, no container bg */}
                <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
                    <img
                        src={image}
                        alt={product.product_name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Discount badge */}
                    {discount && (
                        <span className="absolute top-2.5 left-2.5 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-lg">
                            -{discount}%
                        </span>
                    )}

                    {/* Heart + Eye - appear ON the image on hover, top right */}
                    <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                        <button
                            onClick={handleLike}
                            className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all ${liked
                                ? "bg-red-500 scale-110"
                                : "bg-white/80 hover:bg-white hover:scale-110"
                                }`}
                        >
                            <Heart size={12} className={liked ? "text-white fill-white" : "text-gray-700"} />
                        </button>
                        <button className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-md">
                            <Eye size={12} className="text-gray-700" />
                        </button>
                    </div>

                    {/* Add to Cart - small gradient blue button, appears at bottom of image on hover */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hidden sm:block">
                        <button
                            onClick={handleAdd}
                            className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold text-[11px] transition-all shadow-lg ${added
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30"
                                }`}
                        >
                            <ShoppingCart size={11} />
                            {added ? "Added ✓" : "Add to Cart"}
                        </button>
                    </div>
                </div>

                {/* INFO - bottom portion */}
                <div className="p-3.5 flex flex-col flex-1">
                    <p className="text-[8px] font-bold text-blue-500/70 uppercase tracking-[0.12em] mb-1.5">
                        {product.category.split(" ").slice(0, 2).join(" ")}
                    </p>

                    <h3 className="text-[12px] font-semibold text-gray-800 line-clamp-2 mb-auto group-hover:text-blue-600 transition-colors leading-snug">
                        {product.product_name}
                    </h3>

                    <div className="mt-2.5 pt-2.5 border-t border-gray-50">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-gray-900">
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
                            className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-semibold text-[11px] transition-all mt-2.5 sm:hidden ${added
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20"
                                }`}
                        >
                            <ShoppingCart size={11} />
                            {added ? "Added ✓" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
