import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Tech setup presets - map slug to relevant search terms
const TECH_SETUP_KEYWORDS: Record<string, string[]> = {
    "creator-studio": ["camera", "microphone", "ring light", "tripod", "webcam", "studio", "streaming", "podcast", "monitor", "graphics", "capture card", "green screen", "lighting", "content"],
    "gamer-squad": ["gaming", "console", "controller", "headset", "keyboard", "mouse", "monitor", "playstation", "xbox", "nintendo", "vr", "quest", "hoverboard", "arcade"],
};

// Sub-category keyword mappings for accurate filtering
const SUB_CATEGORY_KEYWORDS: Record<string, string[]> = {
    // Accessories sub-categories
    "Computer Accessories": ["mouse", "keyboard", "usb", "hub", "webcam", "cable", "adapter", "monitor stand", "laptop stand", "docking", "hdmi", "charger", "bag", "sleeve"],
    "Printer Accessories": ["ink", "toner", "cartridge", "paper", "drum", "ribbon", "print head"],
    "Mobile Accessories": ["case", "screen protector", "earphone", "earbuds", "power bank", "car charger", "phone holder", "ring holder", "stylus", "otg"],
    // Electronics sub-categories
    "Kitchen": ["blender", "grinder", "juicer", "kettle", "microwave", "toaster", "oven", "cooker", "chiller", "freezer", "refrigerator", "food processor", "kitchen", "mixer", "fryer"],
    "Home Appliances": ["television", "tv", "iron", "washing machine", "air conditioner", "fan", "water dispenser", "heater", "vacuum", "lighting", "lamp", "ceiling"],
    "Audio & Video": ["headphone", "speaker", "streaming", "soundbar", "projector", "earphone", "earbuds", "bluetooth speaker", "home theatre", "amplifier"],
    "Power": ["generator", "surge protector", "stabilizer", "power socket", "extension", "ups", "inverter", "battery"],
    "Cameras": ["camera", "digital camera", "dslr", "mirrorless", "action cam", "gopro", "lens"],
    "Arcade": ["console", "playstation", "xbox", "nintendo", "hoverboard", "gaming", "vr", "quest", "controller", "joystick"],
    // Computing sub-categories
    "Desktops": ["desktop", "workstation", "tower", "optiplex", "all-in-one", "imac", "mac mini", "pc"],
    "Laptops": ["laptop", "notebook", "elitebook", "probook", "thinkpad", "pavilion", "envy", "macbook", "chromebook", "legion", "zephyrus", "vivobook", "ideapad"],
    "Printers": ["printer", "laserjet", "inkjet", "deskjet", "officejet", "pixma", "ecotank"],
    // Mobile sub-categories
    "Mobile Phones": ["phone", "iphone", "galaxy", "redmi", "tecno", "infinix", "nokia", "oppo", "itel", "samsung", "zte"],
    "Tablets": ["ipad", "tablet", "tab", "surface"],
    // Power sub-categories
    "Power & Accessories": ["battery", "inverter", "portable power", "ups", "power bank", "solar"],
    "Generators": ["generator", "firman", "sumec", "elepaq", "tiger"],
    // Enterprise sub-categories
    "CCTV": ["cctv", "camera", "dvr", "nvr", "hikvision", "dahua", "surveillance"],
    "Access Control": ["access control", "biometric", "fingerprint", "card reader", "time attendance"],
    "Smart Home": ["smart home", "smart plug", "smart bulb", "smart lock", "alexa", "google home", "automation"],
    "Door Locks": ["door lock", "smart lock", "digital lock", "padlock", "deadbolt"],
    // Apple sub-categories
    "iPhones": ["iphone"],
    "iPads": ["ipad"],
    "MacBooks": ["macbook", "mac book"],
    // Print sub-categories
    "Ink & Toner": ["ink", "toner", "cartridge", "refill"],
};

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
        let query = supabase
            .from("products")
            .select("*", { count: "exact" })
            .eq("is_active", true)
            .order(sortBy, { ascending: sortOrder === "asc" })
            .range(offset, offset + limit - 1);

        if (category) {
            query = query.eq("category", category);
        }

        if (search) {
            query = query.ilike("product_name", `%${search}%`);
        }

        if (brand) {
            query = query.ilike("product_name", `%${brand}%`);
        }

        // Tech setup preset filtering - use OR search across keywords
        if (techSetup && TECH_SETUP_KEYWORDS[techSetup]) {
            const keywords = TECH_SETUP_KEYWORDS[techSetup];
            // Build an OR filter for product names containing any of the keywords
            const orFilter = keywords.map(k => `product_name.ilike.%${k}%`).join(",");
            query = query.or(orFilter);
        }

        // Sub-category filtering - use OR search across keywords
        if (sub && SUB_CATEGORY_KEYWORDS[sub]) {
            const keywords = SUB_CATEGORY_KEYWORDS[sub];
            const orFilter = keywords.map(k => `product_name.ilike.%${k}%`).join(",");
            query = query.or(orFilter);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error("[API /products] Error:", error.message);
            return NextResponse.json({ products: [], count: 0, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ products: data || [], count: count || 0 });
    } catch (err: any) {
        console.error("[API /products] Exception:", err.message);
        return NextResponse.json({ products: [], count: 0, error: err.message }, { status: 500 });
    }
}
