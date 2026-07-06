"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
    LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
    FileText, Code2, UserCog, Settings, LogOut, ChevronLeft,
    Menu, X, Shield
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Verifying access...</p>
                </div>
            </div>
        );
    }

    const filteredNav = NAV_ITEMS.filter((item) => item.roles.includes(role));

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Desktop */}
            <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
                    {sidebarOpen && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                                <Shield size={16} className="text-white" />
                            </div>
                            <span className="font-bold text-gray-900 text-sm">DW Admin</span>
                        </div>
                    )}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                        <ChevronLeft size={16} className={`text-gray-400 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
                    </button>
                </div>

                {/* Role badge */}
                {sidebarOpen && (
                    <div className="px-4 py-3">
                        <div className={`px-3 py-2 rounded-xl text-xs font-bold text-center uppercase tracking-wider ${role === "oracle" ? "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200" :
                            role === "admin" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                                "bg-gray-50 text-gray-600 border border-gray-200"
                            }`}>
                            {role === "oracle" ? "⚡ Oracle Access" : role === "admin" ? "🔑 Admin" : "👤 Staff"}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {filteredNav.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? "bg-blue-50 text-blue-700 shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    } ${!sidebarOpen ? "justify-center" : ""}`}
                                title={!sidebarOpen ? item.label : undefined}
                            >
                                <Icon size={18} className={isActive ? "text-blue-600" : "text-gray-400"} />
                                {sidebarOpen && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="border-t border-gray-100 p-3">
                    {sidebarOpen ? (
                        <div className="flex items-center gap-3 px-3 py-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {email[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-900 truncate">{email}</p>
                                <p className="text-[10px] text-gray-400 capitalize">{role}</p>
                            </div>
                            <button onClick={handleSignOut} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center group">
                                <LogOut size={14} className="text-gray-400 group-hover:text-red-500" />
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleSignOut} className="w-full flex items-center justify-center py-2" title="Sign Out">
                            <LogOut size={16} className="text-gray-400 hover:text-red-500" />
                        </button>
                    )}
                </div>
            </aside>

            {/* Mobile header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-50">
                <button onClick={() => setMobileMenuOpen(true)} className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Menu size={18} className="text-gray-600" />
                </button>
                <div className="flex items-center gap-2">
                    <Shield size={16} className="text-blue-600" />
                    <span className="font-bold text-gray-900 text-sm">DW Admin</span>
                </div>
                <button onClick={handleSignOut} className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                    <LogOut size={16} className="text-gray-400" />
                </button>
            </div>

            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-4">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Shield size={18} className="text-blue-600" />
                                <span className="font-bold text-gray-900">DW Admin</span>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)}>
                                <X size={20} className="text-gray-400" />
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
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <Icon size={18} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            )}

            {/* Main content */}
            <main className="flex-1 lg:p-8 p-4 pt-18 lg:pt-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
