"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit3, Trash2, Image as ImageIcon, Save, X, Eye, EyeOff, Upload } from "lucide-react";

interface BlogPost {
    id?: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    thumbnail: string | null;
    category: string;
    author: string;
    published_at: string;
    read_time: number;
    is_published: boolean;
}

const CATEGORIES = ["Tech Tips", "Product News", "Deals", "HP Store", "World Cup", "Guides"];

const EMPTY_POST: BlogPost = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    thumbnail: null,
    category: "Product News",
    author: "Dreamworks Integrated Systems",
    published_at: new Date().toISOString().split("T")[0],
    read_time: 3,
    is_published: true,
};

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<BlogPost | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadPosts();
    }, []);

    async function loadPosts() {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/blog");
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (err) {
            console.error("Failed to load posts:", err);
        }
        setLoading(false);
    }

    function generateSlug(title: string) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    }

    function handleTitleChange(title: string) {
        if (!editing) return;
        const slug = editing.id ? editing.slug : generateSlug(title);
        setEditing({ ...editing, title, slug });
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || !editing) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/admin/blog/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.url) {
                setEditing({ ...editing, thumbnail: data.url });
                setMessage({ type: "success", text: "Image uploaded successfully!" });
            } else {
                setMessage({ type: "error", text: data.error || "Upload failed" });
            }
        } catch (err: any) {
            setMessage({ type: "error", text: "Upload failed: " + err.message });
        }
        setUploading(false);
        setTimeout(() => setMessage(null), 3000);
    }

    async function handleSave() {
        if (!editing || !editing.title) return;

        setSaving(true);
        try {
            const res = await fetch("/api/admin/blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editing),
            });
            const data = await res.json();

            if (data.post) {
                setMessage({ type: "success", text: editing.id ? "Post updated!" : "Post created!" });
                setEditing(null);
                loadPosts();
            } else {
                setMessage({ type: "error", text: data.error || "Save failed" });
            }
        } catch (err: any) {
            setMessage({ type: "error", text: "Save failed: " + err.message });
        }
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
    }

    async function handleDelete(post: BlogPost) {
        if (!post.id) return;
        if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;

        try {
            const res = await fetch("/api/admin/blog", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: post.id }),
            });
            const data = await res.json();

            if (data.success) {
                setMessage({ type: "success", text: "Post deleted!" });
                loadPosts();
            } else {
                setMessage({ type: "error", text: data.error || "Delete failed" });
            }
        } catch (err: any) {
            setMessage({ type: "error", text: "Delete failed: " + err.message });
        }
        setTimeout(() => setMessage(null), 3000);
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-blue-400">Blog Manager</h1>
                    <p className="text-gray-400 mt-1">Create, edit, and manage blog posts with images.</p>
                </div>
                {!editing && (
                    <button
                        onClick={() => setEditing({ ...EMPTY_POST })}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        <Plus size={18} />
                        New Post
                    </button>
                )}
            </div>

            {/* Message */}
            {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                    {message.text}
                </div>
            )}

            {/* Editor */}
            {editing && (
                <div className="bg-[#1a1f2e] border border-gray-700 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">
                            {editing.id ? "Edit Post" : "Create New Post"}
                        </h2>
                        <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={editing.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-[#0d1117] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter blog post title..."
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Slug (URL)</label>
                                <input
                                    type="text"
                                    value={editing.slug}
                                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                                    className="w-full px-3 py-2.5 bg-[#0d1117] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="auto-generated-from-title"
                                />
                            </div>

                            {/* Category & Read Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                    <select
                                        value={editing.category}
                                        onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-[#0d1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Read Time (min)</label>
                                    <input
                                        type="number"
                                        value={editing.read_time}
                                        onChange={(e) => setEditing({ ...editing, read_time: parseInt(e.target.value) || 3 })}
                                        className="w-full px-3 py-2.5 bg-[#0d1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                                        min={1}
                                        max={30}
                                    />
                                </div>
                            </div>

                            {/* Author & Date */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Author</label>
                                    <input
                                        type="text"
                                        value={editing.author}
                                        onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-[#0d1117] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Publish Date</label>
                                    <input
                                        type="date"
                                        value={editing.published_at}
                                        onChange={(e) => setEditing({ ...editing, published_at: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-[#0d1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Published toggle */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setEditing({ ...editing, is_published: !editing.is_published })}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${editing.is_published ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-gray-700/50 text-gray-400 border border-gray-600"}`}
                                >
                                    {editing.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                                    {editing.is_published ? "Published" : "Draft"}
                                </button>
                            </div>
                        </div>

                        {/* Right Column - Image & Excerpt */}
                        <div className="space-y-4">
                            {/* Thumbnail Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Thumbnail Image</label>
                                <div className="relative">
                                    {editing.thumbnail ? (
                                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-600">
                                            <img
                                                src={editing.thumbnail}
                                                alt="Thumbnail"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                onClick={() => setEditing({ ...editing, thumbnail: null })}
                                                className="absolute top-2 right-2 p-1.5 bg-red-600 rounded-full text-white hover:bg-red-700"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-colors"
                                        >
                                            {uploading ? (
                                                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
                                            ) : (
                                                <>
                                                    <Upload size={32} className="text-gray-500 mb-2" />
                                                    <p className="text-sm text-gray-400">Click to upload image</p>
                                                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP (max 5MB)</p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>
                                {/* Or paste URL */}
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        value={editing.thumbnail || ""}
                                        onChange={(e) => setEditing({ ...editing, thumbnail: e.target.value || null })}
                                        className="w-full px-3 py-2 bg-[#0d1117] border border-gray-600 rounded-lg text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                                        placeholder="Or paste image URL directly..."
                                    />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Excerpt (preview text)</label>
                                <textarea
                                    value={editing.excerpt}
                                    onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2.5 bg-[#0d1117] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Brief description shown on the blog listing page..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Full Content */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Full Content (Markdown supported)</label>
                        <textarea
                            value={editing.content}
                            onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                            rows={12}
                            className="w-full px-3 py-2.5 bg-[#0d1117] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 resize-y font-mono text-sm"
                            placeholder="Write your blog post content here. Markdown is supported..."
                        />
                    </div>

                    {/* Save Button */}
                    <div className="mt-6 flex items-center gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving || !editing.title}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                        >
                            <Save size={18} />
                            {saving ? "Saving..." : (editing.id ? "Update Post" : "Create Post")}
                        </button>
                        <button
                            onClick={() => setEditing(null)}
                            className="px-4 py-2.5 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Posts List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-20 bg-[#1a1f2e] border border-gray-700 rounded-xl">
                    <ImageIcon size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-300">No blog posts yet</h3>
                    <p className="text-gray-500 mt-1">Create your first blog post to get started.</p>
                    <p className="text-gray-600 text-sm mt-4">
                        Note: You need to create the &quot;blog_posts&quot; table in Supabase first.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="flex items-center gap-4 p-4 bg-[#1a1f2e] border border-gray-700 rounded-xl hover:border-gray-600 transition-colors"
                        >
                            {/* Thumbnail */}
                            <div className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-gray-800">
                                {post.thumbnail ? (
                                    <img src={post.thumbnail} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon size={20} className="text-gray-600" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-medium truncate">{post.title}</h3>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">{post.category}</span>
                                    <span>{post.published_at}</span>
                                    <span>{post.read_time} min read</span>
                                    <span className={post.is_published ? "text-green-400" : "text-yellow-400"}>
                                        {post.is_published ? "● Published" : "● Draft"}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditing({ ...post })}
                                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit3 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(post)}
                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
