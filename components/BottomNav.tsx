"use client";

import Link from "next/link";
import { Search, Home, ShoppingBag, User, Grid3X3 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export function BottomNav() {
    const pathname = usePathname();
    const { getTotalItems, openCart } = useCartStore();
    const totalItems = getTotalItems();

    const links = [
        { href: "/", icon: Home, label: "Home" },
        { href: "/collections/all", icon: Grid3X3, label: "Shop" },
        { href: "/search", icon: Search, label: "Search" },
        { href: "/account", icon: User, label: "Account" },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
            <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100/50 shadow-2xl">
                <div className="flex items-center justify-around h-16 px-2">
                    {links.map(({ href, icon: Icon, label }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${isActive ? "text-blue-600" : "text-gray-400 hover:text-blue-600"}`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-[9px] font-medium">{label}</span>
                            </Link>
                        );
                    })}

                    {/* Cart button */}
                    <button
                        onClick={openCart}
                        className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all text-gray-400 hover:text-blue-600 relative"
                    >
                        <div className="relative">
                            <ShoppingBag className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white text-[8px] rounded-full flex items-center justify-center font-bold">
                                    {totalItems}
                                </span>
                            )}
                        </div>
                        <span className="text-[9px] font-medium">Cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
}