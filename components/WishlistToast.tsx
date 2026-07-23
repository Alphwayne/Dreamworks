"use client";

import { useState, useEffect } from "react";
import { Heart, X } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";

export function WishlistToast() {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [isAdded, setIsAdded] = useState(true);
    const lastAction = useWishlistStore((s) => s.lastAction);

    useEffect(() => {
        if (!lastAction) return;

        setMessage(lastAction.name);
        setIsAdded(lastAction.type === "added");
        setShow(true);

        const timer = setTimeout(() => setShow(false), 2500);
        return () => clearTimeout(timer);
    }, [lastAction]);

    if (!show) return null;

    return (
        <div className="fixed top-20 right-4 z-[100] animate-slideDown">
            <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-black/10 px-4 py-3 max-w-[300px]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAdded ? "bg-red-50" : "bg-gray-100"}`}>
                    <Heart size={14} className={isAdded ? "text-red-500 fill-red-500" : "text-gray-400"} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{message}</p>
                    <p className="text-[10px] text-gray-500">
                        {isAdded ? "Added to your wishlist" : "Removed from wishlist"}
                    </p>
                </div>
                <button
                    onClick={() => setShow(false)}
                    className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
                >
                    <X size={10} className="text-gray-500" />
                </button>
            </div>
        </div>
    );
}
