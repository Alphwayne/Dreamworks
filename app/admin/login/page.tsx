"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Shield, Eye, EyeOff, AlertCircle, Lock, Fingerprint } from "lucide-react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        if (!data.user) {
            setError("Authentication failed. Please try again.");
            setLoading(false);
            return;
        }

        // Check if user has admin access
        const ORACLE_EMAIL = "amosudnl896@gmail.com";
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
            setError("You do not have admin access. Contact the Oracle administrator.");
            await supabase.auth.signOut();
            setLoading(false);
            return;
        }

        router.push("/admin");
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0a0e1a 0%, #0d1b3e 30%, #0a1628 60%, #060b14 100%)" }}>

            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/8 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]" />
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo & branding */}
                <div className="text-center mb-10">
                    <div className="relative inline-flex">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/30 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Shield size={36} className="text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Lock size={10} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mt-6 tracking-tight">DreamWorks Admin</h1>
                    <p className="text-blue-300/50 text-sm mt-2 font-medium">Secure access to your control panel</p>
                </div>

                {/* Login form card */}
                <form onSubmit={handleLogin}
                    className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)]">

                    {/* Subtle top glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

                    {error && (
                        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3.5 mb-6">
                            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                            <p className="text-red-300 text-xs font-medium">{error}</p>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="text-[11px] font-bold text-blue-200/60 uppercase tracking-[0.15em] mb-2.5 block">Email Address</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@dreamworksdirect.com"
                                    required
                                    className="w-full bg-white/[0.04] border border-white/[0.08] group-focus-within:border-blue-500/50 rounded-2xl px-5 py-4 text-white text-sm placeholder:text-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-300"
                                />
                                <Fingerprint size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-blue-400/50 transition-colors" />
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold text-blue-200/60 uppercase tracking-[0.15em] mb-2.5 block">Password</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    className="w-full bg-white/[0.04] border border-white/[0.08] group-focus-within:border-blue-500/50 rounded-2xl px-5 py-4 text-white text-sm placeholder:text-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-300 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-8 relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-500 hover:via-blue-600 hover:to-indigo-500 text-white font-bold py-4.5 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_32px_-4px_rgba(59,130,246,0.4)] hover:shadow-[0_12px_40px_-4px_rgba(59,130,246,0.5)] text-sm tracking-wide"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2.5">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Authenticating...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <Lock size={14} />
                                Sign In to Admin
                            </span>
                        )}
                    </button>

                    <div className="flex items-center justify-center gap-2 mt-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
                        <p className="text-white/20 text-[11px] font-medium tracking-wide">
                            Encrypted connection · Authorized personnel only
                        </p>
                    </div>
                </form>

                {/* Bottom branding */}
                <p className="text-center text-white/10 text-[10px] mt-8 tracking-widest uppercase font-medium">
                    DreamWorks Direct · Admin Portal v2.0
                </p>
            </div>
        </div>
    );
}
