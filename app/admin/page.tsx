"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// Uses API route instead of direct Supabase calls
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
            const res = await fetch("/api/admin/stats");
            const data = await res.json();

            if (data.error) {
                console.error("Dashboard API error:", data.error);
            }

            // Calculate today/week stats from recent orders
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

            const recentOrders = data.recentOrders || [];
            const todayOrders = recentOrders.filter((o: any) => new Date(o.created_at) >= todayStart);
            const weekOrders = recentOrders.filter((o: any) => new Date(o.created_at) >= weekStart);

            setStats({
                totalOrders: data.totalOrders || 0,
                totalRevenue: data.totalRevenue || 0,
                totalProducts: data.activeProducts || 0,
                totalCustomers: data.totalCustomers || 0,
                todayOrders: todayOrders.length,
                todayRevenue: todayOrders.reduce((s: number, o: any) => s + (Number(o.total) || 0), 0),
                weekOrders: weekOrders.length,
                weekRevenue: weekOrders.reduce((s: number, o: any) => s + (Number(o.total) || 0), 0),
                recentOrders: recentOrders,
                lowStock: data.lowStock || [],
                topProducts: data.topProducts || [],
            });
        } catch (err) {
            console.error("Dashboard loadStats error:", err);
        } finally {
            setLoading(false);
        }
    }

    const kpiCards = [
        { label: "Total Revenue", value: formatPrice(stats.totalRevenue), change: "+12.5%", up: true, icon: DollarSign, gradient: "from-blue-500 to-blue-700", shadow: "shadow-blue-500/20", href: "/admin/analytics" },
        { label: "Total Orders", value: stats.totalOrders.toLocaleString(), change: "+8.2%", up: true, icon: ShoppingCart, gradient: "from-blue-600 to-indigo-700", shadow: "shadow-indigo-500/20", href: "/admin/orders" },
        { label: "Active Products", value: stats.totalProducts.toLocaleString(), change: "+3", up: true, icon: Package, gradient: "from-indigo-500 to-blue-700", shadow: "shadow-indigo-500/20", href: "/admin/products" },
        { label: "Customers", value: stats.totalCustomers.toLocaleString(), change: "+156", up: true, icon: Users, gradient: "from-sky-500 to-blue-700", shadow: "shadow-sky-500/20", href: "/admin/customers" },
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
                        <Link key={kpi.label} href={kpi.href} className="relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group cursor-pointer block">
                            {/* Subtle gradient accent */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${kpi.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-lg ${kpi.shadow}`}>
                                    <Icon size={18} className="text-white" />
                                </div>
                                <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-lg ${kpi.up ? "text-blue-700 bg-blue-50" : "text-red-600 bg-red-50"}`}>
                                    {kpi.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                                    {kpi.change}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 tracking-tight">{kpi.value}</p>
                            <p className="text-xs text-gray-500 mt-1.5 font-medium">{kpi.label}</p>
                        </Link>
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
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 rounded-2xl p-6 text-white shadow-lg shadow-indigo-600/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp size={14} className="text-indigo-200" />
                            <span className="text-indigo-200 text-[11px] font-bold uppercase tracking-widest">This Week</span>
                        </div>
                        <p className="text-2xl font-bold tracking-tight">{formatPrice(stats.weekRevenue)}</p>
                        <p className="text-indigo-200/60 text-xs mt-1.5 font-medium">{stats.weekOrders} orders this week</p>
                    </div>
                </div>
                <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800 rounded-2xl p-6 text-white shadow-lg shadow-violet-600/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                            <BarChart3 size={14} className="text-violet-200" />
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
                                            <p className="font-semibold text-sm text-gray-900">{order.billing_name || order.shipping_name || order.email?.split("@")[0]}</p>
                                            <p className="text-[11px] text-gray-400 font-medium">{new Date(order.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${order.financial_status === "paid" ? "bg-blue-100 text-blue-700" :
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
                                        <p className="text-xs font-medium text-gray-700 flex-1 line-clamp-1">{item.name || item.lineitem_name}</p>
                                        <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{item.quantity || item.lineitem_quantity}</span>
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
                                        <p className="text-xs font-medium text-gray-700 truncate flex-1">{item.sku || item.title}</p>
                                        <span className="text-[11px] font-bold text-orange-600 ml-2 flex-shrink-0 bg-orange-100 px-2 py-0.5 rounded-md">{item.available ?? item.quantity ?? 0} left</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                                <Sparkles size={14} className="text-gray-600" />
                            </div>
                            Quick Actions
                        </h2>
                        <div className="space-y-2">
                            {[
                                { label: "Add New Product", href: "/admin/products", icon: "📦", color: "hover:bg-blue-50 hover:border-blue-100" },
                                { label: "Manage Orders", href: "/admin/orders", icon: "🛒", color: "hover:bg-blue-50 hover:border-blue-100" },
                                { label: "View Customers", href: "/admin/customers", icon: "👥", color: "hover:bg-indigo-50 hover:border-indigo-100" },
                                { label: "Edit Homepage", href: "/admin/content", icon: "🎨", color: "hover:bg-sky-50 hover:border-sky-100" },
                                { label: "View Analytics", href: "/admin/analytics", icon: "📊", color: "hover:bg-blue-50 hover:border-blue-100" },
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
