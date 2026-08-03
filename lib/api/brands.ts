import { getProducts, shopifyToProduct } from "@/lib/shopify";
import { Product } from "@/lib/types";

// Get products by brand name using Shopify tag-based filtering
export async function getProductsByBrand(brandName: string, limit = 24, offset = 0) {
    const normalized = brandName.toUpperCase().trim();
    // Search by tag (brand tags like "HP.", "APPLE.", "DELL.") and also by title
    const query = `tag:"${normalized}." OR tag:"${normalized}" OR title:${brandName}`;

    const { products: shopifyProducts } = await getProducts({
        first: Math.min(offset + limit, 250),
        query,
        sortKey: "CREATED_AT",
        reverse: true,
    });

    const allProducts = shopifyProducts.map(shopifyToProduct);
    const paginatedProducts = allProducts.slice(offset, offset + limit);

    return { products: paginatedProducts, count: allProducts.length };
}