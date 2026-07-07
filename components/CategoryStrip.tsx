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
    const animationRef = useRef<number>();
    const scrollSpeed = 0.8;

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
        <section className="relative py-6 bg-gradient-to-b from-gray-50/80 to-white">
            <div
                className="relative overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

                {/* Scrolling row */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-hidden px-4"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {displayCategories.map((cat, idx) => (
                        <Link
                            key={`${cat.slug}-${idx}`}
                            href={`/collections/${cat.slug}`}
                            className="flex-shrink-0 group/card"
                        >
                            <div className="relative w-[180px] md:w-[210px] h-[120px] md:h-[140px] rounded-2xl overflow-hidden bg-gray-100 shadow-sm group-hover/card:shadow-xl group-hover/card:shadow-blue-500/10 transition-all duration-500 group-hover/card:-translate-y-1">
                                {/* Background image */}
                                <Image
                                    src={cat.image}
                                    alt={cat.label}
                                    fill
                                    className="object-cover group-hover/card:scale-110 transition-transform duration-700"
                                    sizes="210px"
                                    quality={100}
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                {/* Top accent line */}
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                                {/* Label */}
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <p className="text-white font-bold text-sm tracking-tight drop-shadow-lg">
                                        {cat.label}
                                    </p>
                                    {cat.count !== undefined && (
                                        <p className="text-white/60 text-[10px] font-medium mt-0.5">
                                            {cat.count} products
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
