"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search } from "lucide-react";
import { formatPrice } from "@/lib/types";

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        supabase.from("customers").select("*").order("created_at", { ascending: false }).limit(200)
            .then(({ data }) => { setCustomers(data || []); setLoading(false); });
    }, []);

    const filtered = customers.filter((c) =>
        !search ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.last_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                <p className="text-sm text-gray-500 mt-0.5">{customers.length} registered customers</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search by name, email or phone..." value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                {["Name", "Email", "Phone", "City", "Orders", "Total Spent"].map((h) => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                [...Array(6)].map((_, i) => (
                                    <tr key={i} className="border-b border-gray-50">
                                        {[...Array(6)].map((_, j) => (
                                            <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                                        ))}
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No customers found</td></tr>
                            ) : (
                                filtered.map((c) => (
                                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {(c.first_name?.[0] || c.email?.[0] || "?").toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-xs">{c.first_name} {c.last_name}</p>
                                                    <p className="text-gray-400 text-[10px]">ID: {c.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-600">{c.email}</td>
                                        <td className="px-4 py-3 text-xs text-gray-600">{c.phone || "—"}</td>
                                        <td className="px-4 py-3 text-xs text-gray-600">{c.city || "—"}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                                {c.total_orders || 0}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-blue-700 text-xs">
                                            {c.total_spent ? formatPrice(Number(c.total_spent)) : "₦0"}
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
