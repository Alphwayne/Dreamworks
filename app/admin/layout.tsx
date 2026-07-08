"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import {
    LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
    FileText, Code2, UserCog, LogOut, ChevronLeft,
    Menu, X
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

    const checkAuth = useCallback(async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.user?.email) {
                router.replace("/admin/login");
                return;
            }

            const userEmail = session.user.email;
            setEmail(userEmail);

            if (userEmail === ORACLE_EMAIL) {
                setRole("oracle");
                setLoading(false);
                return;
            }

            const { data: adminUser } = await supabase
                .from("admin_users")
                .select("role, is_active")
                .eq("email", userEmail)
                .eq("is_active", true)
                .single();

            if (adminUser) {
                setRole(adminUser.role as Role);
                setLoading(false);
            } else {
                setRole("admin");
                setLoading(false);
            }
        } catch (error) {
            router.replace("/admin/login");
        }
    }, [router]);

    useEffect(() => {
        if (pathname === "/admin/login") {
            setLoading(false);
            return;
        }

        checkAuth();

        const timeout = setTimeout(() => {
            setLoading(false);
            if (!role) setRole("admin");
        }, 1500);

        return () => clearTimeout(timeout);
    }, [pathname, checkAuth, role]);

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.replace("/admin/login");
    }

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0a0e1a 0%, #0d1b3e 30%, #0a1628 60%, #060b14 100%)" }}>
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin mx-auto" />
                </div>
            </div>
        );
    }

    const filteredNav = NAV_ITEMS.filter((item) => item.roles.includes(role));

    return (
        <div className="h-screen bg-[#f0f2f5] flex overflow-hidden">
            {/* Sidebar - Desktop - FIXED height, does not scroll with content */}
            <aside className={`hidden lg:flex flex-col flex-shrink-0 h-screen transition-all duration-300 relative ${sidebarOpen ? "w-[240px]" : "w-[72px]"}`}
                style={{ background: "linear-gradient(180deg, #0d1b3e 0%, #0a1628 50%, #060b14 100%)" }}>

                {/* Subtle side glow */}
                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-blue-500/20 via-transparent to-transparent" />

                {/* Logo area - CENTERED prominently */}
                <div className={`flex flex-col items-center pt-6 pb-4 border-b border-white/[0.06] ${sidebarOpen ? "px-5" : "px-2"}`}>
                    {/* Collapse toggle */}
                    {sidebarOpen && (
                        <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 w-6 h-6 rounded-md hover:bg-white/[0.06] flex items-center justify-center transition-colors">
                            <ChevronLeft size={12} className="text-white/30" />
                        </button>
                    )}
                    {!sidebarOpen && (
                        <button onClick={() => setSidebarOpen(true)} className="absolute top-4 right-3 w-6 h-6 rounded-md hover:bg-white/[0.06] flex items-center justify-center transition-colors">
                            <ChevronLeft size={12} className="text-white/30 rotate-180" />
                        </button>
                    )}

                    {/* Logo - centered and bold */}
                    <Image
                        src="/Dw_web_Logo.avif"
                        alt="DreamWorks"
                        width={sidebarOpen ? 56 : 36}
                        height={sidebarOpen ? 56 : 36}
                        className="rounded-2xl shadow-lg shadow-blue-500/20"
                    />

                    {sidebarOpen && (
                        <>
                            <p className="text-[10px] text-blue-300/50 font-medium mt-3">Admin Panel</p>
                            <div className={`mt-1.5 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-[0.15em] ${role === "oracle"
                                ? "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-300 border border-amber-500/20"
                                : role === "admin"
                                    ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                    : "bg-white/5 text-white/40 border border-white/10"
                                }`}>
                                {role === "oracle" ? "Oracle Access" : role === "admin" ? "Admin" : "Staff"}
                            </div>
                        </>
                    )}
                </div>

                {/* Navigation - scrollable independently */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                    {sidebarOpen && <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] px-3 mb-3">Navigation</p>}
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

                {/* User info + Sign out at bottom */}
                <div className="border-t border-white/[0.06] p-3 space-y-2">
                    {sidebarOpen && (
                        <div className="px-3 py-2">
                            <p className="text-[11px] font-medium text-white/50 truncate">{email.split("@")[0]}</p>
                            <p className="text-[9px] text-white/25 capitalize">{role}</p>
                        </div>
                    )}
                    <button
                        onClick={handleSignOut}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-all ${!sidebarOpen ? "justify-center" : ""}`}
                    >
                        <LogOut size={16} />
                        {sidebarOpen && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0d1b3e]/95 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4 z-50">
                <button onClick={() => setMobileMenuOpen(true)} className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center">
                    <Menu size={18} className="text-white/60" />
                </button>
                <Image src="/Dw_web_Logo.avif" alt="DreamWorks" width={32} height={32} className="rounded-xl" />
                <button onClick={handleSignOut} className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center">
                    <LogOut size={16} className="text-white/40" />
                </button>
            </div>

            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-72 shadow-2xl flex flex-col"
                        style={{ background: "linear-gradient(180deg, #0d1b3e 0%, #0a1628 50%, #060b14 100%)" }}>
                        {/* Mobile menu header */}
                        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <Image src="/Dw_web_Logo.avif" alt="DreamWorks" width={40} height={40} className="rounded-xl" />
                                <div>
                                    <p className="text-[10px] text-blue-300/50 font-medium">Admin Panel</p>
                                    <div className={`mt-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider inline-block ${role === "oracle"
                                        ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                                        : "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                        }`}>
                                        {role === "oracle" ? "Oracle" : role || "Admin"}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center">
                                <X size={18} className="text-white/40" />
                            </button>
                        </div>

                        {/* Mobile nav */}
                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            {filteredNav.map((item) => {
                                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                            ? "bg-blue-500/15 text-blue-300"
                                            : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
                                            }`}
                                    >
                                        <Icon size={18} className={isActive ? "text-blue-400" : "text-white/30"} />
                                        <span>{item.label}</span>
                                        {isActive && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Mobile sign out */}
                        <div className="border-t border-white/[0.06] p-4">
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-all"
                            >
                                <LogOut size={16} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main content - scrolls independently, fills available height */}
            <main className="flex-1 overflow-y-auto h-screen lg:pt-0 pt-14">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
