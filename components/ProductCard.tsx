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
            <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100/80 shadow-sm hover:shadow-2xl hover:shadow-blue-500/8 transition-all duration-500 hover:-translate-y-1.5 flex flex-col h-full">

                {/* Image Section - fills top half */}
                <div className="relative h-[55%] min-h-[180px] overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex-shrink-0">
                    <Image
                        src={image}
                        alt={product.product_name}
                        fill
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+"
                        className="object-contain p-5 group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
                    />

                    {/* Discount badge - top left */}
                    {discount && (
                        <div className="absolute top-3 left-3 z-10">
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md shadow-blue-500/20">
                                -{discount}%
                            </span>
                        </div>
                    )}

                    {/* Heart + Eye icons on image - top right */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                        <button
                            onClick={handleLike}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${liked
                                ? "bg-red-50 border border-red-200"
                                : "bg-white/90 backdrop-blur-sm border border-gray-100 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
                                }`}
                        >
                            <Heart size={13} className={liked ? "text-red-500 fill-red-500" : "text-gray-500"} />
                        </button>
                        <button
                            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 shadow-sm"
                        >
                            <Eye size={13} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Add to Cart overlay on hover - bottom of image */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0 hidden sm:block">
                        <button
                            onClick={handleAdd}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg ${added
                                ? "bg-blue-600 text-white shadow-blue-500/30"
                                : "bg-white/95 backdrop-blur-md text-gray-800 hover:bg-blue-600 hover:text-white border border-gray-200/50 hover:border-blue-600 hover:shadow-blue-500/30"
                                }`}
                        >
                            <ShoppingCart size={13} />
                            {added ? "Added ✓" : "Add to Cart"}
                        </button>
                    </div>
                </div>

                {/* Info Section - bottom half */}
                <div className="p-3.5 flex flex-col flex-1">
                    {/* Category label */}
                    <p className="text-[9px] font-bold text-blue-500/80 uppercase tracking-widest mb-1.5">
                        {product.category.split(" ").slice(0, 2).join(" ")}
                    </p>

                    <h3 className="text-xs md:text-[13px] font-semibold text-gray-800 line-clamp-2 mb-auto group-hover:text-blue-600 transition-colors leading-snug">
                        {product.product_name}
                    </h3>

                    <div className="mt-3 pt-2.5 border-t border-gray-100/80">
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm md:text-base font-bold text-gray-900">
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
                            className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-xs transition-all mt-2.5 sm:hidden ${added ? "bg-blue-600 text-white" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-500/20"
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
