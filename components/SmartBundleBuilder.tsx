"use client";

import { useState, useEffect } from "react";
import { Sparkles, Plus, X, ShoppingCart, Zap } from "lucide-react";
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
                // Search for complementary products
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
        <div className="fixed bottom-24 right-4 z-40 w-[320px] max-h-[400px] hidden sm:block animate-slideUp">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-black/10 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-yellow-300" />
                        <span className="text-white font-bold text-sm">Smart Bundle</span>
                    </div>
                    <button
                        onClick={() => setDismissed(true)}
                        className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                        <X size={12} className="text-white" />
                    </button>
                </div>

                {/* Savings badge */}
                {totalSavings > 0 && (
                    <div className="bg-green-50 border-b border-green-100 px-4 py-2 flex items-center gap-2">
                        <Zap size={12} className="text-green-600" />
                        <span className="text-xs font-semibold text-green-700">
                            Bundle & save up to {formatPrice(totalSavings)}
                        </span>
                    </div>
                )}

                {/* Suggestions */}
                <div className="p-3 space-y-2 max-h-[260px] overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                        </div>
                    ) : (
                        suggestions.slice(0, 4).map((product) => {
                            const isAdded = addedIds.has(product.id);
                            return (
                                <div key={product.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                        <img
                                            src={getProductImage(product)}
                                            alt={product.product_name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-800 line-clamp-1">
                                            {product.product_name}
                                        </p>
                                        <p className="text-xs font-bold text-blue-700">
                                            {formatPrice(product.selling_price)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleAddBundle(product)}
                                        disabled={isAdded}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                            isAdded
                                                ? "bg-emerald-100 text-emerald-600"
                                                : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-110"
                                        }`}
                                    >
                                        {isAdded ? <ShoppingCart size={12} /> : <Plus size={14} />}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
