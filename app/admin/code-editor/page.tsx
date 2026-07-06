"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
    Code2, Save, FileText, FolderOpen, ChevronRight, RefreshCw,
    Terminal, Eye, Crown, AlertTriangle, Check, X, Search
} from "lucide-react";

interface EditableFile {
    id: string;
    name: string;
    path: string;
    content: string;
    language: string;
    category: string;
    description: string;
}

// These are the files that can be edited through the admin interface
// They are stored in Supabase as editable_files
const DEFAULT_EDITABLE_FILES: EditableFile[] = [
    {
        id: "hero-config",
        name: "Hero Configuration",
        path: "config/hero.json",
        content: JSON.stringify({
            slides: [
                { title: "Oraimo Smart Accessories", subtitle: "Smart Life. Simplified.", cta: "Shop Oraimo", link: "/brands/oraimo", media: "/dw-oraimo.png", type: "image" },
                { title: "Samsung Galaxy Z Fold7", subtitle: "Unfold the future", cta: "Shop Samsung", link: "/brands/samsung", media: "/Galaxy-Z-Fold7_Home_Hero_PC_1920x1080_LTR.mp4", type: "video" },
            ],
            autoplay: true,
            interval: 6000,
        }, null, 2),
        language: "json",
        category: "Configuration",
        description: "Hero slider configuration - slides, autoplay settings",
    },
    {
        id: "brand-config",
        name: "Brand Strip Configuration",
        path: "config/brands.json",
        content: JSON.stringify({
            title: "OFFICIAL PARTNERS",
            subtitle: "Premium Brands",
            description: "Every product — authentic & verified",
            brands: ["HP", "Samsung", "LG", "Apple", "Dell", "Sony", "Lenovo", "Asus"],
        }, null, 2),
        language: "json",
        category: "Configuration",
        description: "Brand strip display configuration",
    },
    {
        id: "theme-vars",
        name: "Theme Variables",
        path: "config/theme.css",
        content: `:root {
  /* Primary Colors */
  --color-primary: #003B7E;
  --color-primary-light: #1565C0;
  --color-primary-dark: #002855;

  /* Accent Colors */
  --color-accent: #2563eb;
  --color-accent-light: #60a5fa;

  /* Background */
  --bg-gradient-start: #eef2ff;
  --bg-gradient-mid: #f8faff;
  --bg-gradient-end: #f0f7ff;

  /* Cards */
  --card-radius: 1rem;
  --card-shadow: 0 1px 3px rgba(0,0,0,0.05);
  --card-border: #f3f4f6;

  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-size-base: 14px;
  --font-weight-heading: 700;

  /* Spacing */
  --section-padding: 3rem 1rem;
  --max-width: 80rem;
}`,
        language: "css",
        category: "Styling",
        description: "Global CSS variables for theming",
    },
    {
        id: "footer-config",
        name: "Footer Configuration",
        path: "config/footer.json",
        content: JSON.stringify({
            company_name: "DreamWorks Direct",
            tagline: "Your trusted destination for premium tech products.",
            columns: [
                { title: "SHOP", links: [{ label: "All Products", href: "/collections/all" }, { label: "Laptops", href: "/collections/computing-accessories" }, { label: "Accessories", href: "/collections/accessories" }] },
                { title: "CUSTOMER CARE", links: [{ label: "Contact Us", href: "/contact" }, { label: "Track Order", href: "/account" }, { label: "Returns & Refunds", href: "/policies/refund" }] },
                { title: "COMPANY", links: [{ label: "About Us", href: "/about" }, { label: "Careers", href: "/about" }, { label: "Blog", href: "/blog" }] },
            ],
            social: [
                { name: "Facebook", url: "https://facebook.com/dreamworksnig" },
                { name: "Instagram", url: "https://instagram.com/dreamworksnig" },
                { name: "X", url: "https://x.com/dreamworksnig" },
                { name: "TikTok", url: "https://tiktok.com/@dreamworksnig" },
            ],
            payment_methods: ["Visa", "Mastercard", "Paystack", "Bank Transfer"],
        }, null, 2),
        language: "json",
        category: "Configuration",
        description: "Footer links, social media, payment methods",
    },
    {
        id: "seo-config",
        name: "SEO & Meta Configuration",
        path: "config/seo.json",
        content: JSON.stringify({
            default_title: "DreamWorks Direct - Premium Tech & Gadgets",
            default_description: "Shop the best electronics, computing accessories, and smart gadgets at DreamWorks Direct. Authentic products with warranty.",
            og_image: "/Dw_web_Logo.avif",
            keywords: ["electronics", "laptops", "gadgets", "Nigeria", "tech store", "DreamWorks"],
            robots: "index, follow",
            sitemap_enabled: true,
        }, null, 2),
        language: "json",
        category: "SEO",
        description: "SEO meta tags, Open Graph, and sitemap settings",
    },
    {
        id: "shipping-config",
        name: "Shipping & Delivery",
        path: "config/shipping.json",
        content: JSON.stringify({
            zones: [
                { name: "Lagos", fee: 3000, delivery_days: "1-2" },
                { name: "Abuja", fee: 5000, delivery_days: "2-3" },
                { name: "Port Harcourt", fee: 5000, delivery_days: "2-4" },
                { name: "Other States", fee: 7000, delivery_days: "3-5" },
            ],
            free_shipping_threshold: 100000,
            express_multiplier: 1.5,
        }, null, 2),
        language: "json",
        category: "Configuration",
        description: "Shipping zones, fees, and delivery estimates",
    },
];

export default function CodeEditorPage() {
    const [files, setFiles] = useState<EditableFile[]>(DEFAULT_EDITABLE_FILES);
    const [activeFile, setActiveFile] = useState<EditableFile | null>(DEFAULT_EDITABLE_FILES[0]);
    const [editedContent, setEditedContent] = useState(DEFAULT_EDITABLE_FILES[0]?.content || "");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        loadFiles();
    }, []);

    async function loadFiles() {
        const { data } = await supabase
            .from("editable_files")
            .select("*")
            .order("category", { ascending: true });

        if (data && data.length > 0) {
            const loaded = data.map((d: any) => ({
                id: d.id,
                name: d.name,
                path: d.path,
                content: d.content,
                language: d.language,
                category: d.category,
                description: d.description,
            }));
            setFiles(loaded);
            setActiveFile(loaded[0]);
            setEditedContent(loaded[0].content);
        }
    }

    function selectFile(file: EditableFile) {
        setActiveFile(file);
        setEditedContent(file.content);
        setSaved(false);
    }

    async function saveFile() {
        if (!activeFile) return;
        setSaving(true);

        // Validate JSON if applicable
        if (activeFile.language === "json") {
            try {
                JSON.parse(editedContent);
            } catch {
                alert("Invalid JSON! Please fix the syntax before saving.");
                setSaving(false);
                return;
            }
        }

        // Save to Supabase
        await supabase.from("editable_files").upsert({
            id: activeFile.id,
            name: activeFile.name,
            path: activeFile.path,
            content: editedContent,
            language: activeFile.language,
            category: activeFile.category,
            description: activeFile.description,
            updated_at: new Date().toISOString(),
        });

        // Update local state
        setFiles((prev) => prev.map((f) => f.id === activeFile.id ? { ...f, content: editedContent } : f));
        setActiveFile({ ...activeFile, content: editedContent });

        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        // Ctrl+S to save
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault();
            saveFile();
        }
        // Tab to indent
        if (e.key === "Tab") {
            e.preventDefault();
            const textarea = textareaRef.current;
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const newContent = editedContent.substring(0, start) + "  " + editedContent.substring(end);
                setEditedContent(newContent);
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + 2;
                }, 0);
            }
        }
    }

    const categories = [...new Set(files.map((f) => f.category))];
    const filteredFiles = files.filter((f) =>
        !searchTerm || f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.path.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lineCount = editedContent.split("\n").length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Crown size={20} className="text-amber-500" /> Code Editor
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">Oracle-level access: Edit site configuration and styling directly</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${showPreview ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        <Eye size={14} /> Preview
                    </button>
                    <button
                        onClick={saveFile}
                        disabled={saving || !activeFile}
                        className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all ${saved ? "bg-emerald-600 text-white" : "bg-blue-700 hover:bg-blue-800 text-white"
                            } disabled:opacity-50`}
                    >
                        {saved ? <Check size={14} /> : <Save size={14} />}
                        {saving ? "Saving..." : saved ? "Saved!" : "Save (Ctrl+S)"}
                    </button>
                </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-amber-800">Oracle Access Only</p>
                    <p className="text-xs text-amber-600 mt-0.5">Changes made here directly affect the live site. Please review carefully before saving.</p>
                </div>
            </div>

            {/* Editor Layout */}
            <div className="flex gap-4 h-[calc(100vh-280px)]">
                {/* File Explorer */}
                <div className="w-72 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col flex-shrink-0">
                    <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search files..."
                                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        {categories.map((cat) => (
                            <div key={cat} className="mb-3">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">{cat}</p>
                                {filteredFiles.filter((f) => f.category === cat).map((file) => (
                                    <button
                                        key={file.id}
                                        onClick={() => selectFile(file)}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${activeFile?.id === file.id
                                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                                            : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <FileText size={14} className={activeFile?.id === file.id ? "text-blue-500" : "text-gray-400"} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold truncate">{file.name}</p>
                                            <p className="text-[10px] text-gray-400 truncate">{file.path}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Code Editor */}
                <div className="flex-1 bg-[#1e1e2e] rounded-2xl overflow-hidden shadow-sm flex flex-col">
                    {/* Editor Header */}
                    {activeFile && (
                        <div className="flex items-center justify-between px-4 py-2.5 bg-[#181825] border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <Code2 size={14} className="text-blue-400" />
                                <span className="text-xs text-white/70 font-medium">{activeFile.path}</span>
                                <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded">{activeFile.language}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] text-white/30">{lineCount} lines</span>
                                {editedContent !== activeFile.content && (
                                    <span className="text-[10px] text-amber-400 font-semibold">● Modified</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Editor Body */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* Line Numbers */}
                        <div className="w-12 bg-[#181825] border-r border-white/5 py-4 text-right pr-3 overflow-hidden select-none">
                            {Array.from({ length: lineCount }, (_, i) => (
                                <div key={i} className="text-[11px] text-white/20 leading-[1.6rem] font-mono">{i + 1}</div>
                            ))}
                        </div>

                        {/* Textarea */}
                        <textarea
                            ref={textareaRef}
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            onKeyDown={handleKeyDown}
                            spellCheck={false}
                            className="flex-1 bg-transparent text-white/90 font-mono text-[13px] leading-[1.6rem] p-4 resize-none focus:outline-none overflow-auto"
                            style={{ tabSize: 2 }}
                        />
                    </div>

                    {/* Editor Footer */}
                    <div className="px-4 py-2 bg-[#181825] border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] text-white/30 flex items-center gap-1">
                                <Terminal size={10} /> {activeFile?.language.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-white/30">UTF-8</span>
                        </div>
                        <p className="text-[10px] text-white/20">Ctrl+S to save · Tab to indent</p>
                    </div>
                </div>

                {/* Preview Panel */}
                {showPreview && activeFile?.language === "json" && (
                    <div className="w-80 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col flex-shrink-0">
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                            <Eye size={14} className="text-purple-500" />
                            <span className="text-xs font-bold text-gray-700">Preview</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                                {(() => {
                                    try {
                                        return JSON.stringify(JSON.parse(editedContent), null, 2);
                                    } catch {
                                        return "⚠️ Invalid JSON";
                                    }
                                })()}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
