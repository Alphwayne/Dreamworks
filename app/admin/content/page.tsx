"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Palette, Image, Type, Save, Plus, Trash2, GripVertical,
    Eye, EyeOff, ChevronDown, ChevronUp, Upload, Link2, X
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

interface Banner {
    id: string;
    type: "announcement" | "promo" | "info";
    text: string;
    link: string;
    bg_color: string;
    text_color: string;
    is_active: boolean;
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
    const [activeTab, setActiveTab] = useState<"hero" | "banners" | "config">("hero");
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);
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
        // Load from site_content table (or fallback to defaults)
        const { data: heroData } = await supabase
            .from("site_content")
            .select("*")
            .eq("type", "hero_slide")
            .order("order", { ascending: true });

        if (heroData && heroData.length > 0) {
            setHeroSlides(heroData.map((d: any) => ({ ...d.content, id: d.id })));
        } else {
            // Default slides
            setHeroSlides([
                { id: "1", title: "Oraimo Smart Accessories", subtitle: "Smart Life. Simplified.", cta_text: "Shop Oraimo", cta_link: "/brands/oraimo", bg_image: "/dw-oraimo.png", bg_video: "", is_active: true, order: 1 },
                { id: "2", title: "Samsung Galaxy Z Fold7", subtitle: "Unfold the future", cta_text: "Shop Samsung", cta_link: "/brands/samsung", bg_image: "", bg_video: "/Galaxy-Z-Fold7_Home_Hero_PC_1920x1080_LTR.mp4", is_active: true, order: 2 },
            ]);
        }

        const { data: configData } = await supabase
            .from("site_content")
            .select("content")
            .eq("type", "site_config")
            .single();

        if (configData) {
            setConfig(configData.content as SiteConfig);
        }
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

    const tabs = [
        { id: "hero", label: "Hero Slides", icon: Image },
        { id: "banners", label: "Banners & Promos", icon: Type },
        { id: "config", label: "Site Config", icon: Palette },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Content Manager</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage your homepage content, banners, and site configuration</p>
                </div>
                <button
                    onClick={saveContent}
                    disabled={saving}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${saved ? "bg-emerald-600 text-white" : "bg-blue-700 hover:bg-blue-800 text-white"
                        } disabled:opacity-50`}
                >
                    <Save size={16} /> {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 w-fit">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
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
                                        className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${slide.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                                            }`}
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
                                    <input
                                        value={slide.title}
                                        onChange={(e) => updateSlide(slide.id, "title", e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Subtitle</label>
                                    <input
                                        value={slide.subtitle}
                                        onChange={(e) => updateSlide(slide.id, "subtitle", e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">CTA Text</label>
                                    <input
                                        value={slide.cta_text}
                                        onChange={(e) => updateSlide(slide.id, "cta_text", e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">CTA Link</label>
                                    <input
                                        value={slide.cta_link}
                                        onChange={(e) => updateSlide(slide.id, "cta_link", e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Background Image URL</label>
                                    <input
                                        value={slide.bg_image}
                                        onChange={(e) => updateSlide(slide.id, "bg_image", e.target.value)}
                                        placeholder="https://... or /path/to/image.png"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Background Video URL</label>
                                    <input
                                        value={slide.bg_video}
                                        onChange={(e) => updateSlide(slide.id, "bg_video", e.target.value)}
                                        placeholder="https://... or /path/to/video.mp4"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addHeroSlide}
                        className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                    >
                        <Plus size={20} className="mx-auto text-gray-400 group-hover:text-blue-500 mb-2" />
                        <p className="text-sm font-semibold text-gray-500 group-hover:text-blue-600">Add New Slide</p>
                    </button>
                </div>
            )}

            {/* Banners Tab */}
            {activeTab === "banners" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Announcement Bar</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.announcement_active}
                                    onChange={(e) => setConfig({ ...config, announcement_active: e.target.checked })}
                                    className="accent-blue-600 w-4 h-4"
                                />
                                <span className="text-sm font-medium text-gray-700">Show announcement bar</span>
                            </label>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Announcement Text</label>
                            <input
                                value={config.announcement_text}
                                onChange={(e) => setConfig({ ...config, announcement_text: e.target.value })}
                                placeholder="e.g., Get 10% OFF on all Laptops!"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                            <p className="text-xs text-blue-700 font-medium">Preview:</p>
                            <div className="mt-2 bg-white rounded-lg px-4 py-2 text-center text-sm font-semibold text-blue-700 border border-blue-200">
                                ✨ {config.announcement_text}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Site Config Tab */}
            {activeTab === "config" && (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Brand Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Site Name</label>
                                <input
                                    value={config.site_name}
                                    onChange={(e) => setConfig({ ...config, site_name: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Tagline</label>
                                <input
                                    value={config.tagline}
                                    onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Primary Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={config.primary_color}
                                        onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                                        className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
                                    />
                                    <input
                                        value={config.primary_color}
                                        onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Secondary Color</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={config.secondary_color}
                                        onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                                        className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
                                    />
                                    <input
                                        value={config.secondary_color}
                                        onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Free Shipping Threshold (₦)</label>
                                <input
                                    type="number"
                                    value={config.free_shipping_threshold}
                                    onChange={(e) => setConfig({ ...config, free_shipping_threshold: Number(e.target.value) })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Currency</label>
                                <select
                                    value={config.currency}
                                    onChange={(e) => setConfig({ ...config, currency: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="NGN">NGN (₦)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="EUR">EUR (€)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
