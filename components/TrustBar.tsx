"use client";

import { Shield, Truck, Award, RotateCcw } from "lucide-react";

const TRUST_ITEMS = [
    { icon: Shield, label: "100% Authentic", sub: "Every product verified" },
    { icon: Award, label: "Official Warranty", sub: "Manufacturer backed" },
    { icon: Truck, label: "Free & Fast Delivery", sub: "Lagos & nationwide" },
    { icon: RotateCcw, label: "Easy Returns", sub: "Hassle-free process" },
];

export function TrustBar() {
    return (
        <section className="py-6 px-4 max-w-7xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {TRUST_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.label} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <Icon size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900 leading-tight">{item.label}</p>
                                    <p className="text-[11px] text-gray-500 leading-tight mt-0.5">{item.sub}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
