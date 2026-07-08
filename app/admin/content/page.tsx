"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Palette, Image, Type, Save, Plus, Trash2, GripVertical,
    Eye, EyeOff, Layout, TrendingUp, Rocket, Search
} from "lucide-react";

interface HeroSlide {
    id: string;
    title: string;
    subtitle: string;
    cta_text: string;
    cta_link: string;
    bg_image: string;
    bg_video: string;
    is_active: boolean;
    order: number;
}

interface FeaturedProduct {
    id: string;
    product_name: string;
    slug: string;
    image_url: string;
    selling_price: number;
    is_active: boolean;
}

interface SectionItem {
    id: string;
    product_name: string;
    slug: string;
    image_url: string;
    selling_price: number;
}

interface SiteConfig {
    site_name: string;
    tagline: string;
    logo_url: string;
    primary_color: string;
    secondary_color: string;
    announcement_text: string;
    announcement_active: boolean;
    free_shipping_threshold: number;
    currency: string;
}

export default function ContentManagerPage() {
    const [activeTab, setActiveTab] = useState<"hero" | "featured" | "trending" | "launched" | "config">("hero");
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
    const [trendingProducts, setTrendingProducts] = useState<SectionItem[]>([]);
    const [launchedProducts, setLaunchedProducts] = useState<SectionItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SectionItem[]>([]);
    const [searching, setSearching] = useState(false);
    const [config, setConfig] = useState<SiteConfig>({
        site_name: "DreamWorks Direct",
        tagline: "Premium Tech & Gadgets",
        logo_url: "/Dw_web_Logo.avif",
        primary_color: "#003B7E",
        secondary_color: "#1565C0",
        announcement_text: "Get 10% OFF on all Laptops!",
        announcement_active: true,
        free_shipping_threshold: 100000,
        currency: "NGN",
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        loadContent();
    }, []);

    async function loadContent() {
        // Load hero slides
        const { data: heroData } = await supabase
            .from("site_content")
            .select("*")
            .eq("type", "hero_slide")
            .order("order", { ascending: true });

        if (heroData && heroData.length > 0) {
            setHeroSlides(heroData.map((d: any) => ({ ...d.content, id: d.id })));
        } else {
            setHeroSlides([
                { id: "1", title: "Oraimo Smart Accessories", subtitle: "Smart Life. Simplified.", cta_text: "Shop Oraimo", cta_link: "/brands/oraimo", bg_image: "/dw-oraimo.png", bg_video: "", is_active: true, order: 1 },
                { id: "2", title: "Samsung Galaxy Z Fold7", subtitle: "Unfold the future", cta_text: "Shop Samsung", cta_link: "/brands/samsung", bg_image: "", bg_video: "/Galaxy-Z-Fold7_Home_Hero_PC_1920x1080_LTR.mp4", is_active: true, order: 2 },
            ]);
        }

        // Load featured products
        const { data: featuredData } = await supabase
            .from("site_content")
            .select("*")
            .eq("type", "featured_product")
            .order("order", { ascending: true });

        if (featuredData && featuredData.length > 0) {
            setFeaturedProducts(featuredData.map((d: any) => ({ ...d.content, id: d.id })));
        }

        // Load trending
        const { data: trendingData } = await supabase
            .from("site_content")
            .select("*")
            .eq("type", "trending_product")
            .order("order", { ascending: true });

        if (trendingData && trendingData.length > 0) {
            setTrendingProducts(trendingData.map((d: any) => ({ ...d.content, id: d.id })));
        }

        // Load just launched
        const { data: launchedData } = await supabase
            .from("site_content")
            .select("*")
            .eq("type", "launched_product")
            .order("order", { ascending: true });

        if (launchedData && launchedData.length > 0) {
            setLaunchedProducts(launchedData.map((d: any) => ({ ...d.content, id: d.id })));
        }

        // Load config
        const { data: configData } = await supabase
            .from("site_content")
            .select("content")
            .eq("type", "site_config")
            .single();

        if (configData) {
            setConfig(configData.content as SiteConfig);
        }
    }

    async function searchProducts() {
        if (!searchQuery.trim()) return;
        setSearching(true);
        const { data } = await supabase
            .from("products")
            .select("id, product_name, slug, image_url, selling_price")
            .ilike("product_name", `%${searchQuery}%`)
            .limit(10);
        setSearchResults(data || []);
        setSearching(false);
    }

    async function saveContent() {
        setSaving(true);

        // Save hero slides
        for (const slide of heroSlides) {
            await supabase.from("site_content").upsert({
                id: slide.id,
                type: "hero_slide",
                content: slide,
                order: slide.order,
                updated_at: new Date().toISOString(),
            });
        }

        // Save featured products
        await supabase.from("site_content").delete().eq("type", "featured_product");
        for (let i = 0; i < featuredProducts.length; i++) {
            await supabase.from("site_content").insert({
                id: `featured_${Date.now()}_${i}`,
                type: "featured_product",
                content: featuredProducts[i],
                order: i,
                updated_at: new Date().toISOString(),
            });
        }

        // Save trending products
        await supabase.from("site_content").delete().eq("type", "trending_product");
        for (let i = 0; i < trendingProducts.length; i++) {
            await supabase.from("site_content").insert({
                id: `trending_${Date.now()}_${i}`,
                type: "trending_product",
                content: trendingProducts[i],
                order: i,
                updated_at: new Date().toISOString(),
            });
        }

        // Save just launched products
        await supabase.from("site_content").delete().eq("type", "launched_product");
        for (let i = 0; i < launchedProducts.length; i++) {
            await supabase.from("site_content").insert({
                id: `launched_${Date.now()}_${i}`,
                type: "launched_product",
                content: launchedProducts[i],
                order: i,
                updated_at: new Date().toISOString(),
            });
        }

        // Save config
        await supabase.from("site_content").upsert({
            id: "site_config",
            type: "site_config",
            content: config,
            updated_at: new Date().toISOString(),
        });

        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    function addHeroSlide() {
        const newSlide: HeroSlide = {
            id: `slide_${Date.now()}`,
            title: "New Slide",
            subtitle: "Add your subtitle here",
            cta_text: "Shop Now",
            cta_link: "/collections/all",
            bg_image: "",
            bg_video: "",
            is_active: true,
            order: heroSlides.length + 1,
        };
        setHeroSlides([...heroSlides, newSlide]);
    }

    function updateSlide(id: string, field: keyof HeroSlide, value: any) {
        setHeroSlides((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s));
    }

    function removeSlide(id: string) {
        if (!confirm("Remove this slide?")) return;
        setHeroSlides((prev) => prev.filter((s) => s.id !== id));
    }

    function addToSection(product: SectionItem, section: "featured" | "trending" | "launched") {
        if (section === "featured") {
            setFeaturedProducts([...featuredProducts, { ...product, is_active: true }]);
        } else if (section === "trending") {
            setTrendingProducts([...trendingProducts, product]);
        } else {
            setLaunchedProducts([...launchedProducts, product]);
        }
        setSearchResults([]);
        setSearchQuery("");
    }

    function removeFromSection(id: string, section: "featured" | "trending" | "launched") {
        if (section === "featured") {
            setFeaturedProducts(featuredProducts.filter((p) => p.id !== id));
        } else if (section === "trending") {
            setTrendingProducts(trendingProducts.filter((p) => p.id !== id));
        } else {
            setLaunchedProducts(launchedProducts.filter((p) => p.id !== id));
        }
    }

    function updateSectionItem(id: string, section: "featured" | "trending" | "launched", field: string, value: any) {
        if (section === "featured") {
            setFeaturedProducts(featuredProducts.map((p) => p.id === id ? { ...p, [field]: value } : p));
        } else if (section === "trending") {
            setTrendingProducts(trendingProducts.map((p) => p.id === id ? { ...p, [field]: value } : p));
        } else {
            setLaunchedProducts(launchedProducts.map((p) => p.id === id ? { ...p, [field]: value } : p));
        }
    }

    const tabs = [
        { id: "hero", label: "Hero Slides", icon: Image },
        { id: "featured", label: "Featured Strip", icon: Layout },
        { id: "trending", label: "Trending Now", icon: TrendingUp },
        { id: "launched", label: "Just Launched", icon: Rocket },
        { id: "config", label: "Site Config", icon: Palette },
    ];

    // Product search + list component for sections
    function ProductSectionEditor({ items, section, title, description }: { items: (SectionItem | FeaturedProduct)[]; section: "featured" | "trending" | "launched"; title: string; description: string }) {
        return (
            <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                    <p className="text-sm text-gray-500 mb-5">{description}</p>

                    {/* Search to add products */}
                    <div className="flex gap-2 mb-5">
                        <div className="flex-1 relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && searchProducts()}
                                placeholder="Search products to add..."
                                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={searchProducts}
                            disabled={searching}
                            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                        >
                            {searching ? "..." : "Search"}
                        </button>
                    </div>

                    {/* Search results */}
                    {searchResults.length > 0 && (
                        <div className="border border-blue-100 rounded-xl mb-5 max-h-[200px] overflow-y-auto">
                            {searchResults.map((product) => (
                                <div key={product.id} className="flex items-center justify-between p-3 hover:bg-blue-50 border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                                            <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-800 line-clamp-1">{product.product_name}</span>
                                    </div>
                                    <button
                                        onClick={() => addToSection(product, section)}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        + Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Current items - with inline editing */}
                    <div className="space-y-3">
                        {items.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                                <p className="text-sm text-gray-400">No products added yet. Search and add products above.</p>
                            </div>
                        ) : (
                            items.map((item, index) => (
                                <div key={item.id} className="bg-gray-50 rounded-xl p-4 hover:bg-blue-50/30 transition-colors border border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <GripVertical size={14} className="text-gray-300 cursor-grab" />
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">#{index + 1}</span>
                                            {'is_active' in item && (
                                                <button
                                                    onClick={() => updateSectionItem(item.id, section, 'is_active', !(item as FeaturedProduct).is_active)}
                                                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full transition-colors ${(item as FeaturedProduct).is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'}`}
                                                >
                                                    {(item as FeaturedProduct).is_active ? <Eye size={10} /> : <EyeOff size={10} />}
                                                    {(item as FeaturedProduct).is_active ? 'Live' : 'Hidden'}
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removeFromSection(item.id, section)}
                                            className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="flex gap-4">
                                        {/* Image preview + URL edit */}
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 mb-1.5">
                                                <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <input
                                                value={item.image_url}
                                                onChange={(e) => updateSectionItem(item.id, section, 'image_url', e.target.value)}
                                                placeholder="Image URL"
                                                className="w-16 text-[10px] text-gray-400 border-0 bg-transparent p-0 focus:outline-none truncate"
                                                title={item.image_url}
                                            />
                                        </div>
                                        {/* Editable fields */}
                                        <div className="flex-1 space-y-2">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">Product Name</label>
                                                <input
                                                    value={item.product_name}
                                                    onChange={(e) => updateSectionItem(item.id, section, 'product_name', e.target.value)}
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Slug</label>
                                                    <input
                                                        value={item.slug}
                                                        onChange={(e) => updateSectionItem(item.id, section, 'slug', e.target.value)}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase">Price (₦)</label>
                                                    <input
                                                        type="number"
                                                        value={item.selling_price}
                                                        onChange={(e) => updateSectionItem(item.id, section, 'selling_price', Number(e.target.value))}
                                                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Content Manager</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your homepage sections, hero slides, and site configuration</p>
                </div>
                <button
                    onClick={saveContent}
                    disabled={saving}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${saved ? "bg-emerald-600 text-white" : "bg-blue-700 hover:bg-blue-800 text-white"
                        } disabled:opacity-50`}
                >
                    <Save size={16} /> {saving ? "Saving..." : saved ? "Saved!" : "Save & Go Live"}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <Icon size={16} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Hero Slides Tab */}
            {activeTab === "hero" && (
                <div className="space-y-4">
                    {heroSlides.map((slide, index) => (
                        <div key={slide.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <GripVertical size={16} className="text-gray-300 cursor-grab" />
                                    <span className="text-xs font-bold text-gray-400 uppercase">Slide {index + 1}</span>
                                    <button
                                        onClick={() => updateSlide(slide.id, "is_active", !slide.is_active)}
                                        className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${slide.is_active ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}
                                    >
                                        {slide.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                                        {slide.is_active ? "Active" : "Hidden"}
                                    </button>
                                </div>
                                <button onClick={() => removeSlide(slide.id)} className="text-red-400 hover:text-red-600 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Title</label>
                                    <input value={slide.title} onChange={(e) => updateSlide(slide.id, "title", e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Subtitle</label>
                                    <input value={slide.subtitle} onChange={(e) => updateSlide(slide.id, "subtitle", e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">CTA Text</label>
                                    <input value={slide.cta_text} onChange={(e) => updateSlide(slide.id, "cta_text", e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">CTA Link</label>
                                    <input value={slide.cta_link} onChange={(e) => updateSlide(slide.id, "cta_link", e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Background Image URL</label>
                                    <input value={slide.bg_image} onChange={(e) => updateSlide(slide.id, "bg_image", e.target.value)} placeholder="https://... or /path/to/image.png" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Background Video URL</label>
                                    <input value={slide.bg_video} onChange={(e) => updateSlide(slide.id, "bg_video", e.target.value)} placeholder="https://... or /path/to/video.mp4" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            {/* Preview */}
                            {(slide.bg_image || slide.bg_video) && (
                                <div className="mt-4 rounded-xl overflow-hidden h-32 bg-gray-900 relative">
                                    {slide.bg_video ? (
                                        <video src={slide.bg_video} className="w-full h-full object-cover" muted autoPlay loop />
                                    ) : (
                                        <img src={slide.bg_image} alt="" className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <p className="font-bold text-lg">{slide.title}</p>
                                            <p className="text-sm opacity-80">{slide.subtitle}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <button onClick={addHeroSlide} className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
                        <Plus size={20} className="mx-auto text-gray-400 group-hover:text-blue-500 mb-2" />
                        <p className="text-sm font-semibold text-gray-500 group-hover:text-blue-600">Add New Slide</p>
                    </button>
                </div>
            )}

            {/* Featured Strip Tab */}
            {activeTab === "featured" && (
                <ProductSectionEditor
                    items={featuredProducts}
                    section="featured"
                    title="Featured Products Strip"
                    description="These products display in the scrolling strip below the hero. If empty, the system auto-selects from your catalog."
                />
            )}

            {/* Trending Now Tab */}
            {activeTab === "trending" && (
                <ProductSectionEditor
                    items={trendingProducts}
                    section="trending"
                    title="Trending Now Section"
                    description="Products shown in the Trending Now section. If empty, the system auto-selects based on recent sales."
                />
            )}

            {/* Just Launched Tab */}
            {activeTab === "launched" && (
                <ProductSectionEditor
                    items={launchedProducts}
                    section="launched"
                    title="Just Launched Section"
                    description="Products shown in the Just Launched section. If empty, the system shows the newest products."
                />
            )}

            {/* Site Config Tab */}
            {activeTab === "config" && (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Brand Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Site Name</label>
                                <input value={config.site_name} onChange={(e) => setConfig({ ...config, site_name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Tagline</label>
                                <input value={config.tagline} onChange={(e) => setConfig({ ...config, tagline: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Primary Color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={config.primary_color} onChange={(e) => setConfig({ ...config, primary_color: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200" />
                                    <input value={config.primary_color} onChange={(e) => setConfig({ ...config, primary_color: e.target.value })} className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Secondary Color</label>
                                <div className="flex items-center gap-3">
                                    <input type="color" value={config.secondary_color} onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200" />
                                    <input value={config.secondary_color} onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })} className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Free Shipping Threshold (₦)</label>
                                <input type="number" value={config.free_shipping_threshold} onChange={(e) => setConfig({ ...config, free_shipping_threshold: Number(e.target.value) })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Announcement Text</label>
                                <input value={config.announcement_text} onChange={(e) => setConfig({ ...config, announcement_text: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
