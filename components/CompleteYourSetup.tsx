"use client";

import { useState } from "react";
import { Package, Plus, Check, ShoppingCart, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/types";

interface BundleProduct {
    id: number;
    product_name: string;
    selling_price: number;
    image_url: string | null;
    slug: string;
    category: string;
}

interface SetupBundle {
    title: string;
    description: string;
    icon: string;
    gradient: string;
    products: BundleProduct[];
}

export function CompleteYourSetup({ bundles }: { bundles: SetupBundle[] }) {
    const [activeBundle, setActiveBundle] = useState(0);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

    if (!bundles.length) return null;

    const currentBundle = bundles[activeBundle];
    const totalPrice = currentBundle.products
        .filter((p) => selectedItems.has(p.id))
        .reduce((sum, p) => sum + p.selling_price, 0);

    const bundleDiscount = selectedItems.size >= 3 ? 0.05 : selectedItems.size >= 2 ? 0.03 : 0;
    const discountedTotal = totalPrice * (1 - bundleDiscount);

    function toggleItem(id: number) {
        setSelectedItems((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    return (
        <section className="py-10 px-4 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Package size={20} className="text-white" />
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Complete Your Setup</h2>
                    <p className="text-xs text-gray-500">Bundle products together and save up to 5%</p>
                </div>
            </div>

            {/* Bundle tabs */}
            <div className="flex gap-2 mt-5 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {bundles.map((bundle, i) => (
                    <button
                        key={i}
                        onClick={() => { setActiveBundle(i); setSelectedItems(new Set()); }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeBundle === i
                                ? "bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        <span>{bundle.icon}</span>
                        {bundle.title}
                    </button>
                ))}
            </div>

            {/* Bundle content */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-5 md:p-8">
                    <p className="text-sm text-gray-600 mb-6">{currentBundle.description}</p>

                    {/* Product grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {currentBundle.products.map((product) => {
                            const isSelected = selectedItems.has(product.id);
                            return (
                                <button
                                    key={product.id}
                                    onClick={() => toggleItem(product.id)}
                                    className={`relative text-left rounded-2xl border-2 p-3 transition-all duration-300 ${isSelected
                                            ? "border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10"
                                            : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
                                        }`}
                                >
                                    {/* Selection indicator */}
                                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${isSelected ? "bg-blue-600 scale-100" : "bg-gray-100 scale-90"
                                        }`}>
                                        {isSelected ? <Check size={12} className="text-white" /> : <Plus size={12} className="text-gray-400" />}
                                    </div>

                                    {/* Image */}
                                    <div className="relative h-24 mb-2">
                                        <Image
                                            src={product.image_url || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=75"}
                                            alt={product.product_name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>

                                    {/* Info */}
                                    <p className="text-[10px] text-gray-400 uppercase font-semibold">{product.category?.split(" ")[0]}</p>
                                    <p className="text-xs font-semibold text-gray-900 line-clamp-2 mt-0.5 leading-tight">{product.product_name}</p>
                                    <p className="text-sm font-bold text-blue-700 mt-1.5">{formatPrice(product.selling_price)}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Bundle summary bar */}
                {selectedItems.size > 0 && (
                    <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/30 px-5 md:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-900">
                                    {selectedItems.size} item{selectedItems.size > 1 ? "s" : ""} selected
                                </span>
                                {bundleDiscount > 0 && (
                                    <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                        <Sparkles size={10} /> {bundleDiscount * 100}% bundle discount
                                    </span>
                                )}
                            </div>
                            <div className="flex items-baseline gap-2 mt-0.5">
                                <span className="text-xl font-black text-gray-900">{formatPrice(discountedTotal)}</span>
                                {bundleDiscount > 0 && (
                                    <span className="text-sm text-gray-400 line-through">{formatPrice(totalPrice)}</span>
                                )}
                            </div>
                        </div>
                        <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 text-sm">
                            <ShoppingCart size={16} /> Add Bundle to Cart
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
