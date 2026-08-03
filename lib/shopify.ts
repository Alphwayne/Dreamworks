/**
 * Shopify Storefront API Client
 * Connects to DreamWorks Direct Shopify backend via the Storefront API
 */

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "shop.dreamworksdirect.com";
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || "df9eced78d941c2c24901a14e7447ae4";
const STOREFRONT_API_VERSION = "2024-10";

const STOREFRONT_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`;

// ─── GraphQL Fetch Helper ────────────────────────────────────────────────────

export async function shopifyFetch<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
    const res = await fetch(STOREFRONT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
        next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
        const text = await res.text();
        console.error("[Shopify] API Error:", res.status, text);
        throw new Error(`Shopify API error: ${res.status}`);
    }

    const json = await res.json();

    if (json.errors) {
        console.error("[Shopify] GraphQL Errors:", json.errors);
        throw new Error(json.errors[0]?.message || "Shopify GraphQL error");
    }

    return json.data;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ShopifyProduct {
    id: string;
    title: string;
    handle: string;
    description: string;
    descriptionHtml: string;
    productType: string;
    vendor: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    images: {
        edges: Array<{
            node: {
                url: string;
                altText: string | null;
                width: number;
                height: number;
            };
        }>;
    };
    variants: {
        edges: Array<{
            node: {
                id: string;
                title: string;
                availableForSale: boolean;
                price: {
                    amount: string;
                    currencyCode: string;
                };
                compareAtPrice: {
                    amount: string;
                    currencyCode: string;
                } | null;
                sku: string | null;
                quantityAvailable: number | null;
            };
        }>;
    };
    priceRange: {
        minVariantPrice: {
            amount: string;
            currencyCode: string;
        };
        maxVariantPrice: {
            amount: string;
            currencyCode: string;
        };
    };
    compareAtPriceRange: {
        maxVariantPrice: {
            amount: string;
            currencyCode: string;
        };
    };
    availableForSale: boolean;
    totalInventory: number | null;
}

export interface ShopifyCollection {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: {
        url: string;
        altText: string | null;
    } | null;
}

export interface ShopifyCart {
    id: string;
    checkoutUrl: string;
    totalQuantity: number;
    cost: {
        subtotalAmount: {
            amount: string;
            currencyCode: string;
        };
        totalAmount: {
            amount: string;
            currencyCode: string;
        };
    };
    lines: {
        edges: Array<{
            node: {
                id: string;
                quantity: number;
                merchandise: {
                    id: string;
                    title: string;
                    product: {
                        id: string;
                        title: string;
                        handle: string;
                        images: {
                            edges: Array<{
                                node: {
                                    url: string;
                                };
                            }>;
                        };
                    };
                    price: {
                        amount: string;
                        currencyCode: string;
                    };
                };
            };
        }>;
    };
}

// ─── Product Fragment ─────────────────────────────────────────────────────────

const PRODUCT_FRAGMENT = `
    fragment ProductFields on Product {
        id
        title
        handle
        description
        descriptionHtml
        productType
        vendor
        tags
        createdAt
        updatedAt
        availableForSale
        totalInventory
        images(first: 5) {
            edges {
                node {
                    url
                    altText
                    width
                    height
                }
            }
        }
        variants(first: 10) {
            edges {
                node {
                    id
                    title
                    availableForSale
                    price {
                        amount
                        currencyCode
                    }
                    compareAtPrice {
                        amount
                        currencyCode
                    }
                    sku
                    quantityAvailable
                }
            }
        }
        priceRange {
            minVariantPrice {
                amount
                currencyCode
            }
            maxVariantPrice {
                amount
                currencyCode
            }
        }
        compareAtPriceRange {
            maxVariantPrice {
                amount
                currencyCode
            }
        }
    }
`;

// ─── Queries ─────────────────────────────────────────────────────────────────

// Get all products (paginated)
export async function getProducts(options?: {
    first?: number;
    after?: string;
    sortKey?: string;
    reverse?: boolean;
    query?: string;
}): Promise<{ products: ShopifyProduct[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }> {
    const { first = 24, after, sortKey = "CREATED_AT", reverse = true, query } = options || {};

    const data = await shopifyFetch(`
        ${PRODUCT_FRAGMENT}
        query GetProducts($first: Int!, $after: String, $sortKey: ProductSortKeys!, $reverse: Boolean!, $query: String) {
            products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, query: $query) {
                edges {
                    node {
                        ...ProductFields
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    `, { first, after, sortKey, reverse, query });

    return {
        products: data.products.edges.map((edge: any) => edge.node),
        pageInfo: data.products.pageInfo,
    };
}

// Get a single product by handle (slug)
export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    const data = await shopifyFetch(`
        ${PRODUCT_FRAGMENT}
        query GetProductByHandle($handle: String!) {
            productByHandle(handle: $handle) {
                ...ProductFields
            }
        }
    `, { handle });

    return data.productByHandle || null;
}

// Get products in a collection
export async function getCollectionProducts(handle: string, options?: {
    first?: number;
    after?: string;
    sortKey?: string;
    reverse?: boolean;
}): Promise<{ products: ShopifyProduct[]; collection: ShopifyCollection | null; pageInfo: { hasNextPage: boolean; endCursor: string | null } }> {
    const { first = 24, after, sortKey = "CREATED", reverse = true } = options || {};

    const data = await shopifyFetch(`
        ${PRODUCT_FRAGMENT}
        query GetCollectionProducts($handle: String!, $first: Int!, $after: String, $sortKey: ProductCollectionSortKeys!, $reverse: Boolean!) {
            collection(handle: $handle) {
                id
                title
                handle
                description
                image {
                    url
                    altText
                }
                products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
                    edges {
                        node {
                            ...ProductFields
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
        }
    `, { handle, first, after, sortKey, reverse });

    if (!data.collection) {
        return { products: [], collection: null, pageInfo: { hasNextPage: false, endCursor: null } };
    }

    return {
        products: data.collection.products.edges.map((edge: any) => edge.node),
        collection: data.collection,
        pageInfo: data.collection.products.pageInfo,
    };
}

// Search products
export async function searchProducts(searchQuery: string, first = 12): Promise<ShopifyProduct[]> {
    const data = await shopifyFetch(`
        ${PRODUCT_FRAGMENT}
        query SearchProducts($query: String!, $first: Int!) {
            products(first: $first, query: $query) {
                edges {
                    node {
                        ...ProductFields
                    }
                }
            }
        }
    `, { query: searchQuery, first });

    return data.products.edges.map((edge: any) => edge.node);
}

// Get all collections
export async function getCollections(): Promise<ShopifyCollection[]> {
    const data = await shopifyFetch(`
        query GetCollections {
            collections(first: 50) {
                edges {
                    node {
                        id
                        title
                        handle
                        description
                        image {
                            url
                            altText
                        }
                    }
                }
            }
        }
    `);

    return data.collections.edges.map((edge: any) => edge.node);
}

// ─── Cart Operations ─────────────────────────────────────────────────────────

const CART_FRAGMENT = `
    fragment CartFields on Cart {
        id
        checkoutUrl
        totalQuantity
        cost {
            subtotalAmount {
                amount
                currencyCode
            }
            totalAmount {
                amount
                currencyCode
            }
        }
        lines(first: 50) {
            edges {
                node {
                    id
                    quantity
                    merchandise {
                        ... on ProductVariant {
                            id
                            title
                            product {
                                id
                                title
                                handle
                                images(first: 1) {
                                    edges {
                                        node {
                                            url
                                        }
                                    }
                                }
                            }
                            price {
                                amount
                                currencyCode
                            }
                        }
                    }
                }
            }
        }
    }
`;

// Create a new cart
export async function createCart(): Promise<ShopifyCart> {
    const data = await shopifyFetch(`
        ${CART_FRAGMENT}
        mutation CreateCart {
            cartCreate {
                cart {
                    ...CartFields
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `);

    return data.cartCreate.cart;
}

// Add items to cart
export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<ShopifyCart> {
    const data = await shopifyFetch(`
        ${CART_FRAGMENT}
        mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
                cart {
                    ...CartFields
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `, {
        cartId,
        lines: [{ merchandiseId: variantId, quantity }],
    });

    return data.cartLinesAdd.cart;
}

// Update cart line quantity
export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
    const data = await shopifyFetch(`
        ${CART_FRAGMENT}
        mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
            cartLinesUpdate(cartId: $cartId, lines: $lines) {
                cart {
                    ...CartFields
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `, {
        cartId,
        lines: [{ id: lineId, quantity }],
    });

    return data.cartLinesUpdate.cart;
}

// Remove cart line
export async function removeFromCart(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
    const data = await shopifyFetch(`
        ${CART_FRAGMENT}
        mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
            cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
                cart {
                    ...CartFields
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `, { cartId, lineIds });

    return data.cartLinesRemove.cart;
}

// ─── Helper: Convert Shopify Product to our Product type ─────────────────────

import { Product } from "@/lib/types";

/**
 * Converts a Shopify product to our internal Product type
 * so existing components (ProductCard, etc.) work without changes
 */
export function shopifyToProduct(shopifyProduct: ShopifyProduct): Product {
    const firstVariant = shopifyProduct.variants.edges[0]?.node;
    const price = parseFloat(shopifyProduct.priceRange.minVariantPrice.amount);
    const comparePrice = shopifyProduct.compareAtPriceRange.maxVariantPrice.amount
        ? parseFloat(shopifyProduct.compareAtPriceRange.maxVariantPrice.amount)
        : null;
    const imageUrl = shopifyProduct.images.edges[0]?.node.url || null;

    return {
        id: parseInt(shopifyProduct.id.replace(/\D/g, "").slice(-8)) || Math.random() * 100000,
        item_code: firstVariant?.sku || shopifyProduct.handle,
        product_name: shopifyProduct.title,
        category: mapShopifyTypeToCategory(shopifyProduct.productType, shopifyProduct.vendor),
        selling_price: price,
        compare_price: comparePrice && comparePrice > price ? comparePrice : null,
        slug: shopifyProduct.handle,
        image_url: imageUrl,
        description: shopifyProduct.description || null,
        is_active: shopifyProduct.availableForSale,
        created_at: shopifyProduct.createdAt,
    };
}

/**
 * Maps Shopify product type / vendor to our internal category system
 */
function mapShopifyTypeToCategory(productType: string, vendor: string): string {
    const type = productType.toLowerCase();
    const v = vendor.toLowerCase();

    // Brand-based mapping
    if (v === "apple" || v.includes("apple")) return "APPLE";
    if (v === "hp" || v.includes("hewlett")) return "HP BRAND";

    // Type-based mapping
    if (type.includes("laptop") || type.includes("computer") || type.includes("desktop") || type.includes("printer"))
        return "COMPUTING ACCESSORIES";
    if (type.includes("phone") || type.includes("mobile") || type.includes("tablet"))
        return "MOBILE & TABLET";
    if (type.includes("tv") || type.includes("television") || type.includes("audio") || type.includes("electronic"))
        return "CONSUMER ELECTRONICS";
    if (type.includes("security") || type.includes("cctv") || type.includes("enterprise"))
        return "ENTERPRISE";
    if (type.includes("power") || type.includes("generator") || type.includes("ups"))
        return "POWER";
    if (type.includes("accessory") || type.includes("accessories"))
        return "ACCESSORIES";
    if (type.includes("print") || type.includes("ink") || type.includes("toner"))
        return "PRINT & SUPPLIES";

    // Default
    return "OTHER BRAND";
}
