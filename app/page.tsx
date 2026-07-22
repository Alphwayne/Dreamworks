import { Header } from "@/components/Header";
import { HeroSlider } from "@/components/HeroSlider";
import { CategoryStrip } from "@/components/CategoryStrip";
import { FloatingElements } from "@/components/FloatingElements";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { BrandStrip } from "@/components/BrandStrip";
import { MediaShowcase } from "@/components/MediaShowcase";
import { FlashDeals } from "@/components/FlashDeals";
import { DealOfTheDay } from "@/components/DealOfTheDay";
import { CompleteYourSetup } from "@/components/CompleteYourSetup";
import { TrendingNow } from "@/components/TrendingNow";
import { JustLaunched } from "@/components/JustLaunched";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { getProducts } from "@/lib/api/products";
import Link from "next/link";
import {
  ChevronRight, ArrowRight, BookOpen, Heart, Clock,
} from "lucide-react";
import { CATEGORY_MAP } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

// ISR: Revalidate every 10 minutes for fast loads with fresh data
export const revalidate = 600;

const BLOG_PREVIEWS = [
  {
    slug: "world-cup-2026-tech-showcase",
    title: "The 2026 World Cup Is Becoming a Tech Showcase",
    excerpt: "Football meets technology in the most spectacular way yet.",
    category: "World Cup",
    categoryColor: "bg-blue-500",
    date: "Jun 13, 2026",
    readTime: 5,
    likes: 47,
    bg: "from-blue-800 to-indigo-900",
    emoji: "⚽",
    image: "/blog/world-cup-tech.jpg",
  },
  {
    slug: "dreamworks-trusted-technology-partner",
    title: "Why Dreamworks Is Nigeria's Trusted Technology Partner",
    excerpt: "22 years of excellence, authenticity and customer-first service.",
    category: "Product News",
    categoryColor: "bg-blue-500",
    date: "Jun 6, 2026",
    readTime: 4,
    likes: 32,
    bg: "from-blue-800 to-blue-900",
    emoji: "🏪",
    image: "/blog/dreamworks-partner.jpg",
  },
  {
    slug: "buy-one-get-one-free-deals",
    title: "Buy One, Get One Free! Best Tech Deals Right Now",
    excerpt: "The best deals give you more for your money.",
    category: "Deals",
    categoryColor: "bg-indigo-500",
    date: "Jun 23, 2026",
    readTime: 2,
    likes: 63,
    bg: "from-indigo-700 to-blue-900",
    emoji: "🎁",
    image: "/blog/tech-deals-bogo.jpg",
  },
];

const SOCIAL_LINKS = [
  { name: "Facebook", href: "https://facebook.com/dreamworksnig", bg: "#1877F2", svgPath: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
  { name: "Instagram", href: "https://instagram.com/dreamworksnig", bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", svgPath: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 6.5h11a2 2 0 012 2v7a2 2 0 01-2 2h-11a2 2 0 01-2-2v-7a2 2 0 012-2z" },
  { name: "X", href: "https://x.com/dreamworksnig", bg: "#000000", svgPath: "M4 4l16 16M4 20L20 4" },
  { name: "TikTok", href: "https://tiktok.com/@dreamworksnig", bg: "#010101", svgPath: "M9 12a4 4 0 100 8 4 4 0 000-8zm0 0V4m7 8V4h-4" },
  { name: "LinkedIn", href: "https://linkedin.com/company/dreamworksnig", bg: "#0A66C2", svgPath: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" },
];

const SELLING_POINTS = [
  { icon: "🏆", label: "22 Years of Expertise", sub: "Trusted since 2004", color: "from-blue-500 to-blue-700" },
  { icon: "🌍", label: "Curated Global Brands", sub: "Apple · Samsung · Dell · HP · Sony", color: "from-blue-600 to-indigo-700" },
  { icon: "📍", label: "Nationwide Presence", sub: "Lagos · Abuja · Port Harcourt", color: "from-indigo-500 to-blue-700" },
  { icon: "💳", label: "Pay Small Small", sub: "Own premium tech affordably", color: "from-blue-700 to-indigo-800" },
  { icon: "🎧", label: "24/7 Expert Support", sub: "Chat · Phone · Email", color: "from-sky-500 to-blue-700" },
  { icon: "🔒", label: "Authentic. Guaranteed.", sub: "Every product verified", color: "from-indigo-600 to-blue-800" },
];

// Fetch products with compare_price (deals)
async function getFlashDeals() {
  const { data } = await supabase
    .from("products")
    .select("id, product_name, selling_price, compare_price, image_url, slug, category")
    .eq("is_active", true)
    .not("compare_price", "is", null)
    .gt("compare_price", 0)
    .order("created_at", { ascending: false })
    .limit(10);
  return data || [];
}

// Fetch the single best deal for Deal of the Day
async function getDealOfTheDay() {
  const { data } = await supabase
    .from("products")
    .select("id, product_name, selling_price, compare_price, image_url, slug, category, description")
    .eq("is_active", true)
    .not("compare_price", "is", null)
    .gt("compare_price", 0)
    .order("compare_price", { ascending: false })
    .limit(1)
    .single();
  return data;
}

// Fetch trending (most expensive = most popular proxy)
async function getTrendingProducts() {
  const { data } = await supabase
    .from("products")
    .select("id, product_name, selling_price, compare_price, image_url, slug, category")
    .eq("is_active", true)
    .order("selling_price", { ascending: false })
    .limit(8);
  return data || [];
}

// Fetch just launched (newest)
async function getJustLaunched() {
  const { data } = await supabase
    .from("products")
    .select("id, product_name, selling_price, compare_price, image_url, slug, category, created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(5);
  return data || [];
}

// Fetch bundle suggestions — single query, then split by category
async function getBundles() {
  const bundleConfigs = [
    { title: "Home Office", icon: "💻", description: "Everything you need for a productive workspace", categories: ["COMPUTING ACCESSORIES", "POWER", "ACCESSORIES"] },
    { title: "Smart Home", icon: "🏠", description: "Transform your home into a connected space", categories: ["ENTERPRISE", "ACCESSORIES", "POWER"] },
    { title: "Mobile Life", icon: "📱", description: "Stay connected and powered up on the go", categories: ["MOBILE & TABLET", "ACCESSORIES", "POWER"] },
  ];

  // Fetch all needed categories in one query
  const allCategories = [...new Set(bundleConfigs.flatMap(c => c.categories))];
  const { data: allProducts } = await supabase
    .from("products")
    .select("id, product_name, selling_price, image_url, slug, category")
    .in("category", allCategories)
    .eq("is_active", true)
    .limit(50);

  const productsByCategory = new Map<string, any[]>();
  (allProducts || []).forEach(p => {
    const list = productsByCategory.get(p.category) || [];
    list.push(p);
    productsByCategory.set(p.category, list);
  });

  const bundles = bundleConfigs.map((config) => {
    const products: any[] = [];
    for (const cat of config.categories) {
      const catProducts = productsByCategory.get(cat) || [];
      products.push(...catProducts.slice(0, 3));
    }
    return {
      title: config.title,
      description: config.description,
      icon: config.icon,
      gradient: "",
      products: products.slice(0, 8),
    };
  });

  return bundles.filter((b) => b.products.length >= 3);
}

// Fetch catchy featured products from different categories for the visual strip
async function getCatchyProducts() {
  const categories = [
    "COMPUTING ACCESSORIES", "MOBILE & TABLET", "CONSUMER ELECTRONICS",
    "ENTERPRISE", "ACCESSORIES", "POWER", "APPLE",
  ];
  const results = await Promise.all(
    categories.map((cat) =>
      supabase
        .from("products")
        .select("id, product_name, selling_price, image_url, slug, category")
        .eq("category", cat)
        .eq("is_active", true)
        .not("image_url", "is", null)
        .order("selling_price", { ascending: false })
        .limit(2)
        .then(({ data }) => data || [])
    )
  );
  // Interleave products from different categories
  const mixed: any[] = [];
  const maxLen = Math.max(...results.map((r) => r.length));
  for (let i = 0; i < maxLen; i++) {
    for (const arr of results) {
      if (arr[i]) mixed.push(arr[i]);
    }
  }
  return mixed.slice(0, 14).map((p) => ({
    label: p.product_name.length > 30 ? p.product_name.slice(0, 30) + "..." : p.product_name,
    slug: p.slug || p.id,
    image: p.image_url || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=75",
    isProduct: true,
  }));
}

async function getMixedProducts() {
  const categories = [
    "COMPUTING ACCESSORIES",
    "MOBILE & TABLET",
    "ENTERPRISE",
    "ACCESSORIES",
    "POWER",
    "CONSUMER ELECTRONICS",
  ];
  const results = await Promise.all(
    categories.map((cat) =>
      supabase
        .from("products")
        .select("*")
        .eq("category", cat)
        .eq("is_active", true)
        .limit(3)
        .then(({ data }) => data || [])
    )
  );
  const mixed: any[] = [];
  const maxLen = Math.max(...results.map((r) => r.length));
  for (let i = 0; i < maxLen; i++) {
    for (const arr of results) {
      if (arr[i]) mixed.push(arr[i]);
    }
  }
  return mixed.slice(0, 16);
}


export default async function Home() {
  const [
    { products: newArrivals },
    mixedProducts,
    flashDeals,
    dealOfTheDay,
    trendingProducts,
    justLaunched,
    bundles,
    catchyProducts,
  ] = await Promise.all([
    getProducts({ limit: 8, sortBy: "created_at", sortOrder: "desc" }),
    getMixedProducts(),
    getFlashDeals(),
    getDealOfTheDay(),
    getTrendingProducts(),
    getJustLaunched(),
    getBundles(),
    getCatchyProducts(),
  ]);

  return (
    <>
      <CartDrawer />
      <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#eef2ff 0%,#f8faff 30%,#f0f7ff 60%,#eff0ff 100%)", overflowX: "hidden", maxWidth: "100vw" }}>
        <Header />

        {/* === HERO SECTION (UNTOUCHED) === */}
        <div className="px-4 pt-4 pb-0">
          <HeroSlider />
        </div>

        <div className="h-8 md:h-12" />

        {/* === FEATURED PRODUCTS STRIP === */}
        <div className="mb-8 relative">
          {/* Top gradient fade */}
          <div className="h-8" style={{ background: "linear-gradient(to bottom, transparent, white)" }} />
          {/* Products on white */}
          <div className="bg-white">
            <CategoryStrip categories={catchyProducts} />
          </div>
          {/* Bottom gradient fade */}
          <div className="h-8" style={{ background: "linear-gradient(to top, transparent, white)" }} />
        </div>

        {/* === NEW: JUST LAUNCHED BENTO GRID === */}
        <JustLaunched products={justLaunched} />

        <BrandStrip />

        {/* === NEW: TRENDING NOW === */}
        <TrendingNow products={trendingProducts} />

        {/* === NEW: FLASH DEALS WITH COUNTDOWN === */}
        <FlashDeals deals={flashDeals} />

        {/* === EXISTING: NEW ARRIVALS GRID === */}
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-600 to-transparent rounded-full" />
            <Link href="/collections/all" className="mx-4 text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline flex-shrink-0">
              Shop All Products
            </Link>
            <div className="h-0.5 flex-1 bg-gradient-to-l from-blue-600 to-transparent rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* === NEW: DEAL OF THE DAY === */}
        <DealOfTheDay product={dealOfTheDay} />

        {/* === EXISTING: MEDIA SHOWCASE === */}
        <MediaShowcase />

        {/* === NEW: COMPLETE YOUR SETUP (BUNDLE BUILDER) === */}
        <CompleteYourSetup bundles={bundles} />

        {/* === EXISTING: MIXED CATEGORIES === */}
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="h-0.5 flex-1 bg-gradient-to-r from-purple-600 to-transparent rounded-full" />
            <Link href="/collections/all" className="mx-4 text-xs font-bold text-purple-600 uppercase tracking-widest hover:underline flex-shrink-0">
              View All Categories
            </Link>
            <div className="h-0.5 flex-1 bg-gradient-to-l from-purple-600 to-transparent rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mixedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* === EXISTING: DREAM NOW PAY LATER BANNER === */}
        <section className="py-8 px-4 max-w-7xl mx-auto">
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{ background: "linear-gradient(135deg,#003B7E 0%,#1565C0 50%,#003B7E 100%)" }}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-blue-400/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="relative px-8 md:px-16 pt-12 pb-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10">
              <div className="text-white text-center md:text-left">
                <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-3">✨ Dream Now, Pay Later</p>
                <h2 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
                  Get the tech you love.<br />
                  <span className="text-blue-200">Pay in instalments.</span>
                </h2>
                <p className="text-blue-200/70 max-w-sm mx-auto md:mx-0 hidden sm:block">
                  Flexible payment options on all products. No hidden charges.
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-col items-center gap-3">
                <Link
                  href="/collections/all"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-10 py-5 rounded-2xl hover:bg-blue-50 transition-all shadow-2xl text-base hover:scale-105"
                >
                  Shop Now <ArrowRight size={18} />
                </Link>
                <p className="text-blue-300 text-xs">🔒 Authentic. Guaranteed.</p>
              </div>
            </div>

            <div className="relative px-8 md:px-16 py-8 grid grid-cols-2 md:grid-cols-3 gap-4">
              {SELLING_POINTS.map((pt) => (
                <div key={pt.label} className="flex items-center gap-3 group">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${pt.color} flex items-center justify-center text-lg flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    {pt.icon}
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold leading-tight">{pt.label}</p>
                    <p className="text-blue-200/70 text-xs leading-tight mt-0.5 hidden sm:block">{pt.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === RECENTLY VIEWED === */}
        <RecentlyViewed />

        {/* === EXISTING: BLOG PREVIEWS === */}
        <section className="py-14 px-4 max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={16} className="text-blue-500" />
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Our Blog</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Tech Insights & News</h2>
            </div>
            <Link href="/blog" className="flex items-center gap-1 text-sm text-blue-600 font-semibold hover:underline flex-shrink-0 mt-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {BLOG_PREVIEWS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                  <div className={`relative h-44 bg-gradient-to-br ${post.bg} overflow-hidden`}>
                    {post.image ? (
                      <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-10 text-8xl">{post.emoji}</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`${post.categoryColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-xs line-clamp-2 mb-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1.5"><Clock size={11} /> {post.readTime} min · {post.date}</span>
                      <span className="flex items-center gap-1"><Heart size={11} /> {post.likes}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* === FOOTER TRANSITION WITH VEHICLE/BICYCLE ANIMATION (RESTORED) === */}
        <div className="relative overflow-hidden" style={{ height: "100px", background: "#081530", borderTopLeftRadius: "28px", borderTopRightRadius: "28px" }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#0b1d3f 0%,#081530 55%,#040b1f 100%)" }} />

          <div className="absolute -top-12 left-1/5 w-44 h-44 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(96,165,250,0.10) 0%, transparent 70%)" }} />
          <div className="absolute -top-8 right-1/4 w-52 h-52 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)" }} />

          <div className="absolute pointer-events-none" style={{ top: "12px", left: "0", width: "70px", height: "14px", borderRadius: "999px", background: "rgba(255,255,255,0.04)", animation: "driftCloud 22s linear infinite" }} />
          <div className="absolute pointer-events-none" style={{ top: "28px", left: "0", width: "50px", height: "10px", borderRadius: "999px", background: "rgba(255,255,255,0.03)", animation: "driftCloud 28s linear infinite 6s" }} />

          <div className="absolute pointer-events-none" style={{ top: "14px", left: "12%", width: "3px", height: "3px", borderRadius: "50%", background: "rgba(255,255,255,0.4)", animation: "twinkle 3s ease-in-out infinite" }} />
          <div className="absolute pointer-events-none" style={{ top: "24px", left: "38%", width: "2px", height: "2px", borderRadius: "50%", background: "rgba(255,255,255,0.3)", animation: "twinkle 4s ease-in-out infinite 1s" }} />
          <div className="absolute pointer-events-none" style={{ top: "10px", left: "62%", width: "2.5px", height: "2.5px", borderRadius: "50%", background: "rgba(255,255,255,0.35)", animation: "twinkle 3.5s ease-in-out infinite 0.5s" }} />
          <div className="absolute pointer-events-none" style={{ top: "20px", left: "82%", width: "2px", height: "2px", borderRadius: "50%", background: "rgba(255,255,255,0.3)", animation: "twinkle 4.5s ease-in-out infinite 1.5s" }} />
          <div className="absolute pointer-events-none" style={{ top: "16px", left: "92%", width: "3px", height: "3px", borderRadius: "50%", background: "rgba(255,255,255,0.4)", animation: "twinkle 3s ease-in-out infinite 0.8s" }} />

          <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "18px", background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.2) 100%)" }} />

          <div className="absolute" style={{ bottom: "8px", animation: "convoyBike 13s linear infinite" }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", gap: "0px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginRight: "4px", marginBottom: "10px" }}>
                <div style={{ width: "2px", height: "28px", background: "#e2e8f0" }} />
                <div style={{
                  marginTop: "-28px",
                  marginLeft: "2px",
                  background: "linear-gradient(90deg,#1e40af,#3b82f6)",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  padding: "4px 9px",
                  borderRadius: "3px 4px 4px 3px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  letterSpacing: "0.03em",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                }}>💳 Pay Small Small</div>
              </div>
              <span style={{ fontSize: "46px", lineHeight: 1, display: "inline-block", transform: "scaleX(-1)" }}>🚲</span>
            </div>
          </div>

          <div className="absolute" style={{ bottom: "4px", animation: "convoyTruck 13s linear infinite", animationDelay: "3s" }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", gap: "0px" }}>
              <div style={{
                background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)",
                color: "#fff",
                fontSize: "12px",
                fontWeight: 800,
                whiteSpace: "nowrap",
                padding: "5px 11px",
                borderRadius: "6px 0 0 6px",
                border: "1px solid rgba(255,255,255,0.2)",
                marginRight: "-3px",
                marginBottom: "16px",
                letterSpacing: "0.02em",
                boxShadow: "0 3px 10px rgba(0,0,0,0.5)",
              }}>🚀 Free Ikeja Delivery</div>
              <span style={{ fontSize: "62px", lineHeight: 1, display: "inline-block", transform: "scaleX(-1)" }}>🚚</span>
            </div>
          </div>

          <style>{`
            @keyframes convoyBike {
              0%   { transform: translateX(-220px); }
              100% { transform: translateX(calc(100vw + 220px)); }
            }
            @keyframes convoyTruck {
              0%   { transform: translateX(-420px); }
              100% { transform: translateX(calc(100vw + 420px)); }
            }
            @keyframes twinkle {
              0%, 100% { opacity: 0.2; transform: scale(0.8); }
              50%      { opacity: 1;   transform: scale(1.3); }
            }
            @keyframes driftCloud {
              0%   { transform: translateX(-100px); }
              100% { transform: translateX(calc(100vw + 100px)); }
            }
          `}</style>
        </div>

        {/* === FOOTER === */}
        <footer className="relative" style={{ background: "#081530" }}>
          <div className="max-w-7xl mx-auto px-6 py-14">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1 lg:col-span-1">
                <Image src="/Dw_web_Logo.avif" alt="DreamWorks" width={120} height={40} className="mb-4 brightness-0 invert" />
                <p className="text-blue-200/60 text-xs leading-relaxed mb-4">
                  Your trusted destination for premium tech products since 2004.
                </p>
                <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
                  {SOCIAL_LINKS.map((social) => (
                    <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-transform hover:scale-110"
                      style={{ background: typeof social.bg === "string" && social.bg.includes("gradient") ? social.bg : social.bg }}>
                      <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={social.svgPath} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Shop */}
              <div>
                <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Shop</h4>
                <div className="space-y-2.5">
                  {[
                    { label: "Accessories", slug: "accessories" },
                    { label: "Apple Products", slug: "apple" },
                    { label: "Computing & Printing", slug: "computing-printing" },
                    { label: "Electronics", slug: "electronics" },
                    { label: "Enterprise & Security", slug: "enterprise" },
                    { label: "Mobile & Tablet", slug: "mobile-tablet" },
                    { label: "Power", slug: "power" },
                    { label: "Print & Supplies", slug: "print-supplies" },
                  ].map((cat) => (
                    <Link key={cat.slug} href={`/collections/${cat.slug}`}
                      className="block text-blue-200/60 text-xs hover:text-white transition-colors">{cat.label}</Link>
                  ))}
                </div>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Company</h4>
                <div className="space-y-2.5">
                  {[
                    { label: "About Us", href: "/about" },
                    { label: "Blog / News", href: "/blog" },
                    { label: "DreamPoints", href: "/dreampoints" },
                    { label: "Contact Us", href: "/contact" },
                  ].map((link) => (
                    <Link key={link.label} href={link.href} className="block text-blue-200/60 text-xs hover:text-white transition-colors">{link.label}</Link>
                  ))}
                </div>
              </div>

              {/* Policies */}
              <div>
                <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Policies</h4>
                <div className="space-y-2.5">
                  {[
                    { label: "Refund Policy", href: "/policies/refund" },
                    { label: "Privacy Policy", href: "/policies/privacy" },
                    { label: "Terms of Service", href: "/policies/terms" },
                    { label: "Shipping Policy", href: "/policies/shipping" },
                  ].map((link) => (
                    <Link key={link.label} href={link.href} className="block text-blue-200/60 text-xs hover:text-white transition-colors">{link.label}</Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Stay Updated</h4>
                <p className="text-blue-200/60 text-xs mb-3">Get the latest deals and tech news.</p>
                <div className="flex gap-2 w-full">
                  <input type="email" placeholder="Your email" className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex-shrink-0">→</button>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-white/5 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-blue-200/40 text-xs">© 2024 DreamWorks Direct. All rights reserved.</p>
              <div className="flex items-center gap-3">
                {["Visa", "Mastercard", "Verve", "Paystack"].map((method) => (
                  <span key={method} className="text-blue-200/30 text-[10px] font-semibold bg-white/5 px-2 py-1 rounded">{method}</span>
                ))}
              </div>
            </div>
          </div>
        </footer>

        {/* === FLOATING ELEMENTS (UNTOUCHED) === */}
        <FloatingElements />
      </div>
    </>
  );
}
