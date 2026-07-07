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

// Category placeholder images
export const CATEGORY_IMAGES: Record<string, string> = {
    "ACCESSORIES": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=75",
    "APPLE": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=75",
    "COMPUTING ACCESSORIES": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=75",
    "CONSUMER ELECTRONICS": "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&q=75",
    "ENTERPRISE": "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=75",
    "FACTORY RECERTIFIED": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=75",
    "HP BRAND": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=75",
    "MOBILE & TABLET": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=75",
    "OPEN BOX": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75",
    "OTHER BRAND": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=75",
    "POWER": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75",
    "PRINT & SUPPLIES": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=75",
    "USED": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=75",
};

export function getProductImage(product: Product): string {
    if (product.image_url) return product.image_url;
    return CATEGORY_IMAGES[product.category] || "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=75";
}

export function formatPrice(price: number): string {
    return "₦" + price.toLocaleString("en-NG");
}

export function formatDiscount(price: number, comparePrice: number | null): number | null {
    if (!comparePrice || comparePrice <= price) return null;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
}