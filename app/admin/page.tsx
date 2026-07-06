"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
    Package, ShoppingCart, Users, TrendingUp, AlertCircle, ChevronRight,
    ArrowUpRight, ArrowDownRight, DollarSign, Eye, Zap, Clock,
    BarChart3, Activity
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
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

        const [ordersRes, productsRes, customersRes, recentRes, inventoryRes, todayOrdersRes, weekOrdersRes, topProductsRes] = await Promise.all([
            supabase.from("orders").select("total", { count: "exact" }),
            supabase.from("products").select("id", { count: "exact" }).eq("is_active", true),
            supabase.from("customers").select("id", { count: "exact" }),
            supabase.from("orders").select("order_number,total,financial_status,fulfillment_status,created_at,email,shipping_name").order("created_at", { ascending: false }).limit(8),
            supabase.from("inventory").select("title,available,sku").lt("available", 5).gt("available", 0).limit(8),
            supabase.from("orders").select("total").gte("created_at", todayStart),
            supabase.from("orders").select("total").gte("created_at", weekStart),
            supabase.from("order_items").select("lineitem_name, lineitem_quantity").order("lineitem_quantity", { ascending: false }).limit(5),
        ]);

        const revenue = (ordersRes.data || []).reduce((s: number, o: any) => s + Number(o.total), 0);
        const todayRev = (todayOrdersRes.data || []).reduce((s: number, o: any) => s + Number(o.total), 0);
        const weekRev = (weekOrdersRes.data || []).reduce((s: number, o: any) => s + Number(o.total), 0);

        setStats({
            totalOrders: ordersRes.count || 0,
            totalRevenue: revenue,
            totalProducts: productsRes.count || 0,
            totalCustomers: customersRes.count || 0,
            todayOrders: todayOrdersRes.data?.length || 0,
            todayRevenue: todayRev,
            weekOrders: weekOrdersRes.data?.length || 0,
            weekRevenue: weekRev,
            recentOrders: recentRes.data || [],
            lowStock: inventoryRes.data || [],
            topProducts: topProductsRes.data || [],
        });
        setLoading(false);
    }

    const kpiCards = [
        { label: "Total Revenue", value: formatPrice(stats.totalRevenue), change: "+12.5%", up: true, icon: DollarSign, color: "from-blue-500 to-blue-700", bgColor: "bg-blue-50" },
        { label: "Total Orders", value: stats.totalOrders.toLocaleString(), change: "+8.2%", up: true, icon: ShoppingCart, color: "from-emerald-500 to-emerald-700", bgColor: "bg-emerald-50" },
        { label: "Active Products", value: stats.totalProducts.toLocaleString(), change: "+3", up: true, icon: Package, color: "from-purple-500 to-purple-700", bgColor: "bg-purple-50" },
        { label: "Customers", value: stats.totalCustomers.toLocaleString(), change: "+156", up: true, icon: Users, color: "from-orange-500 to-orange-700", bgColor: "bg-orange-50" },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-96 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                    <div className="h-96 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Welcome back. Here&apos;s what&apos;s happening with your store.</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                    {(["today", "week", "month", "all"] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${timeRange === range ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            {range === "all" ? "All Time" : range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                        <div key={kpi.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl ${kpi.bgColor} flex items-center justify-center`}>
                                    <Icon size={18} className={`bg-gradient-to-br ${kpi.color} bg-clip-text`} style={{ color: kpi.color.includes("blue") ? "#3b82f6" : kpi.color.includes("emerald") ? "#10b981" : kpi.color.includes("purple") ? "#8b5cf6" : "#f97316" }} />
                                </div>
                                <span className={`flex items-center gap-0.5 text-xs font-semibold ${kpi.up ? "text-emerald-600" : "text-red-500"}`}>
                                    {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {kpi.change}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity size={16} className="text-blue-200" />
                        <span className="text-blue-200 text-xs font-semibold">Today</span>
                    </div>
                    <p className="text-2xl font-bold">{formatPrice(stats.todayRevenue)}</p>
                    <p className="text-blue-200 text-xs mt-1">{stats.todayOrders} orders today</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-5 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-emerald-200" />
                        <span className="text-emerald-200 text-xs font-semibold">This Week</span>
                    </div>
                    <p className="text-2xl font-bold">{formatPrice(stats.weekRevenue)}</p>
                    <p className="text-emerald-200 text-xs mt-1">{stats.weekOrders} orders this week</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-5 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap size={16} className="text-purple-200" />
                        <span className="text-purple-200 text-xs font-semibold">Avg. Order Value</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.totalOrders > 0 ? formatPrice(Math.round(stats.totalRevenue / stats.totalOrders)) : "₦0"}</p>
                    <p className="text-purple-200 text-xs mt-1">Across all orders</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <ShoppingCart size={16} className="text-blue-500" /> Recent Orders
                        </h2>
                        <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline flex items-center gap-1 font-medium">
                            View all <ChevronRight size={14} />
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {stats.recentOrders.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
                        ) : (
                            stats.recentOrders.map((order) => (
                                <div key={order.order_number} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                                            #{order.order_number?.slice(-3)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">{order.shipping_name || order.email?.split("@")[0]}</p>
                                            <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${order.financial_status === "paid" ? "bg-emerald-100 text-emerald-700" :
                                            order.financial_status === "pending" ? "bg-amber-100 text-amber-700" :
                                                "bg-gray-100 text-gray-600"
                                            }`}>{order.financial_status}</span>
                                        <span className="font-bold text-blue-700 text-sm">{formatPrice(Number(order.total))}</span>
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
                        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <BarChart3 size={16} className="text-purple-500" /> Top Products
                        </h2>
                        <div className="space-y-3">
                            {stats.topProducts.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center py-4">No data yet</p>
                            ) : (
                                stats.topProducts.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                                        <p className="text-xs font-medium text-gray-700 flex-1 line-clamp-1">{item.lineitem_name}</p>
                                        <span className="text-xs font-bold text-gray-500">{item.lineitem_quantity} sold</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    {stats.lowStock.length > 0 && (
                        <div className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm">
                            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <AlertCircle size={16} className="text-orange-500" /> Low Stock Alert
                            </h2>
                            <div className="space-y-2">
                                {stats.lowStock.map((item) => (
                                    <div key={item.sku} className="flex items-center justify-between p-2.5 bg-orange-50 rounded-xl">
                                        <p className="text-xs font-medium text-gray-700 truncate flex-1">{item.title}</p>
                                        <span className="text-xs font-bold text-orange-600 ml-2 flex-shrink-0">{item.available} left</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            {[
                                { label: "Add New Product", href: "/admin/products", icon: "📦" },
                                { label: "Manage Orders", href: "/admin/orders", icon: "🛒" },
                                { label: "View Customers", href: "/admin/customers", icon: "👥" },
                                { label: "Edit Homepage", href: "/admin/content", icon: "🎨" },
                                { label: "View Analytics", href: "/admin/analytics", icon: "📊" },
                            ].map((item) => (
                                <Link key={item.href} href={item.href}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all text-sm font-medium text-gray-700">
                                    <span>{item.icon}</span> {item.label} <ChevronRight size={14} className="ml-auto" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
