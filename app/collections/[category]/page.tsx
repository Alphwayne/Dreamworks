"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    SlidersHorizontal, ChevronDown, X, Search,
    Grid3X3, Filter, ArrowUpDown
} from "lucide-react";
import { Header } from "@/components/Header";

import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/api/products";
import { Product, SLUG_TO_CATEGORY, CATEGORY_MAP } from "@/lib/types";

const SORT_OPTIONS = [
    { label: "Newest First", value: "created_at-desc" },
    { label: "Price: Low to High", value: "selling_price-asc" },
    { label: "Price: High to Low", value: "selling_price-desc" },
];

const PRICE_RANGES = [
    { label: "All", min: 0, max: Infinity },
    { label: "Under ₦50K", min: 0, max: 50000 },
    { label: "₦50K – ₦200K", min: 50000, max: 200000 },
    { label: "₦200K – ₦500K", min: 200000, max: 500000 },
    { label: "Above ₦500K", min: 500000, max: Infinity },
];

const PAGE_SIZE = 24;

// Gradient mapping for hero backgrounds
const GRADIENT_MAP: Record<string, string> = {
    "accessories": "from-blue-950 via-blue-800 to-indigo-900",
    "apple": "from-gray-950 via-gray-800 to-slate-900",
    "computing-printing": "from-indigo-950 via-indigo-800 to-purple-900",
    "electronics": "from-purple-950 via-purple-800 to-rose-900",
    "enterprise": "from-slate-950 via-slate-800 to-gray-900",
    "factory-recertified": "from-emerald-950 via-emerald-800 to-teal-900",
    "hp-brand": "from-blue-950 via-blue-800 to-cyan-900",
    "mobile-tablet": "from-teal-950 via-teal-800 to-blue-900",
    "open-box": "from-amber-950 via-amber-800 to-orange-900",
    "other-brand": "from-violet-950 via-violet-800 to-purple-900",
    "power": "from-orange-950 via-orange-800 to-amber-900",
    "print-supplies": "from-cyan-950 via-cyan-800 to-blue-900",
    "used": "from-stone-950 via-stone-800 to-gray-900",
};

export default function CollectionPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const categorySlug = params.category as string;
    const isAll = categorySlug === "all";

    const dbCategory = isAll ? undefined : SLUG_TO_CATEGORY[categorySlug];
    const categoryInfo = isAll
        ? { label: "All Products", slug: "all" }
        : CATEGORY_MAP[dbCategory || ""] || { label: categorySlug, slug: categorySlug };

    const subCategory = searchParams.get("sub") || "";
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("created_at-desc");
    const [priceRange, setPriceRange] = useState(0);
    const [search, setSearch] = useState(searchParams.get("q") || "");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const gradient = GRADIENT_MAP[categorySlug] || GRADIENT_MAP["accessories"];

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const [sortBy, sortOrder] = sort.split("-") as [string, "asc" | "desc"];
            // Only use manual search input, NOT sub-category (product names don't match sub labels)
            console.log("[Collections] Fetching:", { category: dbCategory, slug: categorySlug, sub: subCategory, search, sortBy, sortOrder, page });
            const { products: data, count } = await getProducts({
                category: dbCategory,
                search: search || undefined,
                limit: PAGE_SIZE,
                offset: (page - 1) * PAGE_SIZE,
                sortBy,
                sortOrder,
            });

            console.log("[Collections] Got", data.length, "products, total:", count);

            const range = PRICE_RANGES[priceRange];
            const filtered = data.filter(
                (p) => p.selling_price >= range.min && p.selling_price <= range.max
            );

            setProducts(filtered);
            setTotal(count);
        } catch (err: any) {
            console.error("[Collections] FETCH ERROR:", err?.message || err);
            console.error("[Collections] Category slug:", categorySlug, "→ DB category:", dbCategory);
        } finally {
            setLoading(false);
        }
    }, [dbCategory, categorySlug, subCategory, search, page, sort, priceRange]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const totalPages = Math.ceil(total / PAGE_SIZE);

    // Mobile filter drawer
    const FilterDrawer = () => (
        <div className={`fixed inset-0 z-50 transition-all duration-300 ${isFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsFilterOpen(false)} />
            <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 transition-transform duration-300 ${isFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900">Filters</h3>
                    <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-6">
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3">Price Range</p>
                        <div className="grid grid-cols-2 gap-2">
                            {PRICE_RANGES.map((range, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setPriceRange(i); setPage(1); setIsFilterOpen(false); }}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${priceRange === i
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {range.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {isAll && (
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-3">Categories</p>
                            <div className="space-y-1">
                                {Object.entries(CATEGORY_MAP).map(([, info]) => (
                                    <Link
                                        key={info.slug}
                                        href={`/collections/${info.slug}`}
                                        className="block text-sm text-gray-600 hover:text-blue-600 py-1.5"
                                        onClick={() => setIsFilterOpen(false)}
                                    >
                                        {info.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <CartDrawer />
            <div className="min-h-screen bg-gray-50">
                <Header />

                {/* Hero Section */}
                <div className={`relative overflow-hidden bg-gradient-to-br ${gradient}`}>
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <nav className="flex items-center gap-2 text-sm text-white/50 mb-4">
                                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                                    <span className="text-white/30">/</span>
                                    <Link href="/collections/all" className="hover:text-white transition-colors">Shop</Link>
                                    <span className="text-white/30">/</span>
                                    <span className="text-white font-medium">{categoryInfo.label}</span>
                                </nav>

                                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                    {categoryInfo.label}
                                </h1>
                            </div>

                            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-2xl px-4 py-2.5 border border-white/10">
                                <span className="flex items-center gap-2 text-white/60 text-sm">
                                    <span className="w-2 h-2 rounded-full bg-green-400" />
                                    In Stock
                                </span>
                                <div className="w-px h-5 bg-white/10" />
                                <span className="flex items-center gap-2 text-white/60 text-sm">
                                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                                    Genuine
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom curve */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                            <path d="M0 80L60 73.3C120 66.7 240 53.3 360 46.7C480 40 600 40 720 42.7C840 45.3 960 50.7 1080 54.7C1200 58.7 1320 61.3 1380 62.7L1440 64V80H0Z" fill="#F9FAFB" />
                        </svg>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* Search + Sort + Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                            {search && (
                                <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                                    <X size={14} className="text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <div className="relative">
                                <select
                                    value={sort}
                                    onChange={(e) => { setSort(e.target.value); setPage(1); }}
                                    className="appearance-none pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all min-w-[160px]"
                                >
                                    {SORT_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                                <ArrowUpDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-all lg:hidden"
                            >
                                <Filter size={14} />
                                Filters
                            </button>
                        </div>
                    </div>

                    {/* Desktop: Product Grid + Sidebar */}
                    <div className="flex gap-8">
                        {/* Filter Sidebar - Desktop */}
                        <aside className="hidden lg:block w-64 flex-shrink-0">
                            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24 shadow-sm">
                                <div className="flex items-center gap-2 mb-5">
                                    <Filter size={16} className="text-gray-400" />
                                    <h3 className="font-semibold text-gray-900 text-sm">Filters</h3>
                                </div>

                                {/* Creative Price Filter - Pill Buttons */}
                                <div className="mb-6">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Price Range</p>
                                    <div className="flex flex-wrap gap-2">
                                        {PRICE_RANGES.map((range, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { setPriceRange(i); setPage(1); }}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${priceRange === i
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {range.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Categories (only when showing all) */}
                                {isAll && (
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Categories</p>
                                        <div className="space-y-1.5">
                                            {Object.entries(CATEGORY_MAP).map(([, info]) => (
                                                <Link
                                                    key={info.slug}
                                                    href={`/collections/${info.slug}`}
                                                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-1"
                                                >
                                                    {info.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-1">
                            {loading ? (
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div key={i} className="bg-white rounded-2xl border border-gray-100 aspect-[3/4] animate-pulse" />
                                    ))}
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                                    <div className="text-5xl mb-4 opacity-30">🔍</div>
                                    <p className="text-gray-500 text-lg font-medium mb-2">No products found</p>
                                    <p className="text-gray-400 text-sm mb-6">Try adjusting your search or filters</p>
                                    {search && (
                                        <button
                                            onClick={() => setSearch("")}
                                            className="text-blue-600 font-medium hover:underline text-sm"
                                        >
                                            Clear search
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {products.map((p) => (
                                            <ProductCard key={p.id} product={p} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center gap-2 mt-10">
                                            <button
                                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                                disabled={page === 1}
                                                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-all"
                                            >
                                                Previous
                                            </button>
                                            <div className="flex gap-1">
                                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                    const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                                                    if (pageNum > totalPages) return null;
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => setPage(pageNum)}
                                                            className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${page === pageNum
                                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                                                : "border border-gray-200 hover:bg-gray-50"
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <button
                                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                                disabled={page === totalPages}
                                                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-all"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Filter Drawer */}
                <FilterDrawer />

                
            </div>
        </>
    );
}