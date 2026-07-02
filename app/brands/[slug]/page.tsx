import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { FloatingElements } from "@/components/FloatingElements";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
import { getProductsByBrand } from "@/lib/api/brands";
import Link from "next/link";

type Props = {
    params: { slug: string };
};

// Map slug to display name
const BRAND_NAMES: Record<string, string> = {
    apple: "Apple",
    amazon: "Amazon",
    binatone: "Binatone",
    "bang-olufsen": "Bang Olufsen",
    bluegate: "Bluegate",
    beats: "Beats",
    bose: "Bose",
    cannon: "Cannon",
    canon: "Canon",
    canyon: "Canyon",
    century: "Century",
    cway: "Cway",
    dell: "Dell",
    firman: "Firman",
    growatt: "Growatt",
    google: "Google",
    hp: "HP",
    hisense: "Hisense",
    infinix: "Infinix",
    itel: "Itel",
    jbl: "JBL",
    jmary: "Jmary",
    kenwood: "Kenwood",
    lg: "LG",
    lontor: "Lontor",
    maxi: "Maxi",
    metaquest: "MetaQuest",
    mercury: "Mercury",
    nokia: "Nokia",
    nintendo: "Nintendo",
    nexus: "Nexus",
    oraimo: "Oraimo",
    onten: "Onten",
    onyx: "Onyx",
    oppo: "Oppo",
    porodo: "Porodo",
    powerology: "Powerology",
    premax: "Premax",
    philips: "Philips",
    redmi: "Redmi",
    romoss: "Romoss",
    "rite-tek": "Rite-Tek",
    royal: "Royal",
    sony: "Sony",
    samsung: "Samsung",
    starlink: "Starlink",
    shyplus: "Shyplus",
    tecno: "Tecno",
    vertiv: "Vertiv",
};

export default async function BrandPage({ params }: Props) {
    const brandName = BRAND_NAMES[params.slug] || params.slug;
    const { products, count } = await getProductsByBrand(brandName, 24, 0);

    return (
        <>
            <CartDrawer />
            <div className="min-h-screen bg-gray-50">
                <Header />

                <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-8 px-4">
                    <div className="max-w-7xl mx-auto">
                        <nav className="text-sm text-blue-200 mb-3">
                            <Link href="/" className="hover:text-white">Home</Link>
                            <span className="mx-2">›</span>
                            <Link href="/brands" className="hover:text-white">Brands</Link>
                            <span className="mx-2">›</span>
                            <span className="text-white font-medium">{brandName}</span>
                        </nav>
                        <h1 className="text-3xl font-bold">{brandName}</h1>
                        <p className="text-blue-200 mt-1">{count} products available</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-6">
                    {products.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg">No {brandName} products found</p>
                            <Link href="/brands" className="text-blue-600 font-semibold hover:underline mt-4 inline-block">
                                Back to brands
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    )}
                </div>

                <BottomNav />
                <FloatingElements />
            </div>
        </>
    );
}