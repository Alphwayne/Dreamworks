import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/lib/types";

interface CompareStore {
    items: Product[];
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    toggleItem: (product: Product) => void;
    isInCompare: (productId: number) => boolean;
    clearCompare: () => void;
}

const MAX_COMPARE_ITEMS = 4;

export const useCompareStore = create<CompareStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product: Product) => {
                set((state) => {
                    if (state.items.find((i) => i.id === product.id)) return state;
                    if (state.items.length >= MAX_COMPARE_ITEMS) {
                        // Remove oldest, add new
                        return { items: [...state.items.slice(1), product] };
                    }
                    return { items: [...state.items, product] };
                });
            },

            removeItem: (productId: number) => {
                set((state) => ({
                    items: state.items.filter((i) => i.id !== productId),
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

            isInCompare: (productId: number) => {
                return get().items.some((i) => i.id === productId);
            },

            clearCompare: () => set({ items: [] }),
        }),
        {
            name: "dreamworks-compare",
        }
    )
);
