"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/types";
import {
    TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package,
    Calendar, ArrowUpRight, ArrowDownRight, BarChart3, PieChart, Activity
} from "lucide-react";

interface AnalyticsData {
    dailyRevenue: { date: string; revenue: number; orders: number }[];
    categoryBreakdown: { category: string; count: number; revenue: number }[];
    topCustomers: { email: string; name: string; total_spent: number; total_orders: number }[];
    paymentMethods: { method: string; count: number }[];
    fulfillmentStats: { status: string; count: number }[];
    monthlyGrowth: number;
    avgOrderValue: number;
    repeatCustomerRate: number;
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "all">("30d");

    useEffect(() => {
        loadAnalytics();
    }, [period]);

    async function loadAnalytics() {
        setLoading(true);
        try {
            const periodMap: Record<string, string> = { "7d": "week", "30d": "month", "90d": "all", "all": "all" };
            const res = await fetch(`/api/admin/analytics?period=${periodMap[period] || "all"}`);
            const json = await res.json();

            // Transform API response to match existing UI data shape
            const revenueByMonth = json.revenueByMonth || {};
            const dailyRevenue = Object.entries(revenueByMonth).map(([date, d]: [string, any]) => ({
                date,
                revenue: d.revenue || 0,
                orders: d.orders || 0,
            }));

            const categoryBreakdown = Object.entries(json.categoryBreakdown || {}).map(([category, d]: [string, any]) => ({
                category,
                count: d.count || 0,
                revenue: d.revenue || 0,
            })).sort((a, b) => b.revenue - a.revenue).slice(0, 8);

            const topCustomers = (json.topCustomers || []).map((c: any) => ({
                email: c.email,
                name: `${c.first_name || ""} ${c.last_name || ""}`.trim(),
                total_spent: c.total_spent || 0,
                total_orders: c.total_orders || 0,
            }));

            const fulfillmentBreakdown = json.fulfillmentBreakdown || {};
            const fulfillmentStats = Object.entries(fulfillmentBreakdown).map(([status, count]) => ({ status, count: count as number }));

            const ordersByStatus = json.ordersByStatus || {};
            const paymentMethods = Object.entries(ordersByStatus).map(([method, count]) => ({ method, count: count as number }));

            setData({
                dailyRevenue,
                categoryBreakdown,
                topCustomers,
                paymentMethods,
                fulfillmentStats,
                monthlyGrowth: json.monthlyGrowth || 0,
                avgOrderValue: json.avgOrderValue || 0,
                repeatCustomerRate: 0,
            });
        } catch (err) {
            console.error("[Analytics] Load error:", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-10 w-48 bg-gray-200 rounded-xl animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
                </div>
                <div className="h-80 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            </div>
        );
    }

    if (!data) return null;

    const maxRevenue = Math.max(...data.dailyRevenue.map((d) => d.revenue), 1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Deep insights into your store performance</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                    {(["7d", "30d", "90d", "all"] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${period === p ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            {p === "all" ? "All" : p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign size={16} className="text-blue-500" />
                        <span className="text-xs font-semibold text-gray-500">Avg. Order Value</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(Math.round(data.avgOrderValue))}</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={16} className="text-emerald-500" />
                        <span className="text-xs font-semibold text-gray-500">Repeat Customer Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{data.repeatCustomerRate.toFixed(1)}%</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-purple-500" />
                        <span className="text-xs font-semibold text-gray-500">Monthly Growth</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600 flex items-center gap-1">
                        <ArrowUpRight size={18} /> {data.monthlyGrowth}%
                    </p>
                </div>
            </div>

            {/* Revenue Chart (CSS-based bar chart) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                        <Activity size={16} className="text-blue-500" /> Revenue Over Time
                    </h2>
                </div>
                <div className="flex items-end gap-1 h-48">
                    {data.dailyRevenue.map((day, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                            <div className="relative w-full flex justify-center">
                                <div className="absolute -top-8 bg-gray-900 text-white text-[9px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    {formatPrice(day.revenue)} · {day.orders} orders
                                </div>
                            </div>
                            <div
                                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md hover:from-blue-500 hover:to-blue-300 transition-all cursor-pointer min-h-[4px]"
                                style={{ height: `${(day.revenue / maxRevenue) * 100}%` }}
                            />
                            <span className="text-[9px] text-gray-400 font-medium mt-1 hidden sm:block">{day.date.split(" ")[0]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Customers */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users size={16} className="text-emerald-500" /> Top Customers
                    </h2>
                    <div className="space-y-3">
                        {data.topCustomers.map((customer, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{customer.name || customer.email}</p>
                                    <p className="text-xs text-gray-400">{customer.total_orders} orders</p>
                                </div>
                                <span className="text-sm font-bold text-blue-700">{formatPrice(customer.total_spent)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fulfillment Status */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <PieChart size={16} className="text-purple-500" /> Order Fulfillment
                    </h2>
                    <div className="space-y-3">
                        {data.fulfillmentStats.map((stat) => {
                            const total = data.fulfillmentStats.reduce((s, f) => s + f.count, 0);
                            const pct = total > 0 ? (stat.count / total) * 100 : 0;
                            const colors: Record<string, string> = {
                                fulfilled: "bg-emerald-500",
                                unfulfilled: "bg-amber-500",
                                partial: "bg-blue-500",
                            };
                            return (
                                <div key={stat.status} className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 capitalize">{stat.status}</span>
                                        <span className="text-xs font-bold text-gray-500">{stat.count} ({pct.toFixed(0)}%)</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${colors[stat.status] || "bg-gray-400"}`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Payment Methods */}
                    <h3 className="font-bold text-gray-900 mt-6 mb-3 flex items-center gap-2">
                        <DollarSign size={14} className="text-blue-500" /> Payment Methods
                    </h3>
                    <div className="space-y-2">
                        {data.paymentMethods.slice(0, 4).map((pm) => (
                            <div key={pm.method} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <span className="text-xs font-medium text-gray-700 capitalize">{pm.method}</span>
                                <span className="text-xs font-bold text-gray-500">{pm.count} transactions</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
