"use client";

import Link from "next/link";
import { ChevronRight, Laptop, Tv, Smartphone, Speaker, Camera, Gamepad2 } from "lucide-react";

const CATEGORIES = [
    {
        title: "Laptops & Computing",
        description: "From budget-friendly to high-performance gaming rigs",
        icon: Laptop,
        href: "/collections/computing-accessories",
        brands: ["HP", "Dell", "Lenovo", "ASUS", "Apple"],
        color: "from-blue-600 to-blue-800",
    },
    {
        title: "TVs & Displays",
        description: "4K, 8K UHD and Smart TVs for every space",
        icon: Tv,
        href: "/collections/consumer-electronics",
        brands: ["Samsung", "LG", "Sony", "Hisense", "TCL"],
        color: "from-indigo-600 to-indigo-800",
    },
    {
        title: "Phones & Tablets",
        description: "Latest smartphones and tablets from top brands",
        icon: Smartphone,
        href: "/collections/mobile-tablet",
        brands: ["Apple", "Samsung", "Google", "OnePlus"],
        color: "from-blue-700 to-blue-900",
    },
    {
        title: "Audio & Sound",
        description: "Premium headphones, speakers and soundbars",
        icon: Speaker,
        href: "/collections/accessories",
        brands: ["Sony", "JBL", "Bose", "Apple", "Samsung"],
        color: "from-slate-700 to-slate-900",
    },
    {
        title: "Cameras & Drones",
        description: "Professional cameras and aerial photography",
        icon: Camera,
        href: "/collections/smart-devices",
        brands: ["Canon", "Sony", "DJI", "Nikon", "GoPro"],
        color: "from-blue-600 to-indigo-800",
    },
    {
        title: "Gaming",
        description: "Consoles, accessories and gaming peripherals",
        icon: Gamepad2,
        href: "/collections/accessories",
        brands: ["Sony", "Microsoft", "Nintendo", "Razer"],
        color: "from-indigo-700 to-purple-900",
    },
];

export function CategoryGuide() {
    return (
        <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Browse</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">Shop by Category</h2>
                </div>
                <Link href="/collections/all" className="flex items-center gap-1 text-sm text-blue-600 font-semibold hover:underline flex-shrink-0 mt-2">
                    View all <ChevronRight size={14} />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <Link
                            key={cat.title}
                            href={cat.href}
                            className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                        >
                            {/* Subtle gradient accent */}
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                                <Icon size={20} className="text-white" />
                            </div>

                            <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                                {cat.title}
                            </h3>
                            <p className="text-gray-500 text-xs leading-relaxed mb-3">
                                {cat.description}
                            </p>

                            {/* Brand pills */}
                            <div className="flex flex-wrap gap-1.5">
                                {cat.brands.slice(0, 4).map((brand) => (
                                    <span
                                        key={brand}
                                        className="text-[10px] font-medium text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full"
                                    >
                                        {brand}
                                    </span>
                                ))}
                                {cat.brands.length > 4 && (
                                    <span className="text-[10px] font-medium text-blue-500 px-1 py-0.5">
                                        +{cat.brands.length - 4}
                                    </span>
                                )}
                            </div>

                            {/* Arrow indicator */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight size={16} className="text-blue-500" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
