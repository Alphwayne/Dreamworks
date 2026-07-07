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
    const scrollSpeed = 0.6; // pixels per frame

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        function animate() {
            if (!isPaused && container) {
                container.scrollLeft += scrollSpeed;
                // Reset scroll when reaching halfway (we duplicate items for infinite loop)
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

    // Duplicate categories for infinite scroll effect
    const displayCategories = [...categories, ...categories];

    return (
        <section className="relative py-2">
            {/* Auto-scrolling container */}
            <div
                className="relative overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                {/* Scrolling row */}
                <div
                    ref={scrollRef}
                    className="flex gap-5 overflow-x-hidden"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {displayCategories.map((cat, idx) => (
                        <Link
                            key={`${cat.slug}-${idx}`}
                            href={`/collections/${cat.slug}`}
                            className="flex-shrink-0 group/card"
                        >
                            <div className="w-[140px] md:w-[160px] text-center">
                                {/* Image Container - circular with gradient ring */}
                                <div className="relative w-[110px] h-[110px] md:w-[130px] md:h-[130px] mx-auto rounded-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 border-2 border-gray-100 group-hover/card:border-blue-400 group-hover/card:shadow-xl group-hover/card:shadow-blue-500/15 transition-all duration-400 mb-3">
                                    {/* Animated gradient ring on hover */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover/card:opacity-100 transition-opacity duration-400" style={{ padding: "2px" }}>
                                        <div className="w-full h-full rounded-full bg-white" />
                                    </div>
                                    <Image
                                        src={cat.image}
                                        alt={cat.label}
                                        fill
                                        className="object-contain p-4 group-hover/card:scale-110 transition-transform duration-500 relative z-[1]"
                                        sizes="130px"
                                        quality={100}
                                    />
                                </div>
                                {/* Label */}
                                <p className="text-xs font-bold text-gray-800 group-hover/card:text-blue-700 transition-colors duration-200 line-clamp-1 tracking-tight">
                                    {cat.label}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
