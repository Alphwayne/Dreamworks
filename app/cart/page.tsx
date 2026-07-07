"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";

import { useCartStore } from "@/store/cartStore";
import { formatPrice, getProductImage } from "@/lib/types";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
    const total = getTotalPrice();

    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#eef2ff 0%,#f8faff 50%,#f0f7ff 100%)" }}>
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-8 pb-24">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

                {items.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag size={32} className="text-blue-400" />
                        </div>
                        <p className="text-gray-700 font-bold text-lg mb-2">Your cart is empty</p>
                        <p className="text-gray-400 text-sm mb-6">Looks like you haven't added anything yet.</p>
                        <Link href="/collections/all" className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3.5 rounded-2xl transition-colors">
                            Start Shopping <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Items */}
                        <div className="lg:col-span-2 space-y-3">
                            {items.map((item) => (
                                <div key={item.product.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
                                    <Link href={`/products/${item.product.slug}`} className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                        <Image src={getProductImage(item.product)} alt={item.product.product_name} fill className="object-contain p-2" sizes="80px" />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/products/${item.product.slug}`}>
                                            <p className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                                                {item.product.product_name}
                                            </p>
                                        </Link>
                                        <p className="text-blue-700 font-bold text-sm mt-1">{formatPrice(item.product.selling_price)}</p>

                                        <div className="flex items-center gap-3 mt-3">
                                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2.5 py-1.5 hover:bg-gray-50">
                                                    <Minus size={12} />
                                                </button>
                                                <span className="px-3 py-1.5 text-sm font-semibold border-x border-gray-200">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2.5 py-1.5 hover:bg-gray-50">
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                            <button onClick={() => removeItem(item.product.id)} className="text-red-400 hover:text-red-600 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="font-bold text-gray-900 text-sm flex-shrink-0">
                                        {formatPrice(item.product.selling_price * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal ({items.length} items)</span>
                                    <span className="font-semibold">{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Delivery</span>
                                    <span className="font-semibold text-emerald-600">Calculated at checkout</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-100 pt-3 mb-4">
                                <div className="flex justify-between">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-bold text-blue-700 text-lg">{formatPrice(total)}</span>
                                </div>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-3 text-center mb-4">
                                <p className="text-blue-700 text-xs font-medium">💳 Pay Small Small available at checkout</p>
                            </div>
                            <Link href="/checkout" className="block w-full bg-blue-700 hover:bg-blue-800 text-white text-center font-bold py-3.5 rounded-xl transition-colors">
                                Proceed to Checkout
                            </Link>
                            <Link href="/collections/all" className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-3">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>
            
        </div>
    );
}