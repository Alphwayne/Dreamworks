"use client";

import { useEffect, useState, useRef } from "react";
import {
    Palette, Image, Type, Save, Plus, Trash2, GripVertical,
    Eye, EyeOff, Layout, TrendingUp, Rocket, Search, RefreshCw,
    ArrowUp, ArrowDown, Replace, Package
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
    const [loading, setLoading] = useState(true);
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
    const [dragItem, setDragItem] = useState<number | null>(null);

    useEffect(() => {
        loadContent();
    }, []);

    async function loadContent() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/content");
            const data = await res.json();

            if (data.heroSlides) setHeroSlides(data.heroSlides);
            if (data.featuredProducts) setFeaturedProducts(data.featuredProducts);
            if (data.trendingProducts) setTrendingProducts(data.trendingProducts);
            if (data.launchedProducts) setLaunchedProducts(data.launchedProducts);
            if (data.config) setConfig(data.config);
        } catch (err) {
            console.error("Failed to load content:", err);
        }
        setLoading(false);
    }

    async function searchProducts() {
        if (!searchQuery.trim()) return;
        setSearching(true);
        try {
            const res = await fetch(`/api/admin/content/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            setSearchResults(data.products || []);
        } catch (err) {
            console.error("Search failed:", err);
            setSearchResults([]);
        }
        setSearching(false);
    }

    async function saveContent() {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    heroSlides,
                    featuredProducts,
                    trendingProducts,
                    launchedProducts,
                    config,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                alert("Save failed: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            console.error("Save failed:", err);
            alert("Save failed. Check console for details.");
        }
        setSaving(false);
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

    function moveItem(index: number, direction: "up" | "down", section: "featured" | "trending" | "launched") {
        const getItems = () => {
            if (section === "featured") return [...featuredProducts];
            if (section === "trending") return [...trendingProducts];
            return [...launchedProducts];
        };
        const setItems = (items: any[]) => {
            if (section === "featured") setFeaturedProducts(items);
            else if (section === "trending") setTrendingProducts(items);
            else setLaunchedProducts(items);
        };

        const items = getItems();
        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= items.length) return;

        const temp = items[index];
        items[index] = items[newIndex];
        items[newIndex] = temp;
        setItems(items);
    }

    function handleDragStart(index: number) {
        setDragItem(index);
    }

    function handleDragOver(e: React.DragEvent, index: number, section: "featured" | "trending" | "launched") {
        e.preventDefault();
        if (dragItem === null || dragItem === index) return;

        const getItems = () => {
            if (section === "featured") return [...featuredProducts];
            if (section === "trending") return [...trendingProducts];
            return [...launchedProducts];
        };
        const setItems = (items: any[]) => {
            if (section === "featured") setFeaturedProducts(items);
            else if (section === "trending") setTrendingProducts(items);
            else setLaunchedProducts(items);
        };

        const items = getItems();
        const draggedItem = items[dragItem];
        items.splice(dragItem, 1);
        items.splice(index, 0, draggedItem);
        setItems(items);
        setDragItem(index);
    }

    function handleDragEnd() {
        setDragItem(null);
    }

    const tabs = [
        { id: "hero", label: "Hero Slides", icon: Image },
        { id: "featured", label: "Featured Strip", icon: Layout },
        { id: "trending", label: "Trending Now", icon: TrendingUp },
        { id: "launched", label: "Just Launched", icon: Rocket },
        { id: "config", label: "Site Config", icon: Palette },
    ];

    function formatPrice(price: number) {
        return "₦" + (price || 0).toLocaleString();
    }

    // Product section editor with visual cards, drag-drop, and inline editing
    function ProductSectionEditor({ items, section, title, description }: { items: (SectionItem | FeaturedProduct)[]; section: "featured" | "trending" | "launched"; title: string; description: string }) {
        return (
            <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900">{title}</h3>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                            {items.length} items
                        </span>
                    </div>
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

                    {/* Search results dropdown */}
                    {searchResults.length > 0 && (
                        <div className="border border-blue-100 rounded-xl mb-5 max-h-[200px] overflow-y-auto bg-white shadow-lg">
                            {searchResults.map((product) => (
                                <div key={product.id} className="flex items-center justify-between p-3 hover:bg-blue-50 border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            {product.image_url && <img src={product.image_url} alt="" className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-800 line-clamp-1">{product.product_name}</span>
                                            <span className="text-xs text-gray-400 block">{formatPrice(product.selling_price)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => addToSection(product, section)}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex-shrink-0"
                                    >
                                        + Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Current items - visual grid with drag-drop */}
                    {items.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                            <Package size={32} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-sm text-gray-400 font-medium">No products in this section yet.</p>
                            <p className="text-xs text-gray-300 mt-1">Search and add products above, or they&apos;ll auto-populate from your catalog.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index, section)}
                                    onDragEnd={handleDragEnd}
                                    className={`relative bg-white rounded-xl border transition-all cursor-grab active:cursor-grabbing ${dragItem === index ? "border-blue-400 shadow-lg scale-[1.02] opacity-80" : "border-gray-100 hover:border-blue-200 hover:shadow-md"}`}
                                >
                                    {/* Position badge */}
                                    <div className="absolute top-2 left-2 z-10 bg-gray-900/80 text-white text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center">
                                        #{index + 1}
                                    </div>

                                    {/* Move buttons */}
                                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                                        <button
                                            onClick={() => moveItem(index, "up", section)}
                                            disabled={index === 0}
                                            className="w-6 h-6 bg-white/90 border border-gray-200 rounded-md flex items-center justify-center hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <ArrowUp size={10} />
                                        </button>
                                        <button
                                            onClick={() => moveItem(index, "down", section)}
                                            disabled={index === items.length - 1}
                                            className="w-6 h-6 bg-white/90 border border-gray-200 rounded-md flex items-center justify-center hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <ArrowDown size={10} />
                                        </button>
                                        <button
                                            onClick={() => removeFromSection(item.id, section)}
                                            className="w-6 h-6 bg-red-50 border border-red-200 rounded-md flex items-center justify-center hover:bg-red-100 text-red-500"
                                        >
                                            <Trash2 size={10} />
                                        </button>
                                    </div>

                                    {/* Product image */}
                                    <div className="h-32 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-t-xl overflow-hidden flex items-center justify-center p-3">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.product_name} className="max-h-full max-w-full object-contain" />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <Package size={24} className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Product info */}
                                    <div className="p-3 border-t border-gray-50">
                                        <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight min-h-[32px]">
                                            {item.product_name}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm font-bold text-blue-700">{formatPrice(item.selling_price)}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">{item.slug?.slice(0, 15)}...</span>
                                        </div>
                                        {'is_active' in item && (
                                            <div className="mt-2">
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${(item as FeaturedProduct).is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {(item as FeaturedProduct).is_active ? <Eye size={8} /> : <EyeOff size={8} />}
                                                    {(item as FeaturedProduct).is_active ? 'Live' : 'Hidden'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Drag handle indicator */}
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5 opacity-30">
                                        <div className="w-1 h-1 rounded-full bg-gray-400" />
                                        <div className="w-1 h-1 rounded-full bg-gray-400" />
                                        <div className="w-1 h-1 rounded-full bg-gray-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Info bar */}
                    {items.length > 0 && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                            <GripVertical size={12} />
                            <span>Drag cards to reorder • Use arrows to move • Click trash to remove</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <RefreshCw size={24} className="mx-auto text-blue-500 animate-spin mb-3" />
                    <p className="text-sm text-gray-500">Loading content...</p>
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
                    description="These products display in the scrolling strip below the hero. Drag to reorder, remove what you don't want, or search to add new ones."
                />
            )}

            {/* Trending Now Tab */}
            {activeTab === "trending" && (
                <ProductSectionEditor
                    items={trendingProducts}
                    section="trending"
                    title="Trending Now Section"
                    description="Products shown in the Trending Now carousel. Drag to reorder priority. If you remove all, the system auto-selects based on price."
                />
            )}

            {/* Just Launched Tab */}
            {activeTab === "launched" && (
                <ProductSectionEditor
                    items={launchedProducts}
                    section="launched"
                    title="Just Launched Section"
                    description="Products shown in the Just Launched section. Drag to reorder. If empty, the system shows the newest products."
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
