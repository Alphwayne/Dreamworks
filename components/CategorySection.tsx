"use client";

import Link from "next/link";
import { CATEGORY_MAP } from "@/lib/types";
import { ChevronRight } from "lucide-react";

const CATEGORY_CONFIG: Record<string, { icon: string; gradient: string; textColor: string }> = {
    "ACCESSORIES": { icon: "🔌", gradient: "from-slate-800 to-slate-600", textColor: "text-white" },
    "COMPUTING ACCESSORIES": { icon: "💻", gradient: "from-blue-800 to-blue-600", textColor: "text-white" },
    "ENTERPRISE": { icon: "🖥️", gradient: "from-indigo-800 to-indigo-600", textColor: "text-white" },
    "MOBILE DEVICES": { icon: "📱", gradient: "from-purple-800 to-purple-600", textColor: "text-white" },
    "POWER": { icon: "⚡", gradient: "from-yellow-700 to-orange-600", textColor: "text-white" },
    "SMART DEVICES": { icon: "🏠", gradient: "from-teal-800 to-teal-600", textColor: "text-white" },
    "SURVEILLANCE": { icon: "📷", gradient: "from-gray-800 to-gray-600", textColor: "text-white" },
    "OFFICE ESSENTIALS": { icon: "🖨️", gradient: "from-emerald-800 to-emerald-600", textColor: "text-white" },
    "HEALTH & PERSONAL CARE": { icon: "💊", gradient: "from-rose-800 to-rose-600", textColor: "text-white" },
};

export function CategorySection() {
    const entries = Object.entries(CATEGORY_MAP);

    return (
        <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Browse</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
                </div>
                <Link href="/collections/all" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
                    All <ChevronRight size={14} />
                </Link>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
                {entries.map(([dbCat, info]) => {
                    const config = CATEGORY_CONFIG[dbCat] || { icon: "📦", gradient: "from-gray-700 to-gray-500", textColor: "text-white" };
                    return (
                        <Link
                            key={dbCat}
                            href={`/collections/${info.slug}`}
                            className="group flex flex-col items-center gap-2 rounded-2xl p-3 md:p-4 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Icon circle */}
                            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                                <span className="text-2xl">{config.icon}</span>
                            </div>
                            {/* Label */}
                            <span className="text-[10px] md:text-xs text-center font-semibold text-gray-600 group-hover:text-blue-600 leading-tight transition-colors">
                                {info.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}