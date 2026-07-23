import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/types";

interface WishlistAction {
    type: "added" | "removed";
    name: string;
    timestamp: number;
}

interface WishlistStore {
    items: Product[];
    lastAction: WishlistAction | null;
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    toggleItem: (product: Product) => void;
    isInWishlist: (productId: number) => boolean;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            lastAction: null,

            addItem: (product: Product) => {
                set((state) => {
                    if (state.items.find((i) => i.id === product.id)) return state;
                    return {
                        items: [...state.items, product],
                        lastAction: { type: "added", name: product.product_name, timestamp: Date.now() },
                    };
                });
            },

            removeItem: (productId: number) => {
                const item = get().items.find((i) => i.id === productId);
                set((state) => ({
                    items: state.items.filter((i) => i.id !== productId),
                    lastAction: { type: "removed", name: item?.product_name || "Item", timestamp: Date.now() },
                }));
            },

            toggleItem: (product: Product) => {
                const exists = get().items.find((i) => i.id === product.id);
                if (exists) {
                    get().removeItem(product.id);
                } else {
                    get().addItem(product);
                }
            },

            isInWishlist: (productId: number) => {
                return get().items.some((i) => i.id === productId);
            },

            clearWishlist: () => set({ items: [], lastAction: null }),
        }),
        {
            name: "dreamworks-wishlist",
            partialize: (state) => ({ items: state.items }),
        }
    )
);
