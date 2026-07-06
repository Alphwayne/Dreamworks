"use client";

import { RefreshCw, ShieldCheck, Banknote, ChevronRight } from "lucide-react";
import Link from "next/link";

const SERVICES = [
    {
        icon: RefreshCw,
        title: "Trade-In Program",
        description: "Trade in your old device and get credit towards something new. We accept laptops, phones, and tablets.",
        cta: "Learn More",
        href: "/contact",
        gradient: "from-blue-600 to-blue-800",
    },
    {
        icon: ShieldCheck,
        title: "Extended Warranty",
        description: "Protect your investment with our comprehensive extended warranty plans covering accidental damage.",
        cta: "View Plans",
        href: "/policies/terms",
        gradient: "from-indigo-600 to-indigo-800",
    },
    {
        icon: Banknote,
        title: "Pay Small Small",
        description: "Own premium tech affordably with flexible instalment plans. No hidden charges, no surprises.",
        cta: "Get Started",
        href: "/collections/all",
        gradient: "from-blue-700 to-blue-900",
    },
];

export function ServicesShowcase() {
    return (
        <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Value-Added</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">Our Services</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SERVICES.map((service) => {
                    const Icon = service.icon;
                    return (
                        <Link
                            key={service.title}
                            href={service.href}
                            className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                        >
                            {/* Top accent bar */}
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                <Icon size={22} className="text-white" />
                            </div>

                            <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-blue-600 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                {service.description}
                            </p>

                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                                {service.cta} <ChevronRight size={14} />
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
