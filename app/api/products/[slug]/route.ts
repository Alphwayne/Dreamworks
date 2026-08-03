import { NextRequest, NextResponse } from "next/server";
import { getProductByHandle, getProducts, shopifyToProduct } from "@/lib/shopify";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        // Get the product from Shopify by handle (slug)
        const shopifyProduct = await getProductByHandle(slug);

        if (!shopifyProduct) {
            return NextResponse.json({ product: null, inventory: null, related: [] }, { status: 404 });
        }

        // Convert to our internal Product type
        const product = shopifyToProduct(shopifyProduct);

        // Build inventory info from Shopify variant data
        const firstVariant = shopifyProduct.variants.edges[0]?.node;
        const inventory = {
            sku: firstVariant?.sku || product.item_code,
            quantity_available: shopifyProduct.totalInventory ?? firstVariant?.quantityAvailable ?? null,
            in_stock: shopifyProduct.availableForSale,
            variant_id: firstVariant?.id || null,
        };

        // Get related products (same product type)
        let related: any[] = [];
        try {
            const productType = shopifyProduct.productType;
            if (productType) {
                const { products: relatedShopify } = await getProducts({
                    first: 5,
                    query: `product_type:${productType}`,
                });
                related = relatedShopify
                    .filter(p => p.handle !== slug)
                    .slice(0, 4)
                    .map(shopifyToProduct);
            }
        } catch (relErr) {
            // Related products are non-critical, continue without them
            console.warn("[API /products/slug] Related products fetch failed:", relErr);
        }

        return NextResponse.json({
            product,
            inventory,
            related,
            // Include extra Shopify-specific data for enhanced product page
            shopifyData: {
                descriptionHtml: shopifyProduct.descriptionHtml,
                images: shopifyProduct.images.edges.map(e => ({
                    url: e.node.url,
                    alt: e.node.altText,
                    width: e.node.width,
                    height: e.node.height,
                })),
                variants: shopifyProduct.variants.edges.map(e => ({
                    id: e.node.id,
                    title: e.node.title,
                    available: e.node.availableForSale,
                    price: parseFloat(e.node.price.amount),
                    compareAtPrice: e.node.compareAtPrice ? parseFloat(e.node.compareAtPrice.amount) : null,
                    sku: e.node.sku,
                })),
                tags: shopifyProduct.tags,
                vendor: shopifyProduct.vendor,
            },
        });
    } catch (err: any) {
        console.error("[API /products/slug] Shopify Error:", err.message);
        return NextResponse.json({ product: null, inventory: null, related: [], error: err.message }, { status: 500 });
    }
}
