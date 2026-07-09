"use client";

import { ArrowRight, Flame, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/types";

interface NewProduct {
    id: number;
    product_name: string;
    selling_price: number;
    compare_price: number | null;
    image_url: string | null;
    slug: string;
    category: string;
    created_at: string;
}

export function JustLaunched({ products }: { products: NewProduct[] }) {
    if (!products.length) return null;

    const hero = products[0];
    const supporting = products.slice(1, 5);

    return (
        <section className="py-10 px-4 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Flame size={20} className="text-white" />
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Just Launched</h2>
                    <p className="text-xs text-gray-500">Fresh arrivals you won&apos;t find anywhere else</p>
                </div>
            </div>

            {/* Bento grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Hero product - large card */}
                <Link href={`/products/${hero.slug}`} className="lg:col-span-2 lg:row-span-2 group">
                    <div className="relative h-full min-h-[360px] bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                        {/* Badge */}
                        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-blue-500/30">
                                <Zap size={10} /> NEW DROP
                            </span>
                            <span className="bg-white/80 backdrop-blur-sm text-gray-600 text-[10px] font-semibold px-2.5 py-1.5 rounded-full">
                                {new Date(hero.created_at).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                            </span>
                        </div>

                        {/* Product image */}
                        <div className="absolute inset-0 flex items-center justify-center p-12">
                            <div className="relative w-full h-full">
                                <Image
                                    src={hero.image_url || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"}
                                    alt={hero.product_name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    loading="lazy"
                                    className="object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>

                        {/* Bottom info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-transparent p-6 pt-16">
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">{hero.category}</p>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
                                {hero.product_name}
                            </h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-gray-900">{formatPrice(hero.selling_price)}</span>
                                    {hero.compare_price && (
                                        <span className="text-sm text-gray-400 line-through">{formatPrice(hero.compare_price)}</span>
                                    )}
                                </div>
                                <span className="flex items-center gap-1 text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                                    Shop now <ArrowRight size={14} />
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Supporting products - smaller cards */}
                {supporting.map((product) => (
                    <Link key={product.id} href={`/products/${product.slug}`} className="group">
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 h-full hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
                            {/* Image */}
                            <div className="relative h-32 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl mb-3 overflow-hidden">
                                <Image
                                    src={product.image_url || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=75"}
                                    alt={product.product_name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    loading="lazy"
                                    className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                                />
                                <span className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                                    NEW
                                </span>
                            </div>

                            {/* Info */}
                            <p className="text-[9px] text-blue-500 uppercase font-bold tracking-wider">{product.category?.split(" ")[0]}</p>
                            <h3 className="text-xs font-bold text-gray-900 line-clamp-2 mt-1 leading-tight group-hover:text-blue-600 transition-colors flex-1">
                                {product.product_name}
                            </h3>
                            <div className="flex items-baseline gap-1.5 mt-2">
                                <span className="text-sm font-bold text-gray-900">{formatPrice(product.selling_price)}</span>
                                {product.compare_price && (
                                    <span className="text-[10px] text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
