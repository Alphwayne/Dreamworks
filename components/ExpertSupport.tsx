"use client";

import { MessageCircle, Phone, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";

const SUPPORT_OPTIONS = [
    {
        icon: MessageCircle,
        title: "Live Chat Support",
        description: "Chat with our product experts for quick answers and recommendations.",
        cta: "Start Chat",
        href: "#",
        accent: "group-hover:bg-blue-600",
        iconBg: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    },
    {
        icon: Phone,
        title: "Call an Expert",
        description: "Speak with our specialists for personalized product guidance.",
        cta: "+234 912 758 5071",
        href: "tel:+2349127585071",
        accent: "group-hover:bg-blue-700",
        iconBg: "bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white",
    },
    {
        icon: MapPin,
        title: "Visit Our Store",
        description: "Experience products in person at our Ikeja showroom.",
        cta: "Get Directions",
        href: "/contact",
        accent: "group-hover:bg-blue-800",
        iconBg: "bg-blue-50 text-blue-800 group-hover:bg-blue-800 group-hover:text-white",
    },
];

export function ExpertSupport() {
    return (
        <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Help & Advice</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">Expert Support</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SUPPORT_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    return (
                        <Link
                            key={option.title}
                            href={option.href}
                            className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className={`w-12 h-12 rounded-xl ${option.iconBg} flex items-center justify-center mb-4 transition-all duration-300`}>
                                <Icon size={22} />
                            </div>

                            <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-blue-600 transition-colors">
                                {option.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                {option.description}
                            </p>

                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                                {option.cta} <ChevronRight size={14} />
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
