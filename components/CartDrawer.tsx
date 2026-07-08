"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, getProductImage } from "@/lib/types";

export function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();
    const total = getTotalPrice();

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-[9998] backdrop-blur-sm"
                    onClick={closeCart}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[9999] shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-blue-700 text-white">
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={20} />
                        <span className="font-bold text-lg">Your Cart</span>
                        <span className="bg-white text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            {items.length}
                        </span>
                    </div>
                    <button onClick={closeCart} className="p-1 hover:bg-blue-600 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                            <ShoppingBag size={48} className="text-gray-300" />
                            <p className="text-gray-500 font-medium">Your cart is empty</p>
                            <button
                                onClick={closeCart}
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Continue shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.product.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                                {/* Image */}
                                <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-100">
                                    <Image
                                        src={getProductImage(item.product)}
                                        alt={item.product.product_name}
                                        fill
                                        className="object-contain p-1"
                                        sizes="64px"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                                        {item.product.product_name}
                                    </p>
                                    <p className="text-sm font-bold text-blue-700 mt-1">
                                        {formatPrice(item.product.selling_price)}
                                    </p>

                                    {/* Qty controls */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                            className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 hover:border-blue-500 transition-colors"
                                        >
                                            <Minus size={10} />
                                        </button>
                                        <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 hover:border-blue-500 transition-colors"
                                        >
                                            <Plus size={10} />
                                        </button>
                                        <button
                                            onClick={() => removeItem(item.product.id)}
                                            className="ml-auto text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-4 border-t bg-white space-y-3">
                        {/* Subtotal */}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-bold text-lg text-gray-900">{formatPrice(total)}</span>
                        </div>

                        {/* Delivery note */}
                        <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700 font-medium text-center">
                            🚚 Free delivery to locations around Ikeja
                        </div>

                        {/* BNPL note */}
                        <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600 text-center">
                            💳 Pay Small Small — flexible instalments available
                        </div>

                        {/* Checkout button */}
                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="block w-full bg-blue-700 hover:bg-blue-800 text-white text-center font-bold py-3 rounded-xl transition-colors"
                        >
                            Checkout Securely →
                        </Link>

                        <button
                            onClick={closeCart}
                            className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}