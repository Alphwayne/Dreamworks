export interface Product {
    id: number;
    item_code: string;
    product_name: string;
    category: string;
    selling_price: number;
    compare_price: number | null;
    slug: string;
    image_url: string | null;
    description: string | null;
    is_active: boolean;
    created_at: string;
}

export interface Inventory {
    id: number;
    handle: string;
    title: string;
    sku: string;
    available: number;
    on_hand_current: number;
    location: string;
}

export interface Order {
    id: number;
    order_number: string;
    email: string;
    financial_status: string;
    fulfillment_status: string;
    subtotal: number;
    shipping: number;
    taxes: number;
    total: number;
    discount_code: string | null;
    discount_amount: number;
    shipping_name: string;
    shipping_address1: string;
    shipping_city: string;
    shipping_country: string;
    shipping_phone: string;
    payment_method: string;
    created_at: string;
}

export interface OrderItem {
    id: number;
    order_number: string;
    lineitem_quantity: number;
    lineitem_name: string;
    lineitem_price: number;
    lineitem_compare_at_price: number;
    lineitem_sku: string;
    lineitem_fulfillment_status: string;
    lineitem_discount: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Customer {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    city: string;
    province: string;
    country: string;
    total_spent: number;
    orders_count: number;
    created_at: string;
}

// Category map — matches your actual database categories
// Slugs are aligned with Header navigation for seamless routing
export const CATEGORY_MAP: Record<string, { label: string; slug: string; icon: string }> = {
    "ACCESSORIES": { label: "Accessories", slug: "accessories", icon: "🔌" },
    "APPLE": { label: "Apple Products", slug: "apple", icon: "🍎" },
    "COMPUTING ACCESSORIES": { label: "Computing & Printing", slug: "computing-printing", icon: "💻" },
    "CONSUMER ELECTRONICS": { label: "Electronics", slug: "electronics", icon: "📺" },
    "ENTERPRISE": { label: "Enterprise & Security", slug: "enterprise", icon: "🏢" },
    "FACTORY RECERTIFIED": { label: "Factory Recertified", slug: "factory-recertified", icon: "🔄" },
    "HP BRAND": { label: "HP Brand", slug: "hp-brand", icon: "🖥️" },
    "MOBILE & TABLET": { label: "Mobile & Tablet", slug: "mobile-tablet", icon: "📱" },
    "OPEN BOX": { label: "Open Box", slug: "open-box", icon: "📦" },
    "OTHER BRAND": { label: "Other Brands", slug: "other-brand", icon: "🏷️" },
    "POWER": { label: "Power", slug: "power", icon: "⚡" },
    "PRINT & SUPPLIES": { label: "Print & Supplies", slug: "print-supplies", icon: "🖨️" },
    "USED": { label: "Used", slug: "used", icon: "♻️" },
};

// Reverse map — slug to DB category value
// Includes extra aliases so Header nav slugs always resolve to a valid DB category
export const SLUG_TO_CATEGORY: Record<string, string> = {
    // Auto-generated from CATEGORY_MAP
    ...Object.entries(CATEGORY_MAP).reduce(
        (acc, [dbCat, info]) => ({ ...acc, [info.slug]: dbCat }),
        {} as Record<string, string>
    ),
    // Aliases for Header navigation compatibility
    "computing-accessories": "COMPUTING ACCESSORIES",
    "consumer-electronics": "CONSUMER ELECTRONICS",
    "smart-devices": "ENTERPRISE",
    "surveillance": "ENTERPRISE",
    "office-essentials": "ACCESSORIES",
    "health-personal-care": "CONSUMER ELECTRONICS",
};

// Category placeholder images — DISTINCT images per category
// These are used when product.image_url is null in the database
export const CATEGORY_IMAGES: Record<string, string> = {
    "ACCESSORIES": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=75",
    "APPLE": "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400&q=75",
    "COMPUTING ACCESSORIES": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=75",
    "CONSUMER ELECTRONICS": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=75",
    "ENTERPRISE": "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=75",
    "FACTORY RECERTIFIED": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=75",
    "HP BRAND": "https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=400&q=75",
    "MOBILE & TABLET": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=75",
    "OPEN BOX": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=75",
    "OTHER BRAND": "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&q=75",
    "POWER": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=75",
    "PRINT & SUPPLIES": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=75",
    "USED": "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=75",
};

// Smart product image resolver — uses product name keywords to pick better images
// when image_url is null, instead of showing the same category placeholder for everything
export function getProductImage(product: Product): string {
    if (product.image_url) return product.image_url;

    // Try to match product name keywords for more relevant images
    const name = product.product_name.toLowerCase();

    // Laptops & Computers
    if (name.includes("laptop") || name.includes("elitebook") || name.includes("probook") || name.includes("thinkpad") || name.includes("legion") || name.includes("zephyrus") || name.includes("pavilion") || name.includes("envy"))
        return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=75";
    if (name.includes("desktop") || name.includes("workstation") || name.includes("tower") || name.includes("optiplex"))
        return "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&q=75";
    if (name.includes("imac") || name.includes("macbook") || name.includes("mac mini") || name.includes("mac pro"))
        return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=75";

    // Phones & Tablets
    if (name.includes("iphone") || name.includes("galaxy") || name.includes("zte") || name.includes("samsung") || name.includes("phone") || name.includes("redmi") || name.includes("tecno"))
        return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=75";
    if (name.includes("ipad") || name.includes("tablet") || name.includes("fire") || name.includes("tab"))
        return "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=75";

    // TVs & Monitors
    if (name.includes("tv") || name.includes("television") || name.includes("hisense") || name.includes("oled") || name.includes("qled"))
        return "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=75";
    if (name.includes("monitor") || name.includes("display") || name.includes("benq") || name.includes("surface hub"))
        return "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=75";

    // Cameras & Security
    if (name.includes("camera") || name.includes("cctv") || name.includes("dvr") || name.includes("nvr") || name.includes("hikvision") || name.includes("doorbell"))
        return "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=75";

    // Audio
    if (name.includes("speaker") || name.includes("headphone") || name.includes("earphone") || name.includes("jbl") || name.includes("airpod") || name.includes("soundbar"))
        return "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=75";

    // Printers
    if (name.includes("printer") || name.includes("toner") || name.includes("cartridge") || name.includes("ink"))
        return "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=75";

    // Power / UPS
    if (name.includes("ups") || name.includes("bluegate") || name.includes("inverter") || name.includes("solar") || name.includes("battery") || name.includes("power"))
        return "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=75";

    // Networking
    if (name.includes("router") || name.includes("switch") || name.includes("access point") || name.includes("wifi") || name.includes("modem"))
        return "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=75";

    // RAM & Storage
    if (name.includes("ram") || name.includes("ssd") || name.includes("hdd") || name.includes("hard drive") || name.includes("memory") || name.includes("optane"))
        return "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&q=75";

    // Smart Home
    if (name.includes("smart") || name.includes("plug") || name.includes("bulb") || name.includes("alarm"))
        return "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400&q=75";

    // Drones
    if (name.includes("drone") || name.includes("dji") || name.includes("mavic"))
        return "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=75";

    // Gaming
    if (name.includes("gaming") || name.includes("playstation") || name.includes("xbox") || name.includes("controller") || name.includes("rog"))
        return "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&q=75";

    // Default: use category image
    return CATEGORY_IMAGES[product.category] || "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&q=75";
}

export function formatPrice(price: number): string {
    return "₦" + price.toLocaleString("en-NG");
}

export function formatDiscount(price: number, comparePrice: number | null): number | null {
    if (!comparePrice || comparePrice <= price) return null;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
}
