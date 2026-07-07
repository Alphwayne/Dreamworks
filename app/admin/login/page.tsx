"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

const ORACLE_EMAIL = "amosudnl896@gmail.com";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

        if (authError || !data.user) {
            setError("Invalid credentials. Access denied.");
            setLoading(false);
            return;
        }

        // Check if Oracle or admin
        if (data.user.email === ORACLE_EMAIL) {
            router.push("/admin");
            return;
        }

        // Check admin_users table
        const { data: adminUser } = await supabase
            .from("admin_users")
            .select("role, is_active")
            .eq("email", data.user.email)
            .eq("is_active", true)
            .single();

        if (!adminUser) {
            await supabase.auth.signOut();
            setError("You do not have admin access.");
            setLoading(false);
            return;
        }

        router.push("/admin");
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ background: "linear-gradient(145deg, #050a18 0%, #0a1832 25%, #0d1f40 50%, #081428 75%, #030810 100%)" }}>

            {/* Abstract background elements - geometric shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Large gradient circle - top right */}
                <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />

                {/* Smaller accent - bottom left */}
                <div className="absolute -bottom-[150px] -left-[150px] w-[400px] h-[400px] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)" }} />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

                {/* Floating geometric shapes */}
                <div className="absolute top-[15%] left-[10%] w-2 h-2 bg-blue-500/20 rounded-full animate-pulse" />
                <div className="absolute top-[25%] right-[15%] w-1.5 h-1.5 bg-violet-500/20 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute bottom-[30%] left-[20%] w-1 h-1 bg-blue-400/30 rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
                <div className="absolute top-[60%] right-[25%] w-2.5 h-2.5 bg-indigo-500/15 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />

                {/* Diagonal line accents */}
                <div className="absolute top-0 left-[30%] w-px h-[200px] bg-gradient-to-b from-transparent via-blue-500/10 to-transparent rotate-[20deg]" />
                <div className="absolute bottom-0 right-[25%] w-px h-[180px] bg-gradient-to-t from-transparent via-violet-500/10 to-transparent -rotate-[15deg]" />
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-[420px] mx-4">
                {/* Card glow effect */}
                <div className="absolute -inset-px rounded-[28px] bg-gradient-to-b from-white/[0.08] to-transparent" />

                <div className="relative rounded-[28px] p-8 md:p-10"
                    style={{ background: "linear-gradient(180deg, rgba(15,25,50,0.95) 0%, rgba(10,18,38,0.98) 100%)", backdropFilter: "blur(40px)", border: "1px solid rgba(255,255,255,0.06)" }}>

                    {/* Logo / Brand mark */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-5 relative">
                            {/* Abstract DW mark using CSS shapes */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/20 to-violet-600/20 border border-white/[0.08]" />
                            <div className="relative">
                                <Image src="/Dw_web_Logo.avif" alt="DreamWorks" width={40} height={40} className="opacity-90" />
                            </div>
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Welcome Back</h1>
                        <p className="text-sm text-white/30 mt-1.5 font-medium">Sign in to your admin workspace</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="text-[11px] font-bold text-white/40 uppercase tracking-[0.15em] mb-2 block">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@dreamworksdirect.com"
                                    required
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all duration-300"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold text-white/40 uppercase tracking-[0.15em] mb-2 block">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors"
                                >
                                    <span className="text-white/25 text-xs font-bold">{showPassword ? "HIDE" : "SHOW"}</span>
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                <p className="text-red-300 text-xs font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 group"
                        >
                            {/* Button shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <span className="relative">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Authenticating...
                                    </span>
                                ) : "Sign In"}
                            </span>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
                        <p className="text-[10px] text-white/15 font-medium tracking-wider uppercase">
                            DreamWorks Direct &middot; Admin Portal v3.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
