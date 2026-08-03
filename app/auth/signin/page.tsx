"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Star, ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import { shopifyFetch } from "@/lib/shopify";
import Link from "next/link";
import Image from "next/image";

export default function AuthPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Sign In form
    const [signInForm, setSignInForm] = useState({ email: "", password: "" });
    // Sign Up form
    const [signUpForm, setSignUpForm] = useState({ 
        firstName: "", 
        lastName: "", 
        email: "", 
        phone: "", 
        password: "" 
    });

    // Auto-switch to sign-up if redirected from /auth/register
    useEffect(() => {
        if (window.location.hash === "#register") {
            setIsSignUp(true);
        }
    }, []);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await shopifyFetch(`
                mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
                    customerAccessTokenCreate(input: $input) {
                        customerUserErrors {
                            code
                            field
                            message
                        }
                        customerAccessToken {
                            accessToken
                            expiresAt
                        }
                    }
                }
            `, {
                input: {
                    email: signInForm.email,
                    password: signInForm.password,
                },
            });

            const result = data.customerAccessTokenCreate;

            if (result.customerUserErrors && result.customerUserErrors.length > 0) {
                setError(result.customerUserErrors[0].message || "Invalid email or password");
                setLoading(false);
                return;
            }

            if (result.customerAccessToken) {
                localStorage.setItem("shopify_customer_token", result.customerAccessToken.accessToken);
                localStorage.setItem("shopify_customer_token_expires", result.customerAccessToken.expiresAt);
                router.push("/account");
            } else {
                setError("Login failed. Please try again.");
            }
        } catch {
            setError("Login failed. Please check your credentials.");
        }
        setLoading(false);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (signUpForm.password.length < 6) { setError("Password must be at least 6 characters"); return; }
        setLoading(true);
        setError("");

        try {
            const data = await shopifyFetch(`
                mutation customerCreate($input: CustomerCreateInput!) {
                    customerCreate(input: $input) {
                        customerUserErrors {
                            code
                            field
                            message
                        }
                        customer {
                            id
                            email
                            firstName
                            lastName
                        }
                    }
                }
            `, {
                input: {
                    email: signUpForm.email,
                    password: signUpForm.password,
                    firstName: signUpForm.firstName,
                    lastName: signUpForm.lastName,
                    phone: signUpForm.phone ? `+234${signUpForm.phone.replace(/^0+/, "")}` : undefined,
                    acceptsMarketing: true,
                },
            });

            const result = data.customerCreate;

            if (result.customerUserErrors && result.customerUserErrors.length > 0) {
                setError(result.customerUserErrors[0].message || "Registration failed.");
                setLoading(false);
                return;
            }

            if (result.customer) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    setIsSignUp(false);
                    setSignInForm({ email: signUpForm.email, password: "" });
                }, 2500);
            } else {
                setError("Registration failed. Please try again.");
            }
        } catch {
            setError("Registration failed. Please try again.");
        }
        setLoading(false);
    };

    const togglePanel = () => {
        setIsSignUp(!isSignUp);
        setError("");
        setSuccess(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-6 md:py-12" style={{ background: "linear-gradient(135deg, #001a3d 0%, #003B7E 30%, #ffffff 100%)" }}>
            
            {/* Desktop View (Visible on md and up) */}
            <div className="hidden md:flex relative w-full max-w-[850px] min-h-[600px] bg-white rounded-[30px] shadow-2xl overflow-hidden">
                
                {/* ============ SIGN UP FORM (Desktop) ============ */}
                <div 
                    className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out z-[1] ${
                        isSignUp ? "translate-x-full opacity-100 z-[5]" : "opacity-0 z-[1] pointer-events-none"
                    }`}
                >
                    <div className="flex flex-col items-center justify-center h-full px-12 text-center py-10">
                        <div className="mb-4">
                            <Image src="/Dw_web_Logo.avif" alt="DreamWorks" width={110} height={36} className="object-contain" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
                        <p className="text-[10px] text-gray-400 mb-4 uppercase tracking-widest">Join the DreamPoints family</p>

                        {error && isSignUp && (
                            <div className="w-full bg-red-50 border border-red-200 text-red-600 text-[10px] px-3 py-2 rounded-lg mb-3">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="w-full bg-green-50 border border-green-200 text-green-700 text-[10px] px-3 py-2 rounded-lg mb-3">
                                Account created! Redirecting to sign in...
                            </div>
                        )}

                        <form onSubmit={handleSignUp} className="w-full space-y-2.5">
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text" placeholder="First Name" required
                                    value={signUpForm.firstName}
                                    onChange={(e) => setSignUpForm({ ...signUpForm, firstName: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                                />
                                <input
                                    type="text" placeholder="Last Name" required
                                    value={signUpForm.lastName}
                                    onChange={(e) => setSignUpForm({ ...signUpForm, lastName: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                                />
                            </div>
                            <input
                                type="email" placeholder="Email Address" required
                                value={signUpForm.email}
                                onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                            />
                            <input
                                type="tel" placeholder="Phone (e.g. 08012345678)"
                                value={signUpForm.phone}
                                onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                            />
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} placeholder="Password" required
                                    value={signUpForm.password}
                                    onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 pr-10 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            
                            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-2 text-center">
                                <p className="text-[9px] text-yellow-700 font-bold flex items-center justify-center gap-1 uppercase tracking-tight">
                                    <Star size={10} className="fill-yellow-500 text-yellow-500" />
                                    Get 50,000 DreamPoints FREE on sign up!
                                </p>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-gradient-to-r from-[#003B7E] to-[#1565C0] text-white font-bold py-3.5 rounded-lg uppercase text-xs tracking-wider transition-all shadow-md hover:shadow-lg mt-1"
                            >
                                {loading && isSignUp ? "Creating account..." : "SIGN UP & EARN POINTS"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* ============ SIGN IN FORM (Desktop) ============ */}
                <div 
                    className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out z-[2] ${
                        isSignUp ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                >
                    <div className="flex flex-col items-center justify-center h-full px-12 text-center py-10">
                        <div className="mb-6">
                            <Image src="/Dw_web_Logo.avif" alt="DreamWorks" width={140} height={46} className="object-contain" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">Sign In</h1>
                        <p className="text-[10px] text-gray-400 mb-6 uppercase tracking-widest">Nigeria&apos;s #1 Tech Store</p>

                        {error && !isSignUp && (
                            <div className="w-full bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSignIn} className="w-full space-y-4">
                            <input
                                type="email" placeholder="Email Address" required
                                value={signInForm.email}
                                onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                            />
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} placeholder="Password" required
                                    value={signInForm.password}
                                    onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3.5 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            
                            <div className="flex justify-end">
                                <Link href="/auth/forgot-password" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
                                    Forget Your Password?
                                </Link>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-gradient-to-r from-[#003B7E] to-[#1565C0] text-white font-bold py-4 rounded-lg uppercase text-xs tracking-wider transition-all shadow-md hover:shadow-lg mt-2"
                            >
                                {loading && !isSignUp ? "Signing in..." : "SIGN IN"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* ============ OVERLAY CONTAINER (Sliding Part) ============ */}
                <div 
                    className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-[100] ${
                        isSignUp ? "-translate-x-full rounded-r-[80px]" : "rounded-l-[80px]"
                    }`}
                >
                    <div 
                        className={`relative left-[-100%] h-full w-[200%] text-white transition-all duration-700 ease-in-out ${
                            isSignUp ? "translate-x-1/2" : "translate-x-0"
                        }`}
                        style={{ background: "linear-gradient(135deg, #001a3d 0%, #003B7E 50%, #1565C0 100%)" }}
                    >
                        {/* Right Overlay Panel (Paired with SIGN IN view) */}
                        <div className={`absolute top-0 right-0 h-full w-1/2 flex flex-col items-center justify-center px-10 text-center transition-all duration-700 ease-in-out ${
                            isSignUp ? "translate-x-[20%]" : "translate-x-0"
                        }`}>
                            <h2 className="text-3xl font-bold mb-3">Hello, Friend!</h2>
                            <p className="text-blue-100/70 text-sm leading-relaxed mb-8 max-w-[280px]">
                                Join Nigeria&apos;s #1 Tech Community and start earning DreamPoints on every purchase.
                            </p>
                            <button
                                onClick={togglePanel}
                                className="border-2 border-white text-white font-bold py-2.5 px-10 rounded-lg uppercase text-xs tracking-wider hover:bg-white hover:text-[#003B7E] transition-all"
                            >
                                SIGN UP
                            </button>
                        </div>

                        {/* Left Overlay Panel (Paired with SIGN UP view) */}
                        <div className={`absolute top-0 left-0 h-full w-1/2 flex flex-col items-center justify-center px-10 text-center transition-all duration-700 ease-in-out ${
                            isSignUp ? "translate-x-0" : "-translate-x-[20%]"
                        }`}>
                            <h2 className="text-3xl font-bold mb-3">Welcome Back!</h2>
                            <p className="text-blue-100/70 text-sm leading-relaxed mb-8 max-w-[280px]">
                                Sign in to access your orders, track your shipments, and manage your DreamPoints.
                            </p>
                            <button
                                onClick={togglePanel}
                                className="border-2 border-white text-white font-bold py-2.5 px-10 rounded-lg uppercase text-xs tracking-wider hover:bg-white hover:text-[#003B7E] transition-all"
                            >
                                SIGN IN
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile View (Visible on sm screens only) */}
            <div className="md:hidden w-full max-w-[450px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
                {/* Mobile Header / Branding */}
                <div 
                    className="w-full py-8 px-6 text-center text-white relative"
                    style={{ background: "linear-gradient(135deg, #001a3d 0%, #003B7E 100%)" }}
                >
                    <div className="mb-4 flex justify-center">
                        <Image src="/Dw_web_Logo.avif" alt="DreamWorks" width={120} height={40} className="object-contain brightness-0 invert" />
                    </div>
                    <h2 className="text-2xl font-bold">{isSignUp ? "Hello, Friend!" : "Welcome Back!"}</h2>
                    <p className="text-blue-100/70 text-xs mt-2">
                        {isSignUp ? "Join Nigeria's #1 Tech Community" : "Sign in to manage your tech lifestyle"}
                    </p>
                </div>

                {/* Mobile Form Area with Transition */}
                <div className="flex-1 p-6 relative min-h-[380px]">
                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-[10px] px-3 py-2 rounded-lg mb-4 text-center">
                            {error}
                        </div>
                    )}

                    {/* Sign In View */}
                    <div className={`transition-all duration-500 ease-in-out ${!isSignUp ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none absolute inset-0 p-6"}`}>
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <input
                                type="email" placeholder="Email Address" required
                                value={signInForm.email}
                                onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                            />
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} placeholder="Password" required
                                    value={signInForm.password}
                                    onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <Link href="/auth/forgot-password" className="text-xs text-gray-500 hover:text-blue-600">
                                    Forget Password?
                                </Link>
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-gradient-to-r from-[#003B7E] to-[#1565C0] text-white font-bold py-4 rounded-xl uppercase text-xs tracking-wider transition-all shadow-md active:scale-[0.98]"
                            >
                                {loading ? "Signing in..." : "SIGN IN"}
                            </button>
                        </form>
                        <div className="mt-8 text-center">
                            <button onClick={togglePanel} className="text-xs text-blue-600 font-bold flex items-center justify-center gap-1 mx-auto">
                                New here? <span className="underline">Create Account</span> <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Sign Up View */}
                    <div className={`transition-all duration-500 ease-in-out ${isSignUp ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none absolute inset-0 p-6"}`}>
                        <form onSubmit={handleSignUp} className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text" placeholder="First Name" required
                                    value={signUpForm.firstName}
                                    onChange={(e) => setSignUpForm({ ...signUpForm, firstName: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-3 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                                />
                                <input
                                    type="text" placeholder="Last Name" required
                                    value={signUpForm.lastName}
                                    onChange={(e) => setSignUpForm({ ...signUpForm, lastName: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-3 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                                />
                            </div>
                            <input
                                type="email" placeholder="Email Address" required
                                value={signUpForm.email}
                                onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                            />
                            <input
                                type="tel" placeholder="Phone Number"
                                value={signUpForm.phone}
                                onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                            />
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} placeholder="Password" required
                                    value={signUpForm.password}
                                    onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 pr-10 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-2 text-center">
                                <p className="text-[9px] text-yellow-700 font-bold uppercase tracking-tight flex items-center justify-center gap-1">
                                    <Star size={10} className="fill-yellow-500 text-yellow-500" />
                                    Earn 50,000 DreamPoints!
                                </p>
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-gradient-to-r from-[#003B7E] to-[#1565C0] text-white font-bold py-4 rounded-xl uppercase text-xs tracking-wider transition-all shadow-md active:scale-[0.98]"
                            >
                                {loading ? "Creating..." : "SIGN UP & EARN"}
                            </button>
                        </form>
                        <div className="mt-6 text-center">
                            <button onClick={togglePanel} className="text-xs text-blue-600 font-bold flex items-center justify-center gap-1 mx-auto">
                                <ChevronLeft size={14} /> Back to <span className="underline">Sign In</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to store link */}
            <Link href="/" className="fixed bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 bg-white/50 backdrop-blur px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <ArrowLeft size={12} /> Back to store
            </Link>
        </div>
    );
}
