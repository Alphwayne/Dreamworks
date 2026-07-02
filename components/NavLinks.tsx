"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    { name: "Tech Setups", href: "/collections/tech-setups" },
    { name: "Best Sellers", href: "/collections/best-sellers" },
    { name: "Brands", href: "/brands" },
    { name: "Shop All", href: "/collections/all" },
];

export function NavLinks() {
    const pathname = usePathname();

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-2 h-12 overflow-x-auto scrollbar-hide">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all whitespace-nowrap ${isActive
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}