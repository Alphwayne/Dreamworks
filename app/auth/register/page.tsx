"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, Star, Gift } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
        if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: { data: { first_name: form.firstName, last_name: form.lastName, phone: form.phone } },
        });
        if (error) { setError(error.message); setLoading(false); return; }
        setSuccess(true);
        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #020817 0%, #0f1a3e 40%, #1a0a3e 100%)" }}>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 max-w-md w-full text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/30">
                        <Star size={36} className="text-white fill-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome to DreamWorks!</h2>
                    <p className="text-white/50 text-sm mb-3">Check your email to confirm your account.</p>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-6">
                        <p className="text-yellow-300 text-sm font-semibold">🎉 You've earned 50,000 DreamPoints for signing up!</p>
                    </div>
                    <Link href="/auth/signin" className="block w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl font-bold hover:from-blue-500 hover:to-blue-400 transition-all">
                        Sign In Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #020817 0%, #0f1a3e 40%, #1a0a3e 100%)" }}>
            {/* Left panel */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
                <div className="relative">
                    <Image src="/Dw_web_Logo.avif" alt="DreamWorks Direct" width={160} height={50} className="object-contain brightness-200" />
                </div>
                <div className="relative">
                    <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                        Join the<br />
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">DreamPoints Family</span>
                    </h2>
                    <p className="text-white/50 text-base mb-8">Create your account and start earning DreamPoints on every purchase.</p>
                    <div className="space-y-3">
                        {[
                            { icon: "⭐", text: "50,000 DreamPoints just for signing up" },
                            { icon: "🎁", text: "Earn ₦1,500 for every qualifying referral" },
                            { icon: "📸", text: "20,000 points for following on Instagram" },
                            { icon: "🛍️", text: "1 DreamPoint for every ₦1 spent" },
                        ].map((perk, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                                <span className="text-lg">{perk.icon}</span>
                                <span className="text-white/70 text-sm">{perk.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="relative text-white/20 text-xs">© 2026 Dreamworks Direct. All rights reserved.</p>
            </div>

            {/* Right form */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-10 overflow-y-auto">
                <div className="w-full max-w-md py-8">
                    <div className="lg:hidden mb-8 text-center">
                        <Image src="/Dw_web_Logo.avif" alt="DreamWorks" width={140} height={44} className="object-contain brightness-200 mx-auto" />
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
                            <p className="text-white/40 text-sm">Start earning DreamPoints today</p>
                        </div>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {[{ name: "firstName", label: "First Name", placeholder: "John" }, { name: "lastName", label: "Last Name", placeholder: "Adeyemi" }].map((field) => (
                                    <div key={field.name}>
                                        <label className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 block">{field.label} *</label>
                                        <input type="text" name={field.name} value={form[field.name as keyof typeof form]} onChange={handleChange} required placeholder={field.placeholder}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-sm" />
                                    </div>
                                ))}
                            </div>
                            {[{ name: "email", type: "email", label: "Email Address", placeholder: "you@example.com" }, { name: "phone", type: "tel", label: "Phone Number", placeholder: "+234..." }].map((field) => (
                                <div key={field.name}>
                                    <label className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 block">{field.label}</label>
                                    <input type={field.type} name={field.name} value={form[field.name as keyof typeof form]} onChange={handleChange} required={field.name === "email"} placeholder={field.placeholder}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-sm" />
                                </div>
                            ))}
                            <div>
                                <label className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 block">Password *</label>
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required placeholder="Minimum 6 characters"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-sm" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 block">Confirm Password *</label>
                                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder="Repeat password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all text-sm" />
                            </div>
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center">
                                <p className="text-yellow-300 text-xs font-semibold">🎉 Get 50,000 DreamPoints FREE when you sign up!</p>
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 rounded-xl font-bold transition-all disabled:opacity-60 shadow-lg hover:scale-[1.02]">
                                <UserPlus size={16} />
                                {loading ? "Creating account..." : "Create Account & Earn Points"}
                            </button>
                        </form>
                        <div className="mt-6 text-center">
                            <p className="text-sm text-white/30">Already have an account?{" "}
                                <Link href="/auth/signin" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">Sign in</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}