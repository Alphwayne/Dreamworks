"use client";

import { ArrowLeftRight, Smartphone } from "lucide-react";

interface ShakeToastProps {
    visible: boolean;
    isComparing: boolean;
}

export function ShakeToast({ visible, isComparing }: ShakeToastProps) {
    if (!visible) return null;

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slideDown sm:hidden">
            <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-xl border ${
                isComparing
                    ? "bg-indigo-600/95 border-indigo-400/50 text-white"
                    : "bg-red-500/95 border-red-400/50 text-white"
            }`}>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowLeftRight size={14} />
                </div>
                <div>
                    <p className="text-xs font-bold">
                        {isComparing ? "Added to Compare!" : "Removed from Compare"}
                    </p>
                    <p className="text-[10px] text-white/70">
                        <Smartphone size={8} className="inline mr-1" />
                        Shake to toggle compare
                    </p>
                </div>
            </div>
        </div>
    );
}
