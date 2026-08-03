import { NextRequest, NextResponse } from "next/server";
import { getProducts, shopifyToProduct } from "@/lib/shopify";

// ─── TAG-BASED CATEGORY MAPPING ─────────────────────────────────────────────
// Products in the Shopify store are categorized via TAGS (e.g. "LAPTOPS.", "HP.", "GAMING.")
// We use Shopify's tag: filter syntax for accurate results

const CATEGORY_TO_TAG_QUERY: Record<string, string> = {
    // Main nav categories
    "ACCESSORIES": 'tag:"ACCESSORIES." OR tag:"COMPUTING ACCESSORIES." OR tag:"COMPUTER ACCESSORIES."',
    "APPLE": 'tag:"APPLE."',
    "COMPUTING ACCESSORIES": 'tag:"LAPTOPS." OR tag:"DESKTOPS." OR tag:"COMPUTING ACCESSORIES." OR tag:"PRINTERS."',
    "CONSUMER ELECTRONICS": 'tag:"TELEVISIONS." OR tag:"WASHING MACHINES." OR tag:"AIR CONDITIONERS." OR tag:"FANS." OR tag:"KITCHEN." OR tag:"AUDIO & VIDEO." OR tag:"REFRIGERATORS."',
    "ENTERPRISE": 'tag:"SMART HOMES." OR tag:"SMART HOME."',
    "FACTORY RECERTIFIED": 'tag:"USED."',
    "HP BRAND": 'tag:"HP."',
    "MOBILE & TABLET": 'tag:"MOBILE PHONES." OR tag:"TABLETS." OR tag:"SMART WATCHES."',
    "OPEN BOX": 'tag:"USED."',
    "OTHER BRAND": "",
    "POWER": 'tag:"GENERATORS." OR tag:"UPS." OR tag:"INVERTERS." OR tag:"POWER." OR tag:"POWER ACCESSORIES."',
    "PRINT & SUPPLIES": 'tag:"PRINTERS." OR tag:"PRINT & SUPPLIES."',
};

// Tech setup presets - use tag-based queries
const TECH_SETUP_TAG_QUERY: Record<string, string> = {
    "creator-studio": 'tag:"CREATOR STUDIO." OR tag:"MICROPHONES." OR tag:"TRIPODS." OR tag:"CAMERAS."',
    "gamer-squad": 'tag:"GAMING." OR tag:"CONSOLES." OR tag:"GAMING ACCESSORIES." OR tag:"GAMING CONTROLLERS."',
};

// Sub-category tag mappings — these map the ?sub= parameter to Shopify tag queries
const SUB_CATEGORY_TAG_QUERY: Record<string, string> = {
    // Accessories sub-categories
    "Computer Accessories": 'tag:"COMPUTING ACCESSORIES." OR tag:"COMPUTER ACCESSORIES."',
    "Printer Accessories": 'tag:"PRINT & SUPPLIES."',
    "Mobile Accessories": 'tag:"MOBILE ACCESSORIES." OR tag:"PHONE CASES." OR tag:"CHARGERS."',

    // Computing & Printing sub-categories
    "Desktops": 'tag:"DESKTOPS." OR tag:"ALL-IN-ONES."',
    "Laptops": 'tag:"LAPTOPS."',
    "Printers": 'tag:"PRINTERS."',

    // Electronics sub-categories
    "Kitchen": 'tag:"KITCHEN." OR tag:"KETTLES." OR tag:"MICROWAVES." OR tag:"COOKERS." OR tag:"AIR FRYERS." OR tag:"REFRIGERATORS." OR tag:"DISPENSERS."',
    "Home Appliances": 'tag:"TELEVISIONS." OR tag:"WASHING MACHINES." OR tag:"AIR CONDITIONERS." OR tag:"FANS." OR tag:"DISPENSERS."',
    "Audio & Video": 'tag:"AUDIO & VIDEO." OR tag:"HEADPHONES." OR tag:"SPEAKERS." OR tag:"SOUNDBAR." OR tag:"SOUNDBARS." OR tag:"STREAMING."',
    "Power": 'tag:"GENERATORS." OR tag:"UPS." OR tag:"INVERTERS." OR tag:"POWER." OR tag:"POWER ACCESSORIES."',
    "Cameras": 'tag:"CAMERAS." OR tag:"CAMERA ACCESSORIES."',
    "Arcade": 'tag:"GAMING." OR tag:"CONSOLES." OR tag:"GAMING ACCESSORIES."',

    // Mobile & Tablet sub-categories
    "Mobile Phones": 'tag:"MOBILE PHONES."',
    "Tablets": 'tag:"TABLETS."',

    // Power sub-categories
    "Power & Accessories": 'tag:"UPS." OR tag:"INVERTERS." OR tag:"POWER ACCESSORIES." OR tag:"POWER."',
    "Power Brands": 'tag:"MERCURY." OR tag:"POWEROLOGY."',
    "Generators": 'tag:"GENERATORS."',

    // Enterprise sub-categories
    "CCTV": 'tag:"CCTV."',
    "Access Control": 'tag:"ACCESS CONTROL."',
    "Smart Home": 'tag:"SMART HOMES." OR tag:"SMART HOME."',
    "Door Locks": 'tag:"DOOR LOCKS."',

    // Apple sub-categories
    "iPhones": 'tag:"APPLE." AND tag:"MOBILE PHONES."',
    "iPads": 'tag:"APPLE TABLETS." OR (tag:"APPLE." AND tag:"TABLETS.")',
    "MacBooks": 'tag:"APPLE." AND tag:"LAPTOPS."',
    "Accessories": 'tag:"APPLE." AND tag:"ACCESSORIES."',

    // Print & Supplies sub-categories
    "Ink & Toner": 'tag:"PRINT & SUPPLIES."',
};

// Brand tag mapping — brand name to Shopify tag query
function buildBrandQuery(brand: string): string {
    // Normalize brand name to match tag format (UPPERCASE + period)
    const normalized = brand.toUpperCase().trim();
    // Try exact tag match first
    return `tag:"${normalized}." OR tag:"${normalized}"`;
}

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
        // Build the Shopify query string using tag-based filtering
        let queryParts: string[] = [];

        // Category filter (main nav categories)
        if (category && CATEGORY_TO_TAG_QUERY[category]) {
            const catQuery = CATEGORY_TO_TAG_QUERY[category];
            if (catQuery) queryParts.push(`(${catQuery})`);
        }

        // Sub-category filter (takes priority over category if both present)
        if (sub && SUB_CATEGORY_TAG_QUERY[sub]) {
            // If sub is provided, use it instead of the broader category query
            queryParts = [`(${SUB_CATEGORY_TAG_QUERY[sub]})`];
        }

        // Tech setup preset
        if (techSetup && TECH_SETUP_TAG_QUERY[techSetup]) {
            queryParts = [`(${TECH_SETUP_TAG_QUERY[techSetup]})`];
        }

        // Brand filter — use tag-based brand query
        if (brand) {
            queryParts.push(`(${buildBrandQuery(brand)})`);
        }

        // Search term — use plain text search (Shopify searches title, description, tags)
        if (search) {
            queryParts.push(search);
        }

        const shopifyQuery = queryParts.length > 0 ? queryParts.join(" AND ") : undefined;
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
