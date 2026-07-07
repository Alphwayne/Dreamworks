import { Header } from "@/components/Header";

import { CartDrawer } from "@/components/CartDrawer";
import { FloatingElements } from "@/components/FloatingElements";
import { supabase } from "@/lib/supabase";
import { CATEGORY_MAP } from "@/lib/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Complete brands list from your screenshot
const BRANDS = [
    { name: "Apple", slug: "apple", desc: "Premium Apple Products — iPhone, Mac, iPad & more", color: "#555555", category: "APPLE" },
    { name: "Amazon", slug: "amazon", desc: "Amazon Devices — Kindle, Fire TV, Echo & more", color: "#FF9900", category: "CONSUMER ELECTRONICS" },
    { name: "Binatone", slug: "binatone", desc: "Home Appliances & Consumer Electronics", color: "#004B87", category: "ENTERPRISE" },
    { name: "Bang Olufsen", slug: "bang-olufsen", desc: "Premium Audio & Luxury Electronics", color: "#000000", category: "CONSUMER ELECTRONICS" },
    { name: "Bluegate", slug: "bluegate", desc: "Smart Home & Security Solutions", color: "#0055A4", category: "SMART DEVICES" },
    { name: "Beats", slug: "beats", desc: "Premium Headphones & Audio Equipment", color: "#E01A22", category: "ACCESSORIES" },
    { name: "Bose", slug: "bose", desc: "High-Quality Audio & Sound Systems", color: "#000000", category: "ACCESSORIES" },
    { name: "Cannon", slug: "cannon", desc: "Cameras, Printers & Imaging Solutions", color: "#CC0000", category: "PRINT & SUPPLIES" },
    { name: "Canon", slug: "canon", desc: "Cameras, Printers & Imaging Solutions", color: "#CC0000", category: "PRINT & SUPPLIES" },
    { name: "Canyon", slug: "canyon", desc: "Computer Accessories & Gadgets", color: "#0066B3", category: "ACCESSORIES" },
    { name: "Century", slug: "century", desc: "Power Solutions & Batteries", color: "#FF6B00", category: "POWER" },
    { name: "Cway", slug: "cway", desc: "Consumer Electronics & Home Appliances", color: "#00A651", category: "CONSUMER ELECTRONICS" },
    { name: "Dell", slug: "dell", desc: "Laptops, Desktops & Monitors — Premium Business Tech", color: "#0076C5", category: "COMPUTING ACCESSORIES" },
    { name: "Firman", slug: "firman", desc: "Generators & Power Equipment", color: "#E31937", category: "POWER" },
    { name: "Growatt", slug: "growatt", desc: "Inverters & Solar Power Solutions", color: "#00A859", category: "POWER" },
    { name: "Google", slug: "google", desc: "Google Products — Pixel, Nest, Chromecast & more", color: "#4285F4", category: "SMART DEVICES" },
    { name: "HP", slug: "hp", desc: "Nigeria's No.1 HP Store — Laptops, Desktops, Printers & more", color: "#0096D6", category: "HP BRAND" },
    { name: "Hisense", slug: "hisense", desc: "Televisions, Refrigerators & Home Appliances", color: "#003087", category: "CONSUMER ELECTRONICS" },
    { name: "Infinix", slug: "infinix", desc: "Smartphones & Mobile Accessories", color: "#0018A8", category: "MOBILE & TABLET" },
    { name: "Itel", slug: "itel", desc: "Mobile Phones & Consumer Electronics", color: "#00A651", category: "MOBILE & TABLET" },
    { name: "JBL", slug: "jbl", desc: "Premium Speakers, Headphones & Audio Equipment", color: "#F37021", category: "ACCESSORIES" },
    { name: "Jmary", slug: "jmary", desc: "Home Appliances & Electronics", color: "#0072B0", category: "CONSUMER ELECTRONICS" },
    { name: "Kenwood", slug: "kenwood", desc: "Kitchen Appliances & Audio Equipment", color: "#1A1A1A", category: "CONSUMER ELECTRONICS" },
    { name: "LG", slug: "lg", desc: "TVs, Refrigerators, Washing Machines & Electronics", color: "#A50034", category: "CONSUMER ELECTRONICS" },
    { name: "Lontor", slug: "lontor", desc: "Lighting & Power Solutions", color: "#F5A623", category: "POWER" },
    { name: "Maxi", slug: "maxi", desc: "Home Appliances & Kitchen Equipment", color: "#E31E24", category: "CONSUMER ELECTRONICS" },
    { name: "MetaQuest", slug: "metaquest", desc: "VR Gaming & Virtual Reality", color: "#0066CC", category: "ELECTRONICS" },
    { name: "Mercury", slug: "mercury", desc: "Power Solutions — Inverters & UPS", color: "#00A3E0", category: "POWER" },
    { name: "Nokia", slug: "nokia", desc: "Mobile Phones & Consumer Electronics", color: "#005AFF", category: "MOBILE & TABLET" },
    { name: "Nintendo", slug: "nintendo", desc: "Gaming Consoles & Entertainment", color: "#E60012", category: "ELECTRONICS" },
    { name: "Nexus", slug: "nexus", desc: "Networking Equipment & Smart Tech", color: "#00875A", category: "SMART DEVICES" },
    { name: "Oraimo", slug: "oraimo", desc: "Mobile Accessories & Charging Solutions", color: "#FF6B00", category: "ACCESSORIES" },
    { name: "Onten", slug: "onten", desc: "Audio & Consumer Electronics", color: "#1A1A1A", category: "ACCESSORIES" },
    { name: "Onyx", slug: "onyx", desc: "Consumer Electronics & Accessories", color: "#2C2C2C", category: "ACCESSORIES" },
    { name: "Oppo", slug: "oppo", desc: "Smartphones & Mobile Accessories", color: "#1A6B40", category: "MOBILE & TABLET" },
    { name: "Porodo", slug: "porodo", desc: "Gaming Accessories & Consumer Electronics", color: "#E31E24", category: "ELECTRONICS" },
    { name: "Powerology", slug: "powerology", desc: "Power Banks & Charging Solutions", color: "#00A3E0", category: "POWER" },
    { name: "Premax", slug: "premax", desc: "Mobile Accessories & Consumer Electronics", color: "#1A1A1A", category: "ACCESSORIES" },
    { name: "Philips", slug: "philips", desc: "Home Appliances & Consumer Electronics", color: "#0091CA", category: "CONSUMER ELECTRONICS" },
    { name: "Redmi", slug: "redmi", desc: "Smartphones & Mobile Accessories", color: "#FF6700", category: "MOBILE & TABLET" },
    { name: "Romoss", slug: "romoss", desc: "Power Banks & Charging Solutions", color: "#0055A4", category: "POWER" },
    { name: "Rite-Tek", slug: "rite-tek", desc: "Computer Accessories & Peripherals", color: "#1A1A1A", category: "ACCESSORIES" },
    { name: "Royal", slug: "royal", desc: "Home Appliances & Consumer Electronics", color: "#002F6C", category: "CONSUMER ELECTRONICS" },
    { name: "Sony", slug: "sony", desc: "Cameras, Audio, Gaming & Consumer Electronics", color: "#000000", category: "CONSUMER ELECTRONICS" },
    { name: "Samsung", slug: "samsung", desc: "Phones, TVs, Tablets & Smart Home from Samsung", color: "#1428A0", category: "MOBILE & TABLET" },
    { name: "Starlink", slug: "starlink", desc: "Satellite Internet & Connectivity", color: "#000000", category: "CONSUMER ELECTRONICS" },
    { name: "Shyplus", slug: "shyplus", desc: "Mobile Accessories & Charging Solutions", color: "#00A651", category: "ACCESSORIES" },
    { name: "Tecno", slug: "tecno", desc: "Smartphones & Mobile Accessories", color: "#F5A623", category: "MOBILE & TABLET" },
    { name: "Vertiv", slug: "vertiv", desc: "Power Solutions — UPS & Cooling", color: "#0033A0", category: "POWER" },
];

async function getBrandProductCount(category: string) {
    const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category", category)
        .eq("is_active", true);
    return count || 0;
}

export default async function BrandsPage() {
    const counts = await Promise.all(BRANDS.map((b) => getBrandProductCount(b.category)));

    return (
        <>
            <CartDrawer />
            <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#eef2ff 0%,#f8faff 50%,#f0f7ff 100%)" }}>
                <Header />

                <div className="relative py-16 px-4 overflow-hidden" style={{ background: "linear-gradient(135deg,#003B7E 0%,#1565C0 100%)" }}>
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px,white 1px,transparent 0)", backgroundSize: "40px 40px" }} />
                    <div className="relative max-w-3xl mx-auto text-center">
                        <span className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-3 block">Official Partners</span>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">Premium Brands</h1>
                        <p className="text-blue-200">Authorised dealer for Nigeria's top technology brands</p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {BRANDS.map((brand, i) => (
                            <Link
                                key={brand.slug}
                                href={`/brands/${brand.slug}`}
                                className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="h-24 flex items-center justify-center relative overflow-hidden" style={{ background: brand.color }}>
                                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 70% 50%,white 0%,transparent 60%)" }} />
                                    <span className="text-white font-black text-3xl relative z-10 tracking-tight">{brand.name}</span>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Authorised Dealer</span>
                                        <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-full">
                                            {counts[i]} products
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{brand.desc}</p>
                                    <div className="flex items-center gap-1 text-sm font-semibold group-hover:text-blue-600 transition-colors" style={{ color: brand.color }}>
                                        Shop {brand.name} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                
                <FloatingElements />
            </div>
        </>
    );
}