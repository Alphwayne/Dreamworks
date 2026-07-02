"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

// Name your 5 images/gifs in the public folder exactly as below.
// You can change these names to match what you actually save in /public
const MEDIA = [
    { src: "/gallery-1.jpg", alt: "DreamWorks Tech", type: "image", span: "col-span-2 row-span-2" },
    { src: "/gallery-2.gif", alt: "Smart Devices", type: "gif", span: "col-span-1 row-span-1" },
    { src: "/gallery-3.jpg", alt: "Premium Laptops", type: "image", span: "col-span-1 row-span-1" },
    { src: "/gallery-4.gif", alt: "Mobile Devices", type: "gif", span: "col-span-1 row-span-1" },
    { src: "/gallery-5.jpg", alt: "Gaming Gear", type: "image", span: "col-span-1 row-span-1" },
];

export function MediaGallery() {
    const [lightbox, setLightbox] = useState<number | null>(null);

    const prev = () => setLightbox((i) => (i === null ? null : (i - 1 + MEDIA.length) % MEDIA.length));
    const next = () => setLightbox((i) => (i === null ? null : (i + 1) % MEDIA.length));

    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Visual Experience</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                    The DreamWorks <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Universe</span>
                </h2>
                <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
                    Premium tech. Delivered to your door. See it in action.
                </p>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[500px] md:h-[580px]">
                {MEDIA.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => setLightbox(i)}
                        className={`${item.span} group relative rounded-2xl md:rounded-3xl overflow-hidden bg-gray-100 cursor-pointer`}
                    >
                        <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 50vw, 33vw"
                            unoptimized={item.type === "gif"}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {/* GIF indicator */}
                        {item.type === "gif" && (
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                <Play size={8} fill="white" /> GIF
                            </div>
                        )}
                        {/* Caption on hover */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-white font-semibold text-sm">{item.alt}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {lightbox !== null && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                        <ChevronLeft size={22} />
                    </button>

                    <div className="relative w-full max-w-4xl max-h-[85vh] mx-8" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={MEDIA[lightbox].src}
                            alt={MEDIA[lightbox].alt}
                            width={1200}
                            height={800}
                            className="object-contain w-full h-full rounded-2xl"
                            unoptimized={MEDIA[lightbox].type === "gif"}
                        />
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); next(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                        <ChevronRight size={22} />
                    </button>

                    <button
                        onClick={() => setLightbox(null)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                        <X size={16} />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {MEDIA.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                                className={`w-2 h-2 rounded-full transition-all ${i === lightbox ? "bg-white w-6" : "bg-white/40"}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}