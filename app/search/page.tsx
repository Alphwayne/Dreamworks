"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Header } from "@/components/Header";

import { FloatingElements } from "@/components/FloatingElements";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
// Uses API routes instead of direct Supabase calls
import { Product } from "@/lib/types";
import { useRouter } from "next/navigation";

const POPULAR = ["Laptop", "Samsung", "HP", "Phone", "TV", "Speaker", "RAM", "Camera"];

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams.get("q") || "";

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<Product[]>([]);
    const [trending, setTrending] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load trending products for empty state
        fetch("/api/products?limit=8").then(r => r.json()).then(json => setTrending(json.products || []));
    }, []);

    useEffect(() => {
        if (!query.trim()) { setResults([]); return; }
        setLoading(true);
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=24`);
                const json = await res.json();
                setResults(json.products || []);
            } catch (err) {
                console.error("Search error:", err);
            }
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`);
    };

    return (
        <>
            {/* Search hero */}
            <div className="bg-blue-700 py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="relative">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            autoFocus
                            placeholder="Search for products, brands & more..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </form>

                    {/* Popular chips */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        <span className="text-blue-200 text-sm">Popular:</span>
                        {POPULAR.map((chip) => (
                            <button
                                key={chip}
                                onClick={() => setQuery(chip)}
                                className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-full transition-colors"
                            >
                                {chip}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-xl aspect-[3/4] animate-pulse border border-gray-100" />
                        ))}
                    </div>
                )}

                {!loading && query && results.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-xl mb-2">No results for "{query}"</p>
                        <p className="text-gray-400 text-sm mb-6">Try a different search term or browse categories below</p>
                        <button onClick={() => setQuery("")} className="text-blue-600 font-semibold hover:underline">
                            Clear search
                        </button>
                    </div>
                )}

                {!loading && query && results.length > 0 && (
                    <>
                        <p className="text-gray-600 text-sm mb-4">
                            {results.length} results for <strong>"{query}"</strong>
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {results.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </>
                )}

                {!query && (
                    <>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Trending Products</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {trending.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default function SearchPage() {
    return (
        <>
            <CartDrawer />
            <div className="min-h-screen bg-gray-50">
                <Header />
                <Suspense fallback={
                    <div className="flex justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
                    </div>
                }>
                    <SearchContent />
                </Suspense>
                
                <FloatingElements />
            </div>
        </>
    );
}