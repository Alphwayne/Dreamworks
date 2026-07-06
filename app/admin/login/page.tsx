"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";

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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/30">
                        <Shield size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">DreamWorks Admin</h1>
                    <p className="text-blue-200/60 text-sm mt-1">Secure access to your control panel</p>
                </div>

                {/* Login form */}
                <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
                            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                            <p className="text-red-300 text-xs">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-blue-200/80 uppercase tracking-wider mb-2 block">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@dreamworksdirect.com"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-blue-200/80 uppercase tracking-wider mb-2 block">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 text-sm"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Authenticating...
                            </span>
                        ) : (
                            "Sign In to Admin"
                        )}
                    </button>

                    <p className="text-center text-white/20 text-xs mt-4">
                        Only authorized personnel can access this panel.
                    </p>
                </form>
            </div>
        </div>
    );
}
