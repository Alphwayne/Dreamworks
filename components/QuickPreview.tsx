"use client";

import { useState } from "react";
import { X, ShoppingCart, Heart, ArrowRight, Star, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { Product, formatPrice, formatDiscount, getProductImage } from "@/lib/types";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface QuickPreviewProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export function QuickPreview({ product, isOpen, onClose }: QuickPreviewProps) {
    const addItem = useCartStore((s) => s.addItem);
    const { toggleItem, isInWishlist } = useWishlistStore();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const image = getProductImage(product);
    const discount = formatDiscount(product.selling_price, product.compare_price);
    const liked = isInWishlist(product.id);

    if (!isOpen) return null;

    const handleAdd = () => {
        addItem(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed z-[61] inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[90vw] sm:max-w-[700px] sm:max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scaleIn">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                    <X size={18} className="text-gray-600" />
                </button>

                <div className="flex flex-col sm:flex-row flex-1 overflow-y-auto">
                    {/* Image */}
                    <div className="relative sm:w-1/2 aspect-square sm:aspect-auto bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
                        <img
                            src={image}
                            alt={product.product_name}
                            className="w-full h-full object-contain p-6"
                        />
                        {discount && (
                            <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                    -{discount}% OFF
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="sm:w-1/2 p-6 flex flex-col">
                        {/* Category */}
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                            {product.category}
                        </span>

                        {/* Name */}
                        <h2 className="text-lg font-bold text-gray-900 mt-2 leading-tight">
                            {product.product_name}
                        </h2>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className={i < 4 ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                            ))}
                            <span className="text-xs text-gray-400 ml-1">(4.0)</span>
                        </div>

                        {/* Price */}
                        <div className="mt-4">
                            <span className="text-2xl font-black text-gray-900">
                                {formatPrice(product.selling_price)}
                            </span>
                            {product.compare_price && product.compare_price > product.selling_price && (
                                <span className="text-sm text-gray-400 line-through ml-2">
                                    {formatPrice(product.compare_price)}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="text-sm text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                                {product.description}
                            </p>
                        )}

                        {/* Quantity selector */}
                        <div className="flex items-center gap-3 mt-5">
                            <span className="text-sm font-medium text-gray-600">Qty:</span>
                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto pt-5 space-y-2.5">
                            <button
                                onClick={handleAdd}
                                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${
                                    added
                                        ? "bg-emerald-500 text-white"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.01]"
                                }`}
                            >
                                <ShoppingCart size={16} />
                                {added ? "Added to Cart ✓" : "Add to Cart"}
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleItem(product)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                                        liked
                                            ? "border-red-200 bg-red-50 text-red-600"
                                            : "border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500"
                                    }`}
                                >
                                    <Heart size={14} className={liked ? "fill-red-500" : ""} />
                                    {liked ? "Wishlisted" : "Wishlist"}
                                </button>

                                <Link
                                    href={`/products/${product.slug}`}
                                    onClick={onClose}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border-2 border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600 transition-all"
                                >
                                    Full Details
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
