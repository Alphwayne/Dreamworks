"use client";

import { useCompareStore } from "@/store/compareStore";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, getProductImage } from "@/lib/types";
import { X, ShoppingCart, Trash2, Ruler } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";

export default function ComparePage() {
    const { items, removeItem, clearCompare } = useCompareStore();
    const addToCart = useCartStore((s) => s.addItem);
    const [showSizeOverlay, setShowSizeOverlay] = useState(false);

    if (items.length === 0) {
        return (
            <>
                <Header />
                <CartDrawer />
                <main className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <svg width={32} height={32} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M10 2v16" /><path d="M3 5l7-3 7 3" /><path d="M3 5l-1 6h5L6 5" /><path d="M14 5l1 6h5l-1-6" /><circle cx="3" cy="5" r="0.5" fill="currentColor" /><circle cx="17" cy="5" r="0.5" fill="currentColor" /><path d="M2 11a2 2 0 004 0" /><path d="M15 11a2 2 0 004 0" /><rect x="8.5" y="16" width="3" height="2" rx="1" fill="currentColor" opacity="0.3" /></svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">Compare Products</h1>
                        <p className="text-gray-500 mb-8">Add products to compare by clicking the compare icon on product cards.</p>
                        <Link
                            href="/search"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Browse Products
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    // Extract specs from product name for comparison
    const extractSpecs = (name: string) => {
        const specs: Record<string, string> = {};
        // RAM
        const ram = name.match(/(\d+)\s*GB\s*(RAM|DDR)/i);
        if (ram) specs["RAM"] = `${ram[1]} GB`;
        // Storage
        const storage = name.match(/(\d+)\s*(GB|TB)\s*(SSD|HDD|Storage|ROM)/i);
        if (storage) specs["Storage"] = `${storage[1]} ${storage[2]}`;
        // Screen
        const screen = name.match(/(\d+\.?\d*)\s*["'']\s*(inch)?/i) || name.match(/(\d+\.?\d*)\s*inch/i);
        if (screen) specs["Screen"] = `${screen[1]}"`;
        // Processor
        const proc = name.match(/(i[3579]|Ryzen\s*\d|M[1-4]|A\d+|Snapdragon)/i);
        if (proc) specs["Processor"] = proc[1];
        // Battery
        const battery = name.match(/(\d+)\s*mAh/i);
        if (battery) specs["Battery"] = `${battery[1]} mAh`;
        return specs;
    };

    const allSpecs = items.map((item) => extractSpecs(item.product_name));
    const allSpecKeys = [...new Set(allSpecs.flatMap((s) => Object.keys(s)))];

    return (
        <>
            <Header />
            <CartDrawer />
            <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v16" /><path d="M3 5l7-3 7 3" /><path d="M3 5l-1 6h5L6 5" /><path d="M14 5l1 6h5l-1-6" /><path d="M2 11a2 2 0 004 0" /><path d="M15 11a2 2 0 004 0" /><rect x="8.5" y="16" width="3" height="2" rx="1" fill="white" opacity="0.3" /></svg>
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Compare Products</h1>
                                <p className="text-xs text-gray-500">{items.length} product{items.length > 1 ? "s" : ""} selected</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {allSpecKeys.length > 0 && (
                                <button
                                    onClick={() => setShowSizeOverlay(!showSizeOverlay)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                        showSizeOverlay
                                            ? "bg-indigo-600 text-white"
                                            : "bg-white border border-gray-200 text-gray-700 hover:border-indigo-300"
                                    }`}
                                >
                                    <Ruler size={14} />
                                    <span className="hidden sm:inline">Spec Overlay</span>
                                </button>
                            )}
                            <button
                                onClick={clearCompare}
                                className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:border-red-300 hover:text-red-600 transition-all"
                            >
                                <Trash2 size={14} />
                                <span className="hidden sm:inline">Clear All</span>
                            </button>
                        </div>
                    </div>

                    {/* Comparison Grid */}
                    <div className="overflow-x-auto pb-4">
                        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(220px, 1fr))` }}>
                            {/* Product Cards Row */}
                            {items.map((product) => (
                                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm relative group">
                                    {/* Remove button */}
                                    <button
                                        onClick={() => removeItem(product.id)}
                                        className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors"
                                    >
                                        <X size={12} className="text-gray-500 group-hover:text-red-500" />
                                    </button>

                                    {/* Image */}
                                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-4 relative">
                                        <img
                                            src={getProductImage(product)}
                                            alt={product.product_name}
                                            className="w-full h-full object-contain"
                                        />
                                        {/* Size overlay badge */}
                                        {showSizeOverlay && extractSpecs(product.product_name)["Screen"] && (
                                            <div className="absolute bottom-2 left-2 right-2 bg-indigo-600/90 backdrop-blur-sm text-white text-center py-2 rounded-xl text-xs font-bold">
                                                {extractSpecs(product.product_name)["Screen"]} Display
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">
                                            {product.category}
                                        </span>
                                        <h3 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2 leading-tight">
                                            {product.product_name}
                                        </h3>
                                        <p className="text-lg font-black text-gray-900 mt-3">
                                            {formatPrice(product.selling_price)}
                                        </p>
                                        {product.compare_price && product.compare_price > product.selling_price && (
                                            <p className="text-xs text-gray-400 line-through">
                                                {formatPrice(product.compare_price)}
                                            </p>
                                        )}
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                                        >
                                            <ShoppingCart size={14} />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Specs Comparison Table */}
                    {allSpecKeys.length > 0 && (
                        <div className="mt-8 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Ruler size={16} className="text-indigo-600" />
                                    Specifications Comparison
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 w-32">Spec</th>
                                            {items.map((item) => (
                                                <th key={item.id} className="text-left text-xs font-semibold text-gray-700 px-4 py-3 min-w-[180px]">
                                                    {item.product_name.slice(0, 30)}...
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Price row */}
                                        <tr className="border-b border-gray-50 bg-blue-50/30">
                                            <td className="px-6 py-3 text-sm font-semibold text-gray-700">Price</td>
                                            {items.map((item) => (
                                                <td key={item.id} className="px-4 py-3 text-sm font-bold text-blue-700">
                                                    {formatPrice(item.selling_price)}
                                                </td>
                                            ))}
                                        </tr>
                                        {/* Category row */}
                                        <tr className="border-b border-gray-50">
                                            <td className="px-6 py-3 text-sm font-semibold text-gray-700">Category</td>
                                            {items.map((item) => (
                                                <td key={item.id} className="px-4 py-3 text-sm text-gray-600">
                                                    {item.category}
                                                </td>
                                            ))}
                                        </tr>
                                        {/* Extracted specs */}
                                        {allSpecKeys.map((key) => (
                                            <tr key={key} className="border-b border-gray-50">
                                                <td className="px-6 py-3 text-sm font-semibold text-gray-700">{key}</td>
                                                {items.map((item, idx) => (
                                                    <td key={item.id} className="px-4 py-3 text-sm text-gray-600">
                                                        {allSpecs[idx][key] || "—"}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Size Visual Overlay */}
                    {showSizeOverlay && items.length >= 2 && (
                        <div className="mt-8 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm p-6">
                            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Ruler size={16} className="text-indigo-600" />
                                Visual Size Comparison
                            </h2>
                            <div className="flex items-end justify-center gap-6 py-8 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl">
                                {items.map((product, idx) => {
                                    const specs = extractSpecs(product.product_name);
                                    const screenSize = parseFloat(specs["Screen"] || "0");
                                    // Scale factor: base 80px + screen inches * 8px
                                    const height = screenSize > 0 ? 80 + screenSize * 8 : 120;
                                    const width = height * 0.65;
                                    const colors = ["bg-blue-200 border-blue-400", "bg-purple-200 border-purple-400", "bg-emerald-200 border-emerald-400", "bg-amber-200 border-amber-400"];
                                    return (
                                        <div key={product.id} className="flex flex-col items-center gap-2">
                                            <div
                                                className={`${colors[idx % colors.length]} border-2 rounded-lg flex items-center justify-center transition-all`}
                                                style={{ width: `${width}px`, height: `${height}px` }}
                                            >
                                                <span className="text-xs font-bold text-gray-700">
                                                    {specs["Screen"] || "N/A"}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 font-medium text-center max-w-[120px] line-clamp-2">
                                                {product.product_name.slice(0, 25)}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
