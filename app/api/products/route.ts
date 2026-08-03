import { NextRequest, NextResponse } from "next/server";
import { getProducts, searchProducts, getCollectionProducts, shopifyToProduct } from "@/lib/shopify";

// Map our internal category slugs to Shopify collection handles or query terms
const CATEGORY_TO_SHOPIFY_QUERY: Record<string, string> = {
    "ACCESSORIES": "accessories",
    "APPLE": "apple",
    "COMPUTING ACCESSORIES": "computing",
    "CONSUMER ELECTRONICS": "electronics",
    "ENTERPRISE": "enterprise",
    "FACTORY RECERTIFIED": "refurbished",
    "HP BRAND": "hp",
    "MOBILE & TABLET": "mobile tablet",
    "OPEN BOX": "open box",
    "OTHER BRAND": "",
    "POWER": "power generator inverter",
    "PRINT & SUPPLIES": "printer ink toner",
};

// Tech setup presets - map slug to relevant search terms
const TECH_SETUP_KEYWORDS: Record<string, string> = {
    "creator-studio": "camera microphone ring light tripod webcam studio streaming podcast monitor",
    "gamer-squad": "gaming console controller headset keyboard mouse monitor playstation xbox",
};

// Sub-category keyword mappings for search
const SUB_CATEGORY_KEYWORDS: Record<string, string> = {
    "Computer Accessories": "mouse keyboard usb hub webcam cable adapter",
    "Printer Accessories": "ink toner cartridge paper drum",
    "Mobile Accessories": "case screen protector earphone earbuds power bank",
    "Kitchen": "blender grinder juicer kettle microwave toaster oven cooker",
    "Home Appliances": "television tv iron washing machine air conditioner fan",
    "Audio & Video": "headphone speaker soundbar projector earphone bluetooth",
    "Power": "generator surge protector stabilizer ups inverter battery",
    "Cameras": "camera digital camera dslr mirrorless action cam",
    "Arcade": "console playstation xbox nintendo hoverboard gaming vr",
    "Desktops": "desktop workstation tower optiplex all-in-one pc",
    "Laptops": "laptop notebook elitebook probook thinkpad pavilion macbook chromebook",
    "Printers": "printer laserjet inkjet deskjet officejet",
    "Mobile Phones": "phone iphone galaxy redmi tecno infinix samsung",
    "Tablets": "ipad tablet tab surface",
    "Generators": "generator firman sumec elepaq",
    "CCTV": "cctv camera dvr nvr hikvision surveillance",
    "Access Control": "access control biometric fingerprint",
    "Smart Home": "smart home smart plug smart bulb smart lock alexa",
    "Door Locks": "door lock smart lock digital lock",
    "iPhones": "iphone",
    "iPads": "ipad",
    "MacBooks": "macbook",
    "Ink & Toner": "ink toner cartridge refill",
};

// Map our sort fields to Shopify sort keys
function mapSortKey(sortBy: string): string {
    switch (sortBy) {
        case "selling_price": return "PRICE";
        case "product_name": return "TITLE";
        case "created_at": return "CREATED_AT";
        default: return "CREATED_AT";
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const sub = searchParams.get("sub") || undefined;
    const techSetup = searchParams.get("techSetup") || undefined;
    const limit = parseInt(searchParams.get("limit") || "24");
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    try {
        // Build the Shopify query string
        let queryParts: string[] = [];

        // Category filter
        if (category && CATEGORY_TO_SHOPIFY_QUERY[category]) {
            const catQuery = CATEGORY_TO_SHOPIFY_QUERY[category];
            if (catQuery) queryParts.push(catQuery);
        }

        // Search term
        if (search) {
            queryParts.push(search);
        }

        // Brand filter
        if (brand) {
            queryParts.push(brand);
        }

        // Tech setup preset
        if (techSetup && TECH_SETUP_KEYWORDS[techSetup]) {
            queryParts.push(TECH_SETUP_KEYWORDS[techSetup]);
        }

        // Sub-category filter
        if (sub && SUB_CATEGORY_KEYWORDS[sub]) {
            queryParts.push(SUB_CATEGORY_KEYWORDS[sub]);
        }

        const shopifyQuery = queryParts.join(" ") || undefined;
        const sortKey = mapSortKey(sortBy);
        const reverse = sortOrder === "desc";

        // Fetch from Shopify — we request more than needed to handle offset pagination
        // Shopify uses cursor-based pagination, so we fetch offset + limit and slice
        const fetchCount = Math.min(offset + limit, 250); // Shopify max is 250

        const { products: shopifyProducts, pageInfo } = await getProducts({
            first: fetchCount,
            sortKey,
            reverse,
            query: shopifyQuery,
        });

        // Convert to our internal Product type
        const allProducts = shopifyProducts.map(shopifyToProduct);

        // Apply offset pagination (simulate offset for our frontend)
        const paginatedProducts = allProducts.slice(offset, offset + limit);

        // Estimate total count (Shopify doesn't give exact count easily)
        const estimatedCount = pageInfo.hasNextPage ? fetchCount + 50 : allProducts.length;

        return NextResponse.json({
            products: paginatedProducts,
            count: estimatedCount,
        });
    } catch (err: any) {
        console.error("[API /products] Shopify Error:", err.message);
        return NextResponse.json({ products: [], count: 0, error: err.message }, { status: 500 });
    }
}
