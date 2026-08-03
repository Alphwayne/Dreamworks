import { Product } from "@/lib/types";
import {
    getProducts as shopifyGetProducts,
    getProductByHandle,
    searchProducts as shopifySearch,
    getCollectionProducts,
    shopifyToProduct,
} from "@/lib/shopify";

// Map our sort fields to Shopify sort keys
function mapSortKey(sortBy: string): string {
    switch (sortBy) {
        case "selling_price": return "PRICE";
        case "product_name": return "TITLE";
        case "created_at": return "CREATED_AT";
        default: return "CREATED_AT";
    }
}

// Get all products with optional filters
export async function getProducts({
    category,
    search,
    limit = 24,
    offset = 0,
    sortBy = "created_at",
    sortOrder = "desc",
}: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
} = {}) {
    try {
        // Build Shopify query
        let queryParts: string[] = [];
        if (category) queryParts.push(`product_type:${category}`);
        if (search) queryParts.push(search);

        const shopifyQuery = queryParts.length > 0 ? queryParts.join(" ") : undefined;
        const sortKey = mapSortKey(sortBy);
        const reverse = sortOrder === "desc";

        // Fetch more than needed to handle offset
        const fetchCount = Math.min(offset + limit, 250);

        const { products: shopifyProducts, pageInfo } = await shopifyGetProducts({
            first: fetchCount,
            sortKey,
            reverse,
            query: shopifyQuery,
        });

        const allProducts = shopifyProducts.map(shopifyToProduct);
        const paginatedProducts = allProducts.slice(offset, offset + limit);
        const estimatedCount = pageInfo.hasNextPage ? fetchCount + 50 : allProducts.length;

        return { products: paginatedProducts, count: estimatedCount };
    } catch (error: any) {
        console.error("[getProducts] Shopify error:", error.message);
        return { products: [], count: 0 };
    }
}

// Get single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const shopifyProduct = await getProductByHandle(slug);
        if (!shopifyProduct) return null;
        return shopifyToProduct(shopifyProduct);
    } catch {
        return null;
    }
}

// Get single product by id (fallback — search by title/handle)
export async function getProductById(id: number): Promise<Product | null> {
    // Shopify doesn't support lookup by our internal numeric ID
    // This is a legacy function — should use slug-based lookup instead
    return null;
}

// Get related products — same product type, exclude current
export async function getRelatedProducts(category: string, excludeId: number, limit = 4): Promise<Product[]> {
    try {
        const { products } = await shopifyGetProducts({
            first: limit + 1,
            query: `product_type:${category}`,
        });
        return products
            .map(shopifyToProduct)
            .filter(p => p.id !== excludeId)
            .slice(0, limit);
    } catch {
        return [];
    }
}

// Get featured products for homepage sections
export async function getFeaturedProducts(category: string, limit = 4): Promise<Product[]> {
    try {
        const { products } = await shopifyGetProducts({
            first: limit,
            sortKey: "BEST_SELLING",
            reverse: true,
            query: `product_type:${category}`,
        });
        return products.map(shopifyToProduct);
    } catch {
        return [];
    }
}

// Get all distinct categories (from Shopify collections)
export async function getCategories() {
    try {
        const { getCollections } = await import("@/lib/shopify");
        const collections = await getCollections();
        return collections.map(c => ({
            category: c.title,
            count: 0, // Shopify doesn't return count in collection list
        }));
    } catch {
        return [];
    }
}

// Get inventory for a product by item_code (sku)
export async function getInventory(sku: string) {
    // Inventory is now part of the product response from Shopify
    // This function is kept for backward compatibility
    return null;
}

// Search products
export async function searchProducts(query: string, limit = 10): Promise<Product[]> {
    if (!query.trim()) return [];
    try {
        const products = await shopifySearch(query, limit);
        return products.map(shopifyToProduct);
    } catch {
        return [];
    }
}

// Get products by multiple categories (for homepage)
export async function getProductsByCategories(categories: string[], limitEach = 8): Promise<Record<string, Product[]>> {
    const results: Record<string, Product[]> = {};

    await Promise.all(
        categories.map(async (cat) => {
            try {
                const { products } = await shopifyGetProducts({
                    first: limitEach,
                    query: `product_type:${cat}`,
                });
                results[cat] = products.map(shopifyToProduct);
            } catch {
                results[cat] = [];
            }
        })
    );

    return results;
}
