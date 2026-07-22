"use client";

import { useState, useEffect } from "react";
import { Plus, X, ShoppingCart, Check } from "lucide-react";
import { Product, formatPrice, getProductImage } from "@/lib/types";
import { useCartStore } from "@/store/cartStore";

// Smart bundle suggestions based on product categories/keywords
const BUNDLE_RULES: Record<string, string[]> = {
    laptop: ["mouse", "bag", "charger", "keyboard", "monitor", "stand", "sleeve", "hub", "webcam"],
    phone: ["case", "screen protector", "charger", "earbuds", "power bank", "holder", "cable"],
    iphone: ["airpod", "case", "charger", "screen protector", "magsafe", "cable", "power bank"],
    macbook: ["mouse", "sleeve", "hub", "charger", "stand", "keyboard", "monitor"],
    tablet: ["case", "keyboard", "stylus", "charger", "screen protector", "stand"],
    ipad: ["pencil", "keyboard", "case", "charger", "stand", "screen protector"],
    desktop: ["monitor", "keyboard", "mouse", "ups", "speaker", "webcam"],
    monitor: ["cable", "stand", "mount", "keyboard", "mouse"],
    printer: ["toner", "ink", "paper", "cartridge", "cable"],
    camera: ["memory card", "tripod", "bag", "lens", "battery"],
    speaker: ["cable", "stand", "mount", "bluetooth"],
    headphone: ["case", "cable", "adapter", "stand"],
    generator: ["cable", "extension", "stabilizer", "fuel"],
    television: ["mount", "soundbar", "cable", "streaming"],
};

export function SmartBundleBuilder() {
    const { items: cartItems } = useCartStore();
    const addItem = useCartStore((s) => s.addItem);
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (cartItems.length === 0) {
            setSuggestions([]);
            return;
        }

        // Determine what accessories to suggest based on cart items
        const searchTerms: string[] = [];
        cartItems.forEach((item) => {
            const name = item.product.product_name.toLowerCase();
            for (const [keyword, accessories] of Object.entries(BUNDLE_RULES)) {
                if (name.includes(keyword)) {
                    searchTerms.push(...accessories.slice(0, 3));
                    break;
                }
            }
        });

        if (searchTerms.length === 0) return;

        // Fetch suggestions from API
        const fetchSuggestions = async () => {
            setLoading(true);
            try {
                const uniqueTerms = [...new Set(searchTerms)].slice(0, 4);
                const results: Product[] = [];

                for (const term of uniqueTerms) {
                    const res = await fetch(`/api/products?search=${encodeURIComponent(term)}&limit=2`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.products) {
                            results.push(...data.products);
                        }
                    }
                }

                // Filter out items already in cart
                const cartIds = new Set(cartItems.map((i) => i.product.id));
                const filtered = results.filter((p) => !cartIds.has(p.id));

                // Deduplicate
                const unique = filtered.filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i);
                setSuggestions(unique.slice(0, 6));
            } catch {
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, [cartItems]);

    if (cartItems.length === 0 || suggestions.length === 0 || dismissed) return null;

    const totalSavings = Math.round(
        suggestions.slice(0, 3).reduce((sum, p) => sum + p.selling_price * 0.05, 0)
    );

    const handleAddBundle = (product: Product) => {
        addItem(product);
        setAddedIds((prev) => new Set([...prev, product.id]));
    };

    return (
        <div className="fixed bottom-24 right-4 z-40 w-[340px] max-h-[420px] hidden sm:block animate-slideUp">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-black/8 overflow-hidden">
                {/* Header — clean, mature */}
                <div className="bg-gray-900 px-4 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Custom bundle icon */}
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="6" width="14" height="9" rx="1.5" />
                                <path d="M8 6V3.5a2.5 2.5 0 00-2.5-2.5v0A2.5 2.5 0 003 3.5V6" />
                                <path d="M8 6V3.5a2.5 2.5 0 012.5-2.5v0A2.5 2.5 0 0113 3.5V6" />
                                <line x1="8" y1="6" x2="8" y2="15" strokeWidth="1" opacity="0.5" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-white font-semibold text-sm">Complete Your Setup</span>
                            <p className="text-gray-400 text-[10px]">Recommended for your cart</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setDismissed(true)}
                        className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <X size={12} className="text-gray-400" />
                    </button>
                </div>

                {/* Savings badge — red, catchy */}
                {totalSavings > 0 && (
                    <div className="bg-red-50 border-b border-red-100 px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                                <span className="text-white text-[9px] font-black">%</span>
                            </div>
                            <span className="text-xs font-bold text-red-700">
                                Save up to {formatPrice(totalSavings)} when you bundle
                            </span>
                        </div>
                        <span className="text-[9px] font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Deal
                        </span>
                    </div>
                )}

                {/* Suggestions — clean list */}
                <div className="p-3 space-y-1 max-h-[260px] overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
                        </div>
                    ) : (
                        suggestions.slice(0, 4).map((product) => {
                            const isAdded = addedIds.has(product.id);
                            return (
                                <div key={product.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                                    <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                        <img
                                            src={getProductImage(product)}
                                            alt={product.product_name}
                                            className="w-full h-full object-contain p-1"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-800 line-clamp-1">
                                            {product.product_name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-xs font-bold text-gray-900">
                                                {formatPrice(product.selling_price)}
                                            </p>
                                            {product.compare_price && (
                                                <p className="text-[10px] text-red-500 font-semibold line-through">
                                                    {formatPrice(product.compare_price)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAddBundle(product)}
                                        disabled={isAdded}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold flex-shrink-0 transition-all ${
                                            isAdded
                                                ? "bg-gray-100 text-gray-500"
                                                : "bg-gray-900 text-white hover:bg-gray-800 active:scale-95"
                                        }`}
                                    >
                                        {isAdded ? (
                                            <>
                                                <Check size={11} /> Added
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={11} /> Add
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer — subtle */}
                <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-[10px] text-gray-400 text-center">
                        Suggestions based on items in your cart
                    </p>
                </div>
            </div>
        </div>
    );
}
