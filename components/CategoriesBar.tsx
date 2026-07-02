"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

const categories = [
    { name: "Computing", href: "/collections/computing-accessories", color: "from-blue-600 to-blue-400" },
    { name: "Mobile", href: "/collections/mobile-tablet", color: "from-purple-600 to-purple-400" },
    { name: "Electronics", href: "/collections/consumer-electronics", color: "from-indigo-600 to-indigo-400" },
    { name: "Accessories", href: "/collections/accessories", color: "from-slate-600 to-slate-400" },
    { name: "Power", href: "/collections/power", color: "from-orange-500 to-orange-400" },
    { name: "Enterprise", href: "/collections/enterprise", color: "from-emerald-600 to-emerald-400" },
    { name: "HP", href: "/collections/hp-brand", color: "from-red-600 to-red-400" },
    { name: "Apple", href: "/collections/apple", color: "from-gray-600 to-gray-400" },
];

export function CategoriesBar() {
    return (
        <div className="bg-gradient-to-r from-blue-50/80 to-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-4 h-14 overflow-x-auto scrollbar-hide">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 whitespace-nowrap">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        All Categories
                    </div>
                    <div className="h-6 w-px bg-gray-300" />
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="group relative px-4 py-1.5 text-sm font-medium text-gray-700 hover:text-white whitespace-nowrap transition-all duration-300"
                        >
                            <span className="relative z-10">{cat.name}</span>
                            <span className={`absolute inset-0 rounded-full bg-gradient-to-r ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}