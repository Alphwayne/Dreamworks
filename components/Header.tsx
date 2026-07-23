"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Search, ShoppingBag, User, Menu, ChevronDown,
    LogIn, UserPlus, ChevronRight, X, ChevronUp, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice, CATEGORY_MAP, Product } from "@/lib/types";

// ─── NAVIGATION DATA ─────────────────────────────────────────────

const TECH_SETUPS = [
    { name: "Creator Studio", href: "/collections/creator-studio", desc: "Content creation gear" },
    { name: "Gamer Squad", href: "/collections/gamer-squad", desc: "Gaming & entertainment" },
];

const BRANDS_DROPDOWN: string[] = [
    "Apple", "Amazon", "Binatone", "Bang Olufsen", "Bluegate", "Beats", "Bose",
    "Cannon", "Canon", "Canyon", "Century", "Cway",
    "Dell",
    "Firman",
    "Growatt", "Google",
    "HP", "Hisense",
    "Infinix", "Itel",
    "JBL", "Jmary",
    "Kenwood",
    "LG", "Lontor",
    "Maxi", "MetaQuest", "Mercury",
    "Nokia", "Nintendo", "Nexus",
    "Oraimo", "Onten", "Onyx", "Oppo",
    "Porodo", "Powerology", "Premax", "Philips",
    "Redmi", "Romoss", "Rite-Tek", "Royal",
    "Sony", "Samsung", "Starlink", "Shyplus",
    "Tecno", "Vertiv"
];

const MAIN_CATEGORIES = [
    { name: "Accessories", slug: "accessories" },
    { name: "Apple Products", slug: "apple" },
    { name: "Computing & Printing", slug: "computing-printing" },
    { name: "Electronics", slug: "electronics" },
    { name: "Enterprise & Security", slug: "enterprise" },
    { name: "Mobile & Tablet", slug: "mobile-tablet" },
    { name: "Power", slug: "power" },
    { name: "Print & Supplies", slug: "print-supplies" },
];

// ─── COMPLETE SUB-CATEGORIES ────────────────────────────────────

const SUB_CATEGORIES: Record<string, { name: string; href: string; brands?: string[]; items?: string[] }[]> = {
    "accessories": [
        { name: "Computer Accessories", href: "/collections/accessories?sub=Computer Accessories" },
        { name: "Printer Accessories", href: "/collections/accessories?sub=Printer Accessories" },
        { name: "Mobile Accessories", href: "/collections/accessories?sub=Mobile Accessories" },
    ],
    "computing-printing": [
        { name: "Desktops", href: "/collections/computing-printing?sub=Desktops", brands: ["Dell", "HP"] },
        { name: "Laptops", href: "/collections/computing-printing?sub=Laptops", brands: ["Acer", "Asus", "Dell", "Evoo", "HP"] },
        { name: "Printers", href: "/collections/computing-printing?sub=Printers", brands: ["Canon", "HP"] },
        { name: "Computer Accessories", href: "/collections/computing-printing?sub=Computer Accessories" },
    ],
    "electronics": [
        {
            name: "Kitchen",
            href: "/collections/electronics?sub=Kitchen",
            items: ["Blenders & Grinders", "Juicers", "Kettles", "Microwaves", "Toasters & Ovens", "Cookers", "Chillers", "Freezers", "Refrigerators", "Food Processors", "Kitchen Taps"]
        },
        {
            name: "Home Appliances",
            href: "/collections/electronics?sub=Home Appliances",
            items: ["Televisions", "Laundry Irons", "Washing Machines", "Air Conditioners", "Fans", "Water Dispensers", "Heaters", "Vacuum Cleaners", "Lighting"]
        },
        {
            name: "Audio & Video",
            href: "/collections/electronics?sub=Audio & Video",
            items: ["Headphones", "Portable Speaker", "Streaming Devices", "Soundbar", "Projectors"]
        },
        {
            name: "Power",
            href: "/collections/electronics?sub=Power",
            items: ["Generators", "Surge Protector", "Stabilizer", "Power Sockets & Extension Box"]
        },
        {
            name: "Cameras",
            href: "/collections/electronics?sub=Cameras",
            items: ["Digital Cameras"]
        },
        {
            name: "Arcade",
            href: "/collections/electronics?sub=Arcade",
            items: ["Consoles", "Hoverboards", "Gaming Accessories", "VR Gaming"]
        },
    ],
    "mobile-tablet": [
        { name: "Mobile Phones", href: "/collections/mobile-tablet?sub=Mobile Phones", brands: ["Apple", "Samsung", "Tecno", "Infinix", "Nokia"] },
        { name: "Tablets", href: "/collections/mobile-tablet?sub=Tablets", brands: ["iPad", "Samsung Tab"] },
    ],
    "power": [
        { name: "Power & Accessories", href: "/collections/power?sub=Power & Accessories", items: ["Batteries", "Inverters", "Portable Power", "UPS"] },
        { name: "Power Brands", href: "/collections/power?sub=Power Brands", brands: ["APC", "Mercury", "Vertiv", "Grovolt"] },
        { name: "Generators", href: "/collections/power?sub=Generators" },
    ],
    "enterprise": [
        { name: "CCTV & Cameras", href: "/collections/enterprise?sub=CCTV" },
        { name: "Access Control", href: "/collections/enterprise?sub=Access Control" },
        { name: "Smart Home", href: "/collections/enterprise?sub=Smart Home" },
        { name: "Door Locks", href: "/collections/enterprise?sub=Door Locks" },
    ],
    "apple": [
        { name: "iPhones", href: "/collections/apple?sub=iPhones", brands: ["Apple"] },
        { name: "iPads", href: "/collections/apple?sub=iPads", brands: ["Apple"] },
        { name: "MacBooks", href: "/collections/apple?sub=MacBooks", brands: ["Apple"] },
        { name: "Accessories", href: "/collections/apple?sub=Accessories" },
    ],
    "print-supplies": [
        { name: "Printers", href: "/collections/print-supplies?sub=Printers", brands: ["Canon", "HP"] },
        { name: "Ink & Toner", href: "/collections/print-supplies?sub=Ink & Toner" },
    ],
};

const rollingMessages = [
    "🎯 Get 10% OFF all Laptops!!!",
    "✨ Dream Now, Pay Later.",
    "🚚 Free Shipping To Locations Around Ikeja",
];

export function Header() {
    const router = useRouter();
    const { getTotalPrice, getTotalItems, openCart } = useCartStore();
    const wishlistCount = useWishlistStore((s) => s.items.length);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // Only read cart values after mount to avoid hydration mismatch
    const totalItems = mounted ? getTotalItems() : 0;
    const totalPrice = mounted ? getTotalPrice() : 0;

    const [isLoggedIn] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [openCategories, setOpenCategories] = useState<string[]>([]);
    const [openTechSetups, setOpenTechSetups] = useState(false);

    const toggleCategory = (slug: string) => {
        setOpenCategories(prev =>
            prev.includes(slug)
                ? prev.filter(s => s !== slug)
                : [...prev, slug]
        );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessage((prev) => (prev + 1) % rollingMessages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) { setSearchResults([]); setShowResults(false); return; }
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=6`);
                const json = await res.json();
                setSearchResults(json.products || []);
                setShowResults(true);
            } catch (err) {
                console.error("Header search error:", err);
            }
        }, 150);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowResults(false);
            setMobileSearchOpen(false);
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-50/90 via-white/95 to-blue-50/90 backdrop-blur-xl border-b border-blue-100/30 shadow-sm overflow-x-hidden lg:overflow-visible" style={{ maxWidth: "100vw" }}>
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
                <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
                    <Link href="/" className="shrink-0 group">
                        <div className="relative">
                            <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                            <Image
                                src="/Dw_web_Logo.avif"
                                alt="DreamWorks Direct"
                                width={120}
                                height={38}
                                className="object-contain relative w-[80px] sm:w-[100px] lg:w-[120px] h-auto"
                                priority
                            />
                        </div>
                    </Link>

                    <div className="hidden lg:flex flex-1 max-w-xl mx-8" ref={searchRef}>
                        <div className="relative w-full group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-blue-400/30 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white/90 backdrop-blur-md border-2 border-gray-100/80 rounded-2xl overflow-hidden shadow-lg shadow-black/5 group-focus-within:border-blue-400/50 group-focus-within:shadow-blue-500/20 transition-all duration-300">
                                <Search className="absolute left-4 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 group-focus-within:scale-110 transition-all" />
                                <Input
                                    placeholder="Search for products, brands & more..."
                                    className="pl-12 pr-4 py-3.5 bg-transparent border-0 focus-visible:ring-0 text-gray-700 placeholder:text-gray-400 text-base font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchResults.length > 0 && setShowResults(true)}
                                />
                            </form>
                            {showResults && searchQuery.trim() && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-black/15 border border-gray-100 overflow-hidden z-50">
                                    {searchResults.length > 0 ? (
                                        <>
                                            <div className="px-4 py-2 border-b border-gray-50">
                                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Suggestions</p>
                                            </div>
                                            {searchResults.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/${product.slug}`}
                                                    onClick={() => { setShowResults(false); setSearchQuery(""); }}
                                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50/80 transition-colors group/item"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={product.image_url || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=60&q=50"}
                                                            alt=""
                                                            className="w-8 h-8 object-contain"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate group-hover/item:text-blue-600 transition-colors">{product.product_name}</p>
                                                        <p className="text-[11px] text-gray-400">{product.category}</p>
                                                    </div>
                                                    <p className="text-sm font-bold text-blue-600 flex-shrink-0">
                                                        {formatPrice(product.selling_price)}
                                                    </p>
                                                </Link>
                                            ))}
                                            <Link
                                                href={`/search?q=${encodeURIComponent(searchQuery)}`}
                                                onClick={() => setShowResults(false)}
                                                className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-blue-600 font-semibold bg-blue-50/50 hover:bg-blue-100/70 transition-colors border-t border-gray-50"
                                            >
                                                <Search className="w-3.5 h-3.5" />
                                                See all results for &ldquo;{searchQuery}&rdquo;
                                            </Link>
                                        </>
                                    ) : (
                                        <div className="px-4 py-6 text-center">
                                            <p className="text-sm text-gray-500">No products found for &ldquo;{searchQuery}&rdquo;</p>
                                            <p className="text-xs text-gray-400 mt-1">Try a different keyword</p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-3">
                        <button
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            className="lg:hidden p-2 hover:bg-blue-50 rounded-full transition-colors"
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5 text-gray-600" />
                        </button>

                        <div
                            className="relative hidden lg:block"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl px-5 py-2.5 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all group">
                                <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="font-semibold">Sign In</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isHovering ? "rotate-180" : ""}`} />
                            </Button>
                            {isHovering && (
                                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 p-1.5 z-50">
                                    <Link href="/auth/signin" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
                                            <LogIn className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">Sign In</div>
                                            <div className="text-[10px] text-gray-400">Access your account</div>
                                        </div>
                                    </Link>
                                    <div className="relative my-1">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200" />
                                        </div>
                                        <div className="relative flex justify-center text-[10px]">
                                            <span className="bg-white px-2 text-gray-400">or</span>
                                        </div>
                                    </div>
                                    <Link href="/auth/register" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all group">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 flex-shrink-0">
                                            <UserPlus className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">Create Account</div>
                                            <div className="text-[10px] text-gray-400">Join DreamWorks family</div>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link href="/auth/signin" className="lg:hidden p-2 hover:bg-blue-50 rounded-full transition-colors">
                            <User className="w-5 h-5 text-gray-600" />
                        </Link>

                        <Link href="/wishlist" className="relative group p-1.5 sm:p-2 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center">
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                            {mounted && wishlistCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center font-bold">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <button onClick={openCart} className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                            <div className="relative flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-blue-400/50 rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all">
                                <div className="relative">
                                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all" />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[8px] sm:text-[9px] rounded-full flex items-center justify-center font-bold shadow-lg shadow-blue-600/30">
                                            {totalItems}
                                        </span>
                                    )}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <div className="text-[10px] text-gray-400">Cart</div>
                                    <div className="text-xs sm:text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                                        {formatPrice(totalPrice)}
                                    </div>
                                </div>
                            </div>
                        </button>

                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <button className="lg:hidden p-2 hover:bg-blue-50 rounded-full transition-colors">
                                    <Menu className="w-5 h-5 text-gray-600" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[320px] sm:w-[360px] bg-white p-0 border-r border-gray-100 overflow-y-auto">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                                        <Image src="/Dw_web_Logo.avif" alt="DreamWorks" width={100} height={32} className="object-contain" />
                                        <button
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <X className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                                        {/* ─── TECH SETUPS ─── */}
                                        <div>
                                            <button
                                                onClick={() => setOpenTechSetups(!openTechSetups)}
                                                className="w-full flex items-center justify-between text-base font-semibold text-white py-3 px-4 rounded-xl transition-all"
                                                style={{
                                                    background: "linear-gradient(135deg, #1e40af, #3b82f6, #6366f1)",
                                                    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.35)"
                                                }}
                                            >
                                                <span>Tech Setups</span>
                                                <span className="text-white/80">
                                                    {openTechSetups ? (
                                                        <ChevronUp className="w-5 h-5" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5" />
                                                    )}
                                                </span>
                                            </button>
                                            {openTechSetups && (
                                                <div className="mt-2 ml-3 pl-3 border-l-2 border-blue-200 space-y-1">
                                                    {TECH_SETUPS.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            href={item.href}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                            className="block text-base text-gray-700 hover:text-blue-600 py-2.5 px-3 hover:bg-blue-50 rounded-lg transition-all font-normal"
                                                        >
                                                            {item.name}
                                                            <span className="text-sm text-gray-400 ml-2">{item.desc}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* ─── SHOP BY BRAND ─── */}
                                        <div>
                                            <div
                                                className="w-full flex items-center text-base font-semibold text-white py-3 px-4 rounded-xl mb-3"
                                                style={{
                                                    background: "linear-gradient(135deg, #1e40af, #3b82f6, #6366f1)",
                                                    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.35)"
                                                }}
                                            >
                                                <span>Shop by Brand</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-1 max-h-56 overflow-y-auto">
                                                {BRANDS_DROPDOWN.map((brand) => (
                                                    <Link
                                                        key={brand}
                                                        href={`/brands/${brand.toLowerCase()}`}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className="block text-base text-gray-700 hover:text-blue-600 py-2 px-3 hover:bg-blue-50 rounded-lg transition-all font-normal"
                                                    >
                                                        {brand}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        {/* ─── SHOP ALL ─── */}
                                        <Link
                                            href="/collections/all"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block text-base font-semibold text-white py-3 px-4 rounded-xl text-center transition-all hover:scale-[1.02]"
                                            style={{
                                                background: "linear-gradient(135deg, #1e40af, #3b82f6, #6366f1)",
                                                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.35)"
                                            }}
                                        >
                                            Shop All
                                        </Link>

                                        {/* ─── ALL CATEGORIES ─── */}
                                        <div className="border-t border-gray-100 pt-4">
                                            <div
                                                className="w-full flex items-center text-base font-semibold text-white py-3 px-4 rounded-xl mb-3"
                                                style={{
                                                    background: "linear-gradient(135deg, #1e40af, #3b82f6, #6366f1)",
                                                    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.35)"
                                                }}
                                            >
                                                <span>All Categories</span>
                                            </div>
                                            <div className="space-y-1">
                                                {MAIN_CATEGORIES.map((cat) => {
                                                    const subCats = SUB_CATEGORIES[cat.slug] || [];
                                                    const isOpen = openCategories.includes(cat.slug);
                                                    const hasSubs = subCats.length > 0;

                                                    return (
                                                        <div key={cat.slug} className="border-b border-gray-50 last:border-0">
                                                            <button
                                                                onClick={() => hasSubs && toggleCategory(cat.slug)}
                                                                className="w-full flex items-center justify-between text-base font-medium text-blue-600 hover:text-blue-700 py-3 px-3 hover:bg-blue-50 rounded-lg transition-all"
                                                            >
                                                                <span className="flex-1 text-left">{cat.name}</span>
                                                                {hasSubs && (
                                                                    <span className="ml-2 text-gray-400">
                                                                        {isOpen ? (
                                                                            <ChevronUp className="w-5 h-5" />
                                                                        ) : (
                                                                            <ChevronDown className="w-5 h-5" />
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </button>

                                                            {isOpen && hasSubs && (
                                                                <div className="ml-4 pl-3 border-l-2 border-blue-200 space-y-1 pb-2">
                                                                    {subCats.map((sub) => (
                                                                        <div key={sub.name}>
                                                                            <Link
                                                                                href={sub.href}
                                                                                onClick={() => setMobileMenuOpen(false)}
                                                                                className="block text-base text-gray-700 hover:text-blue-600 py-2 px-3 hover:bg-blue-50 rounded-lg transition-all font-normal"
                                                                            >
                                                                                {sub.name}
                                                                            </Link>
                                                                            {sub.brands && sub.brands.length > 0 && (
                                                                                <div className="ml-4 flex flex-wrap gap-1 mt-1">
                                                                                    {sub.brands.map((brand) => (
                                                                                        <Link
                                                                                            key={brand}
                                                                                            href={`/brands/${brand.toLowerCase()}`}
                                                                                            onClick={() => setMobileMenuOpen(false)}
                                                                                            className="text-sm bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 px-3 py-1 rounded transition-all font-normal"
                                                                                        >
                                                                                            {brand}
                                                                                        </Link>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                            {sub.items && sub.items.length > 0 && (
                                                                                <div className="ml-4 flex flex-wrap gap-1 mt-1">
                                                                                    {sub.items.map((item) => (
                                                                                        <Link
                                                                                            key={item}
                                                                                            href={sub.href}
                                                                                            onClick={() => setMobileMenuOpen(false)}
                                                                                            className="text-sm bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-500 px-3 py-1 rounded transition-all font-normal"
                                                                                        >
                                                                                            {item}
                                                                                        </Link>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {mobileSearchOpen && (
                    <div className="lg:hidden py-3 border-t border-gray-100 animate-in slide-in-from-top duration-300" style={{ maxWidth: "100%", overflow: "hidden" }}>
                        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 px-1">
                            <div className="relative flex-1 min-w-0">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                <input
                                    type="search"
                                    placeholder="Search products, brands..."
                                    className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    style={{ fontSize: "16px" }}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="flex-shrink-0 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium"
                            >
                                Go
                            </button>
                        </form>
                        {showResults && searchQuery.trim() && (
                            <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                                {searchResults.length > 0 ? (
                                    <>
                                        <div className="px-3 py-1.5 border-b border-gray-50">
                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Suggestions</p>
                                        </div>
                                        {searchResults.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.slug}`}
                                                onClick={() => { setShowResults(false); setSearchQuery(""); setMobileSearchOpen(false); }}
                                                className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 transition-colors"
                                            >
                                                <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={product.image_url || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=60&q=50"}
                                                        alt=""
                                                        className="w-7 h-7 object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{product.product_name}</p>
                                                    <p className="text-[11px] text-gray-400">{product.category}</p>
                                                </div>
                                                <p className="text-sm font-bold text-blue-600 flex-shrink-0">
                                                    {formatPrice(product.selling_price)}
                                                </p>
                                            </Link>
                                        ))}
                                        <Link
                                            href={`/search?q=${encodeURIComponent(searchQuery)}`}
                                            onClick={() => { setShowResults(false); setMobileSearchOpen(false); }}
                                            className="block px-4 py-2.5 text-sm text-center text-blue-600 font-semibold bg-blue-50/50 border-t border-gray-50"
                                        >
                                            See all results
                                        </Link>
                                    </>
                                ) : (
                                    <div className="px-4 py-4 text-center">
                                        <p className="text-sm text-gray-500">No results for &ldquo;{searchQuery}&rdquo;</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="lg:hidden py-1.5 overflow-hidden border-t border-blue-50/50">
                    <div className="relative h-5 w-full overflow-hidden">
                        <div
                            className="transition-all duration-700 ease-in-out"
                            style={{ transform: `translateY(-${currentMessage * 33.33}%)` }}
                        >
                            {rollingMessages.map((msg, index) => (
                                <div key={index} className="h-5 flex items-center justify-center text-xs text-blue-600 whitespace-nowrap font-medium">
                                    {msg}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex items-center h-14 gap-1 border-t border-blue-100/20 bg-gradient-to-r from-blue-200/50 via-indigo-100/40 to-purple-200/50 rounded-2xl mb-0.5 px-2 shadow-inner shadow-blue-500/10">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-sm font-bold text-blue-700 hover:text-blue-800 flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/10 hover:from-blue-500/30 hover:to-purple-500/20 px-5 py-2 rounded-xl transition-all">
                                    All Categories
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="w-[900px] p-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 max-h-[70vh] overflow-y-auto">
                                        <div className="grid grid-cols-3 gap-4">
                                            {MAIN_CATEGORIES.map((cat) => {
                                                const subCats = SUB_CATEGORIES[cat.slug] || [];
                                                return (
                                                    <div
                                                        key={cat.slug}
                                                        className="group relative rounded-xl p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-transparent hover:border-blue-100"
                                                    >
                                                        <Link
                                                            href={`/collections/${cat.slug}`}
                                                            className="flex items-center justify-between mb-2"
                                                        >
                                                            <span className="text-sm font-light text-blue-600 group-hover:text-blue-700 transition-colors tracking-wide">
                                                                {cat.name}
                                                            </span>
                                                        </Link>

                                                        {subCats.length > 0 && (
                                                            <div className="space-y-1 ml-7 border-l-2 border-blue-100 pl-3 max-h-0 overflow-hidden group-hover:max-h-96 transition-all duration-500 ease-in-out">
                                                                {subCats.map((sub) => (
                                                                    <div key={sub.name}>
                                                                        <Link
                                                                            href={sub.href}
                                                                            className="text-sm text-gray-600 hover:text-blue-600 transition-colors block py-0.5 hover:translate-x-1 transform transition-transform font-normal"
                                                                        >
                                                                            {sub.name}
                                                                        </Link>
                                                                        {sub.brands && (
                                                                            <div className="ml-3 flex flex-wrap gap-1 mt-0.5">
                                                                                {sub.brands.map((brand) => (
                                                                                    <Link
                                                                                        key={brand}
                                                                                        href={`/brands/${brand.toLowerCase()}`}
                                                                                        className="text-xs bg-gray-100 hover:bg-blue-100 text-gray-500 hover:text-blue-600 px-2 py-0.5 rounded transition-all font-normal"
                                                                                    >
                                                                                        {brand}
                                                                                    </Link>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                        {sub.items && (
                                                                            <div className="ml-3 flex flex-wrap gap-1 mt-0.5">
                                                                                {sub.items.map((item) => (
                                                                                    <Link
                                                                                        key={item}
                                                                                        href={sub.href}
                                                                                        className="text-xs bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-500 px-2 py-0.5 rounded transition-all font-normal"
                                                                                    >
                                                                                        {item}
                                                                                    </Link>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    <div className="flex items-center gap-1">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-xl transition-all">
                                        Tech Setups
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="w-64 p-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100">
                                            {TECH_SETUPS.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all group"
                                                >
                                                    <div>
                                                        <div className="font-medium">{item.name}</div>
                                                        <div className="text-[10px] text-gray-400">{item.desc}</div>
                                                    </div>
                                                    <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </Link>
                                            ))}
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>

                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-xl transition-all">
                                        Shop by Brand
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="w-[600px] p-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 max-h-[60vh] overflow-y-auto">
                                            <div className="grid grid-cols-4 gap-1">
                                                {BRANDS_DROPDOWN.map((brand) => (
                                                    <Link
                                                        key={brand}
                                                        href={`/brands/${brand.toLowerCase()}`}
                                                        className="px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    >
                                                        {brand}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>

                        <Link
                            href="/collections/all"
                            className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-xl transition-all flex items-center gap-2"
                        >
                            Shop All
                        </Link>
                    </div>

                    <div className="ml-auto flex items-center h-full px-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                            <div className="relative h-7 w-[280px] overflow-hidden">
                                <div className="transition-all duration-700 ease-in-out"
                                    style={{ transform: `translateY(-${currentMessage * 33.33}%)` }}
                                >
                                    {rollingMessages.map((msg, index) => (
                                        <div key={index} className="h-7 flex items-center whitespace-nowrap">{msg}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}