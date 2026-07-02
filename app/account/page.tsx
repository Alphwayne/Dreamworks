"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, LogOut, User, ChevronRight, Star, Gift, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { CartDrawer } from "@/components/CartDrawer";
import { formatPrice } from "@/lib/types";

interface UserOrder {
    id: number;
    order_number: string;
    total: number;
    financial_status: string;
    fulfillment_status: string;
    created_at: string;
}

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<UserOrder[]>([]);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push("/auth/signin"); return; }
            setUser(user);

            const [ordersRes, pointsRes] = await Promise.all([
                supabase.from("orders").select("id,order_number,total,financial_status,fulfillment_status,created_at")
                    .eq("email", user.email).order("created_at", { ascending: false }).limit(10),
                fetch(`/api/dreampoints/balance?user_id=${user.id}`).then(r => r.json()),
            ]);

            setOrders((ordersRes.data || []) as UserOrder[]);
            setBalance(pointsRes.balance || 0);

            // Award signup points if not yet awarded
            await fetch("/api/dreampoints/award", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.id, action: "signup" }),
            });

            setLoading(false);
        }
        load();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="max-w-3xl mx-auto px-4 py-12 space-y-4 animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-3xl" />
                    <div className="h-48 bg-gray-200 rounded-3xl" />
                </div>
            </>
        );
    }

    const firstName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "Customer";
    const nairaValue = Math.floor(balance / 100000) * 1000;

    return (
        <>
            <CartDrawer />
            <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#eef2ff 0%,#f8faff 50%,#f0f7ff 100%)" }}>
                <Header />

                <div className="max-w-3xl mx-auto px-4 py-8 pb-24">

                    {/* Welcome card */}
                    <div className="rounded-3xl overflow-hidden mb-6" style={{ background: "linear-gradient(135deg,#003B7E 0%,#1565C0 100%)" }}>
                        <div className="p-6 md:p-8">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                                        <User size={26} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-blue-200 text-xs mb-0.5">Welcome back</p>
                                        <h1 className="text-xl font-bold text-white">{firstName}</h1>
                                        <p className="text-blue-200 text-xs">{user?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-xl transition-colors border border-white/20"
                                >
                                    <LogOut size={14} /> Sign Out
                                </button>
                            </div>

                            {/* DreamPoints inline */}
                            <div className="mt-6 bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                                        <Star size={18} className="text-white fill-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-lg">{balance.toLocaleString()} pts</p>
                                        <p className="text-blue-200 text-xs">≈ ₦{nairaValue.toLocaleString()} in rewards</p>
                                    </div>
                                </div>
                                <Link href="/dreampoints" className="text-xs text-blue-200 hover:text-white flex items-center gap-1 transition-colors">
                                    View rewards <ChevronRight size={12} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <Link href="/collections/all" className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-3 hover:shadow-lg hover:shadow-blue-500/10 transition-all group">
                            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <ShoppingBag size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Shop Now</p>
                                <p className="text-xs text-gray-500">Browse all products</p>
                            </div>
                        </Link>
                        <a
                            href="https://wa.me/2349027256852"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-3 hover:shadow-lg transition-all group"
                        >
                            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                <span className="text-xl">💬</span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Support</p>
                                <p className="text-xs text-gray-500">24/7 WhatsApp</p>
                            </div>
                        </a>
                    </div>

                    {/* Order history */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Package size={18} className="text-blue-600" /> Order History
                            </h2>
                            <span className="text-sm text-gray-400">{orders.length} orders</span>
                        </div>

                        {orders.length === 0 ? (
                            <div className="text-center py-10">
                                <Package size={40} className="text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium mb-1">No orders yet</p>
                                <p className="text-gray-400 text-sm mb-4">Start shopping to see your orders here</p>
                                <Link href="/collections/all" className="text-blue-600 font-semibold hover:underline text-sm">
                                    Browse products →
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50/50 transition-colors">
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">#{order.order_number}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {new Date(order.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                                            </p>
                                            <div className="flex gap-2 mt-1.5">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${order.financial_status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                                    }`}>
                                                    {order.financial_status}
                                                </span>
                                                {order.fulfillment_status && (
                                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                                        {order.fulfillment_status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-blue-700">{formatPrice(Number(order.total))}</p>
                                            <a
                                                href={`https://wa.me/2349027256852?text=Hi! I'd like to track order #${order.order_number}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-600 hover:underline mt-1 flex items-center gap-1 justify-end"
                                            >
                                                Track <ChevronRight size={10} />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <BottomNav />
            </div>
        </>
    );
}