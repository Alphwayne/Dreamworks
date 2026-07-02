"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setSent(true);
        setLoading(false);
    };

    if (sent) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-md text-center">
                    <span className="text-5xl block mb-4">📬</span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        We sent a password reset link to <strong>{email}</strong>
                    </p>
                    <Link href="/auth/signin" className="block w-full bg-blue-700 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/"><h1 className="text-2xl font-bold text-blue-700">DREAMWORKS</h1></Link>
                    <p className="text-gray-500 text-sm mt-2">Enter your email and we'll send you a reset link</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Email Address</label>
                        <input
                            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            placeholder="you@example.com"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3.5 rounded-xl font-bold transition-colors disabled:opacity-70">
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/auth/signin" className="text-sm text-blue-600 hover:underline">← Back to Sign In</Link>
                </div>
            </div>
        </div>
    );
}