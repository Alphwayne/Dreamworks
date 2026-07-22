"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Product, formatPrice } from "@/lib/types";
import { useCartStore } from "@/store/cartStore";

interface QuickBuyBarProps {
    product: Product;
}

export function QuickBuyBar({ product }: QuickBuyBarProps) {
    const [visible, setVisible] = useState(false);
    const [added, setAdded] = useState(false);
    const addItem = useCartStore((s) => s.addItem);

    useEffect(() => {
        const handleScroll = () => {
            // Show bar after scrolling 400px down
            setVisible(window.scrollY > 400);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleAdd = () => {
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 animate-slideUp sm:hidden">
            <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center gap-3">
                {/* Product info */}
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">
                        {product.product_name}
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                        {formatPrice(product.selling_price)}
                    </p>
                </div>

                {/* Add to cart button */}
                <button
                    onClick={handleAdd}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all flex-shrink-0 ${
                        added
                            ? "bg-emerald-500 text-white"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 active:scale-95"
                    }`}
                >
                    {added ? (
                        <>
                            <Check size={16} />
                            Added
                        </>
                    ) : (
                        <>
                            <ShoppingCart size={16} />
                            Add to Cart
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
