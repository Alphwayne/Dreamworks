"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Package, ShoppingCart, Users, TrendingUp, AlertCircle, ChevronRight, LogOut } from "lucide-react";
import { formatPrice } from "@/lib/types";

interface Stats {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
    recentOrders: any[];
    lowStock: any[];
}

export default function AdminPage() {
    const router = useRouter();
    const [stats, setStats] = useState<Stats>({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalCustomers: 0, recentOrders: [], lowStock: [] });
    const [loading, setLoading] = useState(true);
    const [authed, setAuthed] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || "dreamworks2026";

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_KEY) {
            sessionStorage.setItem("dw_admin", "true");
            setAuthed(true);
        } else {
            setError("Incorrect password");
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem("dw_admin") === "true") setAuthed(true);
    }, []);

    useEffect(() => {
        if (!authed) return;
        async function loadStats() {
            const [ordersRes, productsRes, customersRes, recentRes, inventoryRes] = await Promise.all([
                supabase.from("orders").select("total", { count: "exact" }),
                supabase.from("products").select("id", { count: "exact" }).eq("is_active", true),
                supabase.from("customers").select("id", { count: "exact" }),
                supabase.from("orders").select("order_number,total,financial_status,fulfillment_status,created_at,email").order("created_at", { ascending: false }).limit(5),
                supabase.from("inventory").select("title,available,sku").lt("available", 5).limit(5),
            ]);
            const revenue = (ordersRes.data || []).reduce((s: number, o: any) => s + Number(o.total), 0);
            setStats({
                totalOrders: ordersRes.count || 0,
                totalRevenue: revenue,
                totalProducts: productsRes.count || 0,
                totalCustomers: customersRes.count || 0,
                recentOrders: recentRes.data || [],
                lowStock: inventoryRes.data || [],
            });
            setLoading(false);
        }
        loadStats();
    }, [authed]);

    if (!authed) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg,#020817 0%,#0f1a3e 100%)" }}>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-sm">
                    <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
                    <p className="text-white/40 text-sm mb-6">DreamWorks Direct — Internal</p>
                    {error && <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            placeholder="Admin password" autoFocus
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 text-sm"
                        />
                        <button type="submit" className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors">
                            Enter Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const STAT_CARDS = [
        { label: "Total Orders", value: stats.totalOrders.toLocaleString(), icon: <ShoppingCart size={22} />, color: "from-blue-600 to-blue-700", sub: "All time" },
        { label: "Total Revenue", value: formatPrice(stats.totalRevenue), icon: <TrendingUp size={22} />, color: "from-emerald-600 to-emerald-700", sub: "All time" },
        { label: "Products", value: stats.totalProducts.toLocaleString(), icon: <Package size={22} />, color: "from-purple-600 to-purple-700", sub: "Active listings" },
        { label: "Customers", value: stats.totalCustomers.toLocaleString(), icon: <Users size={22} />, color: "from-orange-600 to-orange-700", sub: "Registered" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin nav */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div>
                    <h1 className="text-lg font-bold text-gray-900">DreamWorks Admin</h1>
                    <p className="text-xs text-gray-400">dreamworksdirect.com</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/" className="text-sm text-blue-600 hover:underline">View Store</Link>
                    <button onClick={() => { sessionStorage.removeItem("dw_admin"); setAuthed(false); }}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors">
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {STAT_CARDS.map((card) => (
                        <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-3`}>
                                {card.icon}
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{loading ? "..." : card.value}</p>
                            <p className="text-sm font-medium text-gray-600 mt-0.5">{card.label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent orders */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-bold text-gray-900">Recent Orders</h2>
                            <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                View all <ChevronRight size={14} />
                            </Link>
                        </div>
                        {loading ? (
                            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}</div>
                        ) : stats.recentOrders.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
                        ) : (
                            <div className="space-y-2">
                                {stats.recentOrders.map((order) => (
                                    <div key={order.order_number} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">#{order.order_number}</p>
                                            <p className="text-xs text-gray-400">{order.email} · {new Date(order.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${order.financial_status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                                }`}>{order.financial_status}</span>
                                            <span className="font-bold text-blue-700 text-sm">{formatPrice(Number(order.total))}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick links + low stock */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="space-y-2">
                                {[
                                    { label: "Manage Products", href: "/admin/products", icon: "📦" },
                                    { label: "View All Orders", href: "/admin/orders", icon: "🛒" },
                                    { label: "View Customers", href: "/admin/customers", icon: "👥" },
                                ].map((item) => (
                                    <Link key={item.href} href={item.href}
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all text-sm font-medium text-gray-700">
                                        <span>{item.icon}</span> {item.label} <ChevronRight size={14} className="ml-auto" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {stats.lowStock.length > 0 && (
                            <div className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm">
                                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <AlertCircle size={16} className="text-orange-500" /> Low Stock
                                </h2>
                                <div className="space-y-2">
                                    {stats.lowStock.map((item) => (
                                        <div key={item.sku} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                                            <p className="text-xs font-medium text-gray-700 truncate flex-1">{item.title}</p>
                                            <span className="text-xs font-bold text-orange-600 ml-2">{item.available} left</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}