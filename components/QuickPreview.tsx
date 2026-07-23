"use client";

import { useState } from "react";
import { X, ShoppingCart, Heart, ArrowRight, Star, Minus, Plus, Truck, Shield, Package, Check } from "lucide-react";
import Link from "next/link";
import { Product, formatPrice, formatDiscount, getProductImage } from "@/lib/types";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface QuickPreviewProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

// Extract specs from product name
function extractSpecs(name: string): { label: string; value: string }[] {
    const specs: { label: string; value: string }[] = [];

    // RAM
    const ramMatch = name.match(/(\d+)\s*GB\s*(RAM|DDR)/i) || name.match(/(\d+)GB/i);
    if (ramMatch) specs.push({ label: "Memory", value: `${ramMatch[1]}GB RAM` });

    // Storage
    const storageMatch = name.match(/(\d+)\s*(TB|GB)\s*(SSD|HDD|NVMe|Storage)/i);
    if (storageMatch) specs.push({ label: "Storage", value: `${storageMatch[1]}${storageMatch[2]} ${storageMatch[3]}` });

    // Processor
    const procMatch = name.match(/(i[3579]|Ryzen\s*\d|M[1-4]|Snapdragon|A\d+)/i);
    if (procMatch) specs.push({ label: "Processor", value: procMatch[1] });

    // Screen size
    const screenMatch = name.match(/(\d+\.?\d*)["\u201D\u2033]|\b(\d+\.?\d*)\s*inch/i);
    if (screenMatch) specs.push({ label: "Display", value: `${screenMatch[1] || screenMatch[2]}" Screen` });

    // Resolution
    const resMatch = name.match(/(4K|8K|FHD|QHD|UHD|1080p|2160p|Retina|5K)/i);
    if (resMatch) specs.push({ label: "Resolution", value: resMatch[1].toUpperCase() });

    return specs;
}

// Generate highlights based on category
function getHighlights(product: Product): string[] {
    const highlights: string[] = [];
    const name = product.product_name.toLowerCase();
    const cat = product.category?.toLowerCase() || "";

    if (name.includes("laptop") || cat.includes("laptop")) {
        highlights.push("Portable & lightweight design");
        highlights.push("Built for productivity");
    } else if (name.includes("monitor") || name.includes("display")) {
        highlights.push("Vivid color accuracy");
        highlights.push("Eye-care technology");
    } else if (name.includes("phone") || cat.includes("phone")) {
        highlights.push("All-day battery life");
        highlights.push("Advanced camera system");
    } else if (name.includes("printer")) {
        highlights.push("Fast print speeds");
        highlights.push("Wireless connectivity");
    } else if (name.includes("headphone") || name.includes("earbuds") || name.includes("speaker")) {
        highlights.push("Premium sound quality");
        highlights.push("Comfortable fit");
    } else {
        highlights.push("Premium build quality");
        highlights.push("Industry-leading performance");
    }

    highlights.push("Official warranty included");
    return highlights;
}

export function QuickPreview({ product, isOpen, onClose }: QuickPreviewProps) {
    const addItem = useCartStore((s) => s.addItem);
    const { toggleItem, isInWishlist } = useWishlistStore();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const image = getProductImage(product);
    const discount = formatDiscount(product.selling_price, product.compare_price);
    const liked = isInWishlist(product.id);
    const specs = extractSpecs(product.product_name);
    const highlights = getHighlights(product);

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
            <div className="fixed z-[61] inset-2 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[90vw] sm:max-w-[750px] sm:max-h-[88vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scaleIn">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                    <X size={16} className="text-gray-600" />
                </button>

                <div className="flex flex-col sm:flex-row flex-1 overflow-y-auto">
                    {/* Image */}
                    <div className="relative sm:w-[45%] aspect-[4/3] sm:aspect-auto bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
                        <img
                            src={image}
                            alt={product.product_name}
                            className="w-full h-full object-contain p-4 sm:p-6"
                        />
                        {discount && (
                            <div className="absolute top-3 left-3">
                                <span className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg">
                                    -{discount}% OFF
                                </span>
                            </div>
                        )}
                        {/* In Stock badge */}
                        <div className="absolute bottom-3 left-3">
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                                <Check size={10} />
                                In Stock
                            </span>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="sm:w-[55%] p-4 sm:p-6 flex flex-col">
                        {/* Category */}
                        <span className="text-[9px] sm:text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                            {product.category}
                        </span>

                        {/* Name */}
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 mt-1.5 leading-tight">
                            {product.product_name}
                        </h2>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={i < 4 ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                            ))}
                            <span className="text-[10px] text-gray-400 ml-1">(4.0) • 12 reviews</span>
                        </div>

                        {/* Price */}
                        <div className="mt-3">
                            <span className="text-xl sm:text-2xl font-black text-gray-900">
                                {formatPrice(product.selling_price)}
                            </span>
                            {product.compare_price && product.compare_price > product.selling_price && (
                                <span className="text-xs sm:text-sm text-gray-400 line-through ml-2">
                                    {formatPrice(product.compare_price)}
                                </span>
                            )}
                        </div>

                        {/* Specs - extracted from product name */}
                        {specs.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 gap-1.5">
                                {specs.map((spec, i) => (
                                    <div key={i} className="bg-gray-50 rounded-lg px-2.5 py-1.5">
                                        <p className="text-[9px] text-gray-400 uppercase font-medium">{spec.label}</p>
                                        <p className="text-xs font-semibold text-gray-800">{spec.value}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Highlights */}
                        <div className="mt-3 space-y-1.5">
                            {highlights.map((h, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Check size={12} className="text-emerald-500 flex-shrink-0" />
                                    <span className="text-xs text-gray-600">{h}</span>
                                </div>
                            ))}
                        </div>

                        {/* Delivery & Trust info */}
                        <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-gray-500">
                            <span className="flex items-center gap-1">
                                <Truck size={11} className="text-blue-500" />
                                Lagos: 1-3 days
                            </span>
                            <span className="flex items-center gap-1">
                                <Shield size={11} className="text-emerald-500" />
                                Warranty
                            </span>
                            <span className="flex items-center gap-1">
                                <Package size={11} className="text-purple-500" />
                                Genuine Product
                            </span>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed">
                                {product.description}
                            </p>
                        )}

                        {/* Quantity selector */}
                        <div className="flex items-center gap-3 mt-4">
                            <span className="text-xs font-medium text-gray-600">Qty:</span>
                            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                    <Minus size={12} />
                                </button>
                                <span className="w-8 text-center text-xs font-bold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                    <Plus size={12} />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto pt-4 space-y-2">
                            <button
                                onClick={handleAdd}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                                    added
                                        ? "bg-emerald-500 text-white"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.01]"
                                }`}
                            >
                                <ShoppingCart size={15} />
                                {added ? "Added to Cart" : "Add to Cart"}
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleItem(product)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-xs border-2 transition-all ${
                                        liked
                                            ? "border-red-200 bg-red-50 text-red-600"
                                            : "border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500"
                                    }`}
                                >
                                    <Heart size={13} className={liked ? "fill-red-500" : ""} />
                                    {liked ? "Saved" : "Wishlist"}
                                </button>

                                <Link
                                    href={`/products/${product.slug}`}
                                    onClick={onClose}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-xs border-2 border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600 transition-all"
                                >
                                    Full Details
                                    <ArrowRight size={13} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
