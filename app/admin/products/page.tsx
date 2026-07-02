"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, Search, Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { formatPrice, CATEGORY_MAP } from "@/lib/types";

export default function AdminProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ product_name: "", category: "ACCESSORIES", selling_price: "", compare_price: "", description: "", image_url: "", is_active: true });

    useEffect(() => {
        if (sessionStorage.getItem("dw_admin") !== "true") { router.push("/admin"); return; }
        loadProducts();
    }, []);

    async function loadProducts() {
        setLoading(true);
        const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
        setProducts(data || []);
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
    }

    const categories = ["All", ...Object.keys(CATEGORY_MAP)];
    const filtered = products.filter((p) => {
        const matchSearch = !search || p.product_name?.toLowerCase().includes(search.toLowerCase()) || p.item_code?.toLowerCase().includes(search.toLowerCase());
        const matchCat = category === "All" || p.category === category;
        return matchSearch && matchCat;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="text-gray-500 hover:text-gray-700"><ChevronLeft size={20} /></Link>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Products</h1>
                        <p className="text-xs text-gray-400">{products.length} total</p>
                    </div>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
                    <Plus size={16} /> Add Product
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
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

                {/* Product grid */}
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
                                        <tr><td colSpan={6} className="text-center py-12 text-gray-400">No products found</td></tr>
                                    ) : filtered.map((product) => (
                                        <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-gray-900 text-xs line-clamp-1">{product.product_name}</p>
                                                <p className="text-gray-400 text-[10px]">{product.item_code}</p>
                                            </td>
                                            <td className="px-4 py-3"><span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{product.category?.split(" ")[0]}</span></td>
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
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowModal(false)} />
                    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">{editing ? "Edit Product" : "Add New Product"}</h2>
                            <div className="space-y-4">
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
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Image URL</label>
                                    <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                        placeholder="https://..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                                <button onClick={saveProduct} disabled={!form.product_name || !form.selling_price || saving}
                                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold transition-colors text-sm disabled:opacity-50">
                                    {saving ? "Saving..." : editing ? "Save Changes" : "Add Product"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}