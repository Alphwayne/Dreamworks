import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem } from "@/lib/types";
import { createCart, addToCart, shopifyFetch } from "@/lib/shopify";

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    isLoading: boolean;
    // Actions
    addItem: (product: Product, quantity?: number, variantId?: string) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    /**
     * Creates a FRESH Shopify cart with exactly the items currently in the local cart,
     * then returns the checkout URL. This ensures the Shopify checkout always matches
     * what the user sees in their cart drawer — no stale items from previous sessions.
     */
    buildCheckoutUrl: () => Promise<string | null>;
}

/**
 * Look up a product's first available variant ID from Shopify by handle (slug)
 */
async function getVariantIdByHandle(handle: string): Promise<string | null> {
    try {
        const data = await shopifyFetch(`
            query GetVariant($handle: String!) {
                productByHandle(handle: $handle) {
                    variants(first: 1) {
                        edges {
                            node {
                                id
                                availableForSale
                            }
                        }
                    }
                }
            }
        `, { handle });
        return data?.productByHandle?.variants?.edges?.[0]?.node?.id || null;
    } catch {
        return null;
    }
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            isLoading: false,

            addItem: (product: Product, quantity = 1) => {
                set((state) => {
                    const existing = state.items.find((i) => i.product.id === product.id);
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.product.id === product.id
                                    ? { ...i, quantity: i.quantity + quantity }
                                    : i
                            ),
                            isOpen: true,
                        };
                    }
                    return {
                        items: [...state.items, { product, quantity }],
                        isOpen: true,
                    };
                });
            },

            removeItem: (productId: number) => {
                set((state) => ({
                    items: state.items.filter((i) => i.product.id !== productId),
                }));
            },

            updateQuantity: (productId: number, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set((state) => ({
                    items: state.items.map((i) =>
                        i.product.id === productId ? { ...i, quantity } : i
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),

            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            getTotalItems: () => {
                return get().items.reduce((sum, i) => sum + i.quantity, 0);
            },

            getTotalPrice: () => {
                return get().items.reduce(
                    (sum, i) => sum + i.product.selling_price * i.quantity,
                    0
                );
            },

            /**
             * FRESH CART APPROACH:
             * Every time the user clicks "Checkout", we create a brand new Shopify cart
             * and add ONLY the items currently in the local cart.
             * This guarantees the Shopify checkout matches the cart drawer exactly.
             */
            buildCheckoutUrl: async () => {
                const state = get();
                if (state.items.length === 0) return null;

                set({ isLoading: true });

                try {
                    // Step 1: Create a fresh Shopify cart
                    const cart = await createCart();
                    if (!cart) {
                        set({ isLoading: false });
                        return null;
                    }

                    // Step 2: Resolve variant IDs for all items and add them one by one
                    let currentCart = cart;
                    for (const item of state.items) {
                        // Get the variant ID by looking up the product handle
                        const handle = item.product.slug || item.product.item_code;
                        const variantId = handle ? await getVariantIdByHandle(handle) : null;

                        if (variantId) {
                            const updatedCart = await addToCart(currentCart.id, variantId, item.quantity);
                            if (updatedCart) {
                                currentCart = updatedCart;
                            }
                        } else {
                            console.warn("[Cart] Could not find variant for:", item.product.product_name);
                        }
                    }

                    set({ isLoading: false });
                    return currentCart.checkoutUrl;
                } catch (err) {
                    console.error("[Cart] Failed to build checkout:", err);
                    set({ isLoading: false });
                    return null;
                }
            },
        }),
        {
            name: "dreamworks-cart",
            partialize: (state) => ({
                items: state.items,
            }),
        }
    )
);
