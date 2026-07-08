"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface CategoryItem {
    label: string;
    slug: string;
    image: string;
    count?: number;
    isProduct?: boolean;
}

interface CategoryStripProps {
    categories: CategoryItem[];
}

export function CategoryStrip({ categories }: CategoryStripProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const animationRef = useRef<number>(0);
    const scrollSpeed = 0.5;

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
        <section className="relative w-full">
            <div
                className="relative overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Scrolling row */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-hidden"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {displayCategories.map((cat, idx) => (
                        <Link
                            key={`${cat.slug}-${idx}`}
                            href={cat.isProduct ? `/products/${cat.slug}` : `/collections/${cat.slug}`}
                            className="flex-shrink-0 group/card"
                        >
                            {/* The card IS the image - image fills edge to edge */}
                            <div className="relative w-[160px] sm:w-[180px] md:w-[200px] h-[140px] sm:h-[155px] md:h-[170px] rounded-2xl overflow-hidden shadow-md group-hover/card:shadow-2xl group-hover/card:shadow-blue-500/15 transition-all duration-500 group-hover/card:-translate-y-1.5 group-hover/card:scale-[1.02]">
                                {/* Image fills the entire card */}
                                <img
                                    src={cat.image}
                                    alt={cat.label}
                                    className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                                />
                                {/* Dark gradient overlay at bottom for text */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                {/* Product name at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <p className="text-white font-bold text-[11px] sm:text-xs leading-tight line-clamp-2 drop-shadow-lg">
                                        {cat.label}
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
