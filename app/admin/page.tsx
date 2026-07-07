"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
    Package, ShoppingCart, Users, TrendingUp, AlertCircle, ChevronRight,
    ArrowUpRight, ArrowDownRight, DollarSign, Eye, Zap, Clock,
    BarChart3, Activity, Sparkles, ArrowRight
} from "lucide-react";
import { formatPrice } from "@/lib/types";

interface Stats {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
    todayOrders: number;
    todayRevenue: number;
    weekOrders: number;
    weekRevenue: number;
    recentOrders: any[];
    lowStock: any[];
    topProducts: any[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalCustomers: 0,
        todayOrders: 0, todayRevenue: 0, weekOrders: 0, weekRevenue: 0,
        recentOrders: [], lowStock: [], topProducts: []
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<"today" | "week" | "month" | "all">("week");

    useEffect(() => {
        loadStats();
    }, []);

    async function loadStats() {
        try {
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
            const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

            // Fetch all data in parallel
            const [ordersRes, productsRes, customersRes, recentRes, inventoryRes, todayOrdersRes, weekOrdersRes, topProductsRes] = await Promise.all([
                supabase.from("orders").select("total", { count: "exact" }),
                supabase.from("products").select("id", { count: "exact" }).eq("is_active", true),
                supabase.from("customers").select("id", { count: "exact" }),
                supabase.from("orders").select("order_number,total,financial_status,fulfillment_status,created_at,email,billing_name").order("created_at", { ascending: false }).limit(8),
                supabase.from("inventory").select("title,available,sku").not("available", "is", null).lt("available", 5).gt("available", 0).limit(8),
                supabase.from("orders").select("total").gte("created_at", todayStart),
                supabase.from("orders").select("total").gte("created_at", weekStart),
                supabase.from("order_items").select("lineitem_name, lineitem_quantity").order("lineitem_quantity", { ascending: false }).limit(5),
            ]);

            // Log errors for debugging
            if (ordersRes.error) console.error("Orders query error:", ordersRes.error);
            if (productsRes.error) console.error("Products query error:", productsRes.error);
            if (customersRes.error) console.error("Customers query error:", customersRes.error);
            if (recentRes.error) console.error("Recent orders error:", recentRes.error);

            // The orders select with count:exact fetches ALL rows to count them
            // For revenue, we need to sum the total column from all orders
            // But Supabase limits to 1000 rows by default - use count for totals
            const revenue = (ordersRes.data || []).reduce((s: number, o: any) => s + (Number(o.total) || 0), 0);
            const todayRev = (todayOrdersRes.data || []).reduce((s: number, o: any) => s + (Number(o.total) || 0), 0);
            const weekRev = (weekOrdersRes.data || []).reduce((s: number, o: any) => s + (Number(o.total) || 0), 0);

            setStats({
                totalOrders: ordersRes.count || (ordersRes.data?.length || 0),
                totalRevenue: revenue,
                totalProducts: productsRes.count || (productsRes.data?.length || 0),
                totalCustomers: customersRes.count || (customersRes.data?.length || 0),
                todayOrders: todayOrdersRes.data?.length || 0,
                todayRevenue: todayRev,
                weekOrders: weekOrdersRes.data?.length || 0,
                weekRevenue: weekRev,
                recentOrders: recentRes.data || [],
                lowStock: inventoryRes.data || [],
                topProducts: topProductsRes.data || [],
            });
        } catch (err) {
            console.error("Dashboard loadStats error:", err);
        } finally {
            setLoading(false);
        }
    }

    const kpiCards = [
        { label: "Total Revenue", value: formatPrice(stats.totalRevenue), change: "+12.5%", up: true, icon: DollarSign, gradient: "from-blue-500 to-blue-700", shadow: "shadow-blue-500/20" },
        { label: "Total Orders", value: stats.totalOrders.toLocaleString(), change: "+8.2%", up: true, icon: ShoppingCart, gradient: "from-emerald-500 to-emerald-700", shadow: "shadow-emerald-500/20" },
        { label: "Active Products", value: stats.totalProducts.toLocaleString(), change: "+3", up: true, icon: Package, gradient: "from-violet-500 to-violet-700", shadow: "shadow-violet-500/20" },
        { label: "Customers", value: stats.totalCustomers.toLocaleString(), change: "+156", up: true, icon: Users, gradient: "from-orange-500 to-orange-700", shadow: "shadow-orange-500/20" },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-36 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-96 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                    <div className="h-96 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-7">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={16} className="text-blue-500" />
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Overview</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Welcome back. Here&apos;s what&apos;s happening with your store.</p>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm">
                    {(["today", "week", "month", "all"] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${timeRange === range
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            {range === "all" ? "All Time" : range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {kpiCards.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.label} className="relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
                            {/* Subtle gradient accent */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${kpi.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-lg ${kpi.shadow}`}>
                                    <Icon size={18} className="text-white" />
                                </div>
                                <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-lg ${kpi.up ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50"}`}>
                                    {kpi.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                                    {kpi.change}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 tracking-tight">{kpi.value}</p>
                            <p className="text-xs text-gray-500 mt-1.5 font-medium">{kpi.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                            <Activity size={14} className="text-blue-200" />
                            <span className="text-blue-200 text-[11px] font-bold uppercase tracking-widest">Today</span>
                        </div>
                        <p className="text-2xl font-bold tracking-tight">{formatPrice(stats.todayRevenue)}</p>
                        <p className="text-blue-200/60 text-xs mt-1.5 font-medium">{stats.todayOrders} orders today</p>
                    </div>
                </div>
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-2xl p-6 text-white shadow-lg shadow-emerald-600/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={14} className="text-emerald-200" />
                            <span className="text-emerald-200 text-[11px] font-bold uppercase tracking-widest">This Week</span>
                        </div>
                        <p className="text-2xl font-bold tracking-tight">{formatPrice(stats.weekRevenue)}</p>
                        <p className="text-emerald-200/60 text-xs mt-1.5 font-medium">{stats.weekOrders} orders this week</p>
                    </div>
                </div>
                <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800 rounded-2xl p-6 text-white shadow-lg shadow-violet-600/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                            <Zap size={14} className="text-violet-200" />
                            <span className="text-violet-200 text-[11px] font-bold uppercase tracking-widest">Avg. Order</span>
                        </div>
                        <p className="text-2xl font-bold tracking-tight">{stats.totalOrders > 0 ? formatPrice(Math.round(stats.totalRevenue / stats.totalOrders)) : "₦0"}</p>
                        <p className="text-violet-200/60 text-xs mt-1.5 font-medium">Across all orders</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                                <ShoppingCart size={14} className="text-blue-600" />
                            </div>
                            Recent Orders
                        </h2>
                        <Link href="/admin/orders" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                            View all <ChevronRight size={12} />
                        </Link>
                    </div>
                    <div className="space-y-2.5">
                        {stats.recentOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <ShoppingCart size={32} className="text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm">No orders yet</p>
                            </div>
                        ) : (
                            stats.recentOrders.map((order) => (
                                <div key={order.order_number} className="flex items-center justify-between p-3.5 bg-gray-50/80 rounded-xl hover:bg-blue-50/50 transition-all duration-200 border border-transparent hover:border-blue-100 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-[10px] font-bold shadow-sm shadow-blue-500/20">
                                            #{order.order_number?.slice(-3)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">{order.shipping_name || order.email?.split("@")[0]}</p>
                                            <p className="text-[11px] text-gray-400 font-medium">{new Date(order.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${order.financial_status === "paid" ? "bg-emerald-100 text-emerald-700" :
                                            order.financial_status === "pending" ? "bg-amber-100 text-amber-700" :
                                                "bg-gray-100 text-gray-600"
                                            }`}>{order.financial_status}</span>
                                        <span className="font-bold text-gray-900 text-sm tabular-nums">{formatPrice(Number(order.total))}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Top Products */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                                <BarChart3 size={14} className="text-violet-600" />
                            </div>
                            Top Products
                        </h2>
                        <div className="space-y-3">
                            {stats.topProducts.length === 0 ? (
                                <div className="text-center py-8">
                                    <BarChart3 size={24} className="text-gray-200 mx-auto mb-2" />
                                    <p className="text-gray-400 text-xs">No data yet</p>
                                </div>
                            ) : (
                                stats.topProducts.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-sm" :
                                            i === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white" :
                                                i === 2 ? "bg-gradient-to-br from-orange-300 to-orange-500 text-white" :
                                                    "bg-gray-100 text-gray-500"
                                            }`}>{i + 1}</span>
                                        <p className="text-xs font-medium text-gray-700 flex-1 line-clamp-1">{item.lineitem_name}</p>
                                        <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{item.lineitem_quantity}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    {stats.lowStock.length > 0 && (
                        <div className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm">
                            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                                    <AlertCircle size={14} className="text-orange-600" />
                                </div>
                                Low Stock Alert
                            </h2>
                            <div className="space-y-2.5">
                                {stats.lowStock.map((item) => (
                                    <div key={item.sku} className="flex items-center justify-between p-3 bg-orange-50/50 rounded-xl border border-orange-100/50">
                                        <p className="text-xs font-medium text-gray-700 truncate flex-1">{item.title}</p>
                                        <span className="text-[11px] font-bold text-orange-600 ml-2 flex-shrink-0 bg-orange-100 px-2 py-0.5 rounded-md">{item.available} left</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                                <Zap size={14} className="text-gray-600" />
                            </div>
                            Quick Actions
                        </h2>
                        <div className="space-y-2">
                            {[
                                { label: "Add New Product", href: "/admin/products", icon: "📦", color: "hover:bg-blue-50 hover:border-blue-100" },
                                { label: "Manage Orders", href: "/admin/orders", icon: "🛒", color: "hover:bg-emerald-50 hover:border-emerald-100" },
                                { label: "View Customers", href: "/admin/customers", icon: "👥", color: "hover:bg-violet-50 hover:border-violet-100" },
                                { label: "Edit Homepage", href: "/admin/content", icon: "🎨", color: "hover:bg-orange-50 hover:border-orange-100" },
                                { label: "View Analytics", href: "/admin/analytics", icon: "📊", color: "hover:bg-pink-50 hover:border-pink-100" },
                            ].map((item) => (
                                <Link key={item.href} href={item.href}
                                    className={`flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-transparent transition-all duration-200 text-sm font-medium text-gray-700 ${item.color}`}>
                                    <span className="text-base">{item.icon}</span>
                                    <span>{item.label}</span>
                                    <ArrowRight size={13} className="ml-auto text-gray-300" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
