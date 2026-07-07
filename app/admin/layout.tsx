"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
    LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
    FileText, Code2, UserCog, Settings, LogOut, ChevronLeft,
    Menu, X, Shield, Zap, Bell, Search
} from "lucide-react";

const ORACLE_EMAIL = "amosudnl896@gmail.com";

type Role = "oracle" | "admin" | "staff" | null;

interface NavItem {
    label: string;
    href: string;
    icon: any;
    roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["oracle", "admin", "staff"] },
    { label: "Products", href: "/admin/products", icon: Package, roles: ["oracle", "admin"] },
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart, roles: ["oracle", "admin", "staff"] },
    { label: "Customers", href: "/admin/customers", icon: Users, roles: ["oracle", "admin"] },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3, roles: ["oracle", "admin"] },
    { label: "Content", href: "/admin/content", icon: FileText, roles: ["oracle", "admin"] },
    { label: "Code Editor", href: "/admin/code-editor", icon: Code2, roles: ["oracle"] },
    { label: "Staff", href: "/admin/staff", icon: UserCog, roles: ["oracle"] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<Role>(null);
    const [email, setEmail] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user || !user.email) {
                router.push("/admin/login");
                return;
            }

            setEmail(user.email);

            // Oracle check - hardcoded email
            if (user.email === ORACLE_EMAIL) {
                setRole("oracle");
                setLoading(false);
                return;
            }

            // Check admin_users table for other roles
            const { data: adminUser } = await supabase
                .from("admin_users")
                .select("role, is_active")
                .eq("email", user.email)
                .eq("is_active", true)
                .single();

            if (adminUser) {
                setRole(adminUser.role as Role);
            } else {
                // Not authorized
                router.push("/");
                return;
            }

            setLoading(false);
        } catch (error) {
            router.push("/admin/login");
        }
    }

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.push("/admin/login");
    }

    // Allow login page to render without auth
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0a0e1a 0%, #0d1b3e 30%, #0a1628 60%, #060b14 100%)" }}>
                <div className="text-center">
                    <div className="w-14 h-14 border-[3px] border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-5" />
                    <p className="text-blue-200/50 text-sm font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    const filteredNav = NAV_ITEMS.filter((item) => item.roles.includes(role));

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex">
            {/* Sidebar - Desktop */}
            <aside className={`hidden lg:flex flex-col transition-all duration-300 relative ${sidebarOpen ? "w-[260px]" : "w-[72px]"}`}
                style={{ background: "linear-gradient(180deg, #0d1b3e 0%, #0a1628 50%, #060b14 100%)" }}>

                {/* Subtle side glow */}
                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-blue-500/20 via-transparent to-transparent" />

                {/* Logo */}
                <div className={`h-[72px] flex items-center ${sidebarOpen ? "justify-between px-5" : "justify-center"} border-b border-white/[0.06]`}>
                    {sidebarOpen && (
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Shield size={16} className="text-white" />
                            </div>
                            <div>
                                <span className="font-bold text-white text-sm tracking-tight block leading-tight">DreamWorks</span>
                                <span className="text-[10px] text-blue-300/40 font-medium">Admin Panel</span>
                            </div>
                        </div>
                    )}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-7 h-7 rounded-lg hover:bg-white/[0.06] flex items-center justify-center transition-colors">
                        <ChevronLeft size={14} className={`text-white/30 transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`} />
                    </button>
                </div>

                {/* Role badge */}
                {sidebarOpen && (
                    <div className="px-4 pt-5 pb-2">
                        <div className={`px-3 py-2 rounded-xl text-[10px] font-bold text-center uppercase tracking-[0.15em] ${role === "oracle"
                            ? "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-300 border border-amber-500/20"
                            : role === "admin"
                                ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                : "bg-white/5 text-white/40 border border-white/10"
                            }`}>
                            {role === "oracle" ? "⚡ Oracle Access" : role === "admin" ? "🔑 Admin" : "👤 Staff"}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {sidebarOpen && <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] px-3 mb-3">Navigation</p>}
                    {filteredNav.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-blue-500/15 text-blue-300 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]"
                                    : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
                                    } ${!sidebarOpen ? "justify-center" : ""}`}
                                title={!sidebarOpen ? item.label : undefined}
                            >
                                <Icon size={18} className={isActive ? "text-blue-400" : "text-white/30"} />
                                {sidebarOpen && <span>{item.label}</span>}
                                {isActive && sidebarOpen && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="border-t border-white/[0.06] p-3">
                    {sidebarOpen ? (
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03]">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg shadow-blue-500/20">
                                {email[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white/80 truncate">{email}</p>
                                <p className="text-[10px] text-white/30 capitalize font-medium">{role}</p>
                            </div>
                            <button onClick={handleSignOut} className="w-8 h-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center group transition-colors">
                                <LogOut size={14} className="text-white/20 group-hover:text-red-400 transition-colors" />
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleSignOut} className="w-full flex items-center justify-center py-2" title="Sign Out">
                            <LogOut size={16} className="text-white/20 hover:text-red-400 transition-colors" />
                        </button>
                    )}
                </div>
            </aside>

            {/* Mobile header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0d1b3e] border-b border-white/[0.06] flex items-center justify-between px-4 z-50 backdrop-blur-xl">
                <button onClick={() => setMobileMenuOpen(true)} className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center">
                    <Menu size={18} className="text-white/60" />
                </button>
                <div className="flex items-center gap-2">
                    <Shield size={16} className="text-blue-400" />
                    <span className="font-bold text-white text-sm">DW Admin</span>
                </div>
                <button onClick={handleSignOut} className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center">
                    <LogOut size={16} className="text-white/40" />
                </button>
            </div>

            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-72 shadow-2xl p-5"
                        style={{ background: "linear-gradient(180deg, #0d1b3e 0%, #0a1628 50%, #060b14 100%)" }}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <Shield size={14} className="text-white" />
                                </div>
                                <span className="font-bold text-white text-sm">DW Admin</span>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center">
                                <X size={18} className="text-white/40" />
                            </button>
                        </div>
                        <nav className="space-y-1">
                            {filteredNav.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                            ? "bg-blue-500/15 text-blue-300"
                                            : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
                                            }`}
                                    >
                                        <Icon size={18} className={isActive ? "text-blue-400" : "text-white/30"} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            )}

            {/* Main content */}
            <main className="flex-1 lg:p-8 p-4 pt-18 lg:pt-8 overflow-y-auto min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
