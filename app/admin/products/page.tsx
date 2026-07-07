"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Package, RefreshCw, AlertTriangle } from "lucide-react";
import { formatPrice, CATEGORY_MAP, getProductImage } from "@/lib/types";
import Image from "next/image";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const PAGE_SIZE = 50;
    const [form, setForm] = useState({ product_name: "", category: "ACCESSORIES", selling_price: "", compare_price: "", description: "", image_url: "", is_active: true });

    useEffect(() => {
        loadProducts();
    }, [page]);

    async function loadProducts() {
        setLoading(true);
        setError(null);
        try {
            // First get total count
            const { count, error: countError } = await supabase
                .from("products")
                .select("*", { count: "exact", head: true });

            if (countError) {
                console.error("Count error:", countError);
                setError(`Failed to count products: ${countError.message}`);
                setLoading(false);
                return;
            }
            setTotalCount(count || 0);

            // Then fetch paginated data
            const { data, error: fetchError } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false })
                .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

            if (fetchError) {
                console.error("Fetch error:", fetchError);
                setError(`Failed to load products: ${fetchError.message}`);
                setLoading(false);
                return;
            }

            setProducts(data || []);
        } catch (err: any) {
            console.error("Unexpected error:", err);
            setError(`Unexpected error: ${err.message}`);
        }
        setLoading(false);
    }

    function openAdd() {
        setEditing(null);
        setForm({ product_name: "", category: "ACCESSORIES", selling_price: "", compare_price: "", description: "", image_url: "", is_active: true });
        setShowModal(true);
    }

    function openEdit(product: any) {
        setEditing(product);
        setForm({
            product_name: product.product_name,
            category: product.category,
            selling_price: product.selling_price,
            compare_price: product.compare_price || "",
            description: product.description || "",
            image_url: product.image_url || "",
            is_active: product.is_active,
        });
        setShowModal(true);
    }

    async function saveProduct() {
        setSaving(true);
        const payload = {
            product_name: form.product_name,
            category: form.category,
            selling_price: Number(form.selling_price),
            compare_price: form.compare_price ? Number(form.compare_price) : null,
            description: form.description || null,
            image_url: form.image_url || null,
            is_active: form.is_active,
        };

        if (editing) {
            await supabase.from("products").update(payload).eq("id", editing.id);
        } else {
            const slug = form.product_name.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-") + "-" + Date.now();
            await supabase.from("products").insert({ ...payload, slug, item_code: `DW-${Date.now()}` });
        }
        await loadProducts();
        setShowModal(false);
        setSaving(false);
    }

    async function toggleActive(product: any) {
        await supabase.from("products").update({ is_active: !product.is_active }).eq("id", product.id);
        setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, is_active: !p.is_active } : p));
    }

    async function deleteProduct(id: number) {
        if (!confirm("Delete this product?")) return;
        await supabase.from("products").delete().eq("id", id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setTotalCount((prev) => prev - 1);
    }

    const categories = ["All", ...Object.keys(CATEGORY_MAP)];
    const filtered = products.filter((p) => {
        const matchSearch = !search || p.product_name?.toLowerCase().includes(search.toLowerCase()) || p.item_code?.toLowerCase().includes(search.toLowerCase());
        const matchCat = category === "All" || p.category === category;
        return matchSearch && matchCat;
    });

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-500 mt-0.5">{totalCount} total products {products.length > 0 && `(showing ${page * PAGE_SIZE + 1}-${Math.min((page + 1) * PAGE_SIZE, totalCount)})`}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={loadProducts} className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors" title="Refresh">
                        <RefreshCw size={16} className={`text-gray-600 ${loading ? "animate-spin" : ""}`} />
                    </button>
                    <button onClick={openAdd} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
                        <Plus size={16} /> Add Product
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-red-800">Connection Error</p>
                        <p className="text-xs text-red-600 mt-1">{error}</p>
                        <p className="text-xs text-red-500 mt-2">Make sure your <code className="bg-red-100 px-1 rounded">.env.local</code> has valid <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-red-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> values, and that RLS policies allow read access.</p>
                        <button onClick={loadProducts} className="mt-3 text-xs font-bold text-red-700 bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors">
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
            </div>

            {/* Product Table */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => <div key={i} className="h-48 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    {["Product", "Category", "Price", "Compare", "Status", "Actions"].map((h) => (
                                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-16">
                                            <Package size={40} className="text-gray-200 mx-auto mb-3" />
                                            <p className="text-gray-400 font-medium">No products found</p>
                                            <p className="text-gray-300 text-xs mt-1">
                                                {totalCount === 0 ? "Your store has no products yet. Add your first product above." : "Try adjusting your search or filter."}
                                            </p>
                                        </td>
                                    </tr>
                                ) : filtered.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 relative">
                                                    <Image
                                                        src={getProductImage(product)}
                                                        alt={product.product_name}
                                                        fill
                                                        className="object-contain p-1"
                                                        sizes="40px"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-xs line-clamp-1">{product.product_name}</p>
                                                    <p className="text-gray-400 text-[10px]">{product.item_code}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3"><span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{product.category?.split(" ").slice(0, 2).join(" ")}</span></td>
                                        <td className="px-4 py-3 font-bold text-blue-700 text-xs">{formatPrice(product.selling_price)}</td>
                                        <td className="px-4 py-3 text-xs text-gray-400 line-through">{product.compare_price ? formatPrice(product.compare_price) : "—"}</td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => toggleActive(product)} className="flex items-center gap-1 text-xs">
                                                {product.is_active
                                                    ? <><ToggleRight size={18} className="text-green-500" /><span className="text-green-600 font-semibold">Active</span></>
                                                    : <><ToggleLeft size={18} className="text-gray-400" /><span className="text-gray-400">Hidden</span></>}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openEdit(product)} className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                                                    <Edit2 size={12} />
                                                </button>
                                                <button onClick={() => deleteProduct(product.id)} className="w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500">Page {page + 1} of {totalPages}</p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(Math.max(0, page - 1))}
                                    disabled={page === 0}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">{editing ? "Edit Product" : "Add New Product"}</h2>
                        <div className="space-y-4">
                            {/* Image Preview & URL */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Product Image</label>
                                <div className="flex items-start gap-4">
                                    <div className="w-24 h-24 rounded-xl bg-gray-100 border-2 border-dashed border-gray-200 overflow-hidden flex-shrink-0 relative">
                                        {form.image_url ? (
                                            <img src={form.image_url} alt="Preview" className="w-full h-full object-contain p-1" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'; }} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Package size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                            placeholder="Paste image URL here..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        <p className="text-[10px] text-gray-400 mt-1.5">Paste any image URL. Supports Shopify CDN, Unsplash, or any direct image link.</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Product Name *</label>
                                <input value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Category *</label>
                                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    {Object.keys(CATEGORY_MAP).map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Selling Price (₦) *</label>
                                    <input type="number" value={form.selling_price} onChange={(e) => setForm({ ...form, selling_price: e.target.value })}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Compare Price (₦)</label>
                                    <input type="number" value={form.compare_price} onChange={(e) => setForm({ ...form, compare_price: e.target.value })}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Description</label>
                                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-blue-600 w-4 h-4" />
                                <span className="text-sm font-medium text-gray-700">Active (visible on store)</span>
                            </label>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                                Cancel
                            </button>
                            <button onClick={saveProduct} disabled={saving || !form.product_name || !form.selling_price}
                                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold transition-colors text-sm disabled:opacity-50">
                                {saving ? "Saving..." : editing ? "Save Changes" : "Add Product"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
