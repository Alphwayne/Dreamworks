"use client";

import { Heart, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, getProductImage } from "@/lib/types";

export default function WishlistPage() {
    const { items, removeItem, clearWishlist } = useWishlistStore();
    const addToCart = useCartStore((s) => s.addItem);

    return (
        <>
            <CartDrawer />
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                                <Heart size={20} className="text-red-500 fill-red-500" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
                                <p className="text-sm text-gray-500">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>
                            </div>
                        </div>
                        {items.length > 0 && (
                            <button
                                onClick={clearWishlist}
                                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                            <Heart size={48} className="text-gray-200 mx-auto mb-4" />
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
                            <p className="text-sm text-gray-400 mb-6">Save items you love by clicking the heart icon</p>
                            <Link href="/collections/all" className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((product) => (
                                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                                    <Link href={`/products/${product.slug}`}>
                                        <div className="relative h-48 bg-gray-50">
                                            <img
                                                src={getProductImage(product)}
                                                alt={product.product_name}
                                                className="w-full h-full object-contain p-4"
                                            />
                                        </div>
                                    </Link>
                                    <div className="p-4">
                                        <Link href={`/products/${product.slug}`}>
                                            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
                                                {product.product_name}
                                            </h3>
                                        </Link>
                                        <p className="text-xs text-gray-400 mt-1">{product.category}</p>
                                        <p className="text-base font-bold text-gray-900 mt-2">{formatPrice(product.selling_price)}</p>
                                        <div className="flex items-center gap-2 mt-3">
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                                            >
                                                <ShoppingCart size={13} /> Add to Cart
                                            </button>
                                            <button
                                                onClick={() => removeItem(product.id)}
                                                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors text-gray-400"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
