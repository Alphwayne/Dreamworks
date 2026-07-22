import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/types";

interface RecentlyViewedStore {
    items: Product[];
    addItem: (product: Product) => void;
    clearItems: () => void;
}

const MAX_RECENTLY_VIEWED = 12;

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
    persist(
        (set) => ({
            items: [],

            addItem: (product: Product) => {
                set((state) => {
                    // Remove if already exists (to move to front)
                    const filtered = state.items.filter((i) => i.id !== product.id);
                    // Add to front, keep max items
                    return { items: [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED) };
                });
            },

            clearItems: () => set({ items: [] }),
        }),
        {
            name: "dreamworks-recently-viewed",
        }
    )
);
