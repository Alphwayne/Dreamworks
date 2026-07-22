"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ChevronRight, Star, Truck, RefreshCw, Shield, Phone } from "lucide-react";
import { Header } from "@/components/Header";

import { FloatingElements } from "@/components/FloatingElements";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
import { QuickBuyBar } from "@/components/QuickBuyBar";
import { ShakeToast } from "@/components/ShakeToast";
import { useShakeToCompare } from "@/hooks/useShakeToCompare";
import { useRecentlyViewedStore } from "@/store/recentlyViewedStore";
// Uses API route instead of direct Supabase calls
import { useCartStore } from "@/store/cartStore";
import { Product, Inventory, formatPrice, formatDiscount, getProductImage, CATEGORY_MAP } from "@/lib/types";

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [inventory, setInventory] = useState<Inventory | null>(null);
    const [related, setRelated] = useState<Product[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);

    const addItem = useCartStore((s) => s.addItem);

    const addRecentlyViewed = useRecentlyViewedStore((s) => s.addItem);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const res = await fetch(`/api/products/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.product) {
                        setProduct(data.product);
                        setInventory(data.inventory);
                        setRelated(data.related || []);
                        // Track recently viewed
                        addRecentlyViewed(data.product);
                    }
                }
            } catch (err) {
                console.error("Failed to load product:", err);
            }
            setLoading(false);
        }
        load();
    }, [slug, addRecentlyViewed]);

    // Shake to compare (mobile)
    const { shakeDetected, isComparing } = useShakeToCompare({
        product: product || { id: 0, item_code: "", product_name: "", category: "", selling_price: 0, compare_price: null, slug: "", image_url: null, description: null, is_active: true, created_at: "" },
        enabled: !!product,
    });

    const handleAddToCart = () => {
        if (!product) return;
        addItem(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="aspect-square bg-gray-200 rounded-2xl" />
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                            <div className="h-8 bg-gray-200 rounded w-3/4" />
                            <div className="h-6 bg-gray-200 rounded w-1/3" />
                            <div className="h-12 bg-gray-200 rounded" />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <p className="text-gray-500 text-lg mb-4">Product not found</p>
                    <Link href="/" className="text-blue-600 font-semibold hover:underline">Back to home</Link>
                </div>
            </>
        );
    }

    const discount = formatDiscount(product.selling_price, product.compare_price);
    const image = getProductImage(product);
    const categoryInfo = CATEGORY_MAP[product.category];
    const isInStock = !inventory || (inventory.available ?? 0) > 0;

    return (
        <>
            <CartDrawer />
            <div className="min-h-screen bg-gray-50">
                <Header />

                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <ChevronRight size={14} />
                        {categoryInfo && (
                            <>
                                <Link href={`/collections/${categoryInfo.slug}`} className="hover:text-blue-600">
                                    {categoryInfo.label}
                                </Link>
                                <ChevronRight size={14} />
                            </>
                        )}
                        <span className="text-gray-900 font-medium line-clamp-1">{product.product_name}</span>
                    </nav>

                    {/* Main content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl p-6 border border-gray-100">
                        {/* Image */}
                        <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden">
                            <Image
                                src={image}
                                alt={product.product_name}
                                fill
                                className="object-contain p-8"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                            {discount && (
                                <span className="absolute top-4 left-4 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                                    {discount}% OFF
                                </span>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex flex-col">
                            {/* Badges */}
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${isInStock ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                                    }`}>
                                    {isInStock ? "✓ In Stock" : "Out of Stock"}
                                </span>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                                    Genuine Product
                                </span>
                            </div>

                            {/* Name */}
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">{product.product_name}</h1>

                            {/* Stars placeholder */}
                            <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={14} fill={s <= 4 ? "#1565C0" : "none"} stroke="#1565C0" />
                                ))}
                                <span className="text-xs text-gray-500 ml-1">(Reviews)</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3 mb-3">
                                <span className="text-3xl font-bold text-blue-700">
                                    {formatPrice(product.selling_price)}
                                </span>
                                {product.compare_price && product.compare_price > product.selling_price && (
                                    <span className="text-lg text-gray-400 line-through">
                                        {formatPrice(product.compare_price)}
                                    </span>
                                )}
                            </div>

                            {/* BNPL */}
                            <div className="bg-blue-50 rounded-xl p-3 mb-4">
                                <p className="text-sm text-blue-700 font-medium text-center">
                                    💳 Dream Now, Pay Later — flexible instalments available
                                </p>
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-2 hover:bg-gray-100 transition-colors text-lg font-medium"
                                    >
                                        −
                                    </button>
                                    <span className="px-4 py-2 font-semibold border-x border-gray-200">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 py-2 hover:bg-gray-100 transition-colors text-lg font-medium"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to cart */}
                            <button
                                onClick={handleAddToCart}
                                disabled={!isInStock}
                                className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-lg transition-all mb-4 ${added
                                    ? "bg-green-600 text-white"
                                    : isInStock
                                        ? "bg-blue-700 hover:bg-blue-800 text-white"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                <ShoppingCart size={20} />
                                {added ? "Added to Cart ✓" : isInStock ? "Add to Cart" : "Out of Stock"}
                            </button>

                            {/* Delivery info */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Truck size={16} className="text-blue-600" />
                                    <span><strong>Free delivery</strong> to locations around Ikeja</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Phone size={16} className="text-blue-600" />
                                    <span>Other areas — call +234 912 758 5071 for delivery quote</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <RefreshCw size={16} className="text-blue-600" />
                                    <span>3-day return policy</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Shield size={16} className="text-blue-600" />
                                    <span>100% genuine product guaranteed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Specs table */}
                    <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Specifications</h2>
                        <table className="w-full text-sm">
                            <tbody>
                                {[
                                    ["Product Name", product.product_name],
                                    ["Category", categoryInfo?.label || product.category],
                                    ["Price", formatPrice(product.selling_price)],
                                    ["Availability", isInStock ? `In Stock (${inventory?.available ?? "Available"} units)` : "Out of Stock"],
                                    ["Location", inventory?.location || "Ikeja, Lagos"],
                                ].map(([key, value], i) => (
                                    <tr key={key} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                        <td className="py-3 px-4 font-semibold text-gray-500 w-1/3">{key}</td>
                                        <td className="py-3 px-4 text-gray-900">{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        </div>
                    )}

                    {/* Related products */}
                    {related.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Products</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {related.map((p) => <ProductCard key={p.id} product={p} />)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sticky add to cart (mobile) */}
                <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-100 md:hidden z-30">
                    <button
                        onClick={handleAddToCart}
                        disabled={!isInStock}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-colors ${added
                            ? "bg-green-600 text-white"
                            : isInStock
                                ? "bg-blue-700 text-white"
                                : "bg-gray-200 text-gray-400"
                            }`}
                    >
                        <ShoppingCart size={18} />
                        {added ? "Added ✓" : `Add to Cart — ${formatPrice(product.selling_price)}`}
                    </button>
                </div>

                
                <FloatingElements />
                {/* Quick Buy Floating Bar (mobile) */}
                <QuickBuyBar product={product} />
                {/* Shake to Compare Toast */}
                <ShakeToast visible={shakeDetected} isComparing={isComparing} />
            </div>
        </>
    );
}