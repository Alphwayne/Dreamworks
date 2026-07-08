"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface CategoryItem {
    label: string;
    slug: string;
    image: string;
    count?: number;
}

interface CategoryStripProps {
    categories: CategoryItem[];
}

export function CategoryStrip({ categories }: CategoryStripProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const animationRef = useRef<number>(0);
    const scrollSpeed = 0.6;

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        function animate() {
            if (!isPaused && container) {
                container.scrollLeft += scrollSpeed;
                if (container.scrollLeft >= container.scrollWidth / 2) {
                    container.scrollLeft = 0;
                }
            }
            animationRef.current = requestAnimationFrame(animate);
        }

        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPaused]);

    const displayCategories = [...categories, ...categories];

    return (
        <section className="relative py-8 bg-gradient-to-b from-gray-50/50 to-white">
            <div
                className="relative overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Minimal fade edges - much less visible */}
                <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white/60 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white/60 to-transparent z-10 pointer-events-none" />

                {/* Scrolling row - wider items, more gap */}
                <div
                    ref={scrollRef}
                    className="flex gap-5 overflow-x-hidden px-2"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {displayCategories.map((cat, idx) => (
                        <Link
                            key={`${cat.slug}-${idx}`}
                            href={`/collections/${cat.slug}`}
                            className="flex-shrink-0 group/card"
                        >
                            <div className="relative w-[220px] md:w-[260px] lg:w-[280px] h-[140px] md:h-[160px] lg:h-[170px] rounded-2xl overflow-hidden bg-gray-100 shadow-md group-hover/card:shadow-2xl group-hover/card:shadow-blue-500/15 transition-all duration-500 group-hover/card:-translate-y-1.5 border border-white/20">
                                {/* Background image */}
                                <Image
                                    src={cat.image}
                                    alt={cat.label}
                                    fill
                                    className="object-cover group-hover/card:scale-110 transition-transform duration-700"
                                    sizes="280px"
                                    quality={100}
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                                {/* Top accent line */}
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                                {/* Label - more prominent */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white font-bold text-base md:text-lg tracking-tight drop-shadow-lg">
                                        {cat.label}
                                    </p>
                                    <p className="text-white/50 text-[11px] font-medium mt-1 group-hover/card:text-blue-300 transition-colors">
                                        Shop now →
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
