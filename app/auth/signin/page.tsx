"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SignInPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const { error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
        });
        if (error) { setError(error.message); setLoading(false); return; }
        router.push("/account");
    };

    return (
        <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #020817 0%, #0f1a3e 40%, #1a0a3e 100%)" }}>
            {/* Left — branding panel (hidden mobile) */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

                {/* Logo */}
                <div className="relative">
                    <Image src="/Dw_web_Logo.avif" alt="DreamWorks Direct" width={160} height={50} className="object-contain brightness-200" />
                </div>

                {/* Middle content */}
                <div className="relative">
                    <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-300 text-xs font-bold uppercase tracking-widest">DreamPoints Loyalty</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                        Welcome back to<br />
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            DreamWorks Direct
                        </span>
                    </h2>
                    <p className="text-white/50 text-base leading-relaxed mb-8">
                        Nigeria's #1 tech marketplace. Sign in to access your account, track orders, and manage your DreamPoints.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: "Customers", value: "10,000+" },
                            { label: "Products", value: "500+" },
                            { label: "Years", value: "22+" },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                <p className="text-white font-bold text-2xl">{stat.value}</p>
                                <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <p className="relative text-white/20 text-xs">
                    © 2026 Dreamworks Direct. All rights reserved.
                </p>
            </div>

            {/* Right — form */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Image src="/Dw_web_Logo.avif" alt="DreamWorks" width={140} height={44} className="object-contain brightness-200 mx-auto" />
                    </div>

                    {/* Card */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-white mb-1">Sign In</h1>
                            <p className="text-white/40 text-sm">Access your DreamWorks account</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3 rounded-xl mb-5">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 block">Email Address</label>
                                <input
                                    type="email" name="email" value={form.email} onChange={handleChange} required
                                    placeholder="you@example.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-sm"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 block">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password" value={form.password} onChange={handleChange} required
                                        placeholder="Your password"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-sm"
                                    />
                                    <button
                                        type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Link href="/auth/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-60 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02]"
                            >
                                <LogIn size={16} />
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-white/30">
                                Don't have an account?{" "}
                                <Link href="/auth/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                                    Create account
                                </Link>
                            </p>
                        </div>

                        <div className="mt-4 text-center">
                            <Link href="/" className="text-xs text-white/20 hover:text-white/40 transition-colors">
                                ← Back to store
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}