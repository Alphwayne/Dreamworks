"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { CartDrawer } from "@/components/CartDrawer";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            await fetch("/api/email/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            setSent(true);
            setForm({ name: "", email: "", message: "" });
        } catch {
            alert("Something went wrong. Please try WhatsApp instead.");
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <CartDrawer />
            <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#eef2ff 0%,#f8faff 50%,#f0f7ff 100%)" }}>
                <Header />

                {/* Hero */}
                <div className="relative py-16 px-4 overflow-hidden" style={{ background: "linear-gradient(135deg,#003B7E 0%,#1565C0 100%)" }}>
                    <div className="relative max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">Get in Touch</h1>
                        <p className="text-blue-200 text-base">We're here to help — online and in-store</p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Left — info cards */}
                        <div className="space-y-4">
                            {[
                                { icon: <MapPin size={20} />, title: "Visit Our Store", lines: ["83 Adeniyi Jones Avenue", "Ikeja, Lagos, Nigeria"], color: "from-blue-600 to-blue-700" },
                                { icon: <Phone size={20} />, title: "Call Us", lines: ["+234 912 758 5071", "+234 907 040 2023"], color: "from-emerald-600 to-emerald-700" },
                                { icon: <Mail size={20} />, title: "Email Us", lines: ["ecommerce@dreamworksdirect.com"], color: "from-purple-600 to-purple-700" },
                                { icon: <Clock size={20} />, title: "Working Hours", lines: ["Mon - Sat: 9am - 7pm", "Sunday: Closed"], color: "from-orange-600 to-orange-700" },
                            ].map((item) => (
                                <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white flex-shrink-0`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm mb-1">{item.title}</p>
                                        {item.lines.map((l) => <p key={l} className="text-gray-500 text-sm">{l}</p>)}
                                    </div>
                                </div>
                            ))}

                            {/* WhatsApp CTA */}
                            <a
                                href="https://wa.me/2349027256852"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl p-5 transition-colors"
                            >
                                <MessageCircle size={24} />
                                <div>
                                    <p className="font-bold text-sm">Chat with us on WhatsApp</p>
                                    <p className="text-green-100 text-xs">Usually replies within minutes</p>
                                </div>
                            </a>
                        </div>

                        {/* Right — contact form */}
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">Send us a message</h2>
                            <p className="text-gray-500 text-sm mb-6">We'll get back to you within 24 hours.</p>

                            {sent ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Send size={24} className="text-green-600" />
                                    </div>
                                    <p className="font-bold text-gray-900 mb-1">Message sent!</p>
                                    <p className="text-gray-500 text-sm">We'll be in touch soon.</p>
                                    <button onClick={() => setSent(false)} className="mt-4 text-blue-600 font-semibold text-sm hover:underline">
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Your Name</label>
                                        <input
                                            type="text" required value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Email Address</label>
                                        <input
                                            type="email" required value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">Message</label>
                                        <textarea
                                            required rows={5} value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit" disabled={sending}
                                        className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white py-3.5 rounded-xl font-bold transition-colors disabled:opacity-60"
                                    >
                                        <Send size={16} />
                                        {sending ? "Sending..." : "Send Message"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Map */}
                    <div className="mt-10 rounded-3xl overflow-hidden border border-gray-100 h-80">
                        <iframe
                            src="https://www.google.com/maps?q=83+Adeniyi+Jones+Avenue+Ikeja+Lagos&output=embed"
                            width="100%" height="100%" style={{ border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>

                <BottomNav />
            </div>
        </>
    );
}