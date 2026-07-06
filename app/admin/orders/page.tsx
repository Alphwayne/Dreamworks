"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search } from "lucide-react";
import { formatPrice } from "@/lib/types";

const STATUSES = ["All", "paid", "pending", "refunded"];
const FULFIL = ["All", "fulfilled", "unfulfilled", "partial"];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        setLoading(true);
        const { data } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100);
        setOrders(data || []);
        setLoading(false);
    }

    async function updateFulfillment(orderNumber: string, status: string) {
        setUpdating(orderNumber);
        await supabase.from("orders").update({ fulfillment_status: status }).eq("order_number", orderNumber);
        setOrders((prev) => prev.map((o) => o.order_number === orderNumber ? { ...o, fulfillment_status: status } : o));
        setUpdating(null);
    }

    const filtered = orders.filter((o) => {
        const matchSearch = !search || o.order_number?.toLowerCase().includes(search.toLowerCase()) || o.email?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "All" || o.financial_status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-sm text-gray-500 mt-0.5">{orders.length} total orders</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search by order # or email..." value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                {["Order #", "Date", "Customer", "Total", "Payment", "Fulfillment", "Action"].map((h) => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="border-b border-gray-50">
                                        {[...Array(7)].map((_, j) => (
                                            <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                                        ))}
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No orders found</td></tr>
                            ) : (
                                filtered.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-blue-600">#{order.order_number}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {new Date(order.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-900 text-xs">{order.shipping_name || order.billing_name || "—"}</p>
                                            <p className="text-gray-400 text-xs">{order.email}</p>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-gray-900">{formatPrice(Number(order.total))}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${order.financial_status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                                }`}>{order.financial_status}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${order.fulfillment_status === "fulfilled" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                                                }`}>{order.fulfillment_status || "unfulfilled"}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={order.fulfillment_status || "unfulfilled"}
                                                onChange={(e) => updateFulfillment(order.order_number, e.target.value)}
                                                disabled={updating === order.order_number}
                                                className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                                            >
                                                {FULFIL.filter(f => f !== "All").map((s) => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
