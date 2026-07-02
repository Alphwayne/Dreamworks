"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Check, Lock } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, getProductImage } from "@/lib/types";
import { supabase } from "@/lib/supabase";

const STEPS = ["Contact & Delivery", "Payment", "Confirm"];

const DELIVERY_ZONES = [
    { label: "Around Ikeja", fee: 0, description: "Free delivery" },
    { label: "Other Lagos", fee: 2000, description: "₦2,000 delivery fee" },
    { label: "Outside Lagos", fee: 5000, description: "From ₦5,000 — we'll confirm" },
];

export default function CheckoutPage() {
    const { items, getTotalPrice, clearCart } = useCartStore();
    const subtotal = getTotalPrice();

    const [step, setStep] = useState(0);
    const [zone, setZone] = useState(0);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "", phone: "",
        address: "", city: "Lagos", state: "Lagos",
    });

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) {
                setUserId(data.user.id);
                setForm((f) => ({ ...f, email: data.user.email || "" }));
            }
        });
    }, []);

    const deliveryFee = DELIVERY_ZONES[zone].fee;
    const total = subtotal + deliveryFee;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/paystack/initialize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.email,
                    amount: total,
                    metadata: {
                        customer_name: `${form.firstName} ${form.lastName}`,
                        phone: form.phone,
                        address: form.address,
                        city: form.city,
                        user_id: userId,
                        items: items.map((i) => ({
                            product_name: i.product.product_name,
                            item_code: i.product.item_code,
                            quantity: i.quantity,
                            selling_price: i.product.selling_price,
                        })),
                    },
                }),
            });

            const data = await res.json();
            if (data.error) {
                alert(data.error);
                setLoading(false);
                return;
            }

            // Store reference for verification after redirect
            sessionStorage.setItem("dw_payment_ref", data.reference);
            window.location.href = data.authorization_url;
        } catch (err) {
            alert("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <Header />

                <div className="max-w-5xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
                        {STEPS.map((s, i) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${i === step ? "bg-blue-700 text-white" :
                                    i < step ? "bg-green-100 text-green-700" :
                                        "bg-gray-200 text-gray-500"
                                    }`}>
                                    {i < step ? <Check size={14} /> : <span>{i + 1}</span>}
                                    {s}
                                </div>
                                {i < STEPS.length - 1 && <ChevronRight size={16} className="text-gray-400" />}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            {step === 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                    <h2 className="text-lg font-bold text-gray-900 mb-5">Contact & Delivery Details</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">First Name *</label>
                                            <input name="firstName" value={form.firstName} onChange={handleChange}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Last Name *</label>
                                            <input name="lastName" value={form.lastName} onChange={handleChange}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Phone Number *</label>
                                            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+234..."
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Email *</label>
                                            <input name="email" type="email" required value={form.email} onChange={handleChange}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Delivery Address *</label>
                                            <input name="address" value={form.address} onChange={handleChange}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase mb-3 block">Delivery Zone</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {DELIVERY_ZONES.map((z, i) => (
                                                <button key={z.label} onClick={() => setZone(i)}
                                                    className={`p-3 rounded-xl border-2 text-left transition-all ${zone === i ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}>
                                                    <p className="text-sm font-bold text-gray-900">{z.label}</p>
                                                    <p className={`text-xs mt-0.5 ${zone === i ? "text-blue-600" : "text-gray-500"}`}>{z.description}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setStep(1)}
                                        disabled={!form.firstName || !form.phone || !form.address || !form.email}
                                        className="mt-6 w-full bg-blue-700 hover:bg-blue-800 text-white py-3.5 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Continue to Payment →
                                    </button>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                    <h2 className="text-lg font-bold text-gray-900 mb-5">Payment</h2>
                                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-5">
                                        <p className="text-blue-700 text-sm font-semibold mb-1">Secure Payment via Paystack</p>
                                        <p className="text-blue-600 text-xs">Card, Bank Transfer, USSD, and Pay Small Small (BNPL) all available on the next screen.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setStep(0)} className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                                            ← Back
                                        </button>
                                        <button onClick={() => setStep(2)} className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold transition-colors">
                                            Review Order →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                    <h2 className="text-lg font-bold text-gray-900 mb-5">Review & Pay</h2>
                                    <div className="space-y-3 mb-5">
                                        {[
                                            { label: "Name", value: `${form.firstName} ${form.lastName}` },
                                            { label: "Phone", value: form.phone },
                                            { label: "Email", value: form.email },
                                            { label: "Address", value: form.address },
                                            { label: "Delivery Zone", value: DELIVERY_ZONES[zone].label },
                                        ].map((row) => (
                                            <div key={row.label} className="flex justify-between text-sm">
                                                <span className="text-gray-500">{row.label}</span>
                                                <span className="font-semibold text-gray-900">{row.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3 mb-5">
                                        <Lock size={12} /> Secured by Paystack — your payment is encrypted
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50">
                                            ← Back
                                        </button>
                                        <button onClick={handlePayment} disabled={loading}
                                            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-70">
                                            {loading ? "Redirecting..." : `Pay ${formatPrice(total)} →`}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 p-5 h-fit sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex gap-3">
                                        <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                            <Image src={getProductImage(item.product)} alt={item.product.product_name} fill className="object-contain p-1" sizes="48px" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-gray-900 line-clamp-2">{item.product.product_name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-xs font-bold text-blue-700 flex-shrink-0">{formatPrice(item.product.selling_price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 pt-3 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Delivery</span>
                                    <span className="font-semibold text-green-600">{deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold border-t border-gray-100 pt-2">
                                    <span>Total</span>
                                    <span className="text-blue-700">{formatPrice(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <BottomNav />
            </div>
        </>
    );
}