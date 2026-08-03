import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem } from "@/lib/types";
import { createCart, addToCart, updateCartLine, removeFromCart } from "@/lib/shopify";

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    // Shopify Cart state
    shopifyCartId: string | null;
    checkoutUrl: string | null;
    shopifyLineIds: Record<number, string>; // productId -> Shopify line item ID
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
    getCheckoutUrl: () => string | null;
    syncWithShopify: (product: Product, quantity: number, variantId?: string) => Promise<void>;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            shopifyCartId: null,
            checkoutUrl: null,
            shopifyLineIds: {},
            isLoading: false,

            addItem: (product: Product, quantity = 1, variantId?: string) => {
                // Update local state immediately for responsive UI
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

                // Sync with Shopify in the background (non-blocking)
                get().syncWithShopify(product, quantity, variantId);
            },

            removeItem: (productId: number) => {
                const state = get();
                const lineId = state.shopifyLineIds[productId];

                // Update local state immediately
                set((state) => ({
                    items: state.items.filter((i) => i.product.id !== productId),
                    shopifyLineIds: Object.fromEntries(
                        Object.entries(state.shopifyLineIds).filter(([key]) => Number(key) !== productId)
                    ),
                }));

                // Sync with Shopify in background
                if (lineId && state.shopifyCartId) {
                    removeFromCart(state.shopifyCartId, [lineId]).then((cart) => {
                        if (cart) {
                            set({ checkoutUrl: cart.checkoutUrl });
                        }
                    }).catch(console.error);
                }
            },

            updateQuantity: (productId: number, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }

                const state = get();
                const lineId = state.shopifyLineIds[productId];

                // Update local state immediately
                set((state) => ({
                    items: state.items.map((i) =>
                        i.product.id === productId ? { ...i, quantity } : i
                    ),
                }));

                // Sync with Shopify in background
                if (lineId && state.shopifyCartId) {
                    updateCartLine(state.shopifyCartId, lineId, quantity).then((cart) => {
                        if (cart) {
                            set({ checkoutUrl: cart.checkoutUrl });
                        }
                    }).catch(console.error);
                }
            },

            clearCart: () => set({
                items: [],
                shopifyCartId: null,
                checkoutUrl: null,
                shopifyLineIds: {},
            }),

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

            getCheckoutUrl: () => {
                return get().checkoutUrl;
            },

            // Sync cart action with Shopify Cart API
            syncWithShopify: async (product: Product, quantity: number, variantId?: string) => {
                try {
                    set({ isLoading: true });
                    const state = get();

                    // We need a variant ID to add to Shopify cart
                    // If not provided, we'll try to get it from the product's item_code
                    // The variant ID format from Shopify is like "gid://shopify/ProductVariant/12345"
                    const merchandiseId = variantId || null;

                    if (!merchandiseId) {
                        // Can't sync without variant ID — cart still works locally
                        set({ isLoading: false });
                        return;
                    }

                    if (!state.shopifyCartId) {
                        // Create a new Shopify cart
                        const cart = await createCart();
                        if (cart) {
                            // Add the item to the new cart
                            const updatedCart = await addToCart(cart.id, merchandiseId, quantity);
                            if (updatedCart) {
                                const newLineId = updatedCart.lines.edges[0]?.node.id;
                                set({
                                    shopifyCartId: updatedCart.id,
                                    checkoutUrl: updatedCart.checkoutUrl,
                                    shopifyLineIds: newLineId
                                        ? { ...state.shopifyLineIds, [product.id]: newLineId }
                                        : state.shopifyLineIds,
                                });
                            } else {
                                set({
                                    shopifyCartId: cart.id,
                                    checkoutUrl: cart.checkoutUrl,
                                });
                            }
                        }
                    } else {
                        // Add to existing Shopify cart
                        const cart = await addToCart(state.shopifyCartId, merchandiseId, quantity);
                        if (cart) {
                            // Find the new line item
                            const lastLine = cart.lines.edges[cart.lines.edges.length - 1]?.node;
                            set({
                                checkoutUrl: cart.checkoutUrl,
                                shopifyLineIds: lastLine
                                    ? { ...get().shopifyLineIds, [product.id]: lastLine.id }
                                    : get().shopifyLineIds,
                            });
                        }
                    }
                } catch (err) {
                    console.error("[CartStore] Shopify sync error:", err);
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: "dreamworks-cart",
            partialize: (state) => ({
                items: state.items,
                shopifyCartId: state.shopifyCartId,
                checkoutUrl: state.checkoutUrl,
                shopifyLineIds: state.shopifyLineIds,
            }),
        }
    )
);
